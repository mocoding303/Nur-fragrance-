/* NUR Fragrances Theme JS */

var NUR_DE = (typeof window !== 'undefined' && window.NUR_DE) || false;
function _de(de, en){ return NUR_DE ? de : en; }

var _tsid='YOUR_TS_ID';
_tsConfig={yOffset:'0',variant:'reviews_and_trustmark',customElementId:'',trustcardDirection:'topRight',customBadgeWidth:'155',customBadgeHeight:'155',disableResponsive:'false',disableTrustbadge:'false'};
(function(){var _ts=document.createElement('script');_ts.type='text/javascript';_ts.async=true;_ts.src='//widgets.trustedshops.com/js/'+_tsid+'.js';document.head.appendChild(_ts);})();



/* ── WISHLIST ─────────────────────────────────────────────── */
let wishlist = JSON.parse(localStorage.getItem('nurWishlist') || '[]');
function saveWishlist(){ localStorage.setItem('nurWishlist', JSON.stringify(wishlist)); }
function toggleWish(slug, btn){
  event.stopPropagation();
  const i = wishlist.indexOf(slug);
  if (i === -1) { wishlist.push(slug); btn.textContent = '❤️'; btn.classList.add('active'); }
  else { wishlist.splice(i,1); btn.textContent = '🤍'; btn.classList.remove('active'); }
  saveWishlist();
}

/* ── DATA ─────────────────────────────────────────────────── */
const products = Array.isArray(window.NUR_PRODUCTS) ? window.NUR_PRODUCTS.slice() : [];
/* normalise product image paths for Shopify CDN */
products.forEach(function(p){ if(p.img && p.img.indexOf('NUR_assets/')===0) p.img = (window.NUR_IMG||'NUR_assets/') + p.img.slice(11); });
const productBySlug = products.reduce(function(acc,p){ if (p && p.slug) acc[p.slug] = p; return acc; }, {});
function escapeHTML(value){
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
function escapeJSString(value){
  return String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ');
}
function resolveProduct(ref){
  if (typeof ref === 'number') return products[ref];
  if (typeof ref === 'string') return productBySlug[ref] || products.find(function(p){ return p.slug === ref || p.name === ref; });
  return ref && ref.slug ? ref : null;
}
const productMeta = {
  'khamrah':               {tagline:'Liquid amber. The most-complimented scent in our collection.',compliment:97},
  'dahaab-safi':           {tagline:'The warmth of a candlelit evening you never want to leave.',compliment:85},
  'club-de-nuit-precieux': {tagline:'The scent people ask about the morning after.',compliment:91},
  'yulali':                {tagline:'Light, airy confidence — like wearing your best mood.',compliment:77},
  'club-de-nuit-intense':  {tagline:'Every professional wardrobe\'s most reliable ally.',compliment:88},
  'meydan':                {tagline:'Walk into a room. Own it.',compliment:94},
  'rose-01':               {tagline:'Rose, reimagined through the ancient art of oud.',compliment:90},
  'kismet-angel':          {tagline:'Youthful, irresistible, endlessly bright.',compliment:79},
  'asad':                  {tagline:'Clean power, worn quietly.',compliment:82},
  'royal-bleu':            {tagline:'Polished. Understated. Impossible to ignore up close.',compliment:80},
  'melodie':               {tagline:'Femininity in full bloom — rose, praline, memory.',compliment:76},
  'turath':                {tagline:'For those who already know exactly what they want.',compliment:86},
};
const tagCls = {gourmand:'tag-g',sophisticate:'tag-s',connoisseur:'tag-c'};
const tagLbl = {gourmand:'Gourmand',sophisticate:'Sophisticate',connoisseur:'Connoisseur'};
const decisionLabels = {
  'dahaab-safi':'Sweet & warm',
  'khamrah':'Best first Arabian scent',
  'kismet-angel':'Sweet & warm',
  'melodie':'Sweet & warm',
  'club-de-nuit-intense':'Office-safe',
  'asad':'Office-safe',
  'royal-bleu':'Office-safe',
  'yulali':'Office-safe',
  'club-de-nuit-precieux':'Bold oud',
  'meydan':'Bold oud',
  'rose-01':'Bold oud',
  'turath':'Bold oud'
};
const decisionLabel = p => decisionLabels[p.slug] || (p.tag === 'gourmand' ? 'Sweet & warm' : p.tag === 'sophisticate' ? 'Office-safe' : 'Bold oud');
const brandSlug = value => String(value || '').toLowerCase().replace(/^the\s+spirit\s+of\s+dubai$/, 'spirit of dubai').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stars  = r => { const f=Math.floor(r),h=r-f>=.5?1:0; return '★'.repeat(f)+(h?'½':'')+'☆'.repeat(5-f-h); };
const dots   = (n,max=5) => Array.from({length:max},(_,i)=>`<span class="gdot${i<n?' on':''}"></span>`).join('');
const gauges = p => `<div class="card-gauges"><div class="gauge"><span class="gauge-lbl">Longevity</span><div class="gauge-dots">${dots(p.lon)}</div></div><div class="gauge"><span class="gauge-lbl">Projection</span><div class="gauge-dots">${dots(p.proj)}</div></div></div>`;
const viewingHtml = () => '';
function priceDot(v){ return '€' + Number(v).toFixed(2); }
function sizePriceLabel(vol, price){
  return (vol === '1ml' ? _de('Ab ','From ') : '') + priceDot(price) + ' · ' + vol + _de(' Probe',' sample');
}
function cardCtaLabel(){ return _de('Probe hinzufügen','Add Sample'); }

/* ── SEARCH ───────────────────────────────────────────────── */
const searchBtn    = document.getElementById('searchBtn');
const searchBar    = document.getElementById('searchBar');
const searchInput  = document.getElementById('searchInput');
const searchClose  = document.getElementById('searchClose');
const searchResults= document.getElementById('searchResults');
let searchOpen = false;

function openSearch() {
  searchOpen = true;
  searchBar.classList.add('open');
  searchResults.classList.remove('open');
  searchResults.innerHTML = '';
  setTimeout(() => searchInput.focus(), 340);
}
function closeSearch() {
  searchOpen = false;
  searchBar.classList.remove('open');
  searchResults.classList.remove('open');
  searchInput.value = '';
}
searchBtn.addEventListener('click', () => searchOpen ? closeSearch() : openSearch());
searchClose.addEventListener('click', closeSearch);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
document.addEventListener('click', e => {
  if (searchOpen && !e.target.closest('.search-wrap') && !e.target.closest('.search-results')) closeSearch();
});

function runSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('open'); return; }
  if (!products.length) {
    searchResults.innerHTML = `<div class="sr-empty">${_de('Die Suche ist auf Produktseiten und in der Kollektion verfügbar. <a href="/collections/all">Alle Düfte ansehen</a>.','Search is available on product pages and the collection. <a href="/collections/all">Browse all scents</a>.')}</div>`;
    searchResults.classList.add('open');
    return;
  }
  const hits = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.tag.toLowerCase().includes(q) ||
    Object.values(p.notes).join(' ').toLowerCase().includes(q)
  );
  if (!hits.length) {
    searchResults.innerHTML = `<div class="sr-empty">${_de('Kein Treffer. Probiere Khamrah, Oud, Vanille – oder <a href="/#quiz">mach das Duftquiz</a>.','No match. Try Khamrah, Oud, Vanilla, or <a href="/#quiz">take the scent quiz</a>.')}</div>`;
  } else {
    searchResults.innerHTML = hits.map(p => `
      <div class="sr-item" onclick="location.href='/products/${p.slug}'">
        <img class="sr-img" src="${p.img}" alt="${p.name} by ${p.brand} — Arabian fragrance decant">
        <div class="sr-info">
          <p class="sr-brand">${p.brand}</p>
          <p class="sr-name">${p.name}</p>
          <p class="sr-notes">${p.notes.top} · ${p.notes.heart} · ${p.notes.base}</p>
        </div>
        <span class="sr-price">${p.price}</span>
      </div>`).join('');
  }
  searchResults.classList.add('open');
}

let searchTimer;
searchInput.addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => runSearch(e.target.value), 180);
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim().toLowerCase();
    const first = products.find(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    if (first) location.href = `/products/${first.slug}`;
  }
});

/* ── NAV ──────────────────────────────────────────────────── */
window.addEventListener('scroll', () =>
  document.getElementById('navbar').classList.toggle('scrolled', scrollY > 55));

/* ── HERO CHARS ───────────────────────────────────────────── */
[['hw0','Try authentic Arabian'],['hw1','perfume samples'],['hw2','before the full bottle.']].forEach(([id,fallback],wi) => {
  const el = document.getElementById(id);
  if(!el) return;
  const word = el.dataset.heroWord || fallback;
  const phrase = word.replace(/full bottle/gi, 'full\u00A0bottle');
  const chunks = phrase.split(' ');
  let charIndex = 0;
  el.textContent = '';
  el.setAttribute('aria-label', word);
  if (wi === 1) el.style.fontStyle = 'italic', el.style.color = 'var(--gold)';
  chunks.forEach((chunk) => {
    const group = document.createElement('span');
    group.className = 'hero-chunk';
    chunk.split('').forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.animationDelay = (.8+wi*.2+charIndex*.045)+'s';
      group.appendChild(s);
      charIndex += 1;
    });
    el.appendChild(group);
  });
});

/* ── PARTICLES ────────────────────────────────────────────── */
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let W, H;
  const pts = Array.from({length:80},()=>({
    x:Math.random()*2400, y:Math.random()*1400,
    r:Math.random()*1.3+.25,
    dx:(Math.random()-.5)*.12, dy:-Math.random()*.22-.04,
    o:Math.random()*.3+.05
  }));
  function resizeCvs(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  resizeCvs(); window.addEventListener('resize',resizeCvs);
  (function loop(){
    if (document.hidden) { requestAnimationFrame(loop); return; }
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      ctx.beginPath(); ctx.arc(p.x%W,p.y%H,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(201,168,76,${p.o})`; ctx.fill();
      p.x+=p.dx; p.y+=p.dy; if(p.y<0)p.y=H;
    });
    requestAnimationFrame(loop);
  })();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
}

/* ── BESTSELLERS CAROUSEL ─────────────────────────────────── */
const bsPicks = products.filter(p => p.badge === 'bestseller');
const hsTrack = document.getElementById('hsTrack');
if(hsTrack && !hsTrack.children.length){
bsPicks.forEach(p => {
  const idx = products.indexOf(p);
  const wished = wishlist.includes(p.slug);
  const c = document.createElement('div');
  c.className = 'bs-card';
  c.dataset.slug = p.slug;
  const meta = productMeta[p.slug]||{};
  c.innerHTML = `
    <div class="bs-badge">Best Seller</div>
    <div class="bs-img-w">
      <button class="wish-btn${wished?' active':''}" onclick="toggleWish('${p.slug}',this)" aria-label="Wishlist">${wished?'❤️':'🤍'}</button>
      <div class="bs-glow" style="background:${p.glow}"></div>
      <img class="bs-img" src="${p.img}" alt="${p.name} by ${p.brand} — Arabian fragrance decant">
    </div>
    <div class="bs-body">
      <p class="bs-brand">${p.brand}</p>
      <h3 class="bs-name">${p.name}</h3>
      ${meta.tagline?`<p class="card-tagline">${meta.tagline}</p>`:''}
	      ${p.compliment?`<div class="compliment-rate"><span class="cr-n">${escapeHTML(p.compliment)}%</span><span class="cr-l">compliment rate</span></div>`:''}
	      ${p.rating?`<div class="bs-stars">${stars(p.rating)}<span>${p.rating}${p.reviews?` (${Number(p.reviews).toLocaleString()})`:''}</span></div>`:''}
      <span class="bs-tag ${tagCls[p.tag]}">${tagLbl[p.tag]}</span>
      <div class="card-notes">
        <div class="note-row"><span class="note-lbl">Top</span><span class="note-val">${p.notes.top}</span></div>
        <div class="note-row"><span class="note-lbl">Heart</span><span class="note-val">${p.notes.heart}</span></div>
        <div class="note-row"><span class="note-lbl">Base</span><span class="note-val">${p.notes.base}</span></div>
      </div>
      ${gauges(p)}
      ${viewingHtml(p)}
      ${p.stock>0&&p.stock<=8?`<div class="stock-signal"><span class="sdot"></span>Low stock</div>`:''}
      <div class="card-rrp"><span class="rrp-label">Full bottle ${p.rrp}</span><span class="rrp-save">Save ${Math.round((1-(parseFloat(p.price.replace('€',''))/parseFloat(p.rrp.replace('€',''))))*100)}%</span></div>
      <div class="card-sizes">${p.sizes.map(s=>`<button class="card-size-btn${s.popular?' active':''}" data-vol="${s.vol}" data-price="${s.price}" data-pml="${s.pml}" onclick="cardSelectSize(this,event)">${s.vol}</button>`).join('')}</div>
      <div class="card-fullbottle">
        <div class="card-fb-label">Already a fan?</div>
        <button class="card-fb-btn" onclick="addFullBottleToCart(${idx},this);event.stopPropagation()">
          <span class="card-fb-name">Full Bottle</span>
          <div class="card-fb-right"><span class="card-fb-price">${p.rrp}</span><span class="card-fb-divider"></span><span class="card-fb-wa">Add to cart →</span></div>
        </button>
        <div class="card-fb-ships">Ships in 2–4 working days</div>
      </div>
      <div class="bs-foot">
        <span class="bs-price">€${p.sizes.find(s=>s.popular).price.toFixed(2)}</span>
        ${p.available !== false
          ? `<button class="bs-add" onclick="addToCart(${idx},this);event.stopPropagation()">Add to Cart</button>`
          : `<div style="text-align:right"><div class="oos-restock">Restocking Soon</div><button class="notify-btn" onclick="notifyMe('${p.slug}','${p.name}',this);event.stopPropagation()">Notify Me →</button></div>`}
      </div>
      <div class="card-pay-icons">PayPal &nbsp;·&nbsp; Klarna &nbsp;·&nbsp; Visa &nbsp;·&nbsp; Mastercard</div>
    </div>`;
  c.addEventListener('click', () => location.href=`/products/${p.slug}`);
  hsTrack.appendChild(c);
});
document.getElementById('hsLeft').onclick  = () => hsTrack.scrollBy({left:-355,behavior:'smooth'});
document.getElementById('hsRight').onclick = () => hsTrack.scrollBy({left:355,behavior:'smooth'});
let isDrag=false,dragX,dragScroll;
hsTrack.addEventListener('mousedown',e=>{isDrag=true;dragX=e.pageX-hsTrack.offsetLeft;dragScroll=hsTrack.scrollLeft;});
window.addEventListener('mouseup',()=>isDrag=false);
window.addEventListener('mousemove',e=>{if(!isDrag)return;e.preventDefault();hsTrack.scrollLeft=dragScroll-(e.pageX-hsTrack.offsetLeft-dragX);});
} // end if(hsTrack)

/* ── COLLECTION GRID ──────────────────────────────────────── */
const colGrid = document.getElementById('colGrid');
let activeFilter='all', quizWinner=null;
if(colGrid && !colGrid.children.length){
products.forEach((p,i) => {
  const c = document.createElement('div');
  c.className='col-card reveal rv'+(i%4+1);
	  c.dataset.tag    = p.tag;
	  c.dataset.occ    = p.occ;
	  c.dataset.gender = p.gender || 'unisex';
	  c.dataset.brand  = brandSlug(p.brand);
	  c.dataset.idx    = i;
  c.dataset.oos    = p.available === false ? 'true' : 'false';
  c.dataset.slug   = p.slug;
  const wished2 = wishlist.includes(p.slug);
  const meta2 = productMeta[p.slug]||{};
  c.innerHTML = `
    ${p.badge==='bestseller'?'<div class="col-badge">Best Seller</div>':p.badge==='new'?'<div class="col-badge new">New</div>':''}
    <div class="col-img-w">
      <button class="wish-btn${wished2?' active':''}" onclick="toggleWish('${p.slug}',this)" aria-label="Wishlist">${wished2?'❤️':'🤍'}</button>
      <div class="col-glow" style="background:${p.glow}"></div>
      <img class="col-img" src="${p.img}" alt="${p.name} by ${p.brand} — Arabian fragrance decant" loading="lazy" width="300" height="300">
    </div>
    <div class="col-body">
      <p class="col-brand">${p.brand}</p>
      <h3 class="col-name">${p.name}</h3>
      ${meta2.tagline?`<p class="card-tagline">${meta2.tagline}</p>`:''}
	      ${p.compliment?`<div class="compliment-rate"><span class="cr-n">${escapeHTML(p.compliment)}%</span><span class="cr-l">compliment rate</span></div>`:''}
	      ${p.rating?`<div class="col-stars">${stars(p.rating)}<span>${p.rating}</span></div>`:''}
      <span class="col-tag ${tagCls[p.tag]}">${tagLbl[p.tag]}</span>
      <div class="card-notes">
        <div class="note-row"><span class="note-lbl">Top</span><span class="note-val">${p.notes.top}</span></div>
        <div class="note-row"><span class="note-lbl">Heart</span><span class="note-val">${p.notes.heart}</span></div>
        <div class="note-row"><span class="note-lbl">Base</span><span class="note-val">${p.notes.base}</span></div>
      </div>
      ${gauges(p)}
      ${viewingHtml(p)}
      ${p.stock>0&&p.stock<=8?`<div class="stock-signal"><span class="sdot"></span>Low stock</div>`:''}
      <div class="card-rrp"><span class="rrp-label">Full bottle ${p.rrp}</span><span class="rrp-save">Save ${Math.round((1-(parseFloat(p.price.replace('€',''))/parseFloat(p.rrp.replace('€',''))))*100)}%</span></div>
      <div class="card-sizes">${p.sizes.map(s=>`<button class="card-size-btn${s.popular?' active':''}" data-vol="${s.vol}" data-price="${s.price}" data-pml="${s.pml}" onclick="cardSelectSize(this,event)">${s.vol}</button>`).join('')}</div>
      <div class="card-fullbottle">
        <div class="card-fb-label">Already a fan?</div>
        <button class="card-fb-btn" onclick="addFullBottleToCart(${i},this);event.stopPropagation()">
          <span class="card-fb-name">Full Bottle</span>
          <div class="card-fb-right"><span class="card-fb-price">${p.rrp}</span><span class="card-fb-divider"></span><span class="card-fb-wa">Add to cart →</span></div>
        </button>
        <div class="card-fb-ships">Ships in 2–4 working days</div>
      </div>
      <div class="col-foot">
        <span class="col-price">€${p.sizes.find(s=>s.popular).price.toFixed(2)}</span>
        ${p.available !== false
          ? `<button class="col-add" onclick="addToCart(${i},this);event.stopPropagation()">Add to Cart</button>`
          : `<div style="text-align:right"><div class="oos-restock">Restocking Soon</div><button class="notify-btn" onclick="notifyMe('${p.slug}','${p.name}',this);event.stopPropagation()">Notify Me →</button></div>`}
      </div>
      <div class="card-pay-icons">PayPal &nbsp;·&nbsp; Klarna &nbsp;·&nbsp; Visa &nbsp;·&nbsp; Mastercard</div>
    </div>`;
  c.addEventListener('click', () => location.href=`/products/${p.slug}`);
  colGrid.appendChild(c);
});
// Push OOS to bottom on initial load
doSort('default');
} // end if(colGrid)

let activeProfileFilter = 'all', activeOccFilter = 'all', activeNoteFilter = 'all', activeGenderFilter = 'all', activeBrandFilter = 'all';

function applyCardVisibility() {
  const cards = Array.from(document.querySelectorAll('.col-card'));
  let visibleCount = 0;
  cards.forEach((c) => {
    const p = resolveProduct(c.dataset.slug) || products[parseInt(c.dataset.idx, 10)];
    const profileMatch = activeProfileFilter === 'all' || c.dataset.tag    === activeProfileFilter;
    const occMatch     = activeOccFilter     === 'all' || c.dataset.occ    === activeOccFilter;
    const noteMatch    = activeNoteFilter    === 'all' || (p && p.noteKeys && p.noteKeys.includes(activeNoteFilter));
    const genderMatch  = activeGenderFilter  === 'all' || c.dataset.gender === activeGenderFilter;
    const brandMatch   = activeBrandFilter   === 'all' || c.dataset.brand === activeBrandFilter;
    const isVisible = profileMatch && occMatch && noteMatch && genderMatch && brandMatch;
    c.hidden = !isVisible;
    c.classList.toggle('dim', !isVisible);
    if (isVisible) visibleCount++;
  });
  const resultCount = document.getElementById('filterResultCount');
  if (resultCount) resultCount.textContent = NUR_DE ? `${visibleCount} ${visibleCount === 1 ? 'Duft' : 'Düfte'}` : `Showing ${visibleCount} ${visibleCount === 1 ? 'scent' : 'scents'}`;
  const empty = document.getElementById('collectionEmpty');
  if (empty) empty.hidden = visibleCount > 0;
}
function doGenderFilter(g, btn) {
  activeGenderFilter = g;
  document.querySelectorAll('#genderFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.g === g));
  applyCardVisibility();
}
function doBrandFilter(b, btn) {
  activeBrandFilter = b;
  document.querySelectorAll('#brandFilters .col-filter').forEach(el => el.classList.toggle('active', el.dataset.b === b));
  applyCardVisibility();
}
function doProfileFilter(f, btn) {
  activeProfileFilter = f;
  document.querySelectorAll('#profileFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.f === f));
  applyCardVisibility();
}
function doOccFilter(o, btn) {
  activeOccFilter = o;
  document.querySelectorAll('#occFilters .col-filter-occ').forEach(b => b.classList.toggle('active', b.dataset.o === o));
  applyCardVisibility();
}
function doNoteFilter(n, btn) {
  activeNoteFilter = n;
  document.querySelectorAll('#noteFilters .col-filter-note').forEach(b => b.classList.toggle('active', b.dataset.n === n));
  applyCardVisibility();
}
function doFilter(f, e) { doProfileFilter(f, null); }
function applyQuizFilter() { if (quizWinner) doProfileFilter(quizWinner, null); }
function resetCollectionFilters() {
  activeGenderFilter = 'all';
  activeProfileFilter = 'all';
  activeOccFilter = 'all';
  activeNoteFilter = 'all';
  activeBrandFilter = 'all';
  document.querySelectorAll('#genderFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.g === 'all'));
  document.querySelectorAll('#brandFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.b === 'all'));
  document.querySelectorAll('#profileFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.f === 'all'));
  document.querySelectorAll('#occFilters .col-filter-occ').forEach(b => b.classList.toggle('active', b.dataset.o === 'all'));
  document.querySelectorAll('#noteFilters .col-filter-note').forEach(b => b.classList.toggle('active', b.dataset.n === 'all'));
}
function shopByIntent(intent) {
  resetCollectionFilters();
  if (intent === 'office') {
    activeOccFilter = 'office';
    document.querySelectorAll('#occFilters .col-filter-occ').forEach(b => b.classList.toggle('active', b.dataset.o === 'office'));
  } else if (intent === 'sweet') {
    activeProfileFilter = 'gourmand';
    document.querySelectorAll('#profileFilters .col-filter').forEach(b => b.classList.toggle('active', b.dataset.f === 'gourmand'));
  } else if (intent === 'oud') {
    activeNoteFilter = 'oud';
    document.querySelectorAll('#noteFilters .col-filter-note').forEach(b => b.classList.toggle('active', b.dataset.n === 'oud'));
  }
  applyCardVisibility();
  const collection = document.getElementById('collection');
  if (collection) collection.scrollIntoView({behavior:'smooth', block:'start'});
}

let lastFilterTrigger = null;
function filterFocusable(){
  const drawer = document.getElementById('filterDrawer');
  if (!drawer) return [];
  return Array.from(drawer.querySelectorAll('button,select,a,input,[tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.disabled && el.offsetParent !== null);
}
window.openFilterDrawer = function(){
  const drawer = document.getElementById('filterDrawer');
  const veil = document.getElementById('filterDrawerVeil');
  const trigger = document.querySelector('.filter-drawer-toggle');
  if (!drawer || !veil) return;
  lastFilterTrigger = document.activeElement;
  drawer.classList.add('open');
  veil.classList.add('open');
  document.body.classList.add('filter-drawer-open');
  if (trigger) trigger.setAttribute('aria-expanded','true');
  const focusables = filterFocusable();
  (focusables[0] || drawer).focus({preventScroll:true});
};
window.closeFilterDrawer = function(){
  const drawer = document.getElementById('filterDrawer');
  const veil = document.getElementById('filterDrawerVeil');
  const trigger = document.querySelector('.filter-drawer-toggle');
  if (!drawer || !veil) return;
  drawer.classList.remove('open');
  veil.classList.remove('open');
  document.body.classList.remove('filter-drawer-open');
  if (trigger) trigger.setAttribute('aria-expanded','false');
  if (lastFilterTrigger && lastFilterTrigger.focus) lastFilterTrigger.focus({preventScroll:true});
};
document.addEventListener('keydown', e => {
  const drawer = document.getElementById('filterDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  if (e.key === 'Escape') {
    closeFilterDrawer();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusables = filterFocusable();
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
function doSort(val) {
  const grid = document.getElementById('colGrid');
  if(!grid) return;
  const cards = Array.from(grid.querySelectorAll('.col-card'));
  cards.sort((a, b) => {
    const pa = resolveProduct(a.dataset.slug) || products[parseInt(a.dataset.idx)];
    const pb = resolveProduct(b.dataset.slug) || products[parseInt(b.dataset.idx)];
    if (!pa || !pb) return 0;
    if (pa.stock === 0 && pb.stock > 0) return 1;
    if (pa.stock > 0 && pb.stock === 0) return -1;
    if (val === 'rating') return pb.rating - pa.rating;
    if (val === 'price-asc') return parseFloat(pa.price.replace('€','')) - parseFloat(pb.price.replace('€',''));
    if (val === 'price-desc') return parseFloat(pb.price.replace('€','')) - parseFloat(pa.price.replace('€',''));
    return parseInt(a.dataset.idx) - parseInt(b.dataset.idx);
  });
  cards.forEach(c => grid.appendChild(c));
  applyCardVisibility();
}
if (document.getElementById('colGrid')) applyCardVisibility();

/* ── CART ─────────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('nurCart') || localStorage.getItem('nur_cart') || '[]');
const saveCart = () => localStorage.setItem('nurCart', JSON.stringify(cart));
const cartQty  = () => cart.reduce((s,i)=>s+i.qty,0);
const cartSum  = () => cart.reduce((s,i)=>s+parseFloat(i.price.replace('€','').replace(',','.'))*i.qty,0);

/* ── JUDGE.ME LIVE RATINGS ─────────────────────────────────── */
async function loadJudgeMeRatings() {
  const token = '';
  if (!token) return;
  try {
    const res = await fetch(
      'https://judge.me/api/v1/products?shop_domain=nur-fragrances.com&api_token=' + encodeURIComponent(token)
    );
    const data = await res.json();
    if (!data || !data.products) return;
    data.products.forEach(prod => {
      // Match by handle to product card
      const card = document.querySelector(`.col-card[data-slug="${prod.handle}"], .bs-card[data-slug="${prod.handle}"]`);
      if (!card) return;
      const starsEl = card.querySelector('.col-stars, .bs-stars');
      const countEl = card.querySelector('.col-stars span, .bs-stars span');
      if (starsEl && prod.rating) {
        const r = parseFloat(prod.rating);
        const f = Math.floor(r), h = r - f >= .5 ? 1 : 0;
        const starStr = '★'.repeat(f) + (h ? '½' : '') + '☆'.repeat(5 - f - h);
        if (countEl) {
          starsEl.childNodes[0].textContent = starStr;
          countEl.textContent = r.toFixed(2) + ' (' + prod.reviews_count.toLocaleString() + ')';
        }
      }
    });
  } catch(e) { /* silently fall back to static data */ }
}
document.addEventListener('DOMContentLoaded', loadJudgeMeRatings);
function updateBadge(){
  /* Sync badge from Shopify cart */
  fetch('/cart.js').then(function(r){return r.json();}).then(function(c){
    var count = c.item_count || 0;
    document.querySelectorAll('.cart-badge,#cartBadge').forEach(function(b){ b.textContent = count; });
  }).catch(function(){});
}

function renderCart() {
  var body = document.getElementById('cartItems');
  var ft   = document.getElementById('cartFoot');
  if (!body || !ft) return;

  /* Fetch Shopify cart — single source of truth */
  fetch('/cart.js')
    .then(function(r){ return r.json(); })
    .then(function(sc){
      var shopItems = (sc && sc.items) ? sc.items : [];
      if (!shopItems.length) {
        body.innerHTML = _de('<div class="cart-empty"><p>Dein Warenkorb wartet auf seinen ersten Duft.</p><p style="font-size:.78rem;margin-top:.4rem;opacity:.6">Starte mit einer 1-ml-Probe oder einem kuratierten Trio.</p></div>','<div class="cart-empty"><p>Your cart is waiting for its first scent.</p><p style="font-size:.78rem;margin-top:.4rem;opacity:.6">Start with a 1ml sample or a curated trio.</p></div>');
        ft.style.display = 'none';
        return;
      }
      ft.style.display = 'block';
      var html = '';
	      shopItems.forEach(function(item){
	        var lineKey = escapeJSString(item.key);
	        var isGiftAddon = item.handle === 'luxury-gift-packaging-handwritten-card' ||
	          (item.properties && item.properties._nur_addon === 'gift_packaging');
	        /* Use product image from the products array as fallback */
	        var imgSrc = (item.featured_image && item.featured_image.url) ? item.featured_image.url : '';
	        if (!imgSrc) {
	          var localP = products.find(function(p){ return p.slug === item.handle; });
	          if (localP) imgSrc = localP.img;
	        }
	        var vLabel = (item.variant_title && item.variant_title !== 'Default Title') ? ' — ' + item.variant_title : '';
	        var titleText = escapeHTML((item.product_title || '') + vLabel);
	        var vendorText = escapeHTML(item.vendor || '');
	        var imageAlt = escapeHTML(item.product_title || 'Cart item');
	        var imageSrc = escapeHTML(imgSrc || '');
	        var imageMarkup = isGiftAddon
	          ? '<div class="ci-img ci-img-addon" aria-hidden="true">&#x1F381;</div>'
	          : '<img class="ci-img" src="'+imageSrc+'" alt="'+imageAlt+'" onerror="this.style.visibility=\'hidden\'">';
	        var propHtml = '';
	        if (item.properties) {
	          Object.keys(item.properties).forEach(function(key){
	            var val = item.properties[key];
	            if (!val || key.charAt(0) === '_') return;
	            var propClass = key === 'Gift packaging' ? 'ci-prop ci-prop-gift' : 'ci-prop';
	            propHtml += '<p class="' + propClass + '">' + escapeHTML(key) + ': ' + escapeHTML(String(val)) + '</p>';
	          });
	        }
	        if (item.properties && item.properties._nur_bundle && !item.properties['Gift packaging']) {
	          propHtml += '<p class="ci-prop ci-prop-gift">&#x1F381; '+_de('Gratis Geschenkverpackung inklusive','Free gift packaging included')+'</p>';
	        }
	        html += '<div class="cart-item">'
	          + imageMarkup
	          + '<div class="ci-info">'
	          + '<p class="ci-brand">'+vendorText+'</p>'
	          + '<h4 class="ci-name">'+titleText+'</h4>'
	          + propHtml
	          + '<p class="ci-price">€'+(item.price/100).toFixed(2).replace('.',',')+'</p>'
          + '<div class="ci-qty">'
          + '<button class="ci-q-btn" onclick="chgShopifyItem(\''+lineKey+'\','+(item.quantity-1)+')">−</button>'
          + '<span class="ci-q-n">'+item.quantity+'</span>'
          + '<button class="ci-q-btn" onclick="chgShopifyItem(\''+lineKey+'\','+(item.quantity+1)+')">+</button>'
          + '</div></div>'
          + '<button class="ci-del" onclick="chgShopifyItem(\''+lineKey+'\',0)">✕</button>'
          + '</div>';
      });
      body.innerHTML = html;
      var total = (sc.total_price || 0) / 100;
      document.getElementById('cartSubtotal').textContent = '€' + total.toFixed(2).replace('.', ',');
      /* Sync badge */
      var badges = document.querySelectorAll('.cart-badge,#cartBadge');
      badges.forEach(function(b){ b.textContent = sc.item_count || 0; });
    })
    .catch(function(){
      body.innerHTML = _de('<div class="cart-empty"><p>Dein Warenkorb wartet auf seinen ersten Duft.</p></div>','<div class="cart-empty"><p>Your cart is waiting for its first scent.</p></div>');
      ft.style.display = 'none';
    });
}

/* Change quantity or remove a Shopify cart line item */
function chgShopifyItem(lineKey, qty) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id: lineKey, quantity: qty})
  })
  .then(function(r){ return r.json(); })
  .then(function(sc){
    var badges = document.querySelectorAll('#cartBadge,.cart-badge');
    badges.forEach(function(b){ b.textContent = sc.item_count; });
    renderCart(); updateShipBar(); updateCartUpsell();
  })
  .catch(function(){ renderCart(); });
}

/* Shopify checkout — redirect to Shopify's native checkout */
window.goCheckout = function(){ window.location.href = '/checkout'; };

function openCart()  {
  var drawer = document.getElementById('cartDrawer');
  var veil = document.getElementById('cartVeil');
  if (drawer) drawer.classList.add('open');
  if (veil) veil.classList.add('open');
  document.body.classList.add('cart-open');
  document.body.style.overflow='hidden';
  renderCart(); updateShipBar(); updateCartUpsell();
}
function closeCart() {
  var drawer = document.getElementById('cartDrawer');
  var veil = document.getElementById('cartVeil');
  if (drawer) drawer.classList.remove('open');
  if (veil) veil.classList.remove('open');
  document.body.classList.remove('cart-open');
  document.body.style.overflow='';
}
function chgQty(i,d){ cart[i].qty+=d; if(cart[i].qty<=0)cart.splice(i,1); saveCart();updateBadge();renderCart(); }
function delItem(i) { cart.splice(i,1); saveCart();updateBadge();renderCart(); }

function cardSelectSize(btn,evt){
  evt.stopPropagation();
  const card=btn.closest('.col-card,.bs-card');
  card.querySelectorAll('.card-size-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const priceEl=card.querySelector('.card-from,.col-price,.bs-price');
  if(priceEl) priceEl.textContent=sizePriceLabel(btn.dataset.vol, parseFloat(btn.dataset.price));
  const addBtn = card.querySelector('.col-add,.bs-add');
  if(addBtn) addBtn.textContent = cardCtaLabel();
}

function addToCart(ref, btn) {
  const p = resolveProduct(ref);
  if (!p) return;
  var selVol = '5ml';
  if (btn) {
    const card = btn.closest('.col-card,.bs-card');
    if (card) { const ab = card.querySelector('.card-size-btn.active'); if (ab) selVol = ab.dataset.vol; }
  }
  const variantId = p.variants && p.variants[selVol];
  if (!variantId) { window.location.href = '/products/' + p.slug; return; }

  var origText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = _de('Wird hinzugefügt…','Adding…'); btn.disabled = true; }

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ return fetch('/cart.js'); })
  .then(function(r){ return r.json(); })
  .then(function(c){
    var badges = document.querySelectorAll('.cart-badge,#cartBadge');
    badges.forEach(function(b){ b.textContent = c.item_count; });
    if (btn) {
      btn.textContent = _de('✓ Hinzugefügt!','✓ Added!'); btn.style.background = 'var(--gold)'; btn.style.color = 'var(--dark)'; btn.disabled = false;
      setTimeout(function(){ btn.textContent = origText; btn.style.background = ''; btn.style.color = ''; }, 1800);
    }
    var cb = document.getElementById('cartBtn');
    if (cb) { cb.style.transform = 'scale(1.25)'; setTimeout(function(){ cb.style.transform = ''; }, 220); }
    updateShipBar(); updateCartUpsell();
    setTimeout(function(){ openCart(); }, 250);
  })
  .catch(function(err){
    console.error('Add to cart error:', err);
    if (btn) { btn.textContent = origText; btn.disabled = false; }
  });
}
/* ── Full Bottle add to cart ──────────────────────────────── */
function addFullBottleToCart(idx, btn) {
  const p = products[idx];
  const cartName = p.name + ' · Full Bottle';
  const ex = cart.find(c => c.name === cartName);
  const rrpNum = parseFloat(p.rrp.replace('€',''));
  if (ex) ex.qty++; else cart.push({name:cartName, brand:p.brand, price:'€'+rrpNum.toFixed(2), img:p.img, qty:1});
  saveCart(); updateBadge();
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '<div class="card-fb-left"><span class="card-fb-name">'+_de('✓ Zum Warenkorb','✓ Added to Cart')+'</span><span class="card-fb-sub">'+_de('Ganze Flasche · ','Full bottle · ')+p.rrp+'</span></div><div class="card-fb-right"><span class="card-fb-wa">'+_de('Warenkorb ansehen →','View cart →')+'</span></div>';
    btn.style.background = 'rgba(201,168,76,.16)';
    btn.style.borderColor = 'var(--gold)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 1800);
  }
  const cb = document.getElementById('cartBtn');
  cb.style.transform = 'scale(1.25)'; setTimeout(() => cb.style.transform = '', 220);
  updateShipBar(); updateCartUpsell();
  setTimeout(() => openCart(), 300);
}
/* ── Bundle size data (real prices from products array) ──── */
const BUNDLE_PRICES = {
  gourmand: {
    names: ['Khamrah','Dahaab Safi','Kismet Angel'],
    '2ml':  {ind:19.70, price:17.90, save:1.80,  hint:'3 × 2ml &nbsp;·&nbsp; ~24 sprays each'},
    '5ml':  {ind:36.70, price:30.90, save:5.80,  hint:'3 × 5ml decants &nbsp;·&nbsp; ~60 sprays each'},
    '10ml': {ind:63.70, price:57.90, save:5.80,  hint:'3 × 10ml decants &nbsp;·&nbsp; ~130 sprays each'}
  },
  bestseller: {
    names: ['Khamrah','Club de Nuit Intense','Meydan'],
    '2ml':  {ind:36.70,  price:32.90,  save:3.80,  hint:'3 × 2ml &nbsp;·&nbsp; ~24 sprays each'},
    '5ml':  {ind:69.70,  price:57.90,  save:11.80, hint:'3 × 5ml decants &nbsp;·&nbsp; ~60 sprays each'},
    '10ml': {ind:123.70, price:109.90, save:13.80, hint:'3 × 10ml decants &nbsp;·&nbsp; ~130 sprays each'}
  },
  connoisseur: {
    names: ['Meydan','Rose 01','Turath'],
    '2ml':  {ind:52.70,  price:46.90,  save:5.80,  hint:'3 × 2ml &nbsp;·&nbsp; ~24 sprays each'},
    '5ml':  {ind:97.70,  price:84.90,  save:12.80, hint:'3 × 5ml decants &nbsp;·&nbsp; ~60 sprays each'},
    '10ml': {ind:174.70, price:154.90, save:19.80, hint:'3 × 10ml decants &nbsp;·&nbsp; ~130 sprays each'}
  }
};
function bundleSizeSelect(btn) {
  const card = btn.closest('.bundle-card');
  const vol  = btn.dataset.vol;
  const bKey = card.dataset.bundle;
  card.querySelectorAll('.bst').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = BUNDLE_PRICES[bKey][vol];
  card.querySelector('.bundle-vol-hint').innerHTML  = d.hint;
  card.querySelector('.bundle-was').textContent     = 'Individually €' + d.ind.toFixed(2);
  card.querySelector('.bundle-price').textContent   = '€' + d.price.toFixed(2);
  card.querySelector('.bundle-save').textContent    = 'Save €' + d.save.toFixed(2);
}
function addBundle(bKey, btn) {
  const card = btn.closest('.bundle-card');
  const vol  = card.querySelector('.bst.active')?.dataset.vol || '5ml';
  const d    = BUNDLE_PRICES[bKey];
  const items = d.names.map(function(name){
    const p = products.find(function(x){ return x.name === name; });
    const id = p && p.variants && p.variants[vol];
    return id ? {
      id: id,
      quantity: 1,
      properties: {
        '_nur_bundle': bKey,
        '_bundle_size': vol,
        '_discount_rule': 'Configure Shopify automatic discount or Function for matching bundle properties'
      }
    } : null;
  }).filter(Boolean);
  if (!items.length) return;
  const orig = btn ? btn.textContent : '';
  if (btn) {
    btn.textContent = _de('Wird hinzugefügt…','Adding...');
    btn.disabled = true;
  }
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items: items })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ return fetch('/cart.js'); })
  .then(function(r){ return r.json(); })
  .then(function(c){
    var badges = document.querySelectorAll('.cart-badge,#cartBadge');
    badges.forEach(function(b){ b.textContent = c.item_count; });
    if (btn) {
      btn.textContent = '✓ Set added!';
      btn.style.background = '#4a7c59';
      btn.style.color = '#fff';
      btn.style.borderColor = '#4a7c59';
      btn.disabled = false;
      setTimeout(function(){ btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }, 2000);
    }
    const cb = document.getElementById('cartBtn');
    if (cb) { cb.style.transform = 'scale(1.25)'; setTimeout(function(){ cb.style.transform = ''; }, 220); }
    updateShipBar(); updateCartUpsell();
    setTimeout(function(){ openCart(); }, 300);
  })
  .catch(function(err){
    console.error('Bundle cart error:', err);
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  });
}

const GIFT_SET_BUNDLES = {
  'arabian-introduction': {
    label: 'The Arabian Introduction',
    size: '2ml',
    price: '€19.90',
    products: ['Khamrah', 'Asad', 'Dahaab Safi']
  },
  'signature-masculine': {
    label: 'The Signature Masculine',
    size: '5ml',
    price: '€44.90',
    products: ['Club de Nuit Intense', 'Asad', 'Royal Bleu']
  },
  'oud-explorer': {
    label: 'The Oud Explorer',
    size: '5ml',
    price: '€84.90',
    products: ['Meydan', 'Turath', 'Khamrah']
  }
};

function addGiftSet(setKey, btn) {
  const set = GIFT_SET_BUNDLES[setKey];
  if (!set) {
    window.location.href = '/pages/build-your-own-bundle';
    return;
  }

  const items = set.products.map(function(name){
    const p = products.find(function(product){ return product.name === name || product.slug === name; });
    const id = p && p.variants && p.variants[set.size];
    return id ? {
      id: id,
      quantity: 1,
      properties: {
        'Gift packaging': 'Free gift packaging included',
        '_nur_bundle': setKey,
        '_bundle_name': set.label,
        '_bundle_size': set.size,
        '_bundle_price': set.price,
        '_discount_rule': 'Configure Shopify automatic discount or Function for matching bundle properties'
      }
    } : null;
  }).filter(Boolean);

  if (items.length !== set.products.length) {
    window.location.href = '/pages/build-your-own-bundle';
    return;
  }

  const orig = btn ? btn.textContent : '';
  if (btn) {
    btn.textContent = _de('Wird hinzugefügt…','Adding...');
    btn.style.pointerEvents = 'none';
    btn.setAttribute('aria-busy', 'true');
  }

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items: items })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ return fetch('/cart.js'); })
  .then(function(r){ return r.json(); })
  .then(function(c){
    var badges = document.querySelectorAll('.cart-badge,#cartBadge');
    badges.forEach(function(b){ b.textContent = c.item_count; });
    if (btn) {
      btn.textContent = _de('Set hinzugefügt','Set Added');
      btn.style.background = '#4a7c59';
      btn.style.color = '#fff';
      btn.style.pointerEvents = '';
      btn.removeAttribute('aria-busy');
      setTimeout(function(){
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
    const cb = document.getElementById('cartBtn');
    if (cb) { cb.style.transform = 'scale(1.25)'; setTimeout(function(){ cb.style.transform = ''; }, 220); }
    updateShipBar(); updateCartUpsell();
    setTimeout(function(){ openCart(); }, 300);
  })
  .catch(function(err){
    console.error('Gift set cart error:', err);
    if (btn) {
      btn.textContent = orig;
      btn.style.pointerEvents = '';
      btn.removeAttribute('aria-busy');
    }
    window.location.href = '/pages/build-your-own-bundle';
  });
}
function addToCartByName(name, brand, price, img) {
  /* Find product by name, add its 5ml variant to Shopify cart */
  var p = products.find(function(pr){ return pr.name === name || pr.slug === name; });
  var variantId = p && p.variants && p.variants['5ml'];
  if (!variantId) { /* fallback: open product page */ if(p) window.location.href='/products/'+p.slug; return; }
  fetch('/cart/add.js', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ return fetch('/cart.js'); })
  .then(function(r){ return r.json(); })
  .then(function(c){
    var badges = document.querySelectorAll('.cart-badge,#cartBadge');
    badges.forEach(function(b){ b.textContent = c.item_count; });
    updateShipBar(); updateCartUpsell();
  })
  .catch(function(err){ console.error('Cart error:', err); });
}

/* ── DISCOVERY TRIO ──────────────────────────────────────────── */
const TRIO_PRICE = '€19.90';

function addTrioToCart(n1,s1,n2,s2,n3,s3,cardEl,trioPrice) {
  /* Add exactly the advertised three 2ml Discovery Trio variants. */
  var trioSize = '2ml';
  var slugs = [s1, s2, s3];
  var items = [];
  var missing = [];
  slugs.forEach(function(slug) {
    var p = products.find(function(pr){ return pr.slug === slug; });
    var vid = p && p.variants && p.variants[trioSize];
    if (vid) {
      items.push({
        id: vid,
        quantity: 1,
        properties: {
          '_nur_bundle': 'discovery_trio',
          '_bundle_size': trioSize,
          '_bundle_price': trioPrice || TRIO_PRICE,
          '_discount_rule': 'Configure Shopify automatic discount or Function for matching bundle properties'
        }
      });
    } else {
      missing.push(slug);
    }
  });
  var btn = cardEl && (cardEl.querySelector('.trio-card-btn') || cardEl.querySelector('.trio-byo-btn'));
  var orig = btn ? btn.textContent : '';
  if (missing.length || items.length !== 3) {
    if (btn) {
      btn.textContent = '2ml option unavailable';
      btn.disabled = false;
      setTimeout(function(){ btn.textContent = orig; }, 2200);
    }
    console.warn('Discovery Trio requires 2ml variants for:', missing);
    return;
  }
  if (btn) { btn.textContent = _de('Wird hinzugefügt…','Adding…'); btn.disabled = true; }

  fetch('/cart/add.js', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ items: items })
  })
  .then(function(r){ return r.json(); })
  .then(function(){ return fetch('/cart.js'); })
  .then(function(r){ return r.json(); })
  .then(function(c){
    var badges = document.querySelectorAll('.cart-badge,#cartBadge');
    badges.forEach(function(b){ b.textContent = c.item_count; });
    if (btn) { btn.textContent = _de('✓ Zum Warenkorb hinzugefügt!','✓ Added to cart!'); btn.style.background = '#4a7c59'; btn.disabled = false;
      setTimeout(function(){ btn.textContent = orig; btn.style.background = ''; }, 2000); }
    var cb = document.getElementById('cartBtn');
    if (cb) { cb.style.transform='scale(1.25)'; setTimeout(function(){ cb.style.transform=''; },220); }
    updateShipBar(); updateCartUpsell();
    setTimeout(function(){ openCart(); }, 350);
  })
  .catch(function(err){ console.error('Trio cart error:', err); if(btn){btn.textContent=orig;btn.disabled=false;} });
}

// ── Build Your Own picker ──────────────────────────────────────
let byoPicks = [];
const picker = document.getElementById('trioPicker');

if (picker) {
  products.forEach((p, i) => {
    const el = document.createElement('div');
    const productName = escapeHTML(p.name || '');
    const productImage = escapeHTML(p.img || '');
    el.className = 'trio-pick-item';
    el.dataset.name = p.name;
    el.dataset.slug = p.slug;
    el.innerHTML =
      '<img class="trio-pick-img" src="'+productImage+'" alt="'+productName+'" loading="lazy">' +
      '<span class="trio-pick-name">'+productName+'</span>' +
      '<div class="trio-pick-check">✓</div>';
    el.addEventListener('click', function() {
      const idx = byoPicks.indexOf(p.slug);
      if (idx > -1) {
        byoPicks.splice(idx, 1);
        el.classList.remove('picked');
      } else {
        if (byoPicks.length >= 3) return;
        byoPicks.push(p.slug);
        el.classList.add('picked');
      }
      updateBYOState();
    });
    picker.appendChild(el);
  });
}

function updateBYOState() {
  const n = byoPicks.length;
  // Dots
  [0,1,2].forEach(i => {
    const d = document.getElementById('byoDot'+i);
    if (d) d.classList.toggle('filled', i < n);
  });
  // Label
  const lbl = document.getElementById('trioBYOLabel');
  if (lbl) lbl.textContent = n===0 ? _de('3 Düfte auswählen','Select 3 fragrances') : n===3 ? _de('Bereit — in den Warenkorb','Ready — add to cart') : _de('Noch '+(3-n)+' auswählen','Select '+(3-n)+' more');
  // Disable unpicked items if 3 selected
  document.querySelectorAll('.trio-pick-item').forEach(el => {
    const isPicked = byoPicks.includes(el.dataset.slug);
    el.classList.toggle('pick-disabled', n===3 && !isPicked);
  });
  // CTA button
  const btn = document.getElementById('trioBYOBtn');
  if (btn) btn.classList.toggle('ready', n===3);
}

function addBYOTrio() {
  if (byoPicks.length !== 3) return;
  const names = byoPicks.map(slug => products.find(p=>p.slug===slug)?.name || slug);
  addTrioToCart(names[0],byoPicks[0], names[1],byoPicks[1], names[2],byoPicks[2],
    document.querySelector('.trio-byo'));
}

document.getElementById('cartBtn').addEventListener('click', openCart);
updateBadge();

/* ── MOBILE NAV ───────────────────────────────────────────── */
const hamburger=document.getElementById('hamburger'), mobNav=document.getElementById('mobNav');
function closeMob(){ if(mobNav){mobNav.classList.remove('open');} if(hamburger){hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded','false');} document.body.style.overflow=''; }
if(hamburger && mobNav){
  hamburger.addEventListener('click',()=>{
    const o=mobNav.classList.toggle('open');
    hamburger.classList.toggle('open',o);
    hamburger.setAttribute('aria-expanded',String(o));
    document.body.style.overflow=o?'hidden':'';
  });
}

/* ── QUIZ ─────────────────────────────────────────────────── */
const questions = [
  {id:1,text:_de("Wann trägst du am meisten Parfüm?","When do you wear perfume most?"),opts:[
    {l:"A",t:_de("Jeden Tag — es gehört zu meiner Identität","Every day — it's part of my identity"),s:{g:2,s:1,c:0}},
    {l:"B",t:_de("Zu besonderen Anlässen und Events","For special occasions and events"),   s:{g:0,s:1,c:2}},
    {l:"C",t:_de("Um mich bei der Arbeit sicher zu fühlen","To feel confident at work"),          s:{g:0,s:2,c:1}},
    {l:"D",t:_de("Wann immer mir danach ist — keine Regeln","Whenever I feel like it — no rules"), s:{g:1,s:1,c:1}},
  ]},
  {id:2,text:_de("Wähle deinen Vibe:","Pick your vibe:"),opts:[
    {l:"A",t:_de("Süß, warm, gemütlich — wie ein Dessert","Sweet, warm, cozy — like dessert"),   s:{g:3,s:0,c:0}},
    {l:"B",t:_de("Frisch, energiegeladen, zitrisch","Fresh, energetic, citrusy"),          s:{g:0,s:2,c:0}},
    {l:"C",t:_de("Tief, geheimnisvoll, intensiv","Deep, mysterious, intense"),          s:{g:0,s:0,c:3}},
    {l:"D",t:_de("Blumig, romantisch, sanft","Floral, romantic, soft"),             s:{g:1,s:1,c:1}},
  ]},
  {id:3,text:_de("Dein ideales Wochenende:","Your ideal weekend:"),opts:[
    {l:"A",t:_de("Kochen, Netflix, pure Gemütlichkeit","Cooking, Netflix, pure comfort"),     s:{g:2,s:0,c:1}},
    {l:"B",t:_de("Die Stadt erkunden, Galerie, Kaffee","Exploring the city, gallery, coffee"),s:{g:0,s:3,c:0}},
    {l:"C",t:_de("Dinnerparty, aufgestylt und bereit","Dinner party, dressed to impress"),   s:{g:1,s:1,c:2}},
    {l:"D",t:_de("Natur, frische Luft, lange Spaziergänge","Nature, fresh air, long walks"),      s:{g:0,s:2,c:0}},
  ]},
  {id:4,text:_de("Wie lange soll dein Duft halten?","How long should your scent last?"),opts:[
    {l:"A",t:_de("Den ganzen Tag — maximale Projektion","All day — maximum projection"),       s:{g:1,s:0,c:2}},
    {l:"B",t:_de("Ein paar Stunden reichen","A few hours is fine"),                s:{g:1,s:2,c:0}},
    {l:"C",t:_de("Je länger, desto besser","The longer the better"),              s:{g:2,s:0,c:2}},
    {l:"D",t:_de("Nachlegen macht mir nichts aus","I don't mind reapplying"),            s:{g:1,s:1,c:0}},
  ]},
  {id:5,text:_de("Dein Budget pro Decant?","Your fragrance budget per decant?"),opts:[
    {l:"A",t:_de("Unter 20 € — top Preis-Leistung","Under €20 — great value"),            s:{g:2,s:1,c:0}},
    {l:"B",t:_de("20–35 € — erschwinglicher Luxus","€20–€35 — accessible luxury"),        s:{g:1,s:2,c:1}},
    {l:"C",t:_de("35–50 € — die Extravaganz wert","€35–€50 — worth the treat"),          s:{g:1,s:1,c:2}},
    {l:"D",t:_de("Preis nebensächlich — Qualität zuerst","Price is secondary — quality first"), s:{g:0,s:0,c:3}},
  ]},
];
const qProfiles = {
  gourmand: {
    name:_de('Der Gourmand.','The Gourmand.'),
    sub:_de('Du liebst Wärme, Süße und Geborgenheit. Starte mit einem leichten, komplimente-sicheren Trio, bevor du dich für einen Favoriten in voller Größe entscheidest.','You love warmth, sweetness and comfort. Start with an easy, compliment-friendly trio before choosing one full-size favorite.'),
    color:'var(--g-col)',
    trioName:_de('Das Süße-Wärme-Trio','The Sweet Warmth Trio'),
    trioDesc:_de('Drei 2-ml-Proben: Khamrah für Amber-Wärme, Dahaab Safi für goldene Süße und Kismet Angel für strahlende Geborgenheit.','Three 2ml samples: Khamrah for amber warmth, Dahaab Safi for golden sweetness, and Kismet Angel for bright comfort.'),
    trioPrice:'€19.90',
    trioSlugs:['khamrah','dahaab-safi','kismet-angel'],
    picks:['khamrah','dahaab-safi','kismet-angel']
  },
  sophisticate: {
    name:_de('Der Ästhet.','The Sophisticate.'),
    sub:_de('Klar, modern, vielseitig. Dein erstes Set sollte vom Arbeitstag bis zum Dinner elegant wirken.','Clean, modern, versatile. Your first set should feel polished from workday to dinner.'),
    color:'var(--s-col)',
    trioName:_de('Das Elegante-Alltag-Trio','The Polished Daily Trio'),
    trioDesc:_de('Drei 2-ml-Proben: bürotaugliche Frische, raffinierte Abende und warme After-Hours.','Three 2ml samples: office-safe freshness, refined evenings and warm after-hours.'),
    trioPrice:'€19.90',
    trioSlugs:['club-de-nuit-intense','club-de-nuit-precieux','dahaab-safi'],
    picks:['club-de-nuit-intense','club-de-nuit-precieux','dahaab-safi']
  },
  connoisseur: {
    name:_de('Der Kenner.','The Connoisseur.'),
    sub:_de('Kräftig. Selten. Unvergesslich. Dein Trio sollte Oud, Leder, Rose und tiefe Hölzer erkunden.','Bold. Rare. Unforgettable. Your trio should explore oud, leather, rose and deep woods.'),
    color:'var(--c-col)',
    trioName:_de('Das Kräftige-Oud-Trio','The Bold Oud Trio'),
    trioDesc:_de('Drei 2-ml-Proben: Meydan, Club de Nuit Précieux und Khamrah für Tiefe, rauchige Eleganz und warme arabische Süße.','Three 2ml samples: Meydan, Club de Nuit Précieux and Khamrah for depth, smoky elegance and warm Arabian sweetness.'),
    trioPrice:'€19.90',
    trioSlugs:['meydan','club-de-nuit-precieux','khamrah'],
    picks:['meydan','club-de-nuit-precieux','khamrah']
  },
};
function addQuizTrio(type, btn) {
  const pr = qProfiles[type];
  if (!pr || !pr.trioSlugs) return;
  const ps = pr.trioSlugs.map(slug => products.find(p => p.slug === slug)).filter(Boolean);
  if (ps.length < 3) return;
  addTrioToCart(ps[0].name, ps[0].slug, ps[1].name, ps[1].slug, ps[2].name, ps[2].slug, btn.closest('.qr-trio-card'), pr.trioPrice);
}
let qCur=0, qAns=[], qSc={g:0,s:0,c:0};

function startQuiz(){
  document.getElementById('quizIntro').style.display='none';
  document.getElementById('quizActive').style.display='block';
  document.getElementById('qProg').classList.add('vis');
  qCur=0;qAns=[];qSc={g:0,s:0,c:0};renderQ();
}
function renderQ(){
  const q=questions[qCur];
  document.getElementById('qDisp').innerHTML=
    `<span class="q-num">${_de("Frage","Question")} ${q.id} ${_de("von","of")} ${questions.length}</span>
     <h2 class="q-text">${q.text}</h2>
     <div class="opts">${q.opts.map((o,i)=>`
       <button class="opt${qAns[qCur]===i?' sel':''}" onclick="pickOpt(${i})">
         <span class="opt-ltr">${o.l}</span><span class="opt-txt">${o.t}</span>
       </button>`).join('')}</div>`;
  for(let i=0;i<5;i++){
    const d=document.getElementById('d'+i);
    d.className='q-dot'+(i<qCur?' done':i===qCur?' active':'');
  }
  document.getElementById('qCount').textContent=(qCur+1)+' / 5';
  document.getElementById('qBack').style.visibility=qCur===0?'hidden':'visible';
  const nxt=document.getElementById('qNext');
  nxt.textContent=qCur===questions.length-1?_de('Mein Ergebnis ✦','See My Result ✦'):_de('Weiter →','Next →');
  nxt.classList.toggle('on',qAns[qCur]!==undefined);
}
function pickOpt(i){
  qAns[qCur]=i;
  document.querySelectorAll('.opt').forEach((b,j)=>b.classList.toggle('sel',j===i));
  document.getElementById('qNext').classList.add('on');
}
function nextQ(){ if(qAns[qCur]===undefined)return; qCur<questions.length-1?( qCur++, renderQ()):computeResult(); }
function prevQ(){ if(qCur>0){qCur--;renderQ();} }
function computeResult(){
  qSc={g:0,s:0,c:0};
  qAns.forEach((ai,qi)=>{const s=questions[qi].opts[ai].s;qSc.g+=s.g;qSc.s+=s.s;qSc.c+=s.c;});
  let w='gourmand';
  if(qSc.s>qSc.g&&qSc.s>=qSc.c)w='sophisticate';
  else if(qSc.c>qSc.g&&qSc.c>qSc.s)w='connoisseur';
  quizWinner=w; showResult(w);
}
function showResult(type){
  document.getElementById('quizActive').style.display='none';
  const pr=qProfiles[type];
  document.getElementById('qrProfile').innerHTML=`<span style="color:${pr.color}">${pr.name}</span>`;
  document.getElementById('qrSub').textContent=pr.sub;
  const trioProducts = (pr.trioSlugs || []).map(slug => products.find(p => p.slug === slug)).filter(Boolean);
  const trioEl = document.getElementById('qrTrio');
  if (trioEl && trioProducts.length) {
    trioEl.innerHTML = `<div class="qr-trio-card" style="--profile-color:${pr.color}">
      <div class="qr-trio-copy">
        <span class="qr-trio-kicker">${_de("Empfohlenes Trio","Recommended trio")}</span>
        <h3>${pr.trioName}</h3>
        <p>${pr.trioDesc}</p>
      </div>
      <div class="qr-trio-imgs">
        ${trioProducts.map(p => `<img class="qr-trio-img" src="${p.img}" alt="${p.name} Arabian fragrance decant" loading="lazy">`).join('')}
      </div>
      <div class="qr-trio-foot">
        <span>${trioProducts.map(p => p.name).join(' · ')}</span>
        <strong>${pr.trioPrice}</strong>
      </div>
      <button class="trio-card-btn qr-trio-btn" onclick="addQuizTrio('${type}',this)">${_de("Empfohlenes Trio hinzufügen","Add Recommended Trio")} &rarr;</button>
    </div>`;
  }
  document.getElementById('qrPicks').innerHTML=pr.picks.map(slug=>{
    const p=products.find(x=>x.slug===slug);
    if (!p) return '';
    const inStock = p.available !== false;
    return `<div class="qr-pick">
      <div class="qr-glow" style="background:${p.glow}"></div>
      <span class="decision-label">${decisionLabel(p)}</span>
      <p class="qr-brand">${p.brand}</p>
      <h3 class="qr-name">${p.name}</h3>
      <div class="qr-stars">${stars(p.rating)} ${p.rating}</div>
      <p style="font-family:var(--ral);font-size:.68rem;color:var(--mid);margin:.3rem 0 .8rem;line-height:1.6">${p.notes.top} · ${p.notes.heart} · ${p.notes.base}</p>
      <div class="qr-price">${p.price}</div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.85rem">
        ${inStock ? `<button class="qr-shop" onclick="addToCartByName('${p.name}','${p.brand}','${p.price}','${p.img}');this.textContent=_de('✓ Hinzugefügt!','✓ Added!');this.style.background='#4a7c59'">${_de('In den Warenkorb →','Add to Cart →')}</button>` : `<span style="font-family:var(--ral);font-size:.6rem;color:var(--mid);padding:.58rem 0">${_de('Ausverkauft','Out of stock')}</span>`}
        <a href="/products/${p.slug}" style="font-family:var(--ral);font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,168,76,.3);padding:.55rem 1rem;text-decoration:none;transition:border-color .2s" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='rgba(201,168,76,.3)'">${_de("Ansehen","View")} →</a>
      </div>
    </div>`;
  }).join('');
  document.getElementById('quizResult').style.display='block';
}
function retakeQuiz(){
  document.getElementById('quizResult').style.display='none';
  const trioEl = document.getElementById('qrTrio');
  if (trioEl) trioEl.innerHTML = '';
  document.getElementById('quizActive').style.display='none';
  document.getElementById('quizIntro').style.display='block';
  document.getElementById('qProg').classList.remove('vis');
}
function claimDiscount(e){
  e.preventDefault();
  const btn=e.target.querySelector('button');
  btn.textContent='✓ Code Sent!';btn.style.background='#4a7c59';
  e.target.querySelector('input').value='';
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));
window._nurRevObs = revObs; // expose for dynamic re-observation

/* ── COUNT-UP ─────────────────────────────────────────────── */
const statObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting||e.target.dataset.done)return;
    if(!e.target.dataset.target)return;
    e.target.dataset.done=1;
    const target=parseInt(e.target.dataset.target);
    const dec=e.target.dataset.decimal;
    const suf=e.target.dataset.suffix||'';
    const t0=Date.now(),dur=1900;
    (function tick(){
      const p=Math.min((Date.now()-t0)/dur,1);
      const v=Math.round((1-Math.pow(1-p,3))*target);
      e.target.textContent=dec?(v/100).toFixed(1)+'/5':v+suf;
      if(p<1)requestAnimationFrame(tick);
    })();
  });
},{threshold:.5});
document.querySelectorAll('.stat-n').forEach(el=>statObs.observe(el));

/* ── NEWSLETTER ───────────────────────────────────────────── */
function handleNL(e){
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type=submit]');
  const email = form.querySelector('input[type=email]').value.trim();
  btn.textContent = 'Joining…';
  btn.disabled = true;
  fetch('https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({email, source:'newsletter-section'})
  }).finally(() => {
    btn.textContent = "✓ You're in the Inner Circle!";
    btn.style.background = '#4a7c59';
  });
}

/* ── ANNOUNCE BAR: rotate + countdown ────────────────────── */
(function(){
  const el = document.getElementById('dcTime');
  const msgs = [
    document.getElementById('abMsg0'),
    document.getElementById('abMsg1'),
    document.getElementById('abMsg2'),
    document.getElementById('abMsg3')
  ].filter(Boolean);
  let cur = 0;

  // Countdown
  function updateTimer(){
    if (!el) return;
    const now = new Date();
    const cutoff = new Date(now); cutoff.setHours(14,0,0,0);
    const day = now.getDay();
    if (day===0||day===6||now>=cutoff){ el.textContent='—'; return; }
    const diff = cutoff - now;
    const h = Math.floor(diff/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  // Rotate messages every 5s
  if (msgs.length > 1) {
    setInterval(function(){
      msgs[cur].classList.remove('active'); msgs[cur].classList.add('hidden');
      cur = (cur+1) % msgs.length;
      msgs[cur].classList.remove('hidden'); msgs[cur].classList.add('active');
    }, 5000);
  }

  // Close bar
  window.closeAnnounceBar = function(){
    const bar = document.getElementById('announceBar');
    const nav = document.getElementById('navbar');
    if (bar) bar.style.display = 'none';
    if (nav) { nav.style.top = '0'; nav.classList.add('bar-gone'); }
  };
})();

/* ── RECENTLY VIEWED ─────────────────────────────────────── */
(function(){
  try {
    var rv = JSON.parse(localStorage.getItem('nurRecentlyViewed') || '[]');
    if (!rv.length) return;
    // Limit to 4 most recent
    rv = rv.slice(0, 4);
    var sec  = document.getElementById('recently-viewed');
    var grid = document.getElementById('rvGrid');
    if (!sec || !grid) return;

    var tagCls = {gourmand:'tag-g', sophisticate:'tag-s', connoisseur:'tag-c'};
    var tagLbl = {gourmand:'Gourmand', sophisticate:'Sophisticate', connoisseur:'Connoisseur'};

    var cards = rv.map(function(slug){
      var p = products.find(function(x){ return x.slug === slug; });
      if (!p) return '';
      var inStock = p.available !== false;
      var priceNum = p.sizes.find(function(s){ return s.popular; });
      var price5ml = priceNum ? '€' + priceNum.price.toFixed(2).replace('.', '.') : p.price;
      return '<div style="background:#0c0905;border:1px solid rgba(201,168,76,.1);border-radius:4px;overflow:hidden;cursor:pointer;transition:border-color .25s" '
        + 'onclick="location.href=\'/products/' + slug + '\'" '
        + 'onmouseenter="this.style.borderColor=\'rgba(201,168,76,.35)\'" '
        + 'onmouseleave="this.style.borderColor=\'rgba(201,168,76,.1)\'">'
        + '<div style="aspect-ratio:1;overflow:hidden;background:#1a1510">'
        + '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .4s" '
        + 'onmouseenter="this.style.transform=\'scale(1.04)\'" onmouseleave="this.style.transform=\'\'">'
        + '</div>'
        + '<div style="padding:.85rem .9rem">'
        + '<p style="font-family:var(--ral);font-size:.62rem;color:var(--gold);letter-spacing:.1em;text-transform:uppercase;margin:0 0 .2rem;opacity:.75">' + p.brand + '</p>'
        + '<p style="font-family:var(--serif);font-size:1rem;color:var(--cream);margin:0 0 .55rem;line-height:1.2">' + p.name + '</p>'
        + '<div style="display:flex;align-items:center;justify-content:space-between">'
        + '<span style="font-family:var(--ral);font-size:.8rem;color:var(--gold);font-weight:500">' + price5ml + '</span>'
        + (inStock
            ? '<span style="font-family:var(--ral);font-size:.62rem;color:#6db58a;letter-spacing:.06em">In Stock</span>'
            : '<span style="font-family:var(--ral);font-size:.62rem;color:#a07860;letter-spacing:.06em">Notify Me</span>')
        + '</div>'
        + '</div>'
        + '</div>';
    }).filter(Boolean).join('');

    if (!cards) return;
    grid.innerHTML = cards;
    sec.style.display = '';
  } catch(e) {}
})();

/* ── FREE SHIPPING BAR (Shopify cart) ─────────────────────── */
const FREE_SHIP = 39;
function updateShipBar(){
  const bar = document.getElementById('cartShipBar');
  const txt = document.getElementById('csbText');
  const fill = document.getElementById('csbFill');
  if (!bar || !txt || !fill) return;
  fetch('/cart.js').then(r => r.json()).then(sc => {
    const total = (sc.total_price || 0) / 100;
    if (!sc.item_count) { bar.classList.remove('show'); return; }
    bar.classList.add('show');
    if (total >= FREE_SHIP) {
      txt.innerHTML = '🎉 <strong>Free shipping unlocked!</strong>';
      txt.className = 'csb-text done';
      fill.style.width = '100%';
    } else {
      const rem = (FREE_SHIP - total).toFixed(2).replace('.', ',');
      txt.innerHTML = `Add <strong>€${rem}</strong> more for <strong>free shipping</strong>`;
      txt.className = 'csb-text';
      fill.style.width = Math.round((total / FREE_SHIP) * 100) + '%';
    }
  }).catch(() => { bar.classList.remove('show'); });
}

/* ── CART UPSELL (Shopify cart) ───────────────────────────── */
function updateCartUpsell(){
  const el = document.getElementById('cartUpsell');
  if (!el) return;
  fetch('/cart.js').then(r => r.json()).then(sc => {
    if (!sc.items || !sc.items.length) { el.innerHTML = ''; return; }
    const inCartSlugs = new Set(sc.items.map(it => it.handle || ''));
    const suggestion = (products || []).find(p => !inCartSlugs.has(p.slug) && p.badge === 'bestseller') ||
                       (products || []).find(p => !inCartSlugs.has(p.slug));
    if (!suggestion) { el.innerHTML = ''; return; }
    const idx = products.indexOf(suggestion);
    const imgSrc = (window.NUR_IMG && suggestion.img && suggestion.img.indexOf('http') !== 0)
      ? (window.NUR_IMG + (suggestion.img.split('/').pop()))
      : suggestion.img;
    el.innerHTML = `
      <div class="cu-label">${_de('Das könnte dir auch gefallen','You might also like')}</div>
      <div class="cu-card">
        <img class="cu-img" src="${imgSrc}" alt="${suggestion.name}" onerror="this.style.visibility='hidden'">
        <div class="cu-info">
          <div class="cu-name">${suggestion.name}</div>
          <div class="cu-price">${suggestion.price}</div>
        </div>
        <button class="cu-add" onclick="addToCart(${idx},this)">${_de('+ Hinzufügen','+ Add')}</button>
      </div>`;
  }).catch(() => { el.innerHTML = ''; });
}

/* Live viewing counters are disabled until connected to real analytics data. */

/* ── MOBILE STICKY CTA ────────────────────────────────────── */
const mobSticky = document.getElementById('mobSticky');
const heroSection = document.getElementById('hero');
const footerEl = document.querySelector('footer');
function updateMobSticky(){
  if(!mobSticky||!heroSection) return;
  if(window.innerWidth > 767){
    mobSticky.classList.remove('show');
    document.body.classList.remove('mobile-sticky-visible');
    return;
  }
  const active = document.activeElement;
  const isFormActive = active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName);
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  const footerTop  = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
  const show = heroBottom < 72
    && footerTop > window.innerHeight + 90
    && !document.body.classList.contains('cart-open')
    && !document.body.classList.contains('filter-drawer-open')
    && !isFormActive;
  mobSticky.classList.toggle('show', show);
  document.body.classList.toggle('mobile-sticky-visible', show);
}
window.addEventListener('scroll', updateMobSticky, {passive:true});
window.addEventListener('resize', updateMobSticky, {passive:true});
window.addEventListener('focusin', updateMobSticky);
window.addEventListener('focusout', () => setTimeout(updateMobSticky, 120));
document.addEventListener('DOMContentLoaded', updateMobSticky);

/* ── DESKTOP FLOATING CTA ─────────────────────────────────── */
const deskFloat = document.getElementById('deskFloat');
function updateDeskFloat(){
  if(!deskFloat||!heroSection) return;
  if(window.innerWidth <= 768) return;
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  const footerTop  = footerEl.getBoundingClientRect().top;
  const show = heroBottom < 0 && footerTop > window.innerHeight;
  deskFloat.classList.toggle('show', show);
}
window.addEventListener('scroll', updateDeskFloat, {passive:true});
window.addEventListener('resize', updateDeskFloat, {passive:true});

/* ── NOTIFY ME ────────────────────────────────────────────── */
let _notifySlug = '', _notifyOrigBtn = null;
function notifyMe(slug, name, btn) {
  _notifySlug = slug;
  _notifyOrigBtn = btn;
  document.getElementById('notifyTitle').textContent = name;
  document.getElementById('notifySub').textContent =
    (NUR_DE ? ('Wir mailen dir, sobald „' + name + '“ wieder da ist — kein Spam, nur die Benachrichtigung.') : ('We’ll email you the moment “' + name + '” is back — no spam, just the alert.'));
  document.getElementById('notifyEmail').value = '';
  const nbtn = document.querySelector('#notifyForm button[type=submit]');
  if(nbtn){ nbtn.textContent = _de('Benachrichtige mich →','Notify Me When Available →'); nbtn.disabled = false; }
  document.getElementById('notifyVeil').classList.add('open');
  document.getElementById('notifyModal').classList.add('open');
}
function closeNotify(){
  document.getElementById('notifyVeil').classList.remove('open');
  document.getElementById('notifyModal').classList.remove('open');
}
function submitNotify(e){
  e.preventDefault();
  const btn   = e.target.querySelector('button[type=submit]');
  const email = document.getElementById('notifyEmail').value.trim();
  btn.textContent = _de('Wird gespeichert…','Saving…'); btn.disabled = true;
  fetch('https://formspree.io/f/YOUR_NOTIFY_FORM_ID', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({email, product: _notifySlug, source:'back-in-stock'})
  }).finally(() => {
    btn.textContent = _de('✓ Wir benachrichtigen dich!','✓ We’ll notify you!');
    btn.style.background = '#4a7c59';
    if(_notifyOrigBtn){
      _notifyOrigBtn.textContent = '✓ You’re on the list';
      _notifyOrigBtn.style.color = '#6db58a';
      _notifyOrigBtn.style.borderColor = '#6db58a';
      _notifyOrigBtn.disabled = true;
    }
    setTimeout(closeNotify, 1800);
  });
}

/* ── WELCOME POPUP ────────────────────────────────────────── */
const popupVeil = document.getElementById('popupVeil');
const welcomePopup = document.getElementById('welcomePopup');
let popupShown = false;

function openPopup(){
  if(popupShown || sessionStorage.getItem('nurPopupSeen')) return;
  popupShown = true;
  sessionStorage.setItem('nurPopupSeen','1');
  popupVeil.classList.add('open');
  welcomePopup.classList.add('open');
}
function closePopup(){
  popupVeil.classList.remove('open');
  welcomePopup.classList.remove('open');
}
function handlePopup(e){
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type=submit]');
  const email = form.querySelector('input[type=email]').value.trim();
  btn.textContent = 'Sending…';
  btn.disabled = true;
  fetch('https://formspree.io/f/YOUR_POPUP_FORM_ID', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({email, source:'exit-intent-popup', offer:'10% off first order'})
  }).finally(() => {
    btn.textContent = '✓ Code sent — check your inbox!';
    btn.style.background = '#4a7c59';
    setTimeout(closePopup, 2200);
  });
}
popupVeil.addEventListener('click', closePopup);

// Show after visitors understand the offer. Mobile waits for scroll depth.
let mobilePopupWatch = false;
function maybeOpenMobilePopup(){
  if(window.innerWidth > 767) return;
  const scrolled = window.scrollY > Math.max(520, window.innerHeight * .75);
  if(scrolled){
    window.removeEventListener('scroll', maybeOpenMobilePopup);
    openPopup();
  }
}
setTimeout(() => {
  if(window.innerWidth <= 767 && !mobilePopupWatch){
    mobilePopupWatch = true;
    window.addEventListener('scroll', maybeOpenMobilePopup, {passive:true});
    setTimeout(maybeOpenMobilePopup, 30000);
  }
}, 12000);

// Exit-intent: show when mouse leaves viewport upward
document.addEventListener('mouseleave', e => {
  if(e.clientY < 20) openPopup();
});

/* ── CHECKOUT ────────────────────────────────────────────── */
window.openCheckout = function(){
  var o=document.getElementById('chkOverlay'); if(!o) return;
  var cart=JSON.parse(localStorage.getItem('nurCart')||'[]');
  var sub=cart.reduce(function(s,i){return s+parseFloat(i.price.replace('€','').replace(',','.'))*i.qty;},0);
  var ship=sub>=60?0:4.90;
	  var si=document.getElementById('chkSumItems');
	  if(si) si.innerHTML=cart.map(function(it){
	    var isAddon = it.name === 'Gift Packaging & Handwritten Card';
	    var itemName = escapeHTML(it.name || '');
	    var itemImg = escapeHTML(it.img || '');
	    var imgHtml = isAddon
	      ? '<div class="chk-si-img" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:rgba(201,168,76,.07);border:1px solid rgba(201,168,76,.15);border-radius:6px">🎁</div>'
	      : '<img class="chk-si-img" src="'+itemImg+'" alt="'+itemName+'">';
	    var qtyHtml = isAddon ? _de('Extra','Add-on') : _de('Menge: ','Qty: ')+it.qty;
	    return '<div class="chk-si">'
	      +imgHtml
	      +'<div class="chk-si-info"><div class="chk-si-name">'+itemName+'</div><div class="chk-si-qty">'+qtyHtml+'</div></div>'
	      +'<div class="chk-si-p">€'+(parseFloat(it.price.replace('€','').replace(',','.'))*it.qty).toFixed(2).replace('.',',')+'</div>'
	      +'</div>';
	  }).join('');
  var ss=document.getElementById('chkSumSub'); if(ss) ss.textContent='€'+sub.toFixed(2).replace('.',',');
  var sh=document.getElementById('chkSumShip'); if(sh) sh.textContent=ship===0?_de('Gratis ✓','Free ✓'):'€'+ship.toFixed(2).replace('.',',');
  var st=document.getElementById('chkSumTotal'); if(st) st.textContent='€'+(sub+ship).toFixed(2).replace('.',',');
  document.getElementById('chkStep1').style.display='';
  document.getElementById('chkStep2').style.display='none';
  o.classList.add('open'); document.body.style.overflow='hidden';
  // close cart drawer if open
  var cd=document.getElementById('cartDrawer'); if(cd) cd.classList.remove('open');
  var pd=document.getElementById('pdpDrawer'); if(pd) pd.classList.remove('open');
};
window.closeCheckout = function(){
  var o=document.getElementById('chkOverlay'); if(o) o.classList.remove('open');
  document.body.style.overflow='';
};
window.submitCheckout = async function(){
  var fields=[
    document.getElementById('chkName'),
    document.getElementById('chkEmail'),
    document.getElementById('chkStreet'),
    document.getElementById('chkPostal'),
    document.getElementById('chkCity'),
    document.getElementById('chkCountry')
  ];
  var ok=true;
  fields.forEach(function(f){
    if(!f) return;
    f.classList.remove('chk-err');
    var v=f.value.trim();
    if(!v||(f.id==='chkEmail'&&!v.includes('@'))){f.classList.add('chk-err');ok=false;}
  });
  if(!ok){
    var first=fields.find(function(f){return f&&f.classList.contains('chk-err');});
    if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }

  // ── Loading state ────────────────────────────────────────────
  var btn = document.querySelector('#chkStep1 .chk-btn');
  var origText = btn ? btn.textContent : '';
  if(btn){ btn.disabled=true; btn.textContent='Placing order…'; btn.style.opacity='.7'; }

  // ── Collect order data ───────────────────────────────────────
  var cartData = JSON.parse(localStorage.getItem('nurCart')||'[]');
  var subtotal  = cartData.reduce(function(s,i){return s+parseFloat(String(i.price).replace('€','').replace(',','.'))*i.qty;},0);
  var shipping  = subtotal>=60?0:4.90;
  var total     = subtotal+shipping;

  var payload = {
    name:    document.getElementById('chkName').value.trim(),
    email:   document.getElementById('chkEmail').value.trim(),
    phone:   (document.getElementById('chkPhone')||{}).value||'',
    street:  document.getElementById('chkStreet').value.trim(),
    postal:  document.getElementById('chkPostal').value.trim(),
    city:    document.getElementById('chkCity').value.trim(),
    country: document.getElementById('chkCountry').value,
    items:   cartData,
    subtotal: subtotal,
    shipping: shipping,
    total:    total
  };

  // ── POST to Netlify Function ─────────────────────────────────
  try {
    var res = await fetch('/.netlify/functions/create-order', {
      method:  'POST',
      headers: {'Content-Type':'application/json'},
      body:    JSON.stringify(payload)
    });
    var json = await res.json();

    if(json.success){
      // ── Success: show confirmation ───────────────────────────
      document.getElementById('chkStep1').style.display='none';
      document.getElementById('chkStep2').style.display='';
      var on = document.getElementById('chkOrderNum');
      if(on) on.textContent = json.orderNumber;
      // Clear cart
      localStorage.removeItem('nurCart');
      cart = [];
      renderCart();
      ['cartBadge','pdpCartBadge'].forEach(function(id){var el=document.getElementById(id);if(el)el.textContent='0';});
    } else {
      throw new Error(json.error || 'Unknown error');
    }
  } catch(err) {
    console.error('[checkout]', err);
    if(btn){ btn.disabled=false; btn.textContent=origText; btn.style.opacity=''; }
    // Show inline error
    var errEl = document.getElementById('chkError');
    if(!errEl){
      errEl = document.createElement('p');
      errEl.id = 'chkError';
      errEl.style.cssText = 'color:#e07070;font-size:.75rem;text-align:center;margin:.75rem 0 0;font-family:var(--ral)';
      btn.parentNode.insertBefore(errEl, btn.nextSibling);
    }
    errEl.textContent = 'Something went wrong. Please try again or contact us on WhatsApp.';
  }
};
document.addEventListener('click',function(e){
  if(e.target===document.getElementById('chkOverlay')) window.closeCheckout();
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape') window.closeCheckout();
});



(function(){
  var float=document.getElementById('waFloat');
  var tip=document.getElementById('waTip');
  var btn=document.getElementById('waBtn');
  var closeBtn=document.getElementById('waClose');
  if(!float||!btn)return;

  // Set dynamic pre-filled message (product name from DOM if available)
  var productName=(document.querySelector('.pdp-name')||document.querySelector('h1'))?.textContent?.trim()||'';
  var msg=productName
    ?'Hallo! Ich interessiere mich für '+productName+' und hätte eine kurze Frage. 😊'
    :'Hallo! Ich schaue gerade bei NUR Fragrances vorbei und hätte eine kurze Frage. 😊';
  btn.href='https://wa.me/491754264425?text='+encodeURIComponent(msg);

  var shown=false;
  function show(){
    if(shown)return; shown=true;
    float.style.display='flex';
    // Pulse once after 600ms
    setTimeout(function(){btn.classList.add('wa-pulse');setTimeout(function(){btn.classList.remove('wa-pulse');},2000);},600);
    // Show tooltip after 1.4s
    setTimeout(function(){tip.classList.add('wa-vis');},1400);
  }

  // Dismiss tooltip (keep button)
  closeBtn.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    tip.style.display='none';
    try{sessionStorage.setItem('waTipDismissed','1');}catch(x){}
  });

  // Don't re-show tooltip if dismissed this session
  try{if(sessionStorage.getItem('waTipDismissed')){
    tip.style.display='none';
  }}catch(x){}

  // Trigger 1: 8s delay
  setTimeout(show, 8000);

  // Trigger 2: 30% scroll
  var scrolled=false;
  window.addEventListener('scroll',function(){
    if(scrolled)return;
    if((window.scrollY||window.pageYOffset)>document.documentElement.scrollHeight*0.28){
      scrolled=true; show();
    }
  },{passive:true});

  // Trigger 3: exit intent (desktop only)
  document.addEventListener('mouseleave',function(e){
    if(e.clientY<=5)show();
  });
})();



/* ── UPGRADE COMPARATOR ─────────────────────────────────────── */
var UPGRADES={
  'br540':{name:'Khamrah',why:'A warm amber-saffron direction with a darker, sweeter Arabian character. If you like rich amber fragrances, Khamrah is a smart scent family to test first as a decant.',them:'Baccarat Rouge 540 — €380 / 70ml (~€5.43/ml)',us:'from €14.90 / 5ml',href:'/products/khamrah'},
  'sauvage':{name:'Asad',why:'A bergamot, woods and amber profile with a clean opening and warmer dry-down. Easy to wear at the office, but more interesting than a simple fresh scent.',them:'Dior Sauvage EDP — €145 / 100ml (~€1.45/ml)',us:'from €11.90 / 5ml',href:'/products/asad'},
  'aventus':{name:'Club de Nuit Intense',why:'A fresh woody profile with citrus, birch and musk notes. It is often compared with Aventus-style fragrances, but should be tested on skin as its own scent.',them:'Creed Aventus — €395 / 100ml (~€3.95/ml)',us:'from €16.90 / 5ml',href:'/products/club-de-nuit-intense'},
  'bleu':{name:'Royal Bleu',why:'A clean masculine profile built around cool citrus, bergamot, sandalwood and musk. A polished everyday direction for anyone who likes fresh woody fragrances.',them:'Bleu de Chanel EDP — €145 / 100ml (~€1.45/ml)',us:'from €19.90 / 5ml',href:'/products/royal-bleu'},
  'oud-wood':{name:'Meydan',why:'A drier Arabian oud direction with saffron, resinous woods and leather. More traditional and assertive than most Western woody fragrances.',them:'Tom Ford Oud Wood — €300 / 50ml (~€6/ml)',us:'from €37.90 / 5ml',href:'/products/meydan'},
  'flowerbomb':{name:'Dahaab Safi',why:'A warm saffron, rose and vanilla profile with a sandalwood base. A softer gourmand-oriental direction for people who enjoy sweet floral fragrances.',them:'Viktor&Rolf Flowerbomb — €160 / 90ml (~€1.78/ml)',us:'from €10.90 / 5ml',href:'/products/dahaab-safi'},
  'black-opium':{name:'Kismet Angel',why:'A warm fruity-floral musk with a sweet comfort profile. A good decant choice if you like modern gourmand fragrances but want something softer.',them:'YSL Black Opium — €120 / 90ml (~€1.33/ml)',us:'from €10.90 / 5ml',href:'/products/kismet-angel'},
  'lavie':{name:'Dahaab Safi',why:'Date, rose and vanilla over sandalwood create a round sweet profile. A strong starting point for anyone who enjoys praline, vanilla and floral warmth.',them:'Lancôme La Vie Est Belle — €130 / 75ml (~€1.73/ml)',us:'from €10.90 / 5ml',href:'/products/dahaab-safi'}
};
/* ── SEASONAL EDIT ──────────────────────────────────────────── */
(function(){
  var m=new Date().getMonth();
  var seasons=[
    {months:[11,0,1],tag:'Winter Edit · Now',line:'Cold air amplifies warm bases. These are the fragrances built for it.',picks:[{n:'Khamrah',h:'/products/khamrah'},{n:'Meydan',h:'/products/meydan'},{n:'Turath',h:'/products/turath'}]},
    {months:[2,3,4],tag:'Spring Edit · Now',line:'Lighter evenings call for something skin-close and effortless.',picks:[{n:'Asad',h:'/products/asad'},{n:'Royal Bleu',h:'/products/royal-bleu'},{n:'Yulali',h:'/products/yulali'}]},
    {months:[5,6,7],tag:'Summer Edit · Now',line:'Heat intensifies projection. Reach for clean, structured, confident.',picks:[{n:'Club de Nuit Intense',h:'/products/club-de-nuit-intense'},{n:'Asad',h:'/products/asad'},{n:'Royal Bleu',h:'/products/royal-bleu'}]},
    {months:[8,9,10],tag:'Autumn Edit · Now',line:'The season turns. So does the wardrobe. Reach for depth.',picks:[{n:'Khamrah',h:'/products/khamrah'},{n:'Dahaab Safi',h:'/products/dahaab-safi'},{n:'Rose 01',h:'/products/rose-01'}]}
  ];
  var s=seasons.find(function(s){return s.months.indexOf(m)>-1;})||seasons[0];
  var tag=document.getElementById('seTag'),line=document.getElementById('seLine'),picks=document.getElementById('sePicks');
  if(tag)tag.textContent=s.tag;
  if(line)line.textContent=s.line;
  if(picks)picks.innerHTML=s.picks.map(function(p){return '<a class="se-pick" href="'+p.h+'">'+p.n+' &rarr;</a>';}).join('');
})();

function showUpgrade(val){
  var r=document.getElementById('upgradeResult');
  if(!val){r.style.display='none';return;}
  var d=UPGRADES[val];if(!d){r.style.display='none';return;}
  document.getElementById('urName').textContent=d.name;
  document.getElementById('urWhy').textContent=d.why;
  document.getElementById('urThem').textContent=d.them;
  document.getElementById('urUs').textContent=d.us;
  var cta=document.getElementById('urCta');cta.href=d.href;cta.textContent='Try the '+d.name+' Decant →';
  r.style.display='block';
}




/* Language handling now uses Shopify Markets/localized pages instead of client-side auto translation. */

