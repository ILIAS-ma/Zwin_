/* ============================================================
   OVIA — script partagé : i18n (FR/EN/AR), hero animé,
   révélations, accordéon FAQ, formulaire, transitions de page.
   Aucune dépendance externe.
   ============================================================ */

/* ---------------- 1. DICTIONNAIRE ---------------- */
const I18N = {
  fr:{
    nav_home:"Accueil", nav_work:"Réalisations", nav_services:"Services", nav_faq:"FAQ", nav_contact:"Contact",
    hero_kicker:"Studio web créatif — Paris & Remote",
    hero_line1:"On crée des sites",
    hero_line2:"qui",
    hero_sub:"Ovia est un studio web indépendant. Design, développement, e-commerce et SEO — tout sous un même toit, sans agence intermédiaire.",
    hero_cta1:"Démarrer un projet", hero_cta2:"Voir nos réalisations",
    hero_scroll:"Défiler", hero_side:"Studio créatif<br>'23 — '26",

    manifesto_big:"On crée des sites web qui font tourner les têtes et qui convertissent <span class='hl'>vraiment</span>. Pas juste de jolies pages.",
    manifesto_small:"Ovia est un studio web créatif indépendant. Design, développement, e-commerce et SEO — tout sous un même toit.",

    work_title:"Réalisations", work_tag:"— Nos 4 plus beaux projets",
    work_lead:"Des projets pensés pour durer : une direction artistique forte, un code propre et des résultats mesurables.",
    proj1_cat:"Marketplace · 2025", proj1_name:"Eco Motors Deal", proj1_desc:"Marketplace de véhicules électriques : recherche multicritère, fiches détaillées et mise en relation acheteurs / vendeurs.",
    proj2_cat:"Location · Stripe · 2025", proj2_name:"PCW", proj2_desc:"Paris Car Week : plateforme de réservation d'essais et d'espaces, paiement en ligne intégré via Stripe.",
    proj3_cat:"Vitrine B2B · WordPress · 2024", proj3_name:"Artebat", proj3_desc:"Site vitrine B2B pour la rénovation énergétique : simulateur CEE, génération de leads et suivi des demandes d'audit.",
    proj4_cat:"Refonte · WordPress · Maintenance", proj4_name:"Museo Santorsola", proj4_desc:"Refonte complète du site du musée florentin : expositions, résidences d'artistes, bilingue IT / FR et maintenance continue.",

    stat_projects:"Projets livrés", stat_years:"Ans d'expertise", stat_clients:"Clients satisfaits",

    services_title:"Services", services_tag:"— Ce qu'on fait",
    services_lead:"Une équipe réduite, un interlocuteur unique, et tout le savoir-faire nécessaire de la stratégie à la mise en ligne.",
    svc1_tag:"Stratégie", svc1_h:"Stratégie & Conseil", svc1_p:"Audit, positionnement, architecture de l'information et roadmap digitale sur-mesure.",
    svc2_tag:"Design", svc2_h:"Design & UX", svc2_p:"Interfaces soignées et intuitives qui convertissent. Du wireframe au pixel final.",
    svc3_tag:"Code", svc3_h:"Développement web", svc3_p:"Code propre, rapide et évolutif. Next.js, React, WordPress, Shopify.",
    svc4_tag:"E-commerce", svc4_h:"E-commerce", svc4_p:"Boutiques rapides et rentables, pensées pour vendre et fidéliser.",
    svc5_tag:"Motion", svc5_h:"Motion & 3D", svc5_p:"Animations, interactions et expériences 3D qui donnent vie à votre marque.",
    svc6_tag:"SEO", svc6_h:"SEO & Performance", svc6_p:"Visibilité durable, vitesse et bonnes pratiques techniques pour durer.",

    process_title:"Méthode", process_tag:"— Comment on travaille",
    step1_h:"Découverte", step1_p:"On écoute, on questionne, on cadre. Objectifs, cibles, concurrence : on pose les fondations avant de dessiner quoi que ce soit.",
    step2_h:"Direction artistique", step2_p:"Maquettes, typographies, couleurs et animations. Vous validez un design précis — pas une promesse.",
    step3_h:"Développement", step3_p:"Intégration soignée, responsive, rapide et accessible. Vous suivez l'avancement sur un lien de préproduction.",
    step4_h:"Lancement & suivi", step4_p:"Mise en ligne, SEO technique, formation à l'outil et suivi des performances les mois suivants.",

    faq_title:"FAQ", faq_tag:"— Questions fréquentes",
    faq_lead:"Tarifs, délais, méthode : les réponses aux questions qu'on nous pose le plus souvent avant de démarrer.",
    faq1_q:"Quels types de projets réalisez-vous ?", faq1_a:"Sites vitrines, e-commerce, landing pages, applications web, refonte et identité digitale complète. On travaille aussi bien avec des indépendants qu'avec des PME, des startups et des marques établies.",
    faq2_q:"Quels sont vos tarifs ?", faq2_a:"Tout dépend du périmètre. Un site vitrine démarre autour de 2 500 €, un e-commerce autour de 6 000 €. On établit un devis détaillé et personnalisé après un premier appel — transparent, sans surprise.",
    faq3_q:"Quels délais pour un projet web ?", faq3_a:"Une landing page : 2 à 4 semaines. Un site vitrine : 3 à 6 semaines. Un e-commerce : 4 à 8 semaines. Une application sur-mesure : 6 à 16 semaines. On partage un planning détaillé avant de démarrer.",
    faq4_q:"Vous faites le design ET le développement ?", faq4_a:"Oui, les deux sous le même toit. Design UI/UX, motion et développement front & back. Ce que vous validez en maquette est exactement ce qui est livré, au pixel près.",
    faq5_q:"Qui écrit les textes et fournit les images ?", faq5_a:"Vous pouvez tout fournir, ou nous confier la rédaction et la direction photo. On propose des textes optimisés SEO et une sélection d'images pensée pour votre marque.",
    faq6_q:"Que se passe-t-il après la mise en ligne ?", faq6_a:"On ne disparaît pas le jour du lancement. Maintenance, mises à jour, nouvelles pages, suivi des performances : on propose un forfait mensuel, ou on forme votre équipe à gérer le site seule.",
    faq7_q:"Puis-je modifier le site moi-même ?", faq7_a:"Oui. On livre un back-office simple et une courte formation vidéo. Textes, images, articles, produits : vous restez autonome sur tout le contenu.",
    faq8_q:"Travaillez-vous à l'international ?", faq8_a:"Oui. On accompagne des clients partout dans le monde et on gère les projets 100 % en remote — outils modernes, points réguliers, communication claire.",
    faq_more:"Une autre question en tête ?", faq_more_btn:"Écrivez-nous →", faq_all:"Toutes les questions →",

    contact_title:"Parlons<br><span class='o'>de vous</span>", contact_kicker:"(Contact) — Créons quelque chose",
    contact_lead:"Une idée, un brief ou juste une intuition ? Parlez-nous de votre projet. On répond sous 48h — pas de bot, juste l'équipe.",
    f_name:"Votre nom *", f_email:"Votre email *", f_message:"Votre message *",
    f_submit:"Envoyer", f_sending:"Envoi…", f_note:"Réponse sous 48h ouvrées. Vos informations restent confidentielles.",
    f_done:"Bien reçu. <span>On revient vers vous sous 48h. ✺</span>",
    f_fail:"L'envoi n'a pas fonctionné. Écrivez-nous directement à <a href=\"mailto:contact@ovia.agency\">contact@ovia.agency</a>.",
    f_err_req:"Ce champ est obligatoire", f_err_mail:"Adresse email invalide",
    a_write:"Écrivez-nous", a_call:"Appelez-nous", a_studios:"Localisation",
    off_paris:"Paris", off_paris_s:"Île-de-France", off_casa:"Casablanca", off_casa_s:"Maroc", off_remote:"Remote", off_remote_s:"Disponible partout",

    cta_title:"Votre projet<br>mérite mieux", cta_btn:"Démarrer un projet →",
    footer_rights:"© 2026 Ovia — Tous droits réservés"
  },

  en:{
    nav_home:"Home", nav_work:"Work", nav_services:"Services", nav_faq:"FAQ", nav_contact:"Contact",
    hero_kicker:"Creative web studio — Paris & Remote",
    hero_line1:"We build websites",
    hero_line2:"that",
    hero_sub:"Ovia is an independent web studio. Design, development, e-commerce and SEO — all under one roof, with no agency in between.",
    hero_cta1:"Start a project", hero_cta2:"See our work",
    hero_scroll:"Scroll", hero_side:"Creative studio<br>'23 — '26",

    manifesto_big:"We build websites that turn heads and <span class='hl'>actually</span> convert. Not just pretty pages.",
    manifesto_small:"Ovia is an independent creative web studio. Design, development, e-commerce and SEO — all under one roof.",

    work_title:"Work", work_tag:"— Our 4 finest projects",
    work_lead:"Projects built to last: strong art direction, clean code and results you can measure.",
    proj1_cat:"Marketplace · 2025", proj1_name:"Eco Motors Deal", proj1_desc:"Electric vehicle marketplace: multi-criteria search, detailed listings and buyer / seller matching.",
    proj2_cat:"Booking · Stripe · 2025", proj2_name:"PCW", proj2_desc:"Paris Car Week: booking platform for test drives and exhibition spaces, with Stripe payments built in.",
    proj3_cat:"B2B website · WordPress · 2024", proj3_name:"Artebat", proj3_desc:"B2B website for energy renovation: CEE simulator, lead generation and audit request tracking.",
    proj4_cat:"Redesign · WordPress · Maintenance", proj4_name:"Museo Santorsola", proj4_desc:"Full redesign for the Florentine museum: exhibitions, artist residencies, IT / FR bilingual and ongoing maintenance.",

    stat_projects:"Projects delivered", stat_years:"Years of craft", stat_clients:"Happy clients",

    services_title:"Services", services_tag:"— What we do",
    services_lead:"A small team, a single point of contact, and every skill you need from strategy to launch day.",
    svc1_tag:"Strategy", svc1_h:"Strategy & Consulting", svc1_p:"Audit, positioning, information architecture and a tailored digital roadmap.",
    svc2_tag:"Design", svc2_h:"Design & UX", svc2_p:"Polished, intuitive interfaces that convert. From wireframe to final pixel.",
    svc3_tag:"Code", svc3_h:"Web development", svc3_p:"Clean, fast and scalable code. Next.js, React, WordPress, Shopify.",
    svc4_tag:"E-commerce", svc4_h:"E-commerce", svc4_p:"Fast, profitable stores built to sell and keep customers coming back.",
    svc5_tag:"Motion", svc5_h:"Motion & 3D", svc5_p:"Animation, interaction and 3D experiences that bring your brand to life.",
    svc6_tag:"SEO", svc6_h:"SEO & Performance", svc6_p:"Lasting visibility, speed and solid technical foundations that endure.",

    process_title:"Method", process_tag:"— How we work",
    step1_h:"Discovery", step1_p:"We listen, we ask, we frame. Goals, audience, competition: we lay the groundwork before drawing a single screen.",
    step2_h:"Art direction", step2_p:"Mockups, type, colour and motion. You sign off on a precise design — not a promise.",
    step3_h:"Development", step3_p:"Careful build: responsive, fast and accessible. You follow progress on a live staging link.",
    step4_h:"Launch & care", step4_p:"Go live, technical SEO, hands-on training and performance tracking in the months that follow.",

    faq_title:"FAQ", faq_tag:"— Frequently asked",
    faq_lead:"Pricing, timelines, method: answers to the questions we hear most before a project starts.",
    faq1_q:"What kind of projects do you take on?", faq1_a:"Websites, e-commerce, landing pages, web apps, redesigns and full digital identities. We work with freelancers, SMEs, startups and established brands alike.",
    faq2_q:"How much does a project cost?", faq2_a:"It depends on scope. A brochure site starts around €2,500, an e-commerce around €6,000. After a first call we send a detailed, tailored quote — transparent, with no surprises.",
    faq3_q:"What's a typical timeline?", faq3_a:"A landing page: 2–4 weeks. A brochure site: 3–6 weeks. An e-commerce: 4–8 weeks. A custom app: 6–16 weeks. We share a detailed roadmap before we start.",
    faq4_q:"Do you handle design AND development?", faq4_a:"Yes, both under one roof. UI/UX design, motion and front & back development. What you approve in design is exactly what ships, pixel for pixel.",
    faq5_q:"Who writes the copy and supplies images?", faq5_a:"You can provide everything, or hand us copywriting and art direction. We deliver SEO-minded copy and an image selection chosen for your brand.",
    faq6_q:"What happens after launch?", faq6_a:"We don't disappear on launch day. Maintenance, updates, new pages, performance tracking: pick a monthly care plan, or we train your team to run it alone.",
    faq7_q:"Can I edit the site myself?", faq7_a:"Yes. You get a simple back office and a short video walkthrough. Copy, images, articles, products: you stay fully autonomous on content.",
    faq8_q:"Do you work internationally?", faq8_a:"Yes. We work with clients worldwide and run projects fully remote — modern tools, regular check-ins, clear communication.",
    faq_more:"Still have a question?", faq_more_btn:"Write to us →", faq_all:"All questions →",

    contact_title:"Let's talk<br><span class='o'>about you</span>", contact_kicker:"(Contact) — Let's make something",
    contact_lead:"A bold idea, a brief, or just a hunch? Tell us about your project. We reply within 48h — no bots, just the team.",
    f_name:"Your name *", f_email:"Your email *", f_message:"Your message *",
    f_submit:"Send", f_sending:"Sending…", f_note:"We reply within 48 working hours. Your details stay confidential.",
    f_done:"Got it. <span>We'll be in touch within 48h. ✺</span>",
    f_fail:"Something went wrong. Write to us directly at <a href=\"mailto:contact@ovia.agency\">contact@ovia.agency</a>.",
    f_err_req:"This field is required", f_err_mail:"Invalid email address",
    a_write:"Write to us", a_call:"Call us", a_studios:"Based in",
    off_paris:"Paris", off_paris_s:"Île-de-France", off_casa:"Casablanca", off_casa_s:"Morocco", off_remote:"Remote", off_remote_s:"Available worldwide",

    cta_title:"Your project<br>deserves better", cta_btn:"Start a project →",
    footer_rights:"© 2026 Ovia — All rights reserved"
  },

  ar:{
    nav_home:"الرئيسية", nav_work:"أعمالنا", nav_services:"خدماتنا", nav_faq:"الأسئلة", nav_contact:"تواصل",
    hero_kicker:"استوديو ويب إبداعي — باريس وعن بُعد",
    hero_line1:"نصنع مواقع",
    hero_line2:"",
    hero_sub:"أوفيا استوديو ويب مستقل. التصميم والتطوير والتجارة الإلكترونية وتحسين محركات البحث — كلّها تحت سقف واحد، بلا وسطاء.",
    hero_cta1:"ابدأ مشروعاً", hero_cta2:"شاهد أعمالنا",
    hero_scroll:"مرّر", hero_side:"استوديو إبداعي<br>٢٣ — ٢٦",

    manifesto_big:"نبني مواقع إلكترونية تأسر الأنظار وتُحقّق <span class='hl'>تحويلاً حقيقياً</span>. لا مجرّد صفحات جميلة.",
    manifesto_small:"أوفيا استوديو ويب إبداعي مستقل. التصميم والتطوير والتجارة الإلكترونية وتحسين محركات البحث — كلّها تحت سقف واحد.",

    work_title:"أعمالنا", work_tag:"— أجمل أربعة مشاريع لدينا",
    work_lead:"مشاريع مصمّمة لتدوم: إدارة فنية قوية، شيفرة نظيفة، ونتائج قابلة للقياس.",
    proj1_cat:"سوق إلكتروني · ٢٠٢٥", proj1_name:"Eco Motors Deal", proj1_desc:"سوق إلكتروني للسيارات الكهربائية: بحث متعدّد المعايير، بطاقات تفصيلية وربط بين البائعين والمشترين.",
    proj2_cat:"حجز · Stripe · ٢٠٢٥", proj2_name:"PCW", proj2_desc:"Paris Car Week: منصّة لحجز تجارب القيادة والمساحات مع الدفع الإلكتروني عبر Stripe.",
    proj3_cat:"موقع B2B · WordPress · ٢٠٢٤", proj3_name:"Artebat", proj3_desc:"موقع B2B للترميم الطاقي: محاكي شهادات توفير الطاقة، جذب العملاء ومتابعة طلبات التدقيق.",
    proj4_cat:"إعادة تصميم · WordPress · صيانة", proj4_name:"Museo Santorsola", proj4_desc:"إعادة تصميم كاملة لموقع المتحف في فلورنسا: المعارض، إقامات الفنانين، بلغتين IT / FR مع صيانة مستمرّة.",

    stat_projects:"مشروعاً منجزاً", stat_years:"سنوات خبرة", stat_clients:"رضا العملاء",

    services_title:"خدماتنا", services_tag:"— ما نقدّمه",
    services_lead:"فريق صغير، جهة تواصل واحدة، وكل المهارات اللازمة من الاستراتيجية حتى يوم الإطلاق.",
    svc1_tag:"استراتيجية", svc1_h:"الاستراتيجية والاستشارات", svc1_p:"تدقيق وتموضع وهندسة معلومات وخارطة طريق رقمية مخصّصة.",
    svc2_tag:"تصميم", svc2_h:"التصميم وتجربة المستخدم", svc2_p:"واجهات أنيقة وسهلة تُحقّق التحويل. من المخطّط إلى البكسل الأخير.",
    svc3_tag:"برمجة", svc3_h:"تطوير الويب", svc3_p:"شيفرة نظيفة وسريعة وقابلة للتوسّع. Next.js وReact وWordPress وShopify.",
    svc4_tag:"تجارة", svc4_h:"التجارة الإلكترونية", svc4_p:"متاجر سريعة ومربحة مبنية للبيع والحفاظ على العملاء.",
    svc5_tag:"حركة", svc5_h:"الحركة والأبعاد الثلاثية", svc5_p:"رسوم متحرّكة وتفاعلات وتجارب ثلاثية الأبعاد تُحيي علامتك.",
    svc6_tag:"سيو", svc6_h:"تحسين محركات البحث والأداء", svc6_p:"ظهور مستدام وسرعة وأسس تقنية متينة تدوم.",

    process_title:"منهجيتنا", process_tag:"— كيف نعمل",
    step1_h:"الاستكشاف", step1_p:"نستمع ونسأل ونؤطّر. الأهداف والجمهور والمنافسة: نضع الأساس قبل رسم أي شاشة.",
    step2_h:"الإدارة الفنية", step2_p:"نماذج وخطوط وألوان وحركة. توافق على تصميم دقيق — لا على وعد.",
    step3_h:"التطوير", step3_p:"تنفيذ متقن: متجاوب وسريع وسهل الوصول. تتابع التقدّم عبر رابط تجريبي مباشر.",
    step4_h:"الإطلاق والمتابعة", step4_p:"النشر والسيو التقني والتدريب ومتابعة الأداء في الأشهر التالية.",

    faq_title:"الأسئلة", faq_tag:"— الأسئلة المتكرّرة",
    faq_lead:"الأسعار والمدد والمنهجية: إجابات عن أكثر ما يُسأل قبل بدء المشروع.",
    faq1_q:"ما أنواع المشاريع التي تنجزونها؟", faq1_a:"مواقع تعريفية ومتاجر إلكترونية وصفحات هبوط وتطبيقات ويب وإعادة تصميم وهوية رقمية كاملة. نعمل مع المستقلّين والشركات الصغيرة والناشئة والعلامات الراسخة.",
    faq2_q:"ما هي أسعاركم؟", faq2_a:"يعتمد ذلك على نطاق العمل. يبدأ الموقع التعريفي من نحو ٢٥٠٠ يورو، والمتجر الإلكتروني من نحو ٦٠٠٠ يورو. بعد مكالمة أولى نرسل عرض سعر مفصّلاً — شفّاف وبلا مفاجآت.",
    faq3_q:"ما المدّة المعتادة للمشروع؟", faq3_a:"صفحة هبوط: ٢–٤ أسابيع. موقع تعريفي: ٣–٦ أسابيع. متجر إلكتروني: ٤–٨ أسابيع. تطبيق مخصّص: ٦–١٦ أسبوعاً. نشارك خطة زمنية مفصّلة قبل البدء.",
    faq4_q:"هل تتولّون التصميم والتطوير معاً؟", faq4_a:"نعم، الاثنان تحت سقف واحد. تصميم واجهات وحركة وتطوير أمامي وخلفي. ما توافق عليه في التصميم هو تماماً ما يُسلَّم.",
    faq5_q:"من يكتب النصوص ويوفّر الصور؟", faq5_a:"يمكنك توفير كل شيء، أو تكليفنا بالكتابة والإدارة الفنية. نقدّم نصوصاً مُحسّنة لمحركات البحث واختياراً للصور يناسب علامتك.",
    faq6_q:"ماذا يحدث بعد الإطلاق؟", faq6_a:"لا نختفي يوم الإطلاق. صيانة وتحديثات وصفحات جديدة ومتابعة أداء: اختر باقة شهرية، أو ندرّب فريقك لإدارة الموقع بنفسه.",
    faq7_q:"هل يمكنني تعديل الموقع بنفسي؟", faq7_a:"نعم. تحصل على لوحة تحكّم بسيطة وشرح مصوّر قصير. النصوص والصور والمقالات والمنتجات: تبقى مستقلاً تماماً في إدارة المحتوى.",
    faq8_q:"هل تعملون دولياً؟", faq8_a:"نعم. نعمل مع عملاء حول العالم وندير المشاريع عن بُعد بالكامل — أدوات حديثة ومتابعة منتظمة وتواصل واضح.",
    faq_more:"لديك سؤال آخر؟", faq_more_btn:"راسلنا ←", faq_all:"كل الأسئلة ←",

    contact_title:"لنتحدّث<br><span class='o'>عنك</span>", contact_kicker:"(تواصل) — لنصنع شيئاً معاً",
    contact_lead:"فكرة جريئة أو موجز أو مجرّد حدس؟ حدّثنا عن مشروعك. نردّ خلال ٤٨ ساعة — لا روبوتات، بل الفريق مباشرة.",
    f_name:"اسمك *", f_email:"بريدك الإلكتروني *", f_message:"رسالتك *",
    f_submit:"إرسال", f_sending:"جارٍ الإرسال…", f_note:"نردّ خلال ٤٨ ساعة عمل. تبقى معلوماتك سرّية.",
    f_done:"وصلنا طلبك. <span>سنعاود التواصل خلال ٤٨ ساعة. ✺</span>",
    f_fail:"تعذّر الإرسال. راسلنا مباشرة على <a href=\"mailto:contact@ovia.agency\">contact@ovia.agency</a>.",
    f_err_req:"هذا الحقل مطلوب", f_err_mail:"بريد إلكتروني غير صالح",
    a_write:"راسلنا", a_call:"اتّصل بنا", a_studios:"موقعنا",
    off_paris:"باريس", off_paris_s:"إيل دو فرانس", off_casa:"الدار البيضاء", off_casa_s:"المغرب", off_remote:"عن بُعد", off_remote_s:"متاحون في كل مكان",

    cta_title:"مشروعك<br>يستحقّ الأفضل", cta_btn:"ابدأ مشروعاً ←",
    footer_rights:"© ٢٠٢٦ أوفيا — جميع الحقوق محفوظة"
  }
};

/* Le mot qui tourne dans le hero : [texte, couleur d'accent] */
const SWAP_WORDS = {
  fr:[["marquent","#2E2BFF"],["convertissent","#FF2E8B"],["rapportent","#FF5A00"],["inspirent","#6A2EFF"],["durent","#159E4B"]],
  en:[["stand out","#2E2BFF"],["convert","#FF2E8B"],["sell","#FF5A00"],["inspire","#6A2EFF"],["last","#159E4B"]],
  ar:[["تُبهر","#2E2BFF"],["تُحوّل","#FF2E8B"],["تبيع","#FF5A00"],["تُلهم","#6A2EFF"],["تدوم","#159E4B"]]
};

/* ---------------- 2. LANGUE ---------------- */
let LANG = localStorage.getItem('ovia_lang') || 'fr';
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyLang(lang){
  if(!I18N[lang]) lang = 'fr';
  LANG = lang;
  try{ localStorage.setItem('ovia_lang', lang); }catch(e){}
  const dict = I18N[lang];

  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(dict[k] !== undefined) el.textContent = dict[k];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const k = el.getAttribute('data-i18n-html');
    if(dict[k] !== undefined) el.innerHTML = dict[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const k = el.getAttribute('data-i18n-ph');
    if(dict[k] !== undefined) el.placeholder = dict[k];
  });

  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on', b.dataset.lang === lang));
  buildSwap();
}

/* ---------------- 3. HERO : mot tournant + couleur ---------------- */
let swapTimer = null, swapIdx = 0;

function setAccent(color){
  document.documentElement.style.setProperty('--accent', color);
}

function buildSwap(){
  const box = document.getElementById('swap');
  if(!box) return;
  const words = SWAP_WORDS[LANG] || SWAP_WORDS.fr;
  box.innerHTML = words.map(w=>`<span class="w">${w[0]}</span>`).join('');
  swapIdx = 0;
  const first = box.querySelector('.w');
  first.classList.add('on');
  setAccent(words[0][1]);
  sizeSwap();
  clearInterval(swapTimer);
  if(!REDUCED) swapTimer = setInterval(nextWord, 2600);
}

function sizeSwap(){
  const box = document.getElementById('swap');
  if(!box) return;
  const cur = box.querySelector('.w.on');
  if(cur) box.style.width = Math.ceil(cur.getBoundingClientRect().width) + 'px';
}

function nextWord(){
  const box = document.getElementById('swap');
  if(!box) return;
  const words = SWAP_WORDS[LANG] || SWAP_WORDS.fr;
  const nodes = box.querySelectorAll('.w');
  const prev = nodes[swapIdx];
  prev.classList.remove('on');
  prev.classList.add('out');
  setTimeout(()=>prev.classList.remove('out'), 800);

  swapIdx = (swapIdx + 1) % nodes.length;
  nodes[swapIdx].classList.add('on');
  setAccent(words[swapIdx][1]);
  sizeSwap();
}

/* ---------------- 4. RÉVÉLATIONS AU SCROLL ---------------- */
function initReveals(){
  const items = document.querySelectorAll('[data-rev]');
  if(!('IntersectionObserver' in window) || REDUCED){
    items.forEach(el=>el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const group = e.target.parentElement ? [...e.target.parentElement.querySelectorAll(':scope > [data-rev]')] : [];
      const i = Math.max(0, group.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i, 5) * 0.08 + 's';
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, {rootMargin:'0px 0px -10% 0px', threshold:0.08});
  items.forEach(el=>io.observe(el));
}

/* ---------------- 5. COMPTEURS ---------------- */
function initCounters(){
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const run = el=>{
    const end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1500, t0 = performance.now();
    const tick = now=>{
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if(!('IntersectionObserver' in window)){ els.forEach(run); return; }
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ run(e.target); io.unobserve(e.target); }
  }), {threshold:.4});
  els.forEach(el=>io.observe(el));
}

/* ---------------- 6. ACCORDÉON FAQ ---------------- */
function initFaq(){
  const items = document.querySelectorAll('.qa');
  if(!items.length) return;
  const close = qa=>{
    const a = qa.querySelector('.a');
    a.style.height = a.scrollHeight + 'px';
    requestAnimationFrame(()=>{ a.style.height = '0px'; });
    qa.classList.remove('open');
    qa.querySelector('.q').setAttribute('aria-expanded','false');
  };
  const open = qa=>{
    const a = qa.querySelector('.a');
    qa.classList.add('open');
    qa.querySelector('.q').setAttribute('aria-expanded','true');
    a.style.height = a.scrollHeight + 'px';
  };
  items.forEach(qa=>{
    const q = qa.querySelector('.q');
    q.setAttribute('aria-expanded','false');
    q.setAttribute('role','button');
    q.setAttribute('tabindex','0');
    const toggle = ()=>{
      const isOpen = qa.classList.contains('open');
      items.forEach(o=>{ if(o !== qa && o.classList.contains('open')) close(o); });
      isOpen ? close(qa) : open(qa);
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
    });
  });
  window.addEventListener('resize',()=>{
    document.querySelectorAll('.qa.open .a').forEach(a=>{ a.style.height = 'auto'; });
  });
}

/* ---------------- 7. FORMULAIRE ---------------- */
function initForm(){
  const form = document.getElementById('form');
  if(!form) return;

  const check = field=>{
    const input = field.querySelector('input,textarea');
    if(!input || !input.required) return true;
    const v = input.value.trim();
    let ok = v.length > 0;
    let msg = I18N[LANG].f_err_req;
    if(ok && input.type === 'email'){
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if(!ok) msg = I18N[LANG].f_err_mail;
    }
    field.classList.toggle('invalid', !ok);
    const err = field.querySelector('.err');
    if(err) err.textContent = msg;
    return ok;
  };

  form.querySelectorAll('.field input,.field textarea').forEach(input=>{
    input.addEventListener('blur',()=>{ if(input.value.trim()) check(input.closest('.field')); });
    input.addEventListener('input',()=>{
      const f = input.closest('.field');
      if(f.classList.contains('invalid')) check(f);
    });
  });

  const fail = document.getElementById('fail');
  const done = document.getElementById('done');
  const btn = document.getElementById('send');
  const btnLabel = btn ? btn.querySelector('span') : null;

  const showDone = ()=>{
    const parts = [...form.querySelectorAll('.field,.submit')];
    parts.forEach((p,i)=>{
      p.style.transition = 'opacity .4s var(--ease), transform .4s var(--ease)';
      p.style.transitionDelay = i * 0.05 + 's';
      p.style.opacity = '0';
      p.style.transform = 'translateY(-14px)';
    });
    setTimeout(()=>{
      parts.forEach(p=>p.style.display = 'none');
      if(!done) return;
      done.style.display = 'block';
      done.style.opacity = '0';
      done.style.transform = 'translateY(18px)';
      requestAnimationFrame(()=>{
        done.style.transition = 'opacity .7s var(--ease), transform .7s var(--ease)';
        done.style.opacity = '1';
        done.style.transform = 'none';
      });
    }, 400 + parts.length * 50);
  };

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let ok = true, firstBad = null;
    form.querySelectorAll('.field').forEach(f=>{
      if(!check(f)){ ok = false; if(!firstBad) firstBad = f; }
    });
    if(!ok){
      firstBad.scrollIntoView({behavior:'smooth', block:'center'});
      const input = firstBad.querySelector('input,textarea');
      if(input) input.focus({preventScroll:true});
      return;
    }

    if(fail) fail.style.display = 'none';
    if(btn){ btn.disabled = true; if(btnLabel) btnLabel.textContent = I18N[LANG].f_sending; }

    // urlencoded : lisible par PHP comme par la fonction serverless Vercel
    const data = new URLSearchParams(new FormData(form));
    data.append('ajax','1');

    fetch(form.getAttribute('action'), {method:'POST', body:data})
      .then(r=>r.ok ? r.text() : Promise.reject(r.status))
      .then(txt=>{
        if(txt.trim().slice(0,2) !== 'OK') return Promise.reject(txt);
        showDone();
      })
      .catch(()=>{
        if(btn){ btn.disabled = false; if(btnLabel) btnLabel.textContent = I18N[LANG].f_submit; }
        if(fail){
          fail.style.display = 'block';
          fail.scrollIntoView({behavior:'smooth', block:'center'});
        }
      });
  });
}

/* ---------------- 8. NAV : menu mobile + progression ---------------- */
function initNav(){
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if(burger && menu){
    burger.addEventListener('click',()=>{
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }));
    document.addEventListener('keydown',e=>{
      if(e.key === 'Escape' && document.body.classList.contains('menu-open')){
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
  }

  const prog = document.getElementById('prog');
  if(prog){
    const update = ()=>{
      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    };
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  }
}

/* ---------------- 9. TRANSITIONS DE PAGE ---------------- */
function initPageTransition(){
  const pt = document.getElementById('pt');
  if(!pt) return;

  // rideau d'entrée : on le retire une fois joué pour libérer la page
  setTimeout(()=>pt.classList.remove('in'), 1200);

  const internal = a=>{
    const href = a.getAttribute('href');
    if(!href || a.target === '_blank' || a.hasAttribute('download')) return false;
    if(href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    return /\.html($|[?#])/.test(href) || href === '/' ;
  };

  document.addEventListener('click', e=>{
    const a = e.target.closest('a');
    if(!a || !internal(a)) return;
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const dest = a.getAttribute('href');
    if(dest.split('#')[0] === location.pathname.split('/').pop()) return; // déjà sur la page
    e.preventDefault();
    document.body.classList.add('leaving');
    pt.classList.remove('in');
    pt.classList.add('out');
    setTimeout(()=>{ location.href = dest; }, REDUCED ? 0 : 620);
  });

  // retour arrière depuis le cache : on nettoie le rideau
  window.addEventListener('pageshow', e=>{
    if(e.persisted){
      pt.classList.remove('out');
      document.body.classList.remove('leaving');
      pt.classList.add('in');
      setTimeout(()=>pt.classList.remove('in'), 1200);
    }
  });
}

/* ---------------- 10. DÉMARRAGE ---------------- */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.lang button').forEach(b=>{
    b.addEventListener('click',()=>applyLang(b.dataset.lang));
  });
  applyLang(LANG);
  initReveals();
  initCounters();
  initFaq();
  initForm();
  initNav();
  initPageTransition();

  // les polices changent la largeur du mot animé
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(sizeSwap);
  window.addEventListener('resize', sizeSwap);
});
