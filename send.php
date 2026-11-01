<?php
/* ==========================================================================
   OVIA — réception du formulaire de contact et envoi vers la boîte Hostinger.

   ⚙️  RIEN À MODIFIER ICI. Tous les réglages sont dans config.php.
   Pas à pas complet : README-hostinger.txt
   ========================================================================== */

$defauts = [
  'destinataire' => 'contact@ovia.agency',
  'expediteur'   => 'no-reply@ovia.agency',
  'nom_expediteur' => 'Site Ovia',
  'methode'      => 'mail',
  'smtp_host'    => 'smtp.hostinger.com',
  'smtp_port'    => 465,
  'smtp_secure'  => 'ssl',
  'smtp_user'    => '',
  'smtp_pass'    => '',
  'journal'      => true,
];

$cfg = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];
$cfg = array_merge($defauts, is_array($cfg) ? $cfg : []);

$ajax = isset($_POST['ajax']);

/* ---------------------------------------------------------------- outils */

function journaliser($cfg, $texte){
  if(empty($cfg['journal'])) return;
  @file_put_contents(
    __DIR__ . '/.mail-error.log',
    '[' . date('d/m/Y H:i:s') . '] ' . $texte . "\n",
    FILE_APPEND | LOCK_EX
  );
}

function terminer($ok, $ajax, $cfg){
  if($ajax){
    header('Content-Type: text/plain; charset=utf-8');
    echo $ok ? 'OK' : 'ERR';
    exit;
  }
  // Sans JavaScript : petite page de confirmation
  header('Content-Type: text/html; charset=utf-8');
  $titre = $ok ? 'Message envoyé' : 'Envoi impossible';
  $texte = $ok
    ? "Merci, votre message est bien parti. On revient vers vous sous 48h."
    : "L'envoi n'a pas fonctionné. Écrivez-nous directement à "
      . htmlspecialchars($cfg['destinataire'], ENT_QUOTES, 'UTF-8') . ".";
  echo "<!DOCTYPE html><html lang='fr'><head><meta charset='utf-8'>"
     . "<meta name='viewport' content='width=device-width,initial-scale=1'>"
     . "<title>Ovia — $titre</title>"
     . "<style>body{background:#FAF8F3;color:#0E0E0E;font-family:system-ui,sans-serif;"
     . "display:flex;flex-direction:column;align-items:center;justify-content:center;"
     . "min-height:100vh;margin:0;padding:24px;text-align:center}"
     . "h1{font-size:30px;margin:0 0 14px}p{color:#7c7c76;max-width:460px;line-height:1.6}"
     . "a{display:inline-block;margin-top:28px;background:#0E0E0E;color:#FAF8F3;"
     . "padding:16px 34px;border-radius:40px;text-decoration:none}</style></head><body>"
     . "<h1>$titre</h1><p>$texte</p><a href='contact.html'>← Retour au site</a></body></html>";
  exit;
}

/* ------------------------------------------------------ client SMTP mini */

/* Lit une réponse du serveur (gère les réponses sur plusieurs lignes). */
function smtp_lire($fp){
  $reponse = '';
  while(($ligne = fgets($fp, 515)) !== false){
    $reponse .= $ligne;
    // Dernière ligne d'une réponse : "250 texte" (espace), et non "250-texte"
    if(strlen($ligne) < 4 || $ligne[3] === ' ') break;
  }
  return $reponse;
}

/* Envoie une commande et vérifie le code de retour attendu.
   $etiquette : ce qui apparaîtra dans le journal (jamais le mot de passe). */
function smtp_dialogue($fp, $commande, $codesOk, &$erreur, $etiquette = null){
  if($commande !== null) fwrite($fp, $commande . "\r\n");
  $reponse = smtp_lire($fp);
  $code = (int) substr($reponse, 0, 3);
  if(!in_array($code, $codesOk, true)){
    $visible = $etiquette ?? ($commande === null ? 'connexion' : $commande);
    $erreur = "SMTP [$visible] → " . trim($reponse);
    return false;
  }
  return true;
}

/* Envoi authentifié via le serveur SMTP Hostinger. */
function envoyer_smtp($cfg, $destinataire, $sujetEncode, $corps, $enTetes, &$erreur){
  if($cfg['smtp_user'] === '' || $cfg['smtp_pass'] === ''){
    $erreur = 'SMTP non configuré (smtp_user / smtp_pass vides dans config.php)';
    return false;
  }

  $prefixe = $cfg['smtp_secure'] === 'ssl' ? 'ssl://' : 'tcp://';
  $adresse = $prefixe . $cfg['smtp_host'] . ':' . (int) $cfg['smtp_port'];

  $fp = @stream_socket_client($adresse, $numero, $texte, 20, STREAM_CLIENT_CONNECT);
  if(!$fp){
    $erreur = "SMTP connexion impossible à $adresse ($numero $texte)";
    return false;
  }
  stream_set_timeout($fp, 20);

  $hote = $_SERVER['SERVER_NAME'] ?? 'localhost';
  $ok = smtp_dialogue($fp, null, [220], $erreur)
     && smtp_dialogue($fp, "EHLO $hote", [250], $erreur);

  // Port 587 : on chiffre la connexion après coup
  if($ok && $cfg['smtp_secure'] === 'tls'){
    $ok = smtp_dialogue($fp, 'STARTTLS', [220], $erreur);
    if($ok){
      $ok = @stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
      if(!$ok) $erreur = 'SMTP échec du chiffrement STARTTLS';
    }
    if($ok) $ok = smtp_dialogue($fp, "EHLO $hote", [250], $erreur);
  }

  if($ok){
    $ok = smtp_dialogue($fp, 'AUTH LOGIN', [334], $erreur, 'AUTH LOGIN')
       && smtp_dialogue($fp, base64_encode($cfg['smtp_user']), [334], $erreur, 'identifiant')
       && smtp_dialogue($fp, base64_encode($cfg['smtp_pass']), [235], $erreur, 'mot de passe');
  }

  if($ok){
    $ok = smtp_dialogue($fp, 'MAIL FROM:<' . $cfg['expediteur'] . '>', [250], $erreur)
       && smtp_dialogue($fp, 'RCPT TO:<' . $destinataire . '>', [250, 251], $erreur)
       && smtp_dialogue($fp, 'DATA', [354], $erreur);
  }

  if($ok){
    $message = $enTetes
             . 'Subject: ' . $sujetEncode . "\r\n"
             . 'To: ' . $destinataire . "\r\n"
             . 'Date: ' . date('r') . "\r\n"
             . "\r\n"
             . $corps;

    // Fins de ligne CRLF + protection des lignes commençant par un point
    $message = preg_replace("/\r\n|\r|\n/", "\r\n", $message);
    $message = preg_replace("/^\./m", '..', $message);

    fwrite($fp, $message . "\r\n.\r\n");
    $ok = smtp_dialogue($fp, null, [250], $erreur);
  }

  @fwrite($fp, "QUIT\r\n");
  @fclose($fp);
  return $ok;
}

/* ------------------------------------------------------------ réception */

/* On n'accepte que les envois du formulaire */
if($_SERVER['REQUEST_METHOD'] !== 'POST') terminer(false, $ajax, $cfg);

/* Piège à robots : si ce champ caché est rempli, c'est un spam.
   On répond OK pour ne pas donner d'indice au robot, sans rien envoyer. */
if(!empty($_POST['website'])) terminer(true, $ajax, $cfg);

$nom     = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');

/* Champs facultatifs : une seule ligne, longueur limitée */
function ligne($v, $max){
  return mb_substr(trim(str_replace(["\r", "\n"], ' ', (string) $v)), 0, $max);
}
$tel     = ligne($_POST['phone']        ?? '', 40);
$societe = ligne($_POST['company']      ?? '', 120);
$secteur = ligne($_POST['sector']       ?? '', 120);
$projet  = ligne($_POST['project_type'] ?? '', 60);
$aSite   = ligne($_POST['has_site']     ?? '', 10);
$urlSite = ligne($_POST['site_url']     ?? '', 200);
$budget  = ligne($_POST['budget']       ?? '', 40);

/* Vérifications : nom, email valide et consentement RGPD obligatoires */
if($nom === '')                                         terminer(false, $ajax, $cfg);
if(!filter_var($email, FILTER_VALIDATE_EMAIL))          terminer(false, $ajax, $cfg);
if(empty($_POST['consent']))                            terminer(false, $ajax, $cfg);
if(mb_strlen($nom) > 120 || mb_strlen($message) > 5000) terminer(false, $ajax, $cfg);

/* Sécurité : on interdit les retours à la ligne dans les en-têtes
   (sinon un robot peut injecter ses propres destinataires) */
$nomPropre   = str_replace(["\r", "\n"], ' ', $nom);
$emailPropre = str_replace(["\r", "\n"], '', $email);

$sujet = "Demande de devis — $nomPropre";
$sujetEncode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';

$corps = "Nouvelle demande de devis envoyée depuis ovia.agency\n"
       . "------------------------------------------------------------\n\n"
       . "Nom         : $nomPropre\n"
       . "Email       : $emailPropre\n"
       . "Téléphone   : " . ($tel !== '' ? $tel : '-') . "\n"
       . "Entreprise  : " . ($societe !== '' ? $societe : '-') . "\n"
       . "Secteur     : " . ($secteur !== '' ? $secteur : '-') . "\n"
       . "Projet      : " . ($projet !== '' ? $projet : '-') . "\n"
       . "Site actuel : " . ($aSite !== '' ? $aSite : '-') . ($urlSite !== '' ? " ($urlSite)" : '') . "\n"
       . "Budget      : " . ($budget !== '' ? $budget : 'Non précisé') . "\n"
       . "Consentement RGPD : oui\n"
       . "Date        : " . date('d/m/Y à H:i') . "\n\n"
       . "Message :\n" . ($message !== '' ? $message : '(aucun message)') . "\n\n"
       . "------------------------------------------------------------\n"
       . "Réponds simplement à cet email pour écrire à $nomPropre.\n";

$nomExp = '=?UTF-8?B?' . base64_encode($cfg['nom_expediteur']) . '?=';
$enTetes  = "From: $nomExp <" . $cfg['expediteur'] . ">\r\n";
$enTetes .= "Reply-To: $nomPropre <$emailPropre>\r\n";
$enTetes .= "MIME-Version: 1.0\r\n";
$enTetes .= "Content-Type: text/plain; charset=UTF-8\r\n";
$enTetes .= "Content-Transfer-Encoding: base64\r\n";

/* Corps encodé en base64 : les accents arrivent intacts quel que soit
   le serveur de réception, et aucune ligne ne dépasse la limite SMTP. */
$corpsEncode = chunk_split(base64_encode($corps), 76, "\r\n");

/* ---------------------------------------------------------------- envoi */

$envoye = false;

if($cfg['methode'] === 'smtp'){
  $erreur = '';
  $envoye = envoyer_smtp($cfg, $cfg['destinataire'], $sujetEncode, $corpsEncode, $enTetes, $erreur);
  if(!$envoye) journaliser($cfg, $erreur . ' — repli sur mail()');
}

/* Repli (ou méthode 'mail') : fonction mail() de PHP */
if(!$envoye){
  $envoye = @mail(
    $cfg['destinataire'],
    $sujetEncode,
    $corpsEncode,
    $enTetes,
    '-f' . $cfg['expediteur']
  );
  if(!$envoye) journaliser($cfg, 'mail() a échoué (PHP ne peut pas envoyer sur ce serveur)');
}

terminer($envoye, $ajax, $cfg);
