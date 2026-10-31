# -*- coding: utf-8 -*-
"""Génère les pages statiques d'Ovia + assets/i18n.js à partir d'une seule source (FR/EN)."""
import json, io, os, sys

ROOT = sys.argv[1]
SITE = "https://ovia.agency"
TODO = "[À REMPLIR]"

T = {}  # key -> (fr, en)


def d(key, fr, en):
    T[key] = (fr, en)
    return key


def tx(key, fr=None, en=None):
    """Retourne l'attribut data-i18n et le texte FR (le HTML reste lisible sans JS)."""
    if fr is not None:
        T[key] = (fr, en)
    fr_text = T[key][0]
    attr = "data-i18n-html" if "<" in fr_text else "data-i18n"
    return f'{attr}="{key}"', fr_text


def el(tag, key, fr=None, en=None, cls="", extra=""):
    attr, txt = tx(key, fr, en)
    c = f' class="{cls}"' if cls else ""
    e = f" {extra}" if extra else ""
    return f"<{tag}{c} {attr}{e}>{txt}</{tag}>"


# ------------------------------------------------------------------ textes communs
d("nav_home", "Accueil", "Home")
d("nav_work", "Réalisations", "Work")
d("nav_services", "Services", "Services")
d("nav_pricing", "Tarifs", "Pricing")
d("nav_faq", "FAQ", "FAQ")
d("nav_contact", "Contact", "Contact")
d("cta_quote", "Demander un devis gratuit", "Get a free quote")
d("cta_quote_short", "Devis gratuit", "Free quote")
d("menu_label", "Menu", "Menu")
d("skip", "Aller au contenu", "Skip to content")
d("footer_rights", "© 2026 Ovia — Tous droits réservés", "© 2026 Ovia — All rights reserved")
d("footer_legal", "Mentions légales", "Legal notice")
d("footer_tag", "Création de sites internet à Paris et en Île-de-France.", "Website design in Paris and the Île-de-France region.")
d("vat_note", "Prix TTC. TVA non applicable, art. 293 B du CGI.", "Prices include all taxes. VAT not applicable, art. 293 B of the French tax code.")

NAV = [("index.html", "nav_home"), ("work.html", "nav_work"), ("services.html", "nav_services"),
       ("tarifs.html", "nav_pricing"), ("faq.html", "nav_faq"), ("contact.html", "nav_contact")]


def header(active):
    cur = ' class="active" aria-current="page"'
    links = "".join(
        f'<a href="{h}"{cur if h == active else ""} {tx(k)[0]}>{tx(k)[1]}</a>'
        for h, k in NAV[1:])
    menu = "".join(
        f'<a href="{h}" {tx(k)[0]}>{tx(k)[1]}</a>' for h, k in NAV)
    return f'''<a class="skip" href="#main" {tx("skip")[0]}>{tx("skip")[1]}</a>
<header class="nav">
  <div class="nav-in">
    <a href="index.html" class="logo" aria-label="Ovia">ovia<i></i></a>
    <nav class="links" aria-label="Navigation principale">{links}</nav>
    <div class="nav-r">
      <div class="lang" role="group" aria-label="Langue"><button type="button" data-lang="fr">FR</button><button type="button" data-lang="en">EN</button></div>
      <a class="btn btn-sm nav-cta" href="contact.html" {tx("cta_quote_short")[0]}>{tx("cta_quote_short")[1]}</a>
      <button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
    </div>
  </div>
  <div id="menu"><nav aria-label="Menu mobile">{menu}</nav>
    <a class="btn" href="contact.html" {tx("cta_quote")[0]}>{tx("cta_quote")[1]}</a></div>
</header>'''


def footer():
    return f'''<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <div class="logo">ovia<i></i></div>
      <p {tx("footer_tag")[0]}>{tx("footer_tag")[1]}</p>
    </div>
    <div class="foot-links">
      <a href="mailto:contact@ovia.agency">contact@ovia.agency</a>
      <a href="tel:+33651466582">06 51 46 65 82</a>
      <a href="mentions-legales.html" {tx("footer_legal")[0]}>{tx("footer_legal")[1]}</a>
    </div>
  </div>
  <div class="wrap foot-bot"><span {tx("footer_rights")[0]}>{tx("footer_rights")[1]}</span></div>
</footer>'''


LOCAL_BUSINESS = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE + "/#ovia",
    "name": "Ovia",
    "description": "Studio web à Paris : création de sites vitrines WordPress, e-commerce, refonte, webmaster et SEO local pour artisans, commerçants et TPE/PME.",
    "url": SITE + "/",
    "email": "contact@ovia.agency",
    "telephone": "+33651466582",
    "address": {"@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR"},
    "areaServed": [
        {"@type": "City", "name": "Paris"},
        {"@type": "AdministrativeArea", "name": "Seine-Saint-Denis"},
        {"@type": "AdministrativeArea", "name": "Île-de-France"},
    ],
    "makesOffer": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Création de site vitrine"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Site e-commerce"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Refonte de site"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Webmaster et maintenance"}},
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "SEO local"}},
    ],
}


def page(fname, title, desc, body, active=None, jsonld=False, robots=None):
    ld = ""
    if jsonld:
        ld = '<script type="application/ld+json">' + json.dumps(LOCAL_BUSINESS, ensure_ascii=False) + "</script>"
    rb = f'<meta name="robots" content="{robots}">' if robots else ""
    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{rb}<link rel="canonical" href="{SITE}/{'' if fname == 'index.html' else fname}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Ovia">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/{'' if fname == 'index.html' else fname}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%232E2BFF'/><text x='50' y='71' font-size='62' font-family='Arial' font-weight='bold' fill='white' text-anchor='middle'>o</text></svg>">
<link rel="preload" href="assets/fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/ovia.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){{if(!window.__ovia)document.documentElement.classList.add('reveal-all')}},3000)</script>
{ld}
</head>
<body>
{header(active)}
<main id="main">
{body}
</main>
{footer()}
<script src="assets/i18n.js" defer></script>
<script src="assets/ovia.js" defer></script>
</body>
</html>
'''
    with io.open(os.path.join(ROOT, fname), "w", encoding="utf-8", newline="\n") as f:
        f.write(html)


# ------------------------------------------------------------------ blocs réutilisables
d("btn_all_work", "Voir toutes les réalisations", "See all our work")


def picture(name, alt, w, h, eager=False):
    ld = "" if eager else ' loading="lazy"'
    return (f'<picture><source srcset="assets/img/{name}.webp" type="image/webp">'
            f'<img src="assets/img/{name}.webp" alt="{alt}" width="{w}" height="{h}"{ld} decoding="async"></picture>')


PROJECTS = [
    # key, nom, image, w, h, alt
    ("p3", "Artebat", "artebat", 1400, 788),
    ("p2", "Paris Car Week", "paris-car-week", 1400, 875),
    ("p4", "Museo Santorsola", "museo-santorsola", 1400, 683),
    ("p1", "Eco Motors Deal", None, 1400, 788),
]
d("p1_type", "Marketplace de véhicules électriques", "Electric-vehicle marketplace")
d("p1_need", "Permettre d'acheter et de vendre des véhicules électriques en ligne, avec recherche multicritère et fiches détaillées.",
  "Let people buy and sell electric vehicles online, with multi-criteria search and detailed listings.")
d("p2_type", "Réservation en ligne · Paiement Stripe", "Online booking · Stripe payments")
d("p2_need", "Réserver des essais et des espaces d'exposition en ligne, avec paiement intégré.",
  "Book test drives and exhibition spaces online, with built-in payment.")
d("p3_type", "Site vitrine B2B · WordPress", "B2B showcase site · WordPress")
d("p3_need", "Présenter une activité de rénovation énergétique et générer des demandes d'audit grâce à un simulateur CEE.",
  "Present an energy-renovation business and generate audit requests with a CEE simulator.")
d("p4_type", "Refonte · WordPress · Maintenance", "Redesign · WordPress · Maintenance")
d("p4_need", "Refondre le site d'un musée florentin : expositions, résidences d'artistes, bilingue IT / FR, maintenu dans la durée.",
  "Redesign a Florentine museum's site: exhibitions, artist residencies, IT / FR bilingual, maintained over time.")
d("label_need", "Le besoin", "The need")
d("label_result", "Le résultat", "The result")
d("result_todo", "[À REMPLIR : résultat obtenu pour ce client]", "[TO FILL IN: result achieved for this client]")
d("noimg", "[À REMPLIR : capture du site]", "[TO FILL IN: site screenshot]")


def project_card(key, name, img, w, h):
    if img:
        fig = f'<div class="pimg">{picture(img, "Capture du site " + name, w, h)}</div>'
    else:
        fig = f'<div class="pimg ph"><span {tx("noimg")[0]}>{tx("noimg")[1]}</span></div>'
    return f'''<article class="proj" data-rev>
  {fig}
  <div class="pbody">
    <p class="ptype" {tx(key + "_type")[0]}>{tx(key + "_type")[1]}</p>
    <h3>{name}</h3>
    <p class="pneed"><b {tx("label_need")[0]}>{tx("label_need")[1]}</b> <span {tx(key + "_need")[0]}>{tx(key + "_need")[1]}</span></p>
    <p class="pres"><b {tx("label_result")[0]}>{tx("label_result")[1]}</b> <span class="todo" {tx("result_todo")[0]}>{tx("result_todo")[1]}</span></p>
  </div>
</article>'''


# ---- étapes
d("how_title", "Comment ça marche", "How it works")
d("how_lead", "Trois étapes simples, sans jargon et sans surprise.", "Three simple steps, no jargon and no surprises.")
STEPS = [
    ("s1", "Appel gratuit", "Free call",
     "On échange 20 à 30 minutes sur votre activité, vos clients et ce que vous attendez du site. Vous repartez avec un devis clair.",
     "We talk about your business, your customers and what you expect from the site. You leave with a clear quote."),
    ("s2", "Maquette", "Mockup",
     "Vous voyez le design de votre site avant que la mise en ligne ne commence, et vous demandez des ajustements jusqu'à ce qu'il vous plaise.",
     "You see your site's design before anything goes live, and you ask for tweaks until you're happy."),
    ("s3", "Mise en ligne", "Go live",
     "On met le site en ligne, on vérifie tout sur mobile et ordinateur, puis on vous montre comment le modifier vous-même.",
     "We launch the site, check everything on mobile and desktop, then show you how to edit it yourself."),
]


def steps_section():
    items = ""
    for i, (k, tfr, ten, pfr, pen) in enumerate(STEPS, 1):
        d(k + "_h", tfr, ten)
        d(k + "_p", pfr, pen)
        items += f'''<li class="step" data-rev><span class="num">{i}</span>
  <h3 {tx(k + "_h")[0]}>{tx(k + "_h")[1]}</h3><p {tx(k + "_p")[0]}>{tx(k + "_p")[1]}</p></li>'''
    return f'''<section class="sec alt" id="how"><div class="wrap">
  <div class="sec-head" data-rev>{el("h2", "how_title")}{el("p", "how_lead", cls="lead")}</div>
  <ol class="steps">{items}</ol>
</div></section>'''


# ---- avis
d("rev_title", "Ils nous font confiance", "What clients say")
d("rev_lead", "Les avis de nos clients arrivent ici.", "Client reviews will appear here.")
d("rev_q", "[À REMPLIR : avis du client, 2 à 3 phrases]", "[TO FILL IN: client review, 2–3 sentences]")
d("rev_who", "[À REMPLIR : prénom, activité, ville]", "[TO FILL IN: first name, business, city]")


def reviews_section():
    cards = "".join(f'''<figure class="rev" data-rev><blockquote class="todo" {tx("rev_q")[0]}>{tx("rev_q")[1]}</blockquote>
  <figcaption class="todo" {tx("rev_who")[0]}>{tx("rev_who")[1]}</figcaption></figure>''' for _ in range(3))
    return f'''<section class="sec" id="avis"><div class="wrap">
  <div class="sec-head" data-rev>{el("h2", "rev_title")}</div>
  <div class="revs">{cards}</div>
</div></section>'''


# ---- chiffres
d("stat_projects", "Projets livrés", "Projects delivered")
d("stat_years", "Années d'expérience", "Years of experience")
d("stat_clients", "Clients accompagnés", "Clients supported")
d("stat_todo", "[À REMPLIR]", "[TO FILL IN]")


def stats_section():
    cells = "".join(f'<div class="stat"><div class="n todo" {tx("stat_todo")[0]}>{tx("stat_todo")[1]}</div>'
                    f'<div class="l" {tx(k)[0]}>{tx(k)[1]}</div></div>'
                    for k in ("stat_projects", "stat_years", "stat_clients"))
    return f'<section class="stats" aria-label="Chiffres clés"><div class="wrap stats-in">{cells}</div></section>'


# ---- CTA final
d("cta_title", "Parlons de votre site", "Let's talk about your website")
d("cta_text", "Premier appel et devis gratuits, sans engagement. Réponse sous 48 h ouvrées.",
  "First call and quote are free, no commitment. We reply within 48 working hours.")


def cta_section():
    return f'''<section class="sec cta"><div class="wrap">
  {el("h2", "cta_title")}{el("p", "cta_text", cls="lead")}
  <a class="btn btn-lg" href="contact.html" {tx("cta_quote")[0]}>{tx("cta_quote")[1]}</a>
</div></section>'''


# ---- services
SERVICES = [
    ("sv1", "Création de site vitrine", "Showcase website",
     "WordPress ou sur-mesure", "WordPress or custom",
     "Un site clair qui présente votre activité et vous apporte des demandes de contact. Vous pouvez le modifier vous-même.",
     "A clear site that presents your business and brings you enquiries. You can edit it yourself."),
    ("sv2", "Site e-commerce", "E-commerce website",
     "WooCommerce ou Shopify", "WooCommerce or Shopify",
     "Une boutique simple à gérer, avec paiement en ligne sécurisé, pour vendre vos produits sans vous compliquer la vie.",
     "A store that's easy to run, with secure online payment, so you can sell your products without the hassle."),
    ("sv3", "Refonte de site existant", "Website redesign",
     "Plus moderne, plus rapide", "Fresher and faster",
     "Votre site est daté ou lent ? On reprend votre contenu et on le remet au goût du jour, lisible sur téléphone.",
     "Is your site dated or slow? We take your content and bring it up to date, readable on mobile."),
    ("sv4", "Webmaster & maintenance", "Webmaster & maintenance",
     "Mises à jour, sécurité, sauvegardes", "Updates, security, backups",
     "Mises à jour, sécurité, sauvegardes, modifications de contenu et petites évolutions : vous n'avez plus à vous en occuper.",
     "Updates, security, backups, content changes and small improvements: you no longer have to worry about it."),
    ("sv5", "SEO local & performance", "Local SEO & performance",
     "Être trouvé à Paris", "Get found in Paris",
     "Fiche Google, pages locales et site rapide, pour apparaître quand on cherche votre métier près de chez vous.",
     "Google profile, local pages and a fast site, so you show up when people search for your trade nearby."),
]
d("svc_title", "Services", "Services")
d("svc_lead", "Du site vitrine à l'entretien au quotidien : tout ce qu'il faut, avec un seul interlocuteur.",
  "From showcase site to day-to-day upkeep: everything you need, with one point of contact.")
d("svc_wp_badge", "Notre spécialité", "Our specialty")
d("svc_web_badge", "Offre phare", "Flagship offer")
d("svc_more", "Voir les tarifs", "See pricing")


def services_grid():
    out = ""
    for k, tfr, ten, sfr, sen, pfr, pen in SERVICES:
        d(k + "_h", tfr, ten)
        d(k + "_s", sfr, sen)
        d(k + "_p", pfr, pen)
        cls = "svc"
        badge = ""
        if k == "sv1":
            cls += " hl-wp"
            badge = f'<span class="badge" {tx("svc_wp_badge")[0]}>{tx("svc_wp_badge")[1]}</span>'
        if k == "sv4":
            cls += " hl-web"
            badge = f'<span class="badge" {tx("svc_web_badge")[0]}>{tx("svc_web_badge")[1]}</span>'
        out += f'''<article class="{cls}" data-rev>{badge}
  <p class="stag" {tx(k + "_s")[0]}>{tx(k + "_s")[1]}</p>
  <h3 {tx(k + "_h")[0]}>{tx(k + "_h")[1]}</h3>
  <p {tx(k + "_p")[0]}>{tx(k + "_p")[1]}</p>
</article>'''
    return f'<div class="svc-grid">{out}</div>'


# ---- tarifs
d("pr_title", "Tarifs", "Pricing")
d("pr_lead", "Des prix annoncés clairement, sans frais cachés. Un bon rapport qualité-prix, pour que votre site soit un vrai outil de travail.",
  "Clear prices, no hidden fees. Good value for money, so your site becomes a real working tool.")
d("pr_from", "à partir de", "from")
d("pr_month", "/ mois", "/ month")
d("pr_popular", "La plus choisie", "Most popular")
d("pr_delay", "Délai indicatif :", "Indicative timeline:")
PLANS = [
    ("pl1", "Site Essentiel", "Essential site", "490", False, "2 semaines", "2 weeks",
     [("Jusqu'à 3 pages", "Up to 3 pages"), ("WordPress, que vous pouvez modifier", "WordPress, editable by you"),
      ("Adapté au téléphone (responsive)", "Mobile-friendly (responsive)"), ("Formulaire de contact", "Contact form"),
      ("Fiche Google (Google Business Profile)", "Google Business Profile")],
     "Pour se lancer en ligne simplement.", "To get online simply."),
    ("pl2", "Site Pro", "Pro site", "890", True, "3 à 6 semaines", "3 to 6 weeks",
     [("Jusqu'à 7 pages", "Up to 7 pages"), ("SEO local", "Local SEO"), ("Formulaire de devis", "Quote request form"),
      ("Avis clients affichés sur le site", "Customer reviews on your site"),
      ("Formation pour modifier le site", "Training to edit the site")],
     "Pour recevoir des demandes de devis.", "To receive quote requests."),
    ("pl3", "E-commerce", "E-commerce", "1 490", False, "4 à 8 semaines", "4 to 8 weeks",
     [("Boutique WooCommerce ou Shopify", "WooCommerce or Shopify store"), ("Paiement en ligne", "Online payment"),
      ("Jusqu'à 30 produits", "Up to 30 products"), ("Formation à la gestion de la boutique", "Training on running the store")],
     "Pour vendre vos produits en ligne.", "To sell your products online."),
    ("pl4", "Webmaster", "Webmaster", "39", False, None, None,
     [("Mises à jour", "Updates"), ("Sécurité", "Security"), ("Sauvegardes", "Backups"),
      ("Modifications de contenu illimitées", "Unlimited content changes"), ("Sans engagement", "No commitment")],
     "Pour ne plus vous soucier de votre site.", "To stop worrying about your site."),
]


def plan_cards():
    out = ""
    for k, nfr, nen, price, pop, dfr, den, feats, tfr, ten in PLANS:
        d(k + "_n", nfr, nen)
        d(k + "_t", tfr, ten)
        lis = ""
        for j, (ffr, fen) in enumerate(feats):
            d(f"{k}_f{j}", ffr, fen)
            lis += f'<li {tx(f"{k}_f{j}")[0]}>{tx(f"{k}_f{j}")[1]}</li>'
        delay = ""
        if dfr:
            d(k + "_d", dfr, den)
            delay = f'<p class="delay"><span {tx("pr_delay")[0]}>{tx("pr_delay")[1]}</span> <b {tx(k + "_d")[0]}>{tx(k + "_d")[1]}</b></p>'
        suffix = f' <span class="per" {tx("pr_month")[0]}>{tx("pr_month")[1]}</span>' if k == "pl4" else ""
        pill = f'<span class="pill" {tx("pr_popular")[0]}>{tx("pr_popular")[1]}</span>' if pop else ""
        offre = {"pl1": "essentiel", "pl2": "pro", "pl3": "ecommerce", "pl4": "webmaster"}[k]
        out += f'''<article class="plan{" pop" if pop else ""}" data-rev>{pill}
  <h3 {tx(k + "_n")[0]}>{tx(k + "_n")[1]}</h3>
  <p class="ptag" {tx(k + "_t")[0]}>{tx(k + "_t")[1]}</p>
  <p class="price"><span class="from" {tx("pr_from")[0]}>{tx("pr_from")[1]}</span> <b>{price}&nbsp;€</b>{suffix}</p>
  <ul>{lis}</ul>
  {delay}
  <a class="btn{"" if pop else " btn-line"}" href="contact.html?offre={offre}" {tx("cta_quote")[0]}>{tx("cta_quote")[1]}</a>
</article>'''
    return f'<div class="plans">{out}</div><p class="vat" {tx("vat_note")[0]}>{tx("vat_note")[1]}</p>'


d("of_title", "Les offres du moment", "Current offers")
d("of1_t", "Offre de lancement", "Launch offer")
d("of1_p", "-15 % sur tous les sites jusqu'au [À REMPLIR : date]", "15% off all websites until [TO FILL IN: date]")
d("of2_t", "Pack Site + Webmaster", "Site + Webmaster pack")
d("of2_p", "Les 3 premiers mois de maintenance offerts", "First 3 months of maintenance free")
d("of3_t", "Paiement en 3 fois", "Pay in 3 instalments")
d("of3_p", "Sans frais", "No fees")
d("of4_t", "Premier appel et devis", "First call and quote")
d("of4_p", "Gratuits, sans engagement", "Free, no commitment")


def offers():
    items = "".join(f'<li data-rev><b {tx(f"of{i}_t")[0]}>{tx(f"of{i}_t")[1]}</b><span {tx(f"of{i}_p")[0]}>{tx(f"of{i}_p")[1]}</span></li>' for i in range(1, 5))
    return f'<div class="offers"><h3 {tx("of_title")[0]}>{tx("of_title")[1]}</h3><ul>{items}</ul></div>'


# ---- FAQ
FAQ = [
    ("faq1", "Quels types de sites réalisez-vous ?", "What kinds of sites do you build?",
     "Sites vitrines, boutiques en ligne, refontes de sites existants, et maintenance au quotidien. On travaille surtout avec des artisans, commerçants, indépendants et TPE/PME en Île-de-France.",
     "Showcase sites, online stores, redesigns of existing sites, and day-to-day maintenance. We mostly work with craftspeople, shopkeepers, freelancers and small businesses in the Île-de-France region."),
    ("faq2", "Combien coûte un site ?", "How much does a website cost?",
     "Site Essentiel à partir de 490 €, Site Pro à partir de 890 €, E-commerce à partir de 1 490 €, et Webmaster à partir de 39 €/mois. Prix TTC, TVA non applicable (art. 293 B du CGI). Le devis est gratuit et le prix annoncé est celui que vous payez.",
     "Essential site from €490, Pro site from €890, E-commerce from €1,490, and Webmaster from €39/month. Prices include all taxes, VAT not applicable (art. 293 B of the French tax code). The quote is free and the price quoted is the price you pay."),
    ("faq3", "Puis-je payer en plusieurs fois ?", "Can I pay in instalments?",
     "Oui, le paiement en 3 fois sans frais est possible sur tous les sites.",
     "Yes, you can pay in 3 instalments at no extra cost on all websites."),
    ("faq4", "Quels sont les délais ?", "How long does it take?",
     "Site Essentiel : environ 2 semaines. Site Pro : 3 à 6 semaines. E-commerce : 4 à 8 semaines. Les délais dépendent aussi de la rapidité avec laquelle vous nous fournissez textes et photos. Un planning est donné avant de démarrer.",
     "Essential site: about 2 weeks. Pro site: 3 to 6 weeks. E-commerce: 4 to 8 weeks. Timing also depends on how quickly you send us texts and photos. A schedule is shared before we start."),
    ("faq5", "Pourquoi WordPress ?", "Why WordPress?",
     "C'est un outil connu et solide. Vous restez propriétaire de votre site et vous pouvez modifier vous-même textes et images, avec une courte formation. Si vous préférez, on s'en charge avec l'offre Webmaster.",
     "It's a well-known, solid tool. You own your site and can edit text and images yourself after a short training. If you prefer, we handle it for you with the Webmaster plan."),
    ("faq6", "Qui écrit les textes et fournit les images ?", "Who writes the text and supplies the images?",
     "Vous pouvez tout fournir, ou nous confier la rédaction et le choix des images. On propose des textes pensés pour être bien référencés.",
     "You can supply everything, or leave the writing and image selection to us. We write text designed to rank well in search."),
    ("faq7", "Que se passe-t-il après la mise en ligne ?", "What happens after launch?",
     "Vous pouvez gérer le site seul, ou souscrire l'offre Webmaster : mises à jour, sécurité, sauvegardes et modifications de contenu, sans engagement.",
     "You can run the site yourself, or sign up for the Webmaster plan: updates, security, backups and content changes, with no commitment."),
    ("faq8", "Où travaillez-vous ?", "Where do you work?",
     "Ovia est basé à Paris. On accompagne des clients de Paris et de toute l'Île-de-France, notamment en Seine-Saint-Denis, par téléphone, en visio ou en rendez-vous.",
     "Ovia is based in Paris. We work with clients in Paris and across the Île-de-France region, including Seine-Saint-Denis, by phone, video call or in person."),
]
d("faq_title", "Questions fréquentes", "Frequently asked questions")
d("faq_lead", "Les réponses aux questions qu'on nous pose le plus souvent avant de démarrer.",
  "Answers to the questions we hear most before a project starts.")
d("faq_more", "Une autre question ?", "Another question?")
d("faq_all", "Toutes les questions", "All questions")


def faq_items(ids):
    out = ""
    for k, qfr, qen, afr, aen in FAQ:
        d(k + "_q", qfr, qen)
        d(k + "_a", afr, aen)
        if k in ids:
            out += f'''<details class="qa" data-rev><summary><span {tx(k + "_q")[0]}>{tx(k + "_q")[1]}</span></summary>
  <p {tx(k + "_a")[0]}>{tx(k + "_a")[1]}</p></details>'''
    return f'<div class="faq">{out}</div>'


# ================================================================== PAGES
# ---------- ACCUEIL
d("hero_kicker", "Studio web · Paris", "Web studio · Paris")
d("hero_h1", "Des sites web modernes pour les artisans et petites entreprises, à prix accessible",
  "Modern websites for craftspeople and small businesses, at an accessible price")
d("hero_sub", "Site vitrine, boutique en ligne, refonte ou entretien : Ovia vous accompagne à Paris et en Île-de-France, avec des prix clairs et un seul interlocuteur.",
  "Showcase site, online store, redesign or upkeep: Ovia supports you in Paris and across Île-de-France, with clear prices and one point of contact.")
d("hero_c2", "Voir les tarifs", "See pricing")
d("trust1", "Premier appel gratuit", "Free first call")
d("trust2", "Prix transparents", "Transparent pricing")
d("trust3", "Paiement en 3 fois sans frais", "Pay in 3 instalments, no fees")
d("home_work_title", "Réalisations", "Selected work")
d("home_work_lead", "Quelques projets récents : le besoin du client, et ce qu'on a mis en place.", "A few recent projects: the client's need, and what we built.")
d("home_svc_title", "Ce qu'on fait pour vous", "What we do for you")
d("home_pr_title", "Des tarifs clairs", "Clear pricing")
d("home_faq_title", "Vos questions", "Your questions")

home = f'''<section class="hero"><div class="wrap">
  <p class="kicker" {tx("hero_kicker")[0]}>{tx("hero_kicker")[1]}</p>
  <h1 {tx("hero_h1")[0]}>{tx("hero_h1")[1]}</h1>
  <p class="sub" {tx("hero_sub")[0]}>{tx("hero_sub")[1]}</p>
  <div class="acts">
    <a class="btn btn-lg" href="contact.html" {tx("cta_quote")[0]}>{tx("cta_quote")[1]}</a>
    <a class="btn btn-line btn-lg" href="tarifs.html" {tx("hero_c2")[0]}>{tx("hero_c2")[1]}</a>
  </div>
  <ul class="trust"><li {tx("trust1")[0]}>{tx("trust1")[1]}</li><li {tx("trust2")[0]}>{tx("trust2")[1]}</li><li {tx("trust3")[0]}>{tx("trust3")[1]}</li></ul>
</div></section>

{stats_section()}

<section class="sec" id="work"><div class="wrap">
  <div class="sec-head" data-rev>{el("h2", "home_work_title")}{el("p", "home_work_lead", cls="lead")}</div>
  <div class="projs three">{"".join(project_card(*p) for p in PROJECTS[:3])}</div>
  <p class="more" data-rev><a class="btn btn-line" href="work.html" {tx("btn_all_work")[0]}>{tx("btn_all_work")[1]}</a></p>
</div></section>

<section class="sec alt" id="services"><div class="wrap">
  <div class="sec-head" data-rev>{el("h2", "home_svc_title")}{el("p", "svc_lead", cls="lead")}</div>
  {services_grid()}
</div></section>

{steps_section()}

<section class="sec" id="tarifs"><div class="wrap">
  <div class="sec-head" data-rev>{el("h2", "home_pr_title")}{el("p", "pr_lead", cls="lead")}</div>
  {plan_cards()}
  {offers()}
</div></section>

{reviews_section()}

<section class="sec alt" id="faq"><div class="wrap narrow">
  <div class="sec-head" data-rev>{el("h2", "home_faq_title")}</div>
  {faq_items(("faq2", "faq4", "faq5", "faq7"))}
  <p class="more" data-rev><a class="btn btn-line" href="faq.html" {tx("faq_all")[0]}>{tx("faq_all")[1]}</a></p>
</div></section>

{cta_section()}'''
page("index.html", "Création site internet Paris | Ovia — sites pour artisans et TPE",
     "Ovia crée des sites internet modernes à Paris et en Seine-Saint-Denis pour artisans, commerçants et petites entreprises : site vitrine WordPress, e-commerce, refonte et webmaster. Devis gratuit.",
     home, active="index.html", jsonld=True)

# ---------- RÉALISATIONS
d("work_title", "Réalisations", "Work")
d("work_lead", "Pour chaque projet : le type de site, le besoin du client et le résultat obtenu.", "For each project: the type of site, the client's need and the result achieved.")
page("work.html", "Réalisations | Ovia — création de sites web à Paris",
     "Découvrez les sites web réalisés par Ovia, studio web à Paris : site vitrine WordPress, réservation en ligne, refonte et maintenance.",
     f'''<section class="page-hero"><div class="wrap">{el("h1", "work_title")}{el("p", "work_lead", cls="lead")}</div></section>
<section class="sec tight"><div class="wrap"><div class="projs">{"".join(project_card(*p) for p in PROJECTS)}</div></div></section>
{reviews_section()}
{cta_section()}''', active="work.html")

# ---------- SERVICES
d("wp_title", "WordPress : vous gardez la main", "WordPress: you stay in control")
d("wp_p", "On construit la plupart des sites sur WordPress. Vous êtes propriétaire de votre site, vous pouvez modifier vos textes et vos images sans nous, et il évolue avec votre activité.",
  "We build most sites on WordPress. You own your site, you can edit your text and images without us, and it grows with your business.")
d("wp1", "Modifiable par vous-même, avec une formation", "Editable by you, with training")
d("wp2", "Un outil répandu : facile de trouver de l'aide", "A widespread tool: help is easy to find")
d("wp3", "Évolutif : pages, boutique, blog, réservation", "Scalable: pages, store, blog, booking")
d("web_title", "Webmaster : votre site entretenu, sans y penser", "Webmaster: your site looked after, effortlessly")
d("web_p", "Un site doit être mis à jour, sauvegardé et protégé. Avec l'offre Webmaster, on s'en occupe chaque mois et vous pouvez nous demander vos modifications de contenu à tout moment.",
  "A site needs to be updated, backed up and protected. With the Webmaster plan we handle it every month, and you can ask for content changes at any time.")
d("web_cta", "Voir l'offre Webmaster", "See the Webmaster plan")
wp_block = f'''<section class="sec"><div class="wrap feature-2">
  <div class="feat" data-rev>
    {el("h2", "wp_title")}{el("p", "wp_p", cls="lead")}
    <ul class="ticks"><li {tx("wp1")[0]}>{tx("wp1")[1]}</li><li {tx("wp2")[0]}>{tx("wp2")[1]}</li><li {tx("wp3")[0]}>{tx("wp3")[1]}</li></ul>
  </div>
  <div class="feat accent" data-rev>
    {el("h2", "web_title")}{el("p", "web_p", cls="lead")}
    <a class="btn btn-inv" href="tarifs.html" {tx("web_cta")[0]}>{tx("web_cta")[1]}</a>
  </div>
</div></section>'''
svc_page_body = f'''<section class="page-hero"><div class="wrap">{el("h1", "svc_title")}{el("p", "svc_lead", cls="lead")}</div></section>
<section class="sec tight"><div class="wrap">{services_grid()}</div></section>
{wp_block}
{steps_section()}
{cta_section()}'''
page("services.html", "Services | Ovia — création de site internet, WordPress, webmaster à Paris",
     "Création de site vitrine WordPress, site e-commerce WooCommerce ou Shopify, refonte, webmaster et maintenance, SEO local : les services d'Ovia à Paris.",
     svc_page_body, active="services.html")

# ---------- TARIFS
page("tarifs.html", "Tarifs création site internet Paris | Ovia — à partir de 490 €",
     "Tarifs clairs : site vitrine à partir de 490 €, site pro 890 €, e-commerce 1 490 €, webmaster dès 39 €/mois. Paiement en 3 fois sans frais, devis gratuit.",
     f'''<section class="page-hero"><div class="wrap">{el("h1", "pr_title")}{el("p", "pr_lead", cls="lead")}</div></section>
<section class="sec tight"><div class="wrap">{plan_cards()}{offers()}</div></section>
<section class="sec alt"><div class="wrap narrow">
  <div class="sec-head">{el("h2", "faq_title")}</div>{faq_items(("faq2", "faq3", "faq4", "faq7"))}</div></section>
{cta_section()}''', active="tarifs.html")

# ---------- FAQ
page("faq.html", "FAQ | Ovia — questions sur la création de site internet",
     "Prix, délais, paiement en 3 fois, WordPress, maintenance : les réponses aux questions fréquentes sur la création de votre site internet avec Ovia.",
     f'''<section class="page-hero"><div class="wrap">{el("h1", "faq_title")}{el("p", "faq_lead", cls="lead")}</div></section>
<section class="sec tight"><div class="wrap narrow">{faq_items(tuple(f[0] for f in FAQ))}
  <p class="more">{el("span", "faq_more")} <a class="btn" href="contact.html" {tx("cta_quote")[0]}>{tx("cta_quote")[1]}</a></p></div></section>''',
     active="faq.html")

# ---------- CONTACT
d("ct_title", "Demandez votre devis gratuit", "Request your free quote")
d("ct_lead", "Dites-nous quelques mots sur votre activité et votre projet. On vous répond sous 48 h ouvrées, sans engagement.",
  "Tell us a few words about your business and your project. We reply within 48 working hours, no commitment.")
d("f_name", "Votre nom *", "Your name *")
d("f_email", "Votre email *", "Your email *")
d("f_message", "Votre projet *", "Your project *")
d("f_submit", "Envoyer ma demande", "Send my request")
d("f_sending", "Envoi…", "Sending…")
d("f_note", "Réponse sous 48 h ouvrées. Vos informations restent confidentielles.", "We reply within 48 working hours. Your details stay confidential.")
d("f_done", "Bien reçu ! <span>On revient vers vous sous 48 h.</span>", "Got it! <span>We'll get back to you within 48 hours.</span>")
d("f_fail", 'L\'envoi n\'a pas fonctionné. Écrivez-nous directement à <a href="mailto:contact@ovia.agency">contact@ovia.agency</a>.',
  'Something went wrong. Write to us directly at <a href="mailto:contact@ovia.agency">contact@ovia.agency</a>.')
d("f_err_req", "Ce champ est obligatoire", "This field is required")
d("f_err_mail", "Adresse email invalide", "Invalid email address")
d("a_write", "Écrivez-nous", "Write to us")
d("a_call", "Appelez-nous", "Call us")
d("a_loc", "Localisation", "Location")
d("a_paris", "Paris", "Paris")
d("a_free", "Le premier appel est gratuit.", "The first call is free.")
page("contact.html", "Contact & devis gratuit | Ovia — création de site internet Paris",
     "Demandez votre devis gratuit pour la création de votre site internet à Paris ou en Seine-Saint-Denis. Réponse sous 48 h ouvrées.",
     f'''<section class="page-hero"><div class="wrap">{el("h1", "ct_title")}{el("p", "ct_lead", cls="lead")}</div></section>
<section class="sec tight"><div class="wrap contact-wrap">
  <form class="brief" id="form" action="/api/send" method="post" novalidate>
    <div class="field"><label for="f-name" {tx("f_name")[0]}>{tx("f_name")[1]}</label>
      <input id="f-name" name="name" type="text" autocomplete="name" required><div class="err" role="alert"></div></div>
    <div class="field"><label for="f-email" {tx("f_email")[0]}>{tx("f_email")[1]}</label>
      <input id="f-email" name="email" type="email" autocomplete="email" required><div class="err" role="alert"></div></div>
    <div class="field"><label for="f-message" {tx("f_message")[0]}>{tx("f_message")[1]}</label>
      <textarea id="f-message" name="message" rows="5" required></textarea><div class="err" role="alert"></div></div>
    <div class="hp" aria-hidden="true"><label>Ne pas remplir<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
    <div class="submit"><button class="btn btn-lg" type="submit" id="send"><span {tx("f_submit")[0]}>{tx("f_submit")[1]}</span></button>
      <span class="note" {tx("f_note")[0]}>{tx("f_note")[1]}</span></div>
    <div class="formdone" id="done" role="status" {tx("f_done")[0]}>{tx("f_done")[1]}</div>
    <div class="formfail" id="fail" role="alert" {tx("f_fail")[0]}>{tx("f_fail")[1]}</div>
  </form>
  <aside class="aside">
    <div class="blk"><h2 {tx("a_write")[0]}>{tx("a_write")[1]}</h2><a class="em" href="mailto:contact@ovia.agency">contact@ovia.agency</a></div>
    <div class="blk"><h2 {tx("a_call")[0]}>{tx("a_call")[1]}</h2><a class="em" href="tel:+33651466582">06 51 46 65 82</a><p {tx("a_free")[0]}>{tx("a_free")[1]}</p></div>
    <div class="blk"><h2 {tx("a_loc")[0]}>{tx("a_loc")[1]}</h2><p class="em plain" {tx("a_paris")[0]}>{tx("a_paris")[1]}</p></div>
  </aside>
</div></section>
<section class="sec alt"><div class="wrap narrow"><div class="sec-head">{el("h2", "home_faq_title")}</div>{faq_items(("faq2", "faq4", "faq7"))}
  <p class="more"><a class="btn btn-line" href="faq.html" {tx("faq_all")[0]}>{tx("faq_all")[1]}</a></p></div></section>''',
     active="contact.html", jsonld=True)

# ---------- MENTIONS LÉGALES (FR uniquement)
ml = f'''<section class="page-hero"><div class="wrap"><h1>Mentions légales</h1>
<p class="lead">Informations légales relatives au site ovia.agency.</p></div></section>
<section class="sec tight"><div class="wrap narrow legal">
<h2>Éditeur du site</h2>
<ul>
<li>Nom commercial : Ovia</li>
<li>Responsable / directeur de la publication : <span class="todo">[À REMPLIR : nom et prénom]</span></li>
<li>Statut juridique : <span class="todo">[À REMPLIR : ex. micro-entrepreneur]</span></li>
<li>SIRET : <span class="todo">[À REMPLIR : numéro SIRET]</span></li>
<li>Adresse : <span class="todo">[À REMPLIR : adresse du siège, Paris]</span></li>
<li>Email : <a href="mailto:contact@ovia.agency">contact@ovia.agency</a></li>
<li>Téléphone : <a href="tel:+33651466582">06 51 46 65 82</a></li>
<li>TVA : non applicable, art. 293 B du CGI.</li>
</ul>
<h2>Hébergement</h2>
<ul><li>Hébergeur : <span class="todo">[À REMPLIR : nom, adresse et téléphone de l'hébergeur]</span></li></ul>
<h2>Propriété intellectuelle</h2>
<p>Les textes, images, logos et éléments graphiques du site sont la propriété d'Ovia ou de leurs auteurs respectifs. Toute reproduction sans autorisation écrite est interdite. Les captures d'écran de sites clients sont présentées avec l'accord de leurs propriétaires <span class="todo">[À REMPLIR : à confirmer auprès de chaque client]</span>.</p>
<h2>Données personnelles</h2>
<p>Le formulaire de contact collecte votre nom, votre adresse email et votre message, uniquement pour répondre à votre demande. Ces données ne sont ni vendues ni transmises à des tiers, et sont conservées le temps nécessaire au traitement de votre demande. Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à <a href="mailto:contact@ovia.agency">contact@ovia.agency</a>. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
<h2>Cookies</h2>
<p>Ce site n'utilise pas de cookies de suivi ni de publicité. Les polices sont hébergées sur le site lui-même. Votre choix de langue est conservé uniquement dans votre navigateur.</p>
</div></section>'''
page("mentions-legales.html", "Mentions légales | Ovia", "Mentions légales du site ovia.agency.", ml, robots="noindex,follow")

# ================================================================== i18n.js
fr = {k: v[0] for k, v in T.items()}
en = {k: v[1] for k, v in T.items()}
with io.open(os.path.join(ROOT, "assets", "i18n.js"), "w", encoding="utf-8", newline="\n") as f:
    f.write("/* Généré à partir de la source FR/EN. Ne pas éditer à la main : voir build. */\nwindow.I18N=")
    f.write(json.dumps({"fr": fr, "en": en}, ensure_ascii=False, separators=(",", ":")))
    f.write(";\n")

# sitemap + robots
pages = ["", "work.html", "services.html", "tarifs.html", "faq.html", "contact.html"]
with io.open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for p in pages:
        f.write(f"  <url><loc>{SITE}/{p}</loc></url>\n")
    f.write("</urlset>\n")
with io.open(os.path.join(ROOT, "robots.txt"), "w", encoding="utf-8", newline="\n") as f:
    f.write(f"User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: {SITE}/sitemap.xml\n")
print("ok", len(T), "clés")
