/* ==========================================================================
   Tableau de bord PRIVE (compte Alpaca FICTIF, lecture seule).

   Le depot est public : AUCUN secret ici. Tout vient des variables Vercel :
     DESK_KEY            mot a mettre dans l'adresse (?k=...), 3 caracteres minimum
     DASH_USER           nom d'utilisateur
     DASH_PASS           mot de passe (12 caracteres minimum : c'est le vrai verrou)
     DESK_ALPACA_KEY     cle Alpaca PAPER
     DESK_ALPACA_SECRET  secret Alpaca PAPER

   Sans la bonne cle dans l'adresse : 404, comme si la page n'existait pas.
   Avec la cle : mot de passe obligatoire. Jamais indexee (X-Robots-Tag).
   ========================================================================== */

const crypto = require('crypto');

const PAPER = 'https://paper-api.alpaca.markets'; // compte fictif uniquement

const sha = v => crypto.createHash('sha256').update(String(v || '')).digest();
const same = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));

function baseHeaders(res, type){
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

function notFound(res){
  baseHeaders(res, 'text/html; charset=utf-8');
  return res.status(404).send('<!doctype html><title>404</title><h1>404</h1>');
}

async function alp(path, params){
  const url = new URL(PAPER + path);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const r = await fetch(url, {
    headers: {
      'APCA-API-KEY-ID': process.env.DESK_ALPACA_KEY || '',
      'APCA-API-SECRET-KEY': process.env.DESK_ALPACA_SECRET || ''
    }
  });
  if(!r.ok) throw new Error('Alpaca ' + r.status);
  return r.json();
}

async function donnees(){
  const out = { error: null };
  try {
    const acc = await alp('/v2/account');
    out.account = { status: acc.status, equity: acc.equity, cash: acc.cash,
                    buying_power: acc.buying_power, last_equity: acc.last_equity };
    out.clock = await alp('/v2/clock');
    out.positions = (await alp('/v2/positions')).map(p => ({
      symbol: p.symbol, qty: p.qty, avg_entry_price: p.avg_entry_price,
      current_price: p.current_price, market_value: p.market_value,
      unrealized_pl: p.unrealized_pl, unrealized_plpc: p.unrealized_plpc }));
    out.orders = (await alp('/v2/orders', { status: 'all', limit: 30, direction: 'desc' })).map(o => ({
      symbol: o.symbol, side: o.side, qty: o.qty, type: o.type, status: o.status,
      limit_price: o.limit_price, filled_avg_price: o.filled_avg_price, submitted_at: o.submitted_at }));
    const h = await alp('/v2/account/portfolio/history', { period: '1M', timeframe: '1D' });
    out.history = { t: h.timestamp || [], equity: h.equity || [] };
  } catch (e) {
    out.error = 'Alpaca indisponible'; // jamais le detail : il pourrait contenir des infos sensibles
  }
  out.updated = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  return out;
}

const PAGE = String.raw`<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Desk</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#14171c;--mut:#6b7280;--line:#e5e7eb;--up:#0f9d58;--dn:#d93025;--acc:#2f5bea}
@media(prefers-color-scheme:dark){:root{--bg:#0e1116;--card:#171b22;--ink:#e8eaed;--mut:#9aa3af;--line:#262c36;--up:#34c77b;--dn:#f0605a;--acc:#6d8cff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:16px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}
h1{font-size:20px;margin:0}.badge{font-size:12px;padding:3px 9px;border-radius:99px;border:1px solid var(--line);color:var(--mut)}
.badge.paper{color:var(--acc);border-color:var(--acc)}.badge.open{color:var(--up);border-color:var(--up)}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}
.k{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em}.v{font-size:24px;font-weight:650;margin-top:4px}
.up{color:var(--up)}.dn{color:var(--dn)}h2{font-size:15px;margin:0 0 10px}
table{width:100%;border-collapse:collapse;font-size:14px}th{color:var(--mut);font-weight:500;text-align:left;font-size:12px}
td,th{padding:7px 6px;border-bottom:1px solid var(--line)}td.r,th.r{text-align:right}
.scroll{overflow-x:auto}.empty{color:var(--mut);padding:8px 0}
svg{width:100%;height:170px;display:block}.foot{color:var(--mut);font-size:12px;margin-top:10px}
.err{background:#fdecea;color:#7a1f19;padding:10px 12px;border-radius:10px;margin-bottom:12px;display:none}
</style></head><body><div class="wrap">
<header><h1>Desk</h1><div><span class="badge paper">PAPER · argent fictif</span> <span class="badge" id="mkt">marché …</span></div></header>
<div class="err" id="err"></div>
<div class="grid">
 <div class="card"><div class="k">Valeur du compte</div><div class="v" id="eq">…</div></div>
 <div class="card"><div class="k">Aujourd'hui</div><div class="v" id="day">…</div></div>
 <div class="card"><div class="k">Liquidités</div><div class="v" id="cash">…</div></div>
 <div class="card"><div class="k">Positions ouvertes</div><div class="v" id="npos">…</div></div>
</div>
<div class="card" style="margin-bottom:12px"><h2>Valeur du compte, 1 mois</h2><svg id="chart" viewBox="0 0 600 170" preserveAspectRatio="none"></svg></div>
<div class="card" style="margin-bottom:12px"><h2>Positions</h2><div class="scroll"><table id="pos"></table></div></div>
<div class="card"><h2>Derniers ordres</h2><div class="scroll"><table id="ord"></table></div></div>
<div class="foot" id="upd"></div></div>
<script>
const $=id=>document.getElementById(id);
const money=n=>(n==null||isNaN(n))?'–':Number(n).toLocaleString('fr-FR',{style:'currency',currency:'USD'});
const pct=n=>(n==null||isNaN(n))?'–':(n>=0?'+':'')+(Number(n)*100).toFixed(2)+' %';
const cls=n=>n>0?'up':n<0?'dn':'';
function cell(tr,t,right,c){const td=document.createElement('td');td.textContent=t;if(right)td.className='r';if(c)td.classList.add(c);tr.appendChild(td);}
function table(el,heads,rows,emptyMsg){el.replaceChildren();if(!rows.length){const e=document.createElement('div');e.className='empty';e.textContent=emptyMsg;el.parentNode.replaceChildren(e);return;}
 const th=document.createElement('tr');heads.forEach((h,i)=>{const x=document.createElement('th');x.textContent=h;if(i>0)x.className='r';th.appendChild(x)});el.appendChild(th);
 rows.forEach(r=>{const tr=document.createElement('tr');r.forEach((c,i)=>cell(tr,c[0],i>0,c[1]));el.appendChild(tr)});}
function chart(e){const s=$('chart');s.replaceChildren();const v=e.map(Number).filter(x=>!isNaN(x));if(v.length<2){return;}
 const mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.15||1,lo=mn-pad,hi=mx+pad;
 const pts=v.map((y,i)=>[i/(v.length-1)*600,170-(y-lo)/(hi-lo)*170]);
 const ns='http://www.w3.org/2000/svg';const p=document.createElementNS(ns,'polyline');
 p.setAttribute('points',pts.map(q=>q.join(',')).join(' '));p.setAttribute('fill','none');p.setAttribute('stroke','var(--acc)');p.setAttribute('stroke-width','2.5');p.setAttribute('vector-effect','non-scaling-stroke');s.appendChild(p);}
async function load(){
 let d;try{const r=await fetch(location.pathname+location.search+'&d=1',{cache:'no-store',credentials:'same-origin'});d=await r.json();}catch(e){$('err').style.display='block';$('err').textContent='Impossible de joindre le serveur.';return;}
 const er=$('err');if(d.error){er.style.display='block';er.textContent=d.error}else er.style.display='none';
 if(d.account){const a=d.account,eq=+a.equity,le=+a.last_equity;$('eq').textContent=money(eq);
  const day=le?(eq-le):0;$('day').textContent=money(day)+(le?' ('+pct(day/le)+')':'');$('day').className='v '+cls(day);
  $('cash').textContent=money(a.cash);}
 if(d.clock){const m=$('mkt');m.textContent=d.clock.is_open?'marché ouvert':'marché fermé';m.className='badge'+(d.clock.is_open?' open':'');}
 const P=d.positions||[];$('npos').textContent=P.length;
 table($('pos'),['Symbole','Qté','Entrée','Actuel','Valeur','P/L'],P.map(p=>[[p.symbol],[p.qty],[money(p.avg_entry_price)],[money(p.current_price)],[money(p.market_value)],[money(p.unrealized_pl)+' ('+pct(p.unrealized_plpc)+')',cls(+p.unrealized_pl)]]),'Aucune position ouverte.');
 const O=d.orders||[];
 table($('ord'),['Date','Symbole','Sens','Qté','Prix','Statut'],O.map(o=>[[(o.submitted_at||'').slice(0,16).replace('T',' ')],[o.symbol],[o.side==='buy'?'achat':'vente'],[o.qty],[o.filled_avg_price?money(o.filled_avg_price):(o.limit_price?money(o.limit_price):'marché')],[o.status]]),'Aucun ordre pour le moment.');
 if(d.history)chart(d.history.equity);
 $('upd').textContent='Mis à jour : '+d.updated+' · rafraîchi toutes les 30 s · compte fictif, aucun conseil financier.';
}
load();setInterval(load,30000);
</script></body></html>`;

module.exports = async (req, res) => {
  const user = process.env.DASH_USER || '';
  const pass = process.env.DASH_PASS || '';
  const cle = process.env.DESK_KEY || '';

  // Non configure ou mauvaise cle dans l'adresse : la page "n'existe pas".
  // Sans cle configuree, ou avec une mauvaise cle dans l'adresse : la page "n'existe pas".
  const url = new URL(req.url, 'http://x');
  if(cle.length < 3 || !same(url.searchParams.get('k') || '', cle)) return notFound(res);

  // Bonne cle mais configuration incomplete : on nomme la variable en cause (jamais de valeur).
  // La cle est courte (ex. un prenom) : le VRAI verrou est le mot de passe, d'ou 12 caracteres minimum.
  const manque = [];
  if(!user) manque.push('DASH_USER');
  if(pass.length < 12) manque.push('DASH_PASS (12 caracteres minimum)');
  if(!process.env.DESK_ALPACA_KEY) manque.push('DESK_ALPACA_KEY');
  if(!process.env.DESK_ALPACA_SECRET) manque.push('DESK_ALPACA_SECRET');
  if(manque.length){
    baseHeaders(res, 'text/plain; charset=utf-8');
    return res.status(503).send('Configuration incomplete : ' + manque.join(', '));
  }

  // Mot de passe obligatoire (Basic).
  const h = req.headers.authorization || '';
  let ok = false;
  if(h.startsWith('Basic ')){
    const dec = Buffer.from(h.slice(6), 'base64').toString('utf8');
    const i = dec.indexOf(':');
    ok = same(dec.slice(0, i), user) && same(dec.slice(i + 1), pass);
  }
  if(!ok){
    await new Promise(r => setTimeout(r, 1000)); // freine les essais
    baseHeaders(res, 'text/plain; charset=utf-8');
    res.setHeader('WWW-Authenticate', 'Basic realm="Desk"');
    return res.status(401).send('Authentification requise');
  }

  if(url.searchParams.get('d') === '1'){
    baseHeaders(res, 'application/json; charset=utf-8');
    return res.status(200).send(JSON.stringify(await donnees()));
  }
  baseHeaders(res, 'text/html; charset=utf-8');
  return res.status(200).send(PAGE);
};
