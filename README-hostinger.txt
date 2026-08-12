========================================================
OVIA — mettre le site en ligne et brancher le formulaire
========================================================

Temps total : environ 15 minutes. Une seule ligne à taper (ton mot de passe).
Tout se règle dans le fichier  config.php.


────────────────────────────────────────────────────────
ÉTAPE 1 — Créer les deux adresses email dans Hostinger
────────────────────────────────────────────────────────
1. Connecte-toi à hPanel (hpanel.hostinger.com)
2. Menu "Emails" → "Comptes email" → "Créer un compte email"
3. Crée DEUX adresses sur le domaine ovia.agency :

      contact@ovia.agency      → celle qui REÇOIT les messages
      no-reply@ovia.agency     → adresse technique qui ENVOIE

4. Note bien le mot de passe de  no-reply@ovia.agency  :
   il sert à l'étape 2.

Pourquoi deux adresses ? Un serveur mail n'accepte d'envoyer que si
l'expéditeur appartient à ton domaine. On ne peut donc pas mettre
l'email du visiteur comme expéditeur. Il est mis en "Répondre à" :
quand tu cliques sur "Répondre" dans ta boîte, la réponse part bien
au visiteur.


────────────────────────────────────────────────────────
ÉTAPE 2 — Renseigner config.php
────────────────────────────────────────────────────────
Ouvre  config.php  avec un éditeur de texte (Bloc-notes suffit).
(Si tu récupères le projet depuis GitHub, ce fichier n'y est pas : il
 contient un mot de passe. Copie  config.example.php  et renomme la copie
 en  config.php.)
Les adresses sont déjà pré-remplies avec ovia.agency. La seule ligne
à compléter est le mot de passe :

    'smtp_pass'   => '',       ← colle ici le mot de passe de
                                  no-reply@ovia.agency

Enregistre. C'est tout.

Deux méthodes d'envoi existent, réglées par la ligne 'methode' :

  'smtp'  (réglage par défaut, RECOMMANDÉ)
          Le site se connecte à ta boîte Hostinger avec le mot de passe,
          exactement comme le ferait un logiciel de mail. Les messages
          arrivent en boîte de réception. Nécessite 'smtp_pass'.

  'mail'  Utilise la fonction mail() de PHP. Aucun mot de passe à donner,
          mais les messages finissent souvent dans les indésirables.
          À utiliser seulement si le SMTP est bloqué.

Si le SMTP échoue pour une raison quelconque, le site bascule tout seul
sur mail() : aucun message n'est perdu.

Réglages SMTP Hostinger (déjà dans le fichier, à ne pas changer) :
      serveur : smtp.hostinger.com
      port    : 465   avec  'smtp_secure' => 'ssl'
      (variante : port 587 avec 'smtp_secure' => 'tls')


────────────────────────────────────────────────────────
ÉTAPE 3 — Envoyer les fichiers sur le serveur
────────────────────────────────────────────────────────
hPanel → "Fichiers" → "Gestionnaire de fichiers" → dossier  public_html
Glisse dedans TOUT le contenu du dossier Zwin_ :

    index.html
    work.html
    services.html
    faq.html
    contact.html
    send.php
    config.php          ← celui que tu viens de remplir
    .htaccess           ← fichier caché : active "afficher les fichiers
                          cachés" dans le gestionnaire pour le voir
    assets/             ← le dossier entier (ovia.css, ovia.js, img/)

Important : les fichiers vont DANS public_html, pas dans un sous-dossier,
sinon l'adresse sera ovia.agency/Zwin_/ au lieu de ovia.agency

N'oublie pas les 4 captures d'écran des projets dans assets/img/
(voir assets/img/LISEZ-MOI.txt pour les noms de fichiers attendus).

(Alternative : par FTP avec FileZilla, mêmes fichiers, même dossier.)


────────────────────────────────────────────────────────
ÉTAPE 4 — Tester
────────────────────────────────────────────────────────
Va sur https://ovia.agency/contact.html, remplis le formulaire, envoie.
Le message doit arriver dans contact@ovia.agency en quelques secondes
(regarde aussi les indésirables la toute première fois).

Dans l'email reçu :
  • l'objet est "Nouveau message du site — <nom du visiteur>"
  • un clic sur "Répondre" écrit directement au visiteur


────────────────────────────────────────────────────────
SI ÇA NE MARCHE PAS
────────────────────────────────────────────────────────
Le site écrit la cause exacte dans un fichier journal, à côté de send.php :

    .mail-error.log     (fichier caché, dans public_html)

Ouvre-le depuis le gestionnaire de fichiers. Les cas courants :

  "SMTP [mot de passe] → 535 ..."
      → mot de passe faux dans config.php, ou tu as mis celui de
        contact@ au lieu de no-reply@

  "SMTP connexion impossible ..."
      → essaie le port 587 avec 'smtp_secure' => 'tls'
        (l'hébergeur bloque parfois le 465)

  "SMTP [MAIL FROM...] → 550 ..."
      → l'adresse 'expediteur' de config.php n'existe pas encore
        dans hPanel, ou n'est pas sur le domaine

  "mail() a échoué"
      → PHP ne peut pas envoyer : reste en 'methode' => 'smtp'

Autres vérifications :
  • send.php et config.php sont bien dans public_html, à côté de contact.html
  • PHP est actif dans hPanel (c'est le cas par défaut)
  • le formulaire ne marche PAS en local (double-clic sur contact.html) :
    PHP n'existe que sur le serveur. C'est normal.

Quand tout fonctionne, tu peux passer 'journal' => false dans config.php.


────────────────────────────────────────────────────────
BONUS — éviter les indésirables
────────────────────────────────────────────────────────
Dans hPanel → "Emails" → "Configuration DNS / SPF-DKIM", vérifie que
SPF et DKIM sont activés pour ovia.agency. Hostinger le fait en un clic
et ça améliore nettement la délivrabilité des messages du formulaire.


────────────────────────────────────────────────────────
CHANGER L'ADRESSE AFFICHÉE SUR LE SITE
────────────────────────────────────────────────────────
contact@ovia.agency apparaît dans le pied de page, le menu mobile et la
page contact. Pour la remplacer partout : cherche "contact@ovia.agency"
dans les fichiers .html, dans assets/ovia.js et dans config.php.

Le téléphone (06 51 46 65 82) est dans contact.html uniquement.
