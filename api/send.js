/* ==========================================================================
   OVIA — reception du formulaire de contact (Vercel Serverless Function).

   Equivalent de send.php, pour les hebergements sans PHP.
   Runtime Node.js (surtout pas Edge : le SMTP a besoin de sockets TCP).

   Variables d'environnement a definir dans Vercel (Settings > Environment
   Variables) — voir README-vercel.txt :
     SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO
   ========================================================================== */

const nodemailer = require('nodemailer');

/* Les variables collees dans l'interface Vercel arrivent parfois avec une
   espace ou un retour a la ligne invisible en fin de valeur, ce qui fait
   echouer l'authentification SMTP (EAUTH) sans explication. On nettoie. */
const propre = v => (typeof v === 'string' ? v.trim() : v);

const CFG = {
  host:     propre(process.env.SMTP_HOST) || 'smtp.hostinger.com',
  port:     Number(propre(process.env.SMTP_PORT) || 465),
  user:     propre(process.env.SMTP_USER),
  pass:     propre(process.env.SMTP_PASS),
  to:       propre(process.env.MAIL_TO) || 'contact@ovia.agency',
  from:     propre(process.env.MAIL_FROM) || propre(process.env.SMTP_USER),
  fromName: propre(process.env.MAIL_FROM_NAME) || 'Site Ovia',
  debug:    process.env.DEBUG_MAIL === '1',
};

/* Recupere les champs quel que soit l'encodage envoye par le navigateur. */
async function lireChamps(req){
  let corps = req.body;

  if(corps === undefined || corps === null){
    corps = await new Promise((resolve, reject) => {
      let brut = '';
      req.on('data', c => { brut += c; if(brut.length > 100000) req.destroy(); });
      req.on('end', () => resolve(brut));
      req.on('error', reject);
    });
  }
  if(Buffer.isBuffer(corps)) corps = corps.toString('utf8');

  if(typeof corps === 'string'){
    const t = corps.trim();
    if(t.startsWith('{')){
      try { return JSON.parse(t); } catch { return {}; }
    }
    return Object.fromEntries(new URLSearchParams(t));
  }
  return corps || {};
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  /* On n'accepte que les envois du formulaire */
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST');
    return res.status(405).send('ERR');
  }

  let champs;
  try { champs = await lireChamps(req); }
  catch { return res.status(400).send('ERR'); }

  /* Piege a robots : champ cache rempli => on repond OK sans rien envoyer */
  if(champs.website) return res.status(200).send('OK');

  const nom     = String(champs.name    || '').trim();
  const email   = String(champs.email   || '').trim();
  const message = String(champs.message || '').trim();

  /* Verifications, identiques a la version PHP */
  if(!nom || !message)                          return res.status(400).send('ERR');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).send('ERR');
  if(nom.length > 120 || message.length > 5000) return res.status(400).send('ERR');

  if(!CFG.user || !CFG.pass){
    console.error('[ovia] SMTP_USER ou SMTP_PASS absent des variables d\'environnement Vercel');
    // Le code court part toujours : il se lit dans l'onglet Reseau du navigateur
    // et suffit a identifier la panne, sans rien divulguer de sensible.
    return res.status(500).send('ERR:CONFIG');
  }

  /* Pas de retour a la ligne dans les en-tetes (injection d'en-tetes) */
  const nomPropre   = nom.replace(/[\r\n]+/g, ' ');
  const emailPropre = email.replace(/[\r\n]+/g, '');

  const texte =
    'Nouveau message envoye depuis le formulaire de ovia.agency\n' +
    '------------------------------------------------------------\n\n' +
    `Nom     : ${nomPropre}\n` +
    `Email   : ${emailPropre}\n` +
    `Date    : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}\n\n` +
    `Message :\n${message}\n\n` +
    '------------------------------------------------------------\n' +
    `Reponds simplement a cet email pour ecrire a ${nomPropre}.\n`;

  try {
    const transport = nodemailer.createTransport({
      host: CFG.host,
      port: CFG.port,
      secure: CFG.port === 465,          // 465 = SSL direct, 587 = STARTTLS
      auth: { user: CFG.user, pass: CFG.pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });

    await transport.sendMail({
      // L'expediteur DOIT etre une adresse du domaine authentifie,
      // sinon le serveur refuse (550) ou le message part en spam.
      from: { name: CFG.fromName, address: CFG.from },
      to: CFG.to,
      replyTo: { name: nomPropre, address: emailPropre },
      subject: `Nouveau message du site — ${nomPropre}`,
      text: texte,
    });

    return res.status(200).send('OK');
  } catch (err) {
    console.error('[ovia] envoi SMTP echoue :', err && err.message, err && err.code);
    const code = (err && err.code) || (err && err.responseCode) || 'INCONNU';
    return res.status(500).send(CFG.debug ? `ERR:${code} ${err && err.message}` : `ERR:${code}`);
  }
};
