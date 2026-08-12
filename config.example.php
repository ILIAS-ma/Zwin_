<?php
/* ==========================================================================
   OVIA — RÉGLAGES DU FORMULAIRE DE CONTACT (modèle)
   C'est le SEUL fichier à modifier. Voir README-hostinger.txt pour le pas à pas.
   ========================================================================== */

return [

   /* --- Les deux adresses (créées dans hPanel → Emails → Comptes email) --- */

   // L'adresse qui REÇOIT les messages du formulaire.
   'destinataire'   => 'contact@ovia.agency',

   // L'adresse technique qui ENVOIE. Doit appartenir à ton domaine.
   // (L'email du visiteur est mis en "Répondre à" : un clic sur "Répondre"
   //  dans ta boîte lui écrit directement.)
   'expediteur'     => 'contact@ovia.agency',
   'nom_expediteur' => 'Site Ovia',


   /* --- Méthode d'envoi --------------------------------------------------
     'smtp' → recommandé. Connexion authentifiée à ta boîte Hostinger :
              les emails arrivent en boîte de réception, pas en spam.
              Il faut renseigner smtp_user + smtp_pass ci-dessous.
     'mail' → fonction mail() de PHP. Aucun mot de passe à donner,
              mais finit souvent dans les indésirables.
     Avec 'smtp', si la connexion échoue, on retombe automatiquement
     sur mail() pour ne perdre aucun message.
     --------------------------------------------------------------------- */
   'methode'     => 'smtp',

   'smtp_host'   => 'smtp.hostinger.com',
   'smtp_port'   => 465,          // 465 avec 'ssl'  |  587 avec 'tls'
   'smtp_secure' => 'ssl',        // 'ssl' ou 'tls'
   'smtp_user'   => 'contact@ovia.agency',   // = l'adresse expéditrice
   'smtp_pass'   => '',           // ← mot de passe de CETTE boîte email

   /* Journalise les échecs dans .mail-error.log (à côté de send.php).
     Pratique pour comprendre un problème ; passe à false quand tout marche. */
   'journal'     => true,
];
