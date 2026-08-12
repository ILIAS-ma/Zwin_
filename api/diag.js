/* ==========================================================================
   OVIA — page de diagnostic du formulaire (temporaire).

   Accessible sur /api/diag UNIQUEMENT si la variable DEBUG_MAIL vaut "1".
   Sinon elle repond 404, comme si elle n'existait pas.

   Elle indique quelles variables d'environnement sont vues par la fonction,
   puis tente une vraie connexion au serveur SMTP et affiche l'erreur exacte.
   Aucun mot de passe n'est jamais renvoye.
   ========================================================================== */

const nodemailer = require('nodemailer');

const masque = v => {
  if(!v) return null;
  if(v.length <= 6) return '***';
  return v.slice(0, 2) + '***' + v.slice(-10);
};

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if(process.env.DEBUG_MAIL !== '1'){
    return res.status(404).send(JSON.stringify({
      erreur: 'Diagnostic desactive. Ajoute DEBUG_MAIL=1 dans les variables Vercel, puis redeploie.'
    }, null, 2));
  }

  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  const rapport = {
    deploiement: {
      date_du_build: process.env.VERCEL_DEPLOYMENT_ID ? 'build Vercel' : 'local',
      // Si une variable manque ci-dessous alors que tu l'as bien creee dans
      // l'interface, c'est que ce deploiement est ANTERIEUR a sa creation :
      // il faut relancer un deploiement (Deployments > ... > Redeploy).
    },
    variables_vues_par_la_fonction: {
      SMTP_HOST: Boolean(process.env.SMTP_HOST),
      SMTP_PORT: Boolean(process.env.SMTP_PORT),
      SMTP_USER: Boolean(user),
      SMTP_PASS: Boolean(pass),
      MAIL_TO:   Boolean(process.env.MAIL_TO),
    },
    valeurs: {
      host,
      port,
      secure: port === 465,
      user: masque(user),
      destinataire: masque(process.env.MAIL_TO),
      longueur_mot_de_passe: pass ? pass.length : 0,
    },
  };

  if(!user || !pass){
    rapport.conclusion = 'SMTP_USER ou SMTP_PASS absent de CE deploiement. '
      + 'Verifie qu\'elles sont cochees pour l\'environnement Production, '
      + 'puis relance un deploiement.';
    return res.status(200).send(JSON.stringify(rapport, null, 2));
  }

  try {
    const transport = nodemailer.createTransport({
      host, port, secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
    await transport.verify();
    rapport.smtp = { connexion: 'OK', authentification: 'OK' };
    rapport.conclusion = 'La connexion SMTP fonctionne. Si le formulaire echoue '
      + 'encore, l\'erreur vient de l\'envoi lui-meme : regarde les logs [ovia].';
  } catch (err) {
    rapport.smtp = {
      connexion: 'ECHEC',
      code: err && err.code,
      message: err && err.message,
      reponse_serveur: err && err.response,
    };
    rapport.conclusion =
      err && /EAUTH|535/.test(String(err.code) + String(err.message))
        ? 'Identifiants refuses : soit la boite ' + masque(user) + ' n\'existe pas '
          + 'encore dans hPanel, soit le mot de passe est faux (attention : celui '
          + 'de no-reply@, pas celui de contact@).'
        : /ETIMEDOUT|ECONNREFUSED|ESOCKET/.test(String(err && err.code))
          ? 'Impossible de joindre ' + host + ':' + port + '. Essaie SMTP_PORT=587.'
          : 'Voir le message ci-dessus.';
  }

  return res.status(200).send(JSON.stringify(rapport, null, 2));
};
