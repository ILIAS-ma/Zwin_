========================================================
OVIA — formulaire de contact sur Vercel
========================================================

POURQUOI ÇA NE MARCHAIT PAS
-----------------------------
Le formulaire postait vers send.php. Vercel n'exécute pas PHP : le fichier
était servi comme un simple fichier statique, donc la réponse n'était jamais
"OK" et le site affichait le bloc rouge "L'envoi n'a pas fonctionné".

Ce qui a été ajouté :
  api/send.js     la route serverless (Node.js + Nodemailer) qui envoie
                  réellement l'email. C'est l'équivalent de send.php.
  package.json    déclare la dépendance nodemailer (Vercel l'installe seul)
  .vercelignore   n'envoie pas les fichiers PHP sur Vercel
  .htaccess       chez Hostinger, /api/send est redirigé vers send.php

Le formulaire poste maintenant vers /api/send : la même URL fonctionne sur
les deux hébergeurs. Le corps est envoyé en x-www-form-urlencoded (et non
plus en multipart), seul format que Vercel décode automatiquement.


ÉTAPE 1 — Variables d'environnement Vercel
--------------------------------------------
Projet Vercel → Settings → Environment Variables. Coche les trois
environnements (Production, Preview, Development) pour chacune :

    SMTP_HOST   smtp.hostinger.com
    SMTP_PORT   465
    SMTP_USER   no-reply@ovia.agency
    SMTP_PASS   (le mot de passe de la boîte no-reply@ovia.agency)
    MAIL_TO     contact@ovia.agency

Facultatives :
    MAIL_FROM       par défaut = SMTP_USER
    MAIL_FROM_NAME  par défaut = "Site Ovia"
    DEBUG_MAIL      "1" pour que la réponse contienne la cause exacte de
                    l'erreur pendant le débogage. À retirer ensuite.

IMPORTANT : les variables ne sont prises en compte qu'au déploiement suivant.
Après les avoir ajoutées → Deployments → ... → Redeploy.


ÉTAPE 2 — DNS du domaine ovia.agency
--------------------------------------
L'envoi passe par le SMTP Hostinger authentifié, donc aucun domaine à
"vérifier" comme chez Resend ou SendGrid. Il faut par contre que le domaine
autorise Hostinger à envoyer en son nom, sinon les messages partent en spam.

Dans hPanel → Emails → ovia.agency, vérifie que ces enregistrements existent
(Hostinger les crée en un clic, ne les écris pas à la main) :

  MX      @        mx1.hostinger.com   priorité 5
  MX      @        mx2.hostinger.com   priorité 10
          → indispensable pour RECEVOIR sur contact@ovia.agency

  TXT     @        v=spf1 include:_spf.mail.hostinger.com ~all
          → autorise les serveurs Hostinger à envoyer pour ovia.agency

  DKIM    activé depuis hPanel (bouton "Activer DKIM")
          → signe les messages, c'est ce qui pèse le plus contre le spam

  TXT     _dmarc   v=DMARC1; p=none; rua=mailto:contact@ovia.agency
          → facultatif mais recommandé, commence en p=none

Si le domaine n'utilise pas les serveurs DNS de Hostinger, ces
enregistrements sont à créer chez le registrar qui gère la zone.


ÉTAPE 3 — Tester
------------------
Envoie un message depuis /contact.html du site déployé.

Si le bloc rouge apparaît encore :
  Vercel → ton projet → Logs (ou Deployments → Functions) et cherche les
  lignes commençant par [ovia]. Elles donnent la cause exacte :

  "SMTP_USER ou SMTP_PASS absent"     → variables non définies, ou définies
                                        après le dernier déploiement
  "Invalid login: 535 ..."            → mot de passe faux, ou celui de
                                        contact@ au lieu de no-reply@
  "connect ETIMEDOUT / ECONNREFUSED"  → essaie SMTP_PORT=587
  "550 ... not allowed"               → MAIL_FROM n'est pas une adresse du
                                        domaine authentifié


REMARQUE SUR LE RUNTIME
-------------------------
api/send.js tourne en runtime Node.js, surtout pas Edge : le runtime Edge
ne permet pas d'ouvrir de connexion TCP, donc aucun envoi SMTP n'y est
possible. Ne pas ajouter "export const runtime = 'edge'" dans ce fichier.
