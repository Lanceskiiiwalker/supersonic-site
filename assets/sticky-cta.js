/* Sounding Sonics sticky "Try free / Buy" bar, shared by every page.
 *
 * Add one line before </body>:
 *   Product page:
 *     <script src="/assets/sticky-cta.js" data-name="Supersonic" data-price="$45"
 *       data-buy="https://...gumroad.com/l/xxx" data-try="#demo" data-try-label="Play it free"
 *       data-color="var(--text)" data-ink="var(--app)" defer></script>
 *   Home / press (hub):
 *     <script src="/assets/sticky-cta.js" data-mode="hub" defer></script>
 *
 * Behaviour
 *  - Instagram visitors (Instagram in-app browser, utm_source=ig/instagram, fbclid, or
 *    an instagram.com referrer) see the bar straight away; everyone else after a short scroll.
 *  - On a product page it shows the plugin name, price, a "Try free" button that jumps to the
 *    in-browser demo, and a Buy button that opens Gumroad.
 *  - While the demo is on screen the bar shrinks to a small Buy pill so it never covers the
 *    synth keys or knobs. It hides at the final Buy section and the footer.
 *  - UTM tags from the ad link are passed on to every Gumroad link, so Gumroad's analytics can
 *    show which sales came from the Instagram ad.
 */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var d = me.dataset;
  var hub = d.mode === 'hub';

  /* ---------- who is this visitor ---------- */
  var q = new URLSearchParams(location.search);
  var src = (q.get('utm_source') || '').toLowerCase();
  var fromIG = /instagram/i.test(navigator.userAgent) || /^(ig|instagram|facebook|fb|meta)$/.test(src) ||
    q.has('fbclid') || /instagram\.com|facebook\.com/.test(document.referrer);
  try {
    if (fromIG) sessionStorage.setItem('ss_ig', '1');
    else if (sessionStorage.getItem('ss_ig')) fromIG = true;
  } catch (e) {}

  /* ---------- carry ad tags through to Gumroad ---------- */
  var utm = {};
  try { utm = JSON.parse(sessionStorage.getItem('ss_utm') || '{}'); } catch (e) {}
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
    if (q.get(k)) utm[k] = q.get(k);
  });
  try { sessionStorage.setItem('ss_utm', JSON.stringify(utm)); } catch (e) {}
  function tag(url) {
    if (!url || !/gumroad\.com/.test(url)) return url;
    try {
      var u = new URL(url);
      Object.keys(utm).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, utm[k]); });
      return u.toString();
    } catch (e) { return url; }
  }
  function tagLinks() {
    document.querySelectorAll('a[href*="gumroad.com"]').forEach(function (a) { a.href = tag(a.href); });
  }

  /* ---------- styles ---------- */
  var css = '' +
    '.ssbar{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:40;' +
      'transform:translate(-50%,140%);transition:transform .35s cubic-bezier(.2,.8,.2,1),opacity .25s;opacity:0;' +
      'width:min(640px,calc(100% - 20px));box-sizing:border-box;display:flex;align-items:center;gap:10px;' +
      'padding:9px 9px 9px 16px;border-radius:16px;background:rgba(14,14,16,.9);color:#F3F3F4;' +
      'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12);' +
      'box-shadow:0 12px 40px rgba(0,0,0,.5);font:500 14px/1.25 Inter,"Inter Tight",system-ui,-apple-system,sans-serif;letter-spacing:0}' +
    '.ssbar.on{transform:translate(-50%,0);opacity:1}' +
    '.ssbar .ss-txt{flex:1;min-width:0}' +
    '.ssbar .ss-txt b{display:block;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.ssbar .ss-txt small{display:block;color:#A9A9B2;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.ssbar a{display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;text-decoration:none;' +
      'font-weight:700;font-size:14px;padding:11px 16px;border-radius:12px;min-height:44px;box-sizing:border-box;' +
      'text-transform:none;letter-spacing:0;font-family:inherit;transition:filter .15s,transform .05s}' +
    '.ssbar a:active{transform:scale(.97)}' +
    '.ssbar .ss-try{color:#F3F3F4;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18)}' +
    '.ssbar .ss-buy{background:' + (d.color || '#8B7CFF') + ';color:' + (d.ink || '#0E0E10') + '}' +
    '.ssbar .ss-buy:hover,.ssbar .ss-try:hover{filter:brightness(1.1)}' +
    '.ssbar .ss-try i{width:0;height:0;border-left:8px solid currentColor;border-top:5px solid transparent;border-bottom:5px solid transparent}' +
    /* compact pill while the demo is on screen */
    '.ssbar.mini{width:auto;left:auto;right:calc(12px + env(safe-area-inset-right,0px));transform:translate(0,0);padding:6px;border-radius:999px}' +
    '.ssbar.mini .ss-txt,.ssbar.mini .ss-try{display:none}' +
    '.ssbar.mini a{border-radius:999px;padding:10px 16px}' +
    '.ssbar.mini:not(.on){transform:translate(0,140%)}' +
    /* hub: three plugin chips */
    '.ssbar .ss-chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}' +
    '.ssbar .ss-chips::-webkit-scrollbar{display:none}' +
    '.ssbar .ss-chips a{padding:9px 12px;font-size:13px;flex-direction:column;gap:1px;line-height:1.1;min-height:44px;' +
      'background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#F3F3F4}' +
    '.ssbar .ss-chips a span{font-weight:500;font-size:11px;color:#A9A9B2}' +
    '.ssbar .ss-chips a:first-child{background:#8B7CFF;border-color:#8B7CFF;color:#0E0E10}' +
    '.ssbar .ss-chips a:first-child span{color:rgba(14,14,16,.7)}' +
    '.ssbar .ss-x{background:none;border:0;color:#A9A9B2;font-size:20px;line-height:1;padding:6px;cursor:pointer;margin-left:-4px}' +
    'html.ss-has-bar .toast{bottom:calc(92px + env(safe-area-inset-bottom,0px))!important}' +
    '@media (max-width:520px){.ssbar{padding:8px 8px 8px 12px;gap:8px}.ssbar .ss-txt small{display:none}' +
      '.ssbar a{padding:10px 12px;font-size:13.5px}.ssbar.hubbar .ss-txt{display:none}' +
      '.ssbar.hubbar{padding:6px;gap:4px}.ssbar .ss-chips{flex:1;gap:5px}.ssbar .ss-chips a{flex:1;padding:7px 4px;font-size:12.5px;min-width:0}' +
      '.ssbar .ss-chips a span{font-size:10.5px}.ssbar .ss-x{padding:4px;margin:0}}' +
    '@media (prefers-reduced-motion:reduce){.ssbar{transition:none}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  var bar = document.createElement('div');
  bar.className = 'ssbar' + (hub ? ' hubbar' : '');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', hub ? 'Try a plugin' : 'Buy ' + d.name);

  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  if (hub) {
    bar.innerHTML =
      '<div class="ss-txt"><b>Try free in your browser</b><small>No download, no signup</small></div>' +
      '<div class="ss-chips">' +
        '<a href="/supersonic/#demo">Supersonic<span>Synth · $45</span></a>' +
        '<a href="/dubcassette/#demo">Dubcassette<span>Tape echo · $60</span></a>' +
        '<a href="/machmaster/#demo">Machmaster<span>Mastering · $90</span></a>' +
      '</div>' +
      '<button class="ss-x" type="button" aria-label="Hide">×</button>';
  } else {
    bar.innerHTML =
      '<div class="ss-txt"><b>' + esc(d.name) + ' · ' + esc(d.price) + '</b><small>' + esc(d.note || 'Try it free first · Pay once, yours to keep') + '</small></div>' +
      (d.try ? '<a class="ss-try" href="' + esc(d.try) + '"><i aria-hidden="true"></i>' + esc(d.tryLabel || 'Try free') + '</a>' : '') +
      '<a class="ss-buy" href="' + esc(tag(d.buy)) + '" target="_blank" rel="noopener">Buy ' + esc(d.price) + '</a>';
  }
  document.body.appendChild(bar);

  var dismissed = false;
  var x = bar.querySelector('.ss-x');
  if (x) x.addEventListener('click', function () { dismissed = true; update(); });

  /* smooth scroll for the Try button, and start the demo's hint if it has one */
  var tryBtn = bar.querySelector('.ss-try');
  if (tryBtn) tryBtn.addEventListener('click', function (e) {
    var t = document.querySelector(d.try);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', d.try);
  });

  /* ---------- when to show ---------- */
  var demo = d.try ? document.querySelector(d.try) : null;
  var hideAt = [];
  (d.hide || (hub ? '#plugins,body > footer' : '#buy,body > footer')).split(',').forEach(function (s) {
    document.querySelectorAll(s.trim()).forEach(function (el) { hideAt.push(el); });
  });
  var demoVisible = false, hideVisible = new Set();

  if ('IntersectionObserver' in window) {
    if (demo) new IntersectionObserver(function (es) {
      es.forEach(function (e) { demoVisible = e.isIntersecting; });
      update();
    }, { rootMargin: '-35% 0px -35% 0px' }).observe(demo);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) hideVisible.add(e.target); else hideVisible.delete(e.target); });
      update();
    }, { rootMargin: '0px 0px -15% 0px' });
    hideAt.forEach(function (el) { io.observe(el); });
  }

  var scrolled = false;
  function onScroll() {
    var s = window.scrollY > Math.min(window.innerHeight * 0.35, 280);
    if (s !== scrolled) { scrolled = s; update(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function update() {
    var show = !dismissed && (fromIG || scrolled) && hideVisible.size === 0;
    if (!hub) bar.classList.toggle('mini', demoVisible);
    bar.classList.toggle('on', show);
    document.documentElement.classList.toggle('ss-has-bar', show);
  }

  tagLinks();
  // page scripts set Gumroad hrefs on load, so tag again after them
  window.addEventListener('load', tagLinks);
  onScroll();
  setTimeout(update, fromIG ? 600 : 0);
})();
