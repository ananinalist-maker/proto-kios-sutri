/* KIOS · prototipo negozio online: header, footer, carrello e pagine. */
(function () {
  const DATA = window.KIOS_DATA;
  const WA_NUM = "393205542737";
  const FREE_SHIP = 79;
  const SHIP = { "ritiro-64": 0, "ritiro-62": 0, locale: 3.9, corriere: 6.9 };
  const MIRROR = new Set(["pelliccia-alamari", "pelliccia", "maxi-maglione"]);

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const eur = (n) => n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
  const img = (name) => "img/" + name + ".webp";
  const byId = (id) => DATA.products.find((p) => p.id === id);
  const wa = (text) => "https://wa.me/" + WA_NUM + "?text=" + encodeURIComponent(text);
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const params = new URLSearchParams(location.search);
  const sizeKeys = (p) => {
    const k = Object.keys(p.sizes);
    return k.every((x) => /^\d+$/.test(x)) ? k.sort((a, b) => a - b) : k;
  };
  const inStock = (p, s) => (p.sizes[s] || 0) > 0;
  const firstSize = (p) => sizeKeys(p).find((s) => inStock(p, s));
  const catName = (p) => (DATA.cats[p.world].find((c) => c[0] === p.cat) || [, ""])[1];

  const I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h18M3 12h14M3 17h18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 10v10h16V10M3 10l2-6h14l2 6H3Z"/><path d="M9.5 20v-5h5v5"/></svg>',
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
    ret: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 9h11a5 5 0 0 1 0 10H9"/><path d="M8 5 4 9l4 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6.5 3.5h3l1.5 4-2 1.2a11 11 0 0 0 6.3 6.3l1.2-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3.5" y="8.5" width="17" height="4"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5S9 3.5 7 5s1 3.5 5 3.5Zm0 0s3-5 5-3.5-1 3.5-5 3.5Z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.1 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.7 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3Z"/></svg>'
  };

  let gid = 0;
  function emblem() {
    const g = "kg" + ++gid;
    return `<svg class="emblem" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efd9c7"/><stop offset=".5" stop-color="#cba891"/><stop offset="1" stop-color="#9f7861"/></linearGradient></defs><g fill="none" stroke="url(#${g})" stroke-width="2.4"><rect x="21" y="21" width="58" height="58"/><rect x="21" y="21" width="58" height="58" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="19"/></g><text x="50" y="58.5" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="25" font-weight="600" fill="url(#${g})">K</text></svg>`;
  }
  function mono(letter = "E") {
    const g = "mg" + ++gid;
    return `<svg class="mono" viewBox="0 0 60 60" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efd9c7"/><stop offset="1" stop-color="#a47d66"/></linearGradient></defs><circle cx="30" cy="30" r="29" fill="#121110"/><circle cx="30" cy="30" r="25" fill="none" stroke="url(#${g})" stroke-width="1"/><text x="30" y="39" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="28" font-weight="600" fill="url(#${g})">${letter}</text></svg>`;
  }
  const logo = (kids) => `<a class="logo" href="index.html" aria-label="KIOS, home">${emblem()}<span class="word">KIOS</span>${kids ? '<span class="kids-word">Kids</span>' : ""}</a>`;

  /* ---------- storage + cart ---------- */
  const mem = {};
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return mem[k] || null; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const Cart = {
    items() { return (store.get("kios_cart_v1") || []).filter((i) => byId(i.id)); },
    save(list) { store.set("kios_cart_v1", list); updateBadge(); },
    add(id, size, qty = 1, note = "") {
      const list = Cart.items();
      const hit = list.find((i) => i.id === id && i.size === size && (i.note || "") === note);
      if (hit) hit.qty += qty; else list.push({ id, size, qty, note });
      Cart.save(list);
    },
    setQty(idx, qty) { const l = Cart.items(); if (!l[idx]) return; l[idx].qty = Math.max(1, Math.min(9, qty)); Cart.save(l); },
    remove(idx) { const l = Cart.items(); l.splice(idx, 1); Cart.save(l); },
    clear() { Cart.save([]); },
    count() { return Cart.items().reduce((a, i) => a + i.qty, 0); },
    total() { return Cart.items().reduce((a, i) => a + byId(i.id).price * i.qty, 0); }
  };
  function updateBadge() {
    $$(".cart-count").forEach((b) => { const n = Cart.count(); b.textContent = n; b.classList.toggle("on", n > 0); });
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg, href, label) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = I.check + "<span>" + msg + "</span>" + (href ? `<a href="${href}">${label}</a>` : "");
    requestAnimationFrame(() => t.classList.add("on"));
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3600);
  }

  /* ---------- chrome: bars, header, drawer, search, footer ---------- */
  function chrome(opt = {}) {
    const top = document.createElement("div");
    top.innerHTML = `
      <div class="proto-strip">Prototipo per KIOS · prezzi indicativi</div>
      ${opt.checkout ? "" : `<div class="promo" aria-label="Vantaggi"><div class="promo-track">${"<span>Spedizione gratuita da 79 €</span><span>Ritiro gratis in negozio a Sutri</span><span>Paga in 3 rate senza interessi</span><span>Reso entro 14 giorni</span>".repeat(2)}</div></div>`}`;
    document.body.prepend(...top.children);

    const header = document.createElement("header");
    if (opt.checkout) {
      header.className = "co-header";
      header.innerHTML = `<div class="bar"><a class="small" href="carrello.html">← Carrello</a>${logo()}<span class="secure">${I.lock}Pagamento sicuro</span></div>`;
      $(".proto-strip").after(header);
    } else {
      header.className = "site-header";
      header.innerHTML = `<div class="bar">
        <div class="left"><button class="icon-btn burger" aria-label="Apri il menu">${I.menu}</button>
          <nav class="nav-desktop"><a href="donna.html">Donna</a><a href="kids.html">Kids</a><a href="lista-nascita.html">Lista nascita</a></nav></div>
        ${logo(opt.world === "kids")}
        <div class="right"><nav class="nav-desktop" style="margin-right:12px"><a href="negozi.html">I nostri negozi</a></nav>
          <button class="icon-btn search-btn" aria-label="Cerca">${I.search}</button>
          <a class="icon-btn" href="carrello.html" aria-label="Carrello">${I.bag}<span class="cart-count"></span></a></div></div>`;
      (opt.checkout ? $(".proto-strip") : $(".promo")).after(header);
      drawer(opt.world);
      search();
    }
    footer(opt.checkout);
    $$("[data-i]").forEach((e) => (e.outerHTML = I[e.dataset.i] || ""));
    updateBadge();

    if (opt.home) {
      document.body.classList.add("home");
      const hero = $(".hero");
      const setTop = () => { const h = $(".proto-strip").offsetHeight + $(".promo").offsetHeight; document.documentElement.style.setProperty("--topbars", h + "px"); };
      setTop(); addEventListener("resize", setTop);
      const io = new IntersectionObserver(([e]) => header.classList.toggle("over", e.isIntersecting), { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 2}px 0px 0px 0px`, threshold: 0.06 });
      if (hero) { header.classList.add("over"); io.observe(hero); }
      const slides = $$(".hero-slides img"), dots = $$(".hero-dots i");
      let k = 0;
      const show = (i) => { slides.forEach((s, j) => s.classList.toggle("on", j === i)); dots.forEach((d, j) => d.classList.toggle("on", j === i)); };
      show(0);
      if (slides.length > 1) setInterval(() => { k = (k + 1) % slides.length; show(k); }, 6000);
    }
    reveal();
  }

  function drawer(world) {
    const d = document.createElement("div");
    const donna = DATA.cats.donna.map(([k, n]) => `<li><a href="donna.html?cat=${k}">${n}</a></li>`).join("");
    const kids = DATA.cats.kids.map(([k, n]) => `<li><a href="kids.html?cat=${k}#catalogo">${n}</a></li>`).join("");
    d.innerHTML = `<div class="scrim"></div>
      <aside class="drawer" aria-label="Menu">
        <div class="drawer-head">${logo()}<button class="icon-btn close-drawer" aria-label="Chiudi">${I.close}</button></div>
        <div class="drawer-tabs"><button data-t="donna" class="${world === "kids" ? "" : "on"}">DONNA</button><button data-t="kids" class="${world === "kids" ? "on" : ""}">KIDS</button></div>
        <div class="drawer-body">
          <ul class="drawer-list" data-p="donna" ${world === "kids" ? "hidden" : ""}>
            <li><a href="donna.html">Tutto Donna <small>38–52</small></a></li>${donna}
            <li><a href="donna.html?taglia=46,48,50,52">Taglie 46–52 <small>curvy</small></a></li>
            <li><a href="index.html#look">Il look della settimana</a></li></ul>
          <ul class="drawer-list" data-p="kids" ${world === "kids" ? "" : "hidden"}>
            <li><a href="kids.html">Tutto Kids <small>0–14 anni</small></a></li>${kids}
            <li><a href="lista-nascita.html">Lista nascita <small>online</small></a></li>
            <li><a href="kids.html#marchi">Marchi</a></li></ul>
          <ul class="drawer-list minor">
            <li><a href="info.html#gift-card">Gift card</a></li>
            <li><a href="negozi.html">I nostri negozi a Sutri</a></li>
            <li><a href="info.html#spedizioni">Spedizioni e resi</a></li>
            <li><a href="info.html#taglie">Guida alle taglie</a></li></ul>
        </div>
        <div class="drawer-foot"><a class="btn btn-wa btn-block" href="${wa("Ciao! Ho una domanda sul negozio online.")}" target="_blank" rel="noopener">${I.wa}Scrivici su WhatsApp</a>
          Viale G. Marconi 62 e 64, Sutri (VT)</div>
      </aside>`;
    document.body.append(...d.children);
    const open = () => { $(".drawer").classList.add("on"); $(".scrim").classList.add("on"); document.body.classList.add("no-scroll"); };
    const close = () => { $(".drawer").classList.remove("on"); $(".scrim").classList.remove("on"); $(".search-panel")?.classList.remove("on"); document.body.classList.remove("no-scroll"); };
    $(".burger").addEventListener("click", open);
    $(".close-drawer").addEventListener("click", close);
    $(".scrim").addEventListener("click", close);
    $$(".drawer-tabs button").forEach((b) => b.addEventListener("click", () => {
      $$(".drawer-tabs button").forEach((x) => x.classList.toggle("on", x === b));
      $$(".drawer-list[data-p]").forEach((l) => (l.hidden = l.dataset.p !== b.dataset.t));
    }));
    $$(".drawer a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  }

  function search() {
    const s = document.createElement("div");
    s.className = "search-panel";
    s.innerHTML = `<div class="search-row">${I.search}<input type="search" placeholder="Cerca: cappotto, maglione, Mayoral…" aria-label="Cerca"><button class="icon-btn close-search" aria-label="Chiudi">${I.close}</button></div><div class="search-results"></div>`;
    document.body.appendChild(s);
    const input = $("input", s), out = $(".search-results", s);
    const render = () => {
      const q = norm(input.value.trim());
      const hits = DATA.products.filter((p) => (q || !p.look) && (!q || norm([p.name, p.brand, catName(p), p.color, p.world].join(" ")).includes(q))).slice(0, 8);
      out.innerHTML = (q ? "" : '<p class="small">Più cercati</p>') + hits.map((p) => `<a class="search-hit" href="prodotto.html?id=${p.id}"><img src="${img(p.img[0])}" alt="" style="object-position:${p.pos}"><span><b>${p.name}</b><span class="small">${eur(p.price)} · ${catName(p)}</span></span></a>`).join("") + (hits.length ? "" : '<p class="small">Nessun risultato. Prova con «maglione» o «Petit Bateau».</p>');
    };
    input.addEventListener("input", render);
    $(".search-btn").addEventListener("click", () => { s.classList.add("on"); $(".scrim").classList.add("on"); render(); setTimeout(() => input.focus(), 300); });
    $(".close-search", s).addEventListener("click", () => { s.classList.remove("on"); $(".scrim").classList.remove("on"); });
  }

  function footer(checkout) {
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `<div class="wrap">
      ${logo()}
      <p class="foot-intro">Abbigliamento e accessori donna, taglie dalla 38 alla 52. Accanto, KIOS Kids: abbigliamento da 0 a 14 anni. Viale Guglielmo Marconi 62 e 64, Sutri (VT).</p>
      ${checkout ? "" : `<div class="foot-cols">
        <div><h4>Negozio</h4><ul><li><a href="donna.html">Donna</a></li><li><a href="kids.html">Kids</a></li><li><a href="lista-nascita.html">Lista nascita</a></li><li><a href="info.html#gift-card">Gift card</a></li><li><a href="negozi.html">I nostri negozi</a></li></ul></div>
        <div><h4>Aiuto</h4><ul><li><a href="info.html#spedizioni">Spedizioni e resi</a></li><li><a href="info.html#taglie">Guida alle taglie</a></li><li><a href="info.html#pagamenti">Pagamenti</a></li><li><a href="negozi.html#contatti">Contatti</a></li></ul></div>
        <div><h4>Seguici</h4><ul><li><a href="https://www.instagram.com/kios_sanna_/" target="_blank" rel="noopener">Instagram KIOS</a></li><li><a href="https://www.instagram.com/kios_kids_/" target="_blank" rel="noopener">Instagram KIOS Kids</a></li><li><a href="${wa("Ciao! Vorrei entrare nel gruppo delle novità.")}" target="_blank" rel="noopener">WhatsApp 320 554 2737</a></li></ul></div>
        <div><h4>Note legali</h4><ul><li><a href="info.html#condizioni">Condizioni di vendita</a></li><li><a href="info.html#privacy">Privacy e cookie</a></li><li><a class="recede" href="info.html#recesso">Recedi dal contratto</a></li></ul></div>
      </div>`}
      <div class="pay"><span>VISA</span><span>Mastercard</span><span>Maestro</span><span>PayPal · 3 rate</span><span>Apple Pay</span><span>Google Pay</span></div>
      <div class="legal"><span>© 2026 KIOS · Sutri (VT) · Ragione sociale e P.IVA: da inserire</span>
      <span class="proto">Prototipo realizzato per KIOS: non è un negozio attivo, i prezzi sono indicativi e nessun pagamento è reale.</span></div></div>`;
    document.body.appendChild(f);
  }

  function reveal() {
    const els = $$(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- product card ---------- */
  function card(p, opt = {}) {
    const keys = sizeKeys(p);
    const tags = (p.novita ? '<span class="tag">Novità</span>' : "") + (p.ultimo ? '<span class="tag last">Ultimo pezzo</span>' : "");
    const sizes = keys.length > 1 && p.world === "donna"
      ? `<div class="pcard-sizes">${keys.map((s) => `<span class="${inStock(p, s) ? "" : "off"} ${opt.hit && opt.hit.includes(s) && inStock(p, s) ? "hit" : ""}">${s}</span>`).join("")}</div>` : "";
    const note = p.world === "kids" ? `<div class="pcard-note">${keys.length > 1 ? keys[0] + " – " + keys[keys.length - 1] : "Taglia unica"}</div>` : "";
    return `<a class="pcard" href="prodotto.html?id=${p.id}">
      <div class="pcard-media"><img src="${img(p.img[0])}" alt="${p.name}" loading="lazy" style="object-position:${p.pos}">${tags}</div>
      <div class="pcard-body">${p.brand ? `<div class="pcard-brand">${p.brand}</div>` : ""}<div class="pcard-name">${p.name}</div>
      <div class="pcard-price">${eur(p.price)}<span class="ind">prezzo indicativo</span></div>${sizes}${note}</div></a>`;
  }

  /* ---------- size guide ---------- */
  function sizeGuide(world) {
    let sh = $("#size-guide");
    if (!sh) {
      sh = document.createElement("div");
      sh.className = "sheet"; sh.id = "size-guide";
      const rows = [[38, 84, 66, 90], [40, 88, 70, 94], [42, 92, 74, 98], [44, 96, 78, 102], [46, 100, 82, 106], [48, 104, 86, 110], [50, 108, 90, 114], [52, 112, 94, 118]];
      const kids = [["1 mese", "56"], ["3 mesi", "62"], ["6 mesi", "68"], ["12 mesi", "80"], ["18 mesi", "86"], ["2 anni", "92"], ["4 anni", "104"], ["6 anni", "116"], ["8 anni", "128"], ["10 anni", "140"], ["12 anni", "152"], ["14 anni", "164"]];
      sh.innerHTML = `<div class="grab"></div><div class="sheet-head"><div><p class="eyebrow">Guida alle taglie</p><h3>${world === "kids" ? "Taglie per età" : "Dalla 38 alla 52"}</h3></div><button class="icon-btn" data-close aria-label="Chiudi">${I.close}</button></div>
        ${world === "kids" ? `<table class="sizes"><tr><th>Taglia</th><th>Altezza (cm)</th></tr>${kids.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table>`
          : `<table class="sizes"><tr><th>Taglia</th><th>Seno</th><th>Vita</th><th>Fianchi</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("")}</table>`}
        <p class="small">Misure indicative in centimetri. Ogni marca veste in modo diverso: per questo su ogni capo trovi il consiglio di Eleonora. Hai un dubbio? <a href="${wa("Ciao! Mi aiuti con la taglia?")}" target="_blank" rel="noopener" style="border-bottom:1px solid">Scrivici su WhatsApp</a>.</p>`;
      document.body.appendChild(sh);
      $("[data-close]", sh).addEventListener("click", () => closeSheet(sh));
    }
    openSheet(sh);
  }
  function openSheet(sh) { ensureScrim(); sh.classList.add("on"); $(".scrim").classList.add("on"); document.body.classList.add("no-scroll"); $(".scrim").onclick = () => closeSheet(sh); }
  function closeSheet(sh) { sh.classList.remove("on"); $(".scrim").classList.remove("on"); document.body.classList.remove("no-scroll"); $(".scrim").onclick = null; }
  function ensureScrim() { if (!$(".scrim")) { const s = document.createElement("div"); s.className = "scrim"; document.body.appendChild(s); } }

  /* ---------- look sheet ---------- */
  function lookSheet() {
    const items = DATA.look.items.map(byId);
    let sh = $("#look-sheet");
    if (!sh) {
      sh = document.createElement("div"); sh.className = "sheet"; sh.id = "look-sheet";
      document.body.appendChild(sh);
    }
    const chosen = {};
    items.forEach((p) => { if (sizeKeys(p).length === 1) chosen[p.id] = sizeKeys(p)[0]; });
    const total = items.reduce((a, p) => a + p.price, 0);
    sh.innerHTML = `<div class="grab"></div><div class="sheet-head"><div><p class="eyebrow">Il look della settimana</p><h3>${DATA.look.title}</h3></div><button class="icon-btn" data-close aria-label="Chiudi">${I.close}</button></div>
      ${items.map((p) => `<div class="sheet-item" data-id="${p.id}"><div class="top"><b>${p.name}</b><span>${eur(p.price)}</span></div>
        <div class="mini-sizes">${sizeKeys(p).map((s) => `<button class="${inStock(p, s) ? "" : "off"} ${chosen[p.id] === s ? "on" : ""}" data-s="${s}">${s}</button>`).join("")}</div></div>`).join("")}
      <p class="size-msg" id="look-msg"></p>
      <button class="btn btn-ink btn-block" id="look-add">Aggiungi i 4 capi · ${eur(total)}</button>
      <p class="small" style="text-align:center;margin-top:10px">o 3 rate da ${eur(total / 3)} con PayPal · prezzi indicativi</p>`;
    $$(".sheet-item", sh).forEach((row) => $$(".mini-sizes button", row).forEach((b) => b.addEventListener("click", () => {
      $$(".mini-sizes button", row).forEach((x) => x.classList.toggle("on", x === b)); chosen[row.dataset.id] = b.dataset.s;
    })));
    $("[data-close]", sh).addEventListener("click", () => closeSheet(sh));
    $("#look-add", sh).addEventListener("click", () => {
      const miss = items.filter((p) => !chosen[p.id]);
      if (miss.length) { $("#look-msg").textContent = "Scegli la taglia per: " + miss.map((p) => p.name.toLowerCase()).join(", "); return; }
      items.forEach((p) => Cart.add(p.id, chosen[p.id]));
      closeSheet(sh); toast("Look aggiunto al carrello", "carrello.html", "Vai al carrello");
    });
    openSheet(sh);
  }

  /* ---------- pages ---------- */
  const pages = {};

  pages.home = function () {
    const nov = DATA.products.filter((p) => p.world === "donna" && p.novita).slice(0, 8);
    $("#novita").innerHTML = nov.map((p) => card(p)).join("");
    const look = DATA.look.items.map(byId);
    const total = look.reduce((a, p) => a + p.price, 0);
    $("#look-list").innerHTML = look.map((p) => `<li><a href="prodotto.html?id=${p.id}">${p.name}<small>${p.brand ? p.brand + " · " : ""}${p.color || "Taglia unica"}</small></a><span class="p">${eur(p.price)}</span></li>`).join("");
    $("#look-total").innerHTML = `<span>Tutto il look<span class="ind">prezzi indicativi</span></span><b>${eur(total)}</b>`;
    $("#look-btn").addEventListener("click", lookSheet);
    $("#reviews").innerHTML = DATA.reviews.map((r) => `<figure class="review"><p>${r.text}</p><b>${r.name}</b><small>${r.src}</small></figure>`).join("");
    $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
    $("#news-form")?.addEventListener("submit", (e) => { e.preventDefault(); toast("Iscrizione di prova: nel sito vero arriva la mail di benvenuto"); });
  };

  pages.donna = function () {
    const all = DATA.products.filter((p) => p.world === "donna" && !p.look);
    const state = {
      cat: params.get("cat") || "",
      sizes: (params.get("taglia") || "").split(",").filter(Boolean),
      sort: "novita"
    };
    $("#cats").innerHTML = `<button class="chip" data-c="">Tutto</button>` + DATA.cats.donna.map(([k, n]) => `<button class="chip" data-c="${k}">${n}</button>`).join("");
    $("#sizes").innerHTML = [38, 40, 42, 44, 46, 48, 50, 52].map((s) => `<button class="sz" data-s="${s}" aria-pressed="false">${s}</button>`).join("");
    const render = () => {
      $$("#cats .chip").forEach((c) => c.classList.toggle("on", c.dataset.c === state.cat));
      $$("#sizes .sz").forEach((b) => { const on = state.sizes.includes(b.dataset.s); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
      let list = all.filter((p) => !state.cat || (state.cat === "novita" ? p.novita : state.cat === "ultimi" ? p.ultimo : p.cat === state.cat));
      if (state.sizes.length) list = list.filter((p) => p.sizes.Unica || state.sizes.some((s) => inStock(p, s)));
      if (state.sort === "asc") list.sort((a, b) => a.price - b.price);
      if (state.sort === "desc") list.sort((a, b) => b.price - a.price);
      const title = state.cat ? (DATA.cats.donna.find((c) => c[0] === state.cat) || [, "Donna"])[1] : "Donna";
      $("#title").innerHTML = title === "Donna" ? 'Donna, <em class="g">dalla 38 alla 52</em>' : title;
      $("#count").textContent = list.length + (list.length === 1 ? " capo" : " capi") + (state.sizes.length ? " nella " + state.sizes.join(", ") : "");
      $("#reset").hidden = !state.sizes.length && !state.cat;
      const cards = list.map((p) => card(p, { hit: state.sizes }));
      if (cards.length > 4) cards.splice(4, 0, `<div class="help-card">${mono()}<div><b>Non sai la taglia?</b><p>Scrivici su WhatsApp: ti diciamo come veste il capo, poi ordini qui.</p><a href="${wa("Ciao! Mi aiuti a scegliere la taglia?")}" target="_blank" rel="noopener">Chiedi a Eleonora</a></div></div>`);
      $("#grid").innerHTML = cards.join("") || `<div class="empty"><p>In questa taglia non c'è niente in questa categoria.</p><a class="link" href="${wa("Ciao! Cerco un capo nella mia taglia.")}" target="_blank" rel="noopener">Scrivici: lo cerchiamo noi</a></div>`;
      const q = new URLSearchParams();
      if (state.cat) q.set("cat", state.cat);
      if (state.sizes.length) q.set("taglia", state.sizes.join(","));
      history.replaceState(null, "", "donna.html" + (q.toString() ? "?" + q : ""));
    };
    $("#cats").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; state.cat = c.dataset.c; render(); });
    $("#sizes").addEventListener("click", (e) => { const b = e.target.closest(".sz"); if (!b) return; const s = b.dataset.s; state.sizes = state.sizes.includes(s) ? state.sizes.filter((x) => x !== s) : [...state.sizes, s]; render(); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    $("#reset").addEventListener("click", () => { state.sizes = []; state.cat = ""; render(); });
    render();
    const active = $("#cats .chip.on"); if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
  };

  pages.product = function () {
    const p = byId(params.get("id")) || DATA.products[0];
    const keys = sizeKeys(p);
    const kids = p.world === "kids";
    document.title = p.name + " · KIOS Sutri";
    if (kids) { $(".site-header .logo").outerHTML = logo(true); }
    let size = keys.length === 1 && inStock(p, keys[0]) ? keys[0] : null;
    const figs = p.img.map((n, i) => `<figure><img src="${img(n)}" alt="${p.name}" style="object-position:${p.pos}" ${i ? 'loading="lazy"' : ""}>${i === 0 && MIRROR.has(p.id) ? "<figcaption>Provato in negozio</figcaption>" : ""}${i === 1 ? "<figcaption>Sulla stampella</figcaption>" : ""}</figure>`).join("");
    const shop = kids ? "KIOS Kids, Viale G. Marconi 62" : "KIOS, Viale G. Marconi 64";
    $("#pdp").innerHTML = `
      <div class="gallery"><div class="gallery-track">${figs}</div>${p.img.length > 1 ? `<div class="gallery-dots">${p.img.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}</div>
      <div class="pdp-info">
        <div class="crumbs"><a href="${kids ? "kids.html" : "donna.html"}">${kids ? "Kids" : "Donna"}</a><span>/</span><a href="${kids ? "kids.html?cat=" + p.cat + "#catalogo" : "donna.html?cat=" + p.cat}">${catName(p)}</a></div>
        ${p.brand ? `<div class="pdp-brand">${p.brand}</div>` : ""}
        <h1>${p.name}</h1>
        <div class="pdp-price"><b>${eur(p.price)}</b><span class="pill">prezzo indicativo</span></div>
        <div class="rate">o 3 rate da <b>${eur(p.price / 3)}</b> senza interessi con PayPal</div>
        ${p.color ? `<div class="pdp-color"><span>Colore:</span> ${p.color}</div>` : ""}
        <div class="size-head"><b>TAGLIA</b>${keys.length > 1 ? '<button id="guide">Guida alle taglie</button>' : ""}</div>
        <div class="size-pick ${kids ? "kids" : ""}" id="pick">${keys.map((s) => {
          const q = p.sizes[s];
          return `<button class="${q ? "" : "off"} ${q === 1 ? "last" : ""} ${size === s ? "on" : ""}" data-s="${s}" aria-label="Taglia ${s}${q ? "" : ", esaurita"}">${s}${q === 1 ? "<small>ultimo</small>" : ""}</button>`;
        }).join("")}</div>
        <div class="size-msg" id="size-msg"></div>
        <div class="notify" id="notify"><p>La <b id="nsize"></b> è finita. Ti scriviamo quando torna?</p><form><input type="email" placeholder="La tua email" aria-label="Email"><button class="btn btn-ink" type="submit">Avvisami</button></form></div>
        <div class="consiglia">${mono()}<div><b>ELEONORA CONSIGLIA</b><p>${DATA.fit[p.fit]}</p></div></div>
        <div class="wa-hint">${I.wa}<span>Non sai la taglia? <a href="${wa("Ciao! Che taglia mi consigli per: " + p.name + "?")}" target="_blank" rel="noopener">Scrivici su WhatsApp</a></span></div>
        <button class="btn btn-ink btn-block" id="add">${I.bag}Aggiungi al carrello</button>
        <ul class="services">
          <li>${I.truck}<span><b>Spedizione gratuita da 79 €</b> · corriere in tutta Italia</span></li>
          <li>${I.store}<span><b>Ritira gratis in negozio</b> · ${shop}, Sutri</span></li>
          <li>${I.card}<span><b>Paga in 3 rate</b> senza interessi con PayPal</span></li>
          <li>${I.ret}<span><b>Reso entro 14 giorni</b> · cambio in negozio gratuito</span></li>
        </ul>
        <details class="acc" open><summary>DESCRIZIONE</summary><div class="acc-body"><p>${p.desc}</p></div></details>
        <details class="acc"><summary>COMPOSIZIONE E CURA</summary><div class="acc-body"><p class="placeholder">Qui composizione e istruzioni di lavaggio, copiate dall'etichetta del capo.</p></div></details>
        <details class="acc"><summary>SPEDIZIONI E RESI</summary><div class="acc-body"><p>Corriere in tutta Italia: 6,90 €, gratis da 79 €. Consegna a Sutri e dintorni dal negozio. Ritiro gratuito in negozio.</p><p>Hai 14 giorni per il reso. In negozio il cambio è gratuito. <a href="info.html#spedizioni" style="border-bottom:1px solid">Tutte le condizioni</a></p></div></details>
        <details class="acc"><summary>PRODUTTORE E SICUREZZA</summary><div class="acc-body"><p class="placeholder">Nome e indirizzo del produttore (obbligatori per la vendita online, regolamento GPSR): da inserire per ogni marca.</p></div></details>
      </div>`;
    const pick = $("#pick");
    pick.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.classList.contains("off")) { $("#nsize").textContent = (kids ? "" : "taglia ") + b.dataset.s; $("#notify").classList.add("on"); return; }
      $("#notify").classList.remove("on");
      size = b.dataset.s; $$("button", pick).forEach((x) => x.classList.toggle("on", x === b)); $("#size-msg").textContent = "";
      $("#sticky-size").textContent = "Taglia " + size;
    });
    $("#notify form").addEventListener("submit", (e) => { e.preventDefault(); $("#notify").classList.remove("on"); toast("Ti avviseremo appena torna (prova)"); });
    $("#guide")?.addEventListener("click", () => sizeGuide(p.world));
    const add = () => {
      if (!size) { $("#size-msg").textContent = "Scegli la taglia"; pick.classList.remove("shake"); void pick.offsetWidth; pick.classList.add("shake"); pick.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      Cart.add(p.id, size); toast(p.name + " · " + size, "carrello.html", "Vai al carrello");
    };
    $("#add").addEventListener("click", add);
    // gallery dots
    const track = $(".gallery-track");
    track.addEventListener("scroll", () => { const i = Math.round(track.scrollLeft / track.clientWidth); $$(".gallery-dots i").forEach((d, k) => d.classList.toggle("on", k === i)); }, { passive: true });
    // sticky buy bar
    const sb = document.createElement("div");
    sb.className = "sticky-buy";
    sb.innerHTML = `<div class="meta"><b>${p.name}</b><span>${eur(p.price)} · <span id="sticky-size">${size ? "Taglia " + size : "Scegli la taglia"}</span></span></div><button class="btn btn-ink">Aggiungi</button>`;
    document.body.appendChild(sb);
    $("button", sb).addEventListener("click", add);
    new IntersectionObserver(([e]) => { const on = !e.isIntersecting && e.boundingClientRect.top < 0; sb.classList.toggle("on", on); document.body.classList.toggle("has-sticky", on); }).observe($("#add"));
    // complete the look
    const pair = (p.pair || []).map(byId).filter(Boolean);
    $("#pair").innerHTML = pair.map((x) => card(x)).join("");
    $("#pair-title").textContent = kids ? "Da abbinare" : "Completa il look";
  };

  pages.cart = function () {
    const render = () => {
      const items = Cart.items();
      const sub = Cart.total();
      const left = Math.max(0, FREE_SHIP - sub);
      if (!items.length) {
        $("#cart").innerHTML = `<div class="empty" style="padding:30px 0 10px"><p style="font-family:var(--f-display);font-size:28px;color:var(--ink);margin:0 0 8px">Il carrello è vuoto</p><p>Per la prova puoi metterci il look della settimana.</p><button class="btn btn-ink" id="demo">Aggiungi il look di prova</button></div>`;
        $("#demo").addEventListener("click", () => { DATA.look.items.forEach((id) => { const p = byId(id); Cart.add(id, p.sizes.Unica ? "Unica" : (inStock(p, "46") ? "46" : firstSize(p))); }); render(); });
        $("#cart-side").innerHTML = "";
        return;
      }
      $("#cart").innerHTML = `<div class="ship-progress">${left > 0 ? `Ti mancano <b>${eur(left)}</b> per la spedizione gratuita` : "<b>La spedizione è gratuita</b> per questo ordine"}<div class="bar"><i style="width:${Math.min(100, (sub / FREE_SHIP) * 100)}%"></i></div></div>` +
        items.map((it, i) => { const p = byId(it.id); return `<div class="line-item"><a href="prodotto.html?id=${p.id}"><img src="${img(p.img[0])}" alt="" style="object-position:${p.pos}"></a><div>
          <h3>${p.name}</h3><div class="meta">${p.brand ? p.brand + " · " : ""}Taglia ${it.size}${it.note ? "<br>" + it.note : ""}</div>
          <div class="row"><div class="qty"><button data-q="${i}" data-d="-1" aria-label="Meno">−</button><span>${it.qty}</span><button data-q="${i}" data-d="1" aria-label="Più">+</button></div><b>${eur(p.price * it.qty)}</b></div>
          <button class="remove" data-r="${i}" style="margin-top:10px">Rimuovi</button></div></div>`; }).join("");
      $("#cart-side").innerHTML = `<div class="summary"><div class="r"><span>Subtotale</span><span>${eur(sub)}</span></div>
        <div class="r"><span>Spedizione</span><span>${left > 0 ? "da 0 €, al passo successivo" : "gratis"}</span></div>
        <div class="r tot"><span>Totale</span><b>${eur(sub)}</b></div>
        <p class="small" style="margin:4px 0 14px">o 3 rate da ${eur(sub / 3)} con PayPal · prezzi indicativi</p>
        <a class="btn btn-ink btn-block" href="checkout.html">${I.lock}Vai alla cassa</a>
        <div class="ways"><div>${I.store}Ritiro gratuito in negozio a Sutri</div><div>${I.truck}Consegna a Sutri e dintorni o corriere in Italia</div><div>${I.ret}Reso entro 14 giorni, cambio in negozio gratuito</div></div></div>
        <p class="small" style="margin-top:14px">Un dubbio sulla taglia? <a href="${wa("Ciao! Ho un dubbio sul mio ordine.")}" target="_blank" rel="noopener" style="border-bottom:1px solid">Scrivici su WhatsApp</a></p>`;
    };
    $("#cart").addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]"), r = e.target.closest("[data-r]");
      if (q) { const it = Cart.items()[q.dataset.q]; Cart.setQty(+q.dataset.q, it.qty + +q.dataset.d); render(); }
      if (r) { Cart.remove(+r.dataset.r); render(); }
    });
    render();
    const ids = new Set(Cart.items().map((i) => i.id));
    $("#suggest").innerHTML = DATA.products.filter((p) => p.world === "donna" && p.novita && !ids.has(p.id)).slice(0, 6).map((p) => card(p)).join("");
  };

  pages.checkout = function () {
    let ship = "ritiro-64";
    const items = Cart.items();
    if (items.length && items.every((i) => byId(i.id).world === "kids")) ship = "ritiro-62";
    const sumHtml = () => {
      const sub = Cart.total();
      const cost = ship === "corriere" && sub >= FREE_SHIP ? 0 : SHIP[ship];
      return { sub, cost, tot: sub + cost };
    };
    const paint = () => {
      const { sub, cost, tot } = sumHtml();
      $("#co-items").innerHTML = (Cart.items().map((it) => { const p = byId(it.id); return `<div class="co-mini"><img src="${img(p.img[0])}" alt="" style="object-position:${p.pos}"><span>${p.name}<br><small class="small">Taglia ${it.size} · ${it.qty} pz${it.note ? " · " + it.note : ""}</small></span><b>${eur(p.price * it.qty)}</b></div>`; }).join("") || '<p class="small">Il carrello è vuoto: torna al <a href="donna.html" style="border-bottom:1px solid">negozio</a>.</p>') +
        `<div class="summary" style="margin-top:10px"><div class="r"><span>Subtotale</span><span>${eur(sub)}</span></div><div class="r"><span>Consegna</span><span>${cost ? eur(cost) : "gratis"}</span></div><div class="r tot"><span>Totale</span><b>${eur(tot)}</b></div></div>`;
      $("#co-total").textContent = eur(tot);
      $("#pay-btn").textContent = "Paga " + eur(tot);
      $("#rate-note").textContent = "Con PayPal anche in 3 rate da " + eur(tot / 3) + " senza interessi.";
      $("#addr").hidden = !(ship === "locale" || ship === "corriere");
    };
    $$('input[name="ship"]').forEach((r) => { r.checked = r.value === ship; r.addEventListener("change", () => { ship = r.value; markOpts(); paint(); }); });
    $$('input[name="pay"]').forEach((r) => r.addEventListener("change", () => { markOpts(); $("#card-fields").classList.toggle("on", $('input[name="pay"]:checked').value === "carta"); }));
    function markOpts() { $$(".opt").forEach((o) => o.classList.toggle("on", $("input", o).checked)); }
    markOpts(); paint();
    $("#card-fields").classList.toggle("on", $('input[name="pay"]:checked').value === "carta");
    $("#pay-btn").addEventListener("click", () => {
      if (!Cart.items().length) { toast("Il carrello è vuoto: aggiungi un capo per la prova"); return; }
      $("#proto-modal").classList.add("on");
    });
    $("#modal-ok").addEventListener("click", () => {
      const { tot } = sumHtml();
      const n = "KS-" + (1000 + Math.floor(Math.random() * 9000));
      const label = { "ritiro-64": "Ritiro gratuito · KIOS, Viale G. Marconi 64", "ritiro-62": "Ritiro gratuito · KIOS Kids, Viale G. Marconi 62", locale: "Consegna a Sutri e dintorni", corriere: "Corriere in Italia" }[ship];
      $("#proto-modal").classList.remove("on");
      $("#co-form").hidden = true;
      $("#co-done").hidden = false;
      $("#done-box").innerHTML = `<div class="r"><span>Ordine</span><b>${n}</b></div><div class="r"><span>Totale</span><b>${eur(tot)}</b></div><div class="r"><span>Consegna</span><span style="text-align:right">${label}</span></div><div class="r"><span>Pagamento</span><span>${{ carta: "Carta", applepay: "Apple Pay", googlepay: "Google Pay", paypal: "PayPal" }[$('input[name="pay"]:checked').value]}</span></div>`;
      $("#done-pickup").textContent = ship.startsWith("ritiro") ? "Ti scriviamo su WhatsApp quando il pacco è pronto in negozio: lo provi e, se serve, lo cambi subito." : "Ti mandiamo il numero di spedizione appena il pacco parte.";
      Cart.clear(); scrollTo({ top: 0, behavior: "smooth" });
    });
    $("#modal-no").addEventListener("click", () => $("#proto-modal").classList.remove("on"));
  };

  pages.kids = function () {
    const all = DATA.products.filter((p) => p.world === "kids");
    let cat = params.get("cat") || "";
    $("#kcats").innerHTML = `<button class="chip" data-c="">Tutto</button>` + DATA.cats.kids.map(([k, n]) => `<button class="chip" data-c="${k}">${n}</button>`).join("");
    const render = () => {
      $$("#kcats .chip").forEach((c) => c.classList.toggle("on", c.dataset.c === cat));
      const list = all.filter((p) => !cat || p.cat === cat);
      $("#kgrid").innerHTML = list.map((p) => card(p)).join("") || '<div class="empty">Nessun capo in questa categoria.</div>';
    };
    $("#kcats").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; cat = c.dataset.c; render(); history.replaceState(null, "", "kids.html" + (cat ? "?cat=" + cat : "") + "#catalogo"); });
    $$("[data-kcat]").forEach((t) => t.addEventListener("click", (e) => { e.preventDefault(); cat = t.dataset.kcat; render(); $("#catalogo").scrollIntoView({ behavior: "smooth" }); }));
    render();
  };

  pages.lista = function () {
    const list = [
      { id: "k-coordinato-nascita", size: "3 mesi", want: 2, got: 1 },
      { id: "k-bavaglini", size: "Unica", want: 3, got: 3 },
      { id: "k-confezione-pb", size: "1 mese", want: 2, got: 1 },
      { id: "k-set-dino", size: "6 mesi", want: 1, got: 0 },
      { id: "k-abito-cerimonia", size: "12 mesi", want: 1, got: 0 },
      { id: "k-quadri", size: "2 anni", want: 1, got: 1 }
    ];
    const paint = () => {
      const want = list.reduce((a, x) => a + x.want, 0), got = list.reduce((a, x) => a + x.got, 0);
      $("#ln-progress").innerHTML = `<b>${got} regali su ${want}</b> sono già stati scelti<div class="bar"><i style="width:${(got / want) * 100}%"></i></div>`;
      $("#ln-items").innerHTML = list.map((x, i) => { const p = byId(x.id); const done = x.got >= x.want; return `<div class="gift-item ${done ? "done-g" : ""}"><img src="${img(p.img[0])}" alt="" style="object-position:${p.pos}"><div>
        <h4>${p.name}</h4><div class="meta">${p.brand ? p.brand + " · " : ""}taglia ${x.size} · ${x.got} di ${x.want} regalati</div>
        <div class="row"><b>${eur(p.price)}</b>${done ? `<span class="gifted">${I.check}Completato</span>` : `<button class="btn btn-ink" data-g="${i}">${I.gift}Regala</button>`}</div></div></div>`; }).join("");
    };
    $("#ln-items").addEventListener("click", (e) => {
      const b = e.target.closest("[data-g]"); if (!b) return;
      const x = list[b.dataset.g]; Cart.add(x.id, x.size, 1, "Regalo · lista di Sofia"); x.got++; paint();
      toast("Regalo aggiunto: lo consegniamo ai genitori", "carrello.html", "Carrello");
    });
    $("#finder").addEventListener("submit", (e) => {
      e.preventDefault();
      $("#result").hidden = false;
      $("#result").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    $("#ln-mono").innerHTML = mono("S");
    $("#open-list").addEventListener("click", () => { $("#lista").hidden = false; paint(); $("#lista").scrollIntoView({ behavior: "smooth" }); });
    $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
  };

  pages.negozi = function () {
    $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });
    if (!window.L) return;
    const pos = [42.2458322, 12.2160903];
    const map = L.map("map", { scrollWheelZoom: false }).setView(pos, 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
    const icon = L.divIcon({ className: "", html: '<div style="width:46px;height:46px;border-radius:50%;background:#121110;border:2px solid #cba891;display:grid;place-items:center;color:#e6cfbd;font:600 20px Cinzel,serif;box-shadow:0 8px 20px -8px rgba(0,0,0,.6)">K</div>', iconSize: [46, 46], iconAnchor: [23, 23] });
    L.marker(pos, { icon }).addTo(map).bindPopup("<b>KIOS e KIOS Kids</b><br>Viale Guglielmo Marconi 62 e 64<br>Sutri (VT)").openPopup();
  };

  window.KIOS = { chrome, pages, Cart, toast, sizeGuide, wa, eur, mono, emblem, icons: I };
})();
