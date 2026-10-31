/* ============================================================
   OVIA — script partagé : langue FR/EN, menu mobile, apparitions
   discrètes, formulaire. Les textes viennent de assets/i18n.js.
   Aucune dépendance. Le site reste lisible sans ce fichier.
   ============================================================ */
window.__ovia = true;

const I18N = window.I18N || {fr:{}, en:{}};
let LANG = 'fr';
try{ LANG = localStorage.getItem('ovia_lang') || 'fr'; }catch(e){}
if(!I18N[LANG]) LANG = 'fr';

/* ---------------- Langue ---------------- */
function applyLang(lang){
  if(!I18N[lang]) lang = 'fr';
  LANG = lang;
  try{ localStorage.setItem('ovia_lang', lang); }catch(e){}
  const dict = I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const v = dict[el.getAttribute('data-i18n')];
    if(v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{
    const v = dict[el.getAttribute('data-i18n-html')];
    if(v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('.lang button').forEach(b=>{
    const on = b.dataset.lang === lang;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

/* ---------------- Apparitions au scroll ---------------- */
function initReveals(){
  const items = document.querySelectorAll('[data-rev]');
  if(!('IntersectionObserver' in window)){ items.forEach(el=>el.classList.add('in')); return; }
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, {rootMargin:'0px 0px -6% 0px', threshold:0.05});
  items.forEach(el=>io.observe(el));
}

/* ---------------- Menu mobile ---------------- */
function initNav(){
  const burger = document.getElementById('burger');
  if(!burger) return;
  const set = open=>{
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', ()=>set(!document.body.classList.contains('menu-open')));
  document.querySelectorAll('#menu a').forEach(a=>a.addEventListener('click', ()=>set(false)));
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') set(false); });
  window.addEventListener('resize', ()=>{ if(window.innerWidth > 860) set(false); });
}

/* ---------------- Formulaire de contact ---------------- */
function initForm(){
  const form = document.getElementById('form');
  if(!form) return;

  // Pré-remplit le message quand on arrive depuis une formule (?offre=pro)
  const OFFRES = {
    essentiel:'Site Essentiel', pro:'Site Pro', ecommerce:'E-commerce', webmaster:'Webmaster'
  };
  const offre = new URLSearchParams(location.search).get('offre');
  const msg = form.querySelector('textarea');
  if(offre && OFFRES[offre] && msg && !msg.value){
    msg.value = 'Bonjour, je souhaite un devis gratuit pour : ' + OFFRES[offre] + '.\n\nMon activité : ';
  }

  const check = field=>{
    const input = field.querySelector('input,textarea');
    if(!input || !input.required) return true;
    const v = input.value.trim();
    let ok = v.length > 0;
    let text = I18N[LANG].f_err_req;
    if(ok && input.type === 'email'){
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if(!ok) text = I18N[LANG].f_err_mail;
    }
    field.classList.toggle('invalid', !ok);
    const err = field.querySelector('.err');
    if(err) err.textContent = text;
    return ok;
  };

  form.querySelectorAll('.field input,.field textarea').forEach(input=>{
    input.addEventListener('blur', ()=>{ if(input.value.trim()) check(input.closest('.field')); });
    input.addEventListener('input', ()=>{
      const f = input.closest('.field');
      if(f.classList.contains('invalid')) check(f);
    });
  });

  const fail = document.getElementById('fail');
  const done = document.getElementById('done');
  const btn = document.getElementById('send');
  const btnLabel = btn ? btn.querySelector('span') : null;

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

    // urlencoded : lisible par PHP (Hostinger) comme par la fonction serverless Vercel
    const data = new URLSearchParams(new FormData(form));
    data.append('ajax','1');

    fetch(form.getAttribute('action'), {method:'POST', body:data})
      .then(r=>r.ok ? r.text() : Promise.reject(r.status))
      .then(txt=>{
        if(txt.trim().slice(0,2) !== 'OK') return Promise.reject(txt);
        form.querySelectorAll('.field,.submit').forEach(p=>p.style.display = 'none');
        if(done){ done.style.display = 'block'; done.scrollIntoView({behavior:'smooth', block:'center'}); }
      })
      .catch(()=>{
        if(btn){ btn.disabled = false; if(btnLabel) btnLabel.textContent = I18N[LANG].f_submit; }
        if(fail){ fail.style.display = 'block'; fail.scrollIntoView({behavior:'smooth', block:'center'}); }
      });
  });
}

/* ---------------- Démarrage ---------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click', ()=>applyLang(b.dataset.lang)));
  applyLang(LANG);
  initReveals();
  initNav();
  initForm();
});
