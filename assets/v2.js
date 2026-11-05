/* KIOS · home, variante 2 (05.11.2026): «Il camerino».
   Schede in vetro con i capi girano ad arco intorno allo specchio. Quando l'arco si ferma,
   una linea dorata scende sullo specchio e mostra il look provato in negozio.
   Matematica dell'arco e tempi dal prompt «VirtualFit: Spatial Try-On Arc», adattati:
   foto vere dal loro Instagram, pagina che scorre (la rotella verticale resta alla pagina). */
(function () {
  const root = document.querySelector(".v2");
  if (!root || !window.KIOS_DATA || !window.KIOS) return;
  const DATA = window.KIOS_DATA, K = window.KIOS;
  const $ = (s, el = root) => el.querySelector(s);
  const byId = (id) => DATA.products.find((p) => p.id === id);
  const mod = (n, m) => ((n % m) + m) % m;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePtr = matchMedia("(pointer: fine)").matches;
  const EASE = "cubic-bezier(.2,.8,.2,1)", SCAN = "cubic-bezier(.65,0,.35,1)";

  /* The five looks: real photos from @kios_sanna_, all taken in the shop.
     ia = image width / height; fx = where the figure stands (share of the width), to centre it in the mirror;
     crop = [centre x, centre y, width share] of the detail shown on the glass card. */
  const LOOKS = [
    { id: "pelliccia-alamari", tab: "Capispalla", short: "Pelliccia con alamari", img: "hero-1", ia: 1080 / 1440, fx: .42, crop: [.40, .42, .50],
      alt: "Pelliccia ecologica con alamari, provata allo specchio del negozio KIOS" },
    { id: "maxi-maglione", tab: "Maglieria", short: "Maxi maglione", img: "d-maxi-maglione", ia: 640 / 1022, fx: .38, crop: [.36, .42, .58],
      alt: "Maxi maglione bordeaux con lo stivale alto, allo specchio del negozio KIOS" },
    { id: "abito-paillettes", tab: "Abiti", short: "Abito in paillettes", img: "hero-2", ia: 1080 / 1350, fx: .58, crop: [.56, .60, .50],
      alt: "Abito lungo in paillettes nero con lo spacco, in negozio da KIOS" },
    { id: "camicia-righe", tab: "Camicie", short: "Camicia a righe", img: "d-camicia-righe", ia: 900 / 1199, fx: .36, crop: [.34, .50, .56],
      alt: "Camicia a righe da annodare con lo shorts bianco, allo specchio del negozio KIOS" },
    { id: "gonna-paillettes", tab: "Gonne", short: "Gonna in paillettes", img: "d-gonna-paillettes", ia: 900 / 1125, fx: .58, crop: [.55, .66, .36],
      alt: "Gonna lunga in paillettes argento con il maglione chiaro, in negozio da KIOS" }
  ].map((L) => Object.assign(L, { p: byId(L.id) })).filter((L) => L.p);
  const N = LOOKS.length, C = N * 2, HALF = C / 2;
  if (!N) return;

  const SIZES = ["38", "40", "42", "44", "46", "48", "50", "52"];
  const FIT = { abbondante: "veste abbondante", regolare: "veste regolare", aderente: "veste aderente" };
  const short = (n) => (n % 1 ? K.eur(n) : n + " €");
  const src = (L) => "img/" + L.img + ".webp";

  /* background-size / position that show the crop of a photo in a box of the given aspect (w / h) */
  function crop(L, aspect) {
    const [cx, cy, rw] = L.crop;
    let wd = 1 / rw, hd = wd / L.ia;
    const eh = 1 / aspect;
    if (hd < eh) { wd *= eh / hd; hd = eh; }
    const px = wd > 1 ? Math.min(100, Math.max(0, (.5 - cx * wd) / (1 - wd) * 100)) : 50;
    const py = hd > eh ? Math.min(100, Math.max(0, (eh / 2 - cy * hd) / (eh - hd) * 100)) : 50;
    return `background-image:url(${src(L)});background-size:${(wd * 100).toFixed(1)}% auto;background-position:${px.toFixed(1)}% ${py.toFixed(1)}%`;
  }
  /* object-position that keeps the figure in the middle of the mirror */
  function mirrorPos(L) {
    const ma = parseFloat(getComputedStyle(root).getPropertyValue("--MA")) || .52;
    if (ma >= L.ia) return "50% 0%";
    const v = ma / L.ia;
    return (Math.min(1, Math.max(0, (L.fx - v / 2) / (1 - v))) * 100).toFixed(1) + "% 0%";
  }

  /* ---------- elements ---------- */
  const stage = $(".v2-stage"), arc = $(".v2-arc"), room = $(".v2-room"), ghost = $(".v2-ghost");
  const letters = [...ghost.querySelectorAll("b")], words = [...ghost.querySelectorAll("i")];
  const mCur = $(".v2-cur"), mNext = $(".v2-next"), grid = $(".v2-grid"), scan = $(".v2-scan");
  const tabs = $(".v2-tabs"), pill = $(".v2-tabs .v2-pill");
  const buy = $(".v2-buy"), hint = $(".v2-hint"), cursor = $(".v2-cursor"), waLink = $(".v2-wa");
  const thLink = $(".v2-th", buy), th = $(".v2-th i", buy), nmLn = $(".v2-nm", buy), prLn = $(".v2-pr", buy), lbLn = $(".v2-lb", buy);
  const chipsEl = $(".v2-chips", buy), addBtn = $(".v2-add", buy);

  const CARD_A = .84 / (.64 * 1.42);
  const cards = [];
  for (let i = 0; i < C; i++) {
    const L = LOOKS[i % N];
    const b = document.createElement("button");
    b.type = "button"; b.className = "v2-card glass"; b.dataset.i = i;
    if (i < N) b.setAttribute("aria-label", `${L.p.name}, ${short(L.p.price)}: guardalo allo specchio`);
    else { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }       // the second copy only closes the ring
    b.innerHTML = `<span class="v2-g" style="${crop(L, CARD_A)}"></span><span class="v2-cn">${L.short}</span>` +
      `<span class="v2-cp">${short(L.p.price)}</span><span class="v2-ci">prezzo indicativo</span><span class="v2-sheen"></span>`;
    arc.appendChild(b); cards.push(b);
  }
  const tabBtns = LOOKS.map((L, k) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = L.tab; b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => { touch(); goTo(k); });
    tabs.appendChild(b);
    return b;
  });
  let size = null;                                   // the visitor's size, kept from one look to the next
  const chips = SIZES.map((s) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "v2-chip"; b.textContent = s; b.dataset.s = s;
    b.addEventListener("click", () => { touch(); size = s; paintChips(); setLabel(); setWa(); });
    chipsEl.appendChild(b);
    return b;
  });

  /* ---------- buy card ---------- */
  function roll(ln, html) {
    const cur = ln.lastElementChild;
    if (cur && cur.innerHTML === html) return;
    [...ln.children].slice(0, -1).forEach((c) => c.remove());
    const nu = document.createElement("span");
    nu.innerHTML = html;
    if (reduce || shown < 0 || !cur || !cur.innerHTML || !nu.animate) { ln.replaceChildren(nu); return; }
    Object.assign(cur.style, { position: "absolute", left: 0, right: 0, top: 0 });
    ln.appendChild(nu);
    const o = { duration: 620, easing: EASE };
    cur.animate([{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], { ...o, fill: "forwards" }).onfinish = () => cur.remove();
    nu.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], o);
  }
  const cur = () => LOOKS[Math.max(0, shown)];
  function paintChips() {
    const p = cur().p;
    chips.forEach((b) => {
      const s = b.dataset.s, n = p.sizes[s] || 0;
      b.disabled = n <= 0;
      b.classList.toggle("is-on", s === size && n > 0);
      b.setAttribute("aria-pressed", String(s === size && n > 0));
      b.title = n <= 0 ? `Taglia ${s} esaurita` : n === 1 ? `Taglia ${s}: ultimo pezzo` : `Taglia ${s}`;
    });
  }
  function setLabel(warn) {
    const p = cur().p, has = size && (p.sizes[size] || 0) > 0;
    const fit = FIT[p.fit] ? `<span class="v2-fit"> · ${FIT[p.fit]}</span>` : "";
    const text = warn ? "Scegli la tua taglia" : size && !has ? `La ${size} è esaurita` : `Taglia${has ? " " + size : ""}`;
    lbLn.classList.toggle("is-warn", !!(warn || (size && !has)));
    roll(lbLn, text + fit);
  }
  function setWa() {
    const p = cur().p;
    waLink.href = K.wa(`Ciao! Ho visto sul sito: ${p.name}. Vorrei provare questo capo in negozio${size ? " nella taglia " + size : ""}.`);
  }
  let buyShown = -1;
  function updateBuy(k) {
    if (k === buyShown) return;
    buyShown = k;
    const L = LOOKS[k], p = L.p, href = "prodotto.html?id=" + p.id;
    thLink.href = href; nmLn.href = href;
    roll(nmLn, p.name);
    roll(prLn, `<b>${K.eur(p.price)}</b><small>prezzo indicativo</small>`);
    th.style.cssText = crop(L, 1);
    if (!reduce && th.animate && shown >= 0) th.animate([{ transform: "translateY(70%) scale(.8)" }, { transform: "none" }], { duration: 650, easing: EASE });
    paintChips(); setLabel(); setWa();
  }
  addBtn.addEventListener("click", () => {
    touch();
    const p = cur().p;
    if (!size || !((p.sizes[size] || 0) > 0)) {
      setLabel(true);
      if (chipsEl.animate && !reduce) chipsEl.animate([{ transform: "none" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 360 });
      return;
    }
    K.Cart.add(p.id, size);
    K.toast(`Nel carrello, taglia ${size}`, "carrello.html", "Vai al carrello");
  });

  /* ---------- tabs ---------- */
  function updateTabs(k) {
    tabBtns.forEach((b, j) => { b.classList.toggle("is-on", j === k); b.setAttribute("aria-pressed", String(j === k)); });
    const b = tabBtns[k];
    if (!b) return;
    pill.style.width = b.offsetWidth + "px";
    pill.style.transform = `translateX(${b.offsetLeft}px)`;
    if (tabs.scrollWidth > tabs.clientWidth + 2) tabs.scrollTo({ left: b.offsetLeft - (tabs.clientWidth - b.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  }

  /* ---------- layout ---------- */
  let W = 0, H = 0, XS = [0, 0, 0, 0, 0, 0];
  function layout() {
    W = root.clientWidth; H = root.clientHeight;
    const phone = W < 768;
    const cw = phone ? Math.min(W * .23, 140) : Math.min(W * .148, innerHeight * .33);
    root.style.setProperty("--CW", cw.toFixed(1) + "px");
    XS = (phone ? [0, .37, .5, .565, .6, .62] : [0, .215, .345, .432, .49, .52]).map((v) => v * W);
    root.style.setProperty("--buyH", buy.offsetHeight + "px");
    if (shown >= 0) { mCur.style.objectPosition = mNext.style.objectPosition = mirrorPos(LOOKS[shown]); updateTabs(shown); }
  }
  function xAt(a) {
    const i = Math.floor(a);
    return i >= XS.length - 1 ? XS[XS.length - 1] : XS[i] + (XS[i + 1] - XS[i]) * (a - i);
  }

  /* ---------- try-on: the golden scan ---------- */
  let shown = -1, anims = [];
  function setImg(img, L) {
    if (img.getAttribute("src") !== src(L)) img.src = src(L);
    img.style.objectPosition = mirrorPos(L);
  }
  function commit(L) { setImg(mCur, L); mCur.alt = L.alt; mCur.style.visibility = "visible"; }
  function tryOn(k) {
    shown = k;
    const L = LOOKS[k];
    updateBuy(k); updateTabs(k);
    anims.forEach((a) => a.cancel()); anims = [];
    setImg(mNext, L);
    if (reduce || !mNext.animate) { commit(L); return; }
    const a1 = mNext.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)" }], { duration: 950, easing: SCAN, fill: "forwards" });
    const a2 = grid.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)", offset: .5 }, { clipPath: "inset(100% 0 0 0)" }], { duration: 1092, easing: SCAN });
    const mh = scan.parentNode.clientHeight, ty = (k) => `translateY(${(k * mh).toFixed(1)}px)`;   // transform, not top: no layout every frame
    const a3 = scan.animate([
      { transform: ty(0) + " scaleX(.2)", opacity: 0 },
      { transform: ty(.06) + " scaleX(1)", opacity: 1, offset: .08 },
      { transform: ty(.94) + " scaleX(1)", opacity: 1, offset: .92 },
      { transform: ty(1) + " scaleX(.2)", opacity: 0 }], { duration: 950, easing: SCAN });
    const a4 = mNext.animate([{ transform: "scale(1.012)" }, { transform: "scale(1)" }], { duration: 1250, easing: "ease-out" });
    anims = [a1, a2, a3, a4];
    a1.onfinish = () => { commit(L); anims.forEach((a) => a.cancel()); anims = []; };
  }

  /* ---------- the arc, every frame ---------- */
  let pos = 0, target = 0, intro = reduce ? 1 : 0, introDone = false, dragging = false, raf = 0, ready = false;
  let sx = 0, sy = 0, tsx = 0, tsy = 0, lastNow = 0;
  const k60 = (k, f) => 1 - Math.pow(1 - k, f);           // per-frame factor k at 60 fps, scaled to the real frame time
  let hov = false, ccx = -200, ccy = -200, tcx = -200, tcy = -200;
  const seeds = cards.map((_, i) => i * 1.9 + Math.random());

  function paintIntro(ie) {
    letters.forEach((b, i) => (b.style.transform = `translateY(${((1 - ie) * (60 + 30 * i)).toFixed(1)}px)`));
    words.forEach((w) => (w.style.opacity = ie.toFixed(3)));
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = now / 1000, f = Math.min(4, (now - (lastNow || now)) / 16.667) || 1;
    lastNow = now;
    if (!dragging) pos = reduce ? target : pos + (target - pos) * k60(.11, f);
    if (intro < 1) intro = Math.min(1, intro + .012 * f);
    const ie = 1 - Math.pow(1 - intro, 3);
    sx += (tsx - sx) * k60(.06, f); sy += (tsy - sy) * k60(.06, f);

    for (let i = 0; i < C; i++) {
      const el = cards[i];
      const u = mod(i - pos + HALF, C) - HALF, a = Math.abs(u), sg = Math.sign(u);
      let s, z, op, ry, blur = 0;
      if (a < 1) { s = .55 + .45 * a; z = -260 * (1 - a); op = a; ry = -sg * 16 * a; }
      else { s = 1 / (1 + .3 * Math.pow(a - 1, 1.15)); z = -110 * (a - 1); op = 1; ry = -sg * (16 + 9 * Math.min(2, a - 1)); blur = Math.max(0, a - 1.6) * 2.4; }
      if (a > 3.4) op = Math.max(0, 1 - (a - 3.4) / .8);
      op *= ie;
      if (op < .01) { if (el._v !== 0) { el.style.visibility = "hidden"; el._v = 0; } continue; }
      if (el._v !== 1) { el.style.visibility = "visible"; el._v = 1; }
      const bob = reduce ? 0 : Math.sin(t * 1.1 + seeds[i]) * H * .006 * Math.min(1, a);
      const x = sg * xAt(a) * ie, y = bob - (1 - s) * H * .04;
      ry += sx * 10;
      el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) perspective(1300px) translateZ(${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateX(${(-sy * 6).toFixed(2)}deg) scale(${(s * (.6 + .4 * ie)).toFixed(4)})`;
      el.style.opacity = op.toFixed(3);
      el.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : "";
      el.style.zIndex = a < 1 ? 1 : Math.round(100 - 10 * a);
    }
    room.style.transform = `translate3d(${(-sx * 22).toFixed(2)}px,${(-sy * 14).toFixed(2)}px,0) scale(${(1.08 - .03 * ie).toFixed(4)})`;
    ghost.style.transform = `translate3d(${(-sx * 40).toFixed(2)}px,${(-sy * 16).toFixed(2)}px,0)`;
    if (!introDone) { paintIntro(ie); introDone = intro >= 1; }

    if (!dragging && Math.abs(target - pos) < .02) { const k = mod(Math.round(target), N); if (k !== shown) tryOn(k); }
    if (hov) { ccx += (tcx - ccx) * k60(.22, f); ccy += (tcy - ccy) * k60(.22, f); cursor.style.transform = `translate3d(${ccx.toFixed(1)}px,${ccy.toFixed(1)}px,0)`; }
  }
  const start = () => { if (ready && inView && !raf) { lastNow = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  /* ---------- input ---------- */
  let touched = false, autoT = 0;
  function touch() { if (touched) return; touched = true; clearInterval(autoT); hint.classList.add("is-off"); }
  const step = (d) => { touch(); target = Math.round(target) + d; };
  function goTo(k) { let d = mod(k - mod(Math.round(target), N), N); if (d > N / 2) d -= N; target = Math.round(target) + d; }
  const toCard = (i) => { target = Math.round(pos + (mod(i - pos + HALF, C) - HALF)); };

  let p0 = 0, x0 = 0, moved = 0, lastX = 0, lastT = 0, vel = 0, downCard = null, pid = null;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || !ready) return;
    dragging = true; moved = 0; p0 = pos; x0 = lastX = e.clientX; lastT = e.timeStamp; vel = 0;
    downCard = e.target.closest(".v2-card"); pid = e.pointerId;
    try { stage.setPointerCapture(pid); } catch (_) { /* old browsers */ }
    curState();
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - x0;
    moved = Math.max(moved, Math.abs(dx));
    if (moved >= 6) touch();                           // a real sideways drag, not a page scroll
    pos = p0 - dx / (XS[1] || 1);
    const dt = e.timeStamp - lastT;
    if (dt > 0) { vel = vel * .5 + ((e.clientX - lastX) / dt) * .5; lastX = e.clientX; lastT = e.timeStamp; }
  });
  function release(e, cancelled) {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    if (e.timeStamp - lastT > 90) vel = 0;              // the finger stopped before lifting: no flick
    if (!cancelled && moved < 6 && downCard) { touch(); toCard(+downCard.dataset.i); }
    else target = Math.round(pos - (cancelled ? 0 : vel) * 3.2);
    curState();
  }
  stage.addEventListener("pointerup", (e) => release(e, false));
  stage.addEventListener("pointercancel", (e) => release(e, true));
  arc.addEventListener("click", (e) => {             // keyboard (Enter / Space on a card); mouse and touch go through pointerup
    const c = e.target.closest(".v2-card");
    if (c && e.detail === 0) { touch(); toCard(+c.dataset.i); }
  });
  arc.addEventListener("pointerover", (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const c = e.target.closest(".v2-card");
    if (!c || c.contains(e.relatedTarget)) return;
    const s = c.querySelector(".v2-sheen");
    s.classList.remove("is-go"); void s.offsetWidth; s.classList.add("is-go");
  });
  $(".v2-arrow.prev").addEventListener("click", () => step(-1));
  $(".v2-arrow.next").addEventListener("click", () => step(1));

  let acc = 0, lastStep = 0;
  root.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;          // vertical wheel keeps scrolling the page
    e.preventDefault(); touch();
    acc += e.deltaX;
    const now = performance.now();
    if (Math.abs(acc) > 60 && now - lastStep > 260) { target = Math.round(target) + Math.sign(acc); acc = 0; lastStep = now; }
  }, { passive: false });
  let keysOn = true;
  addEventListener("keydown", (e) => {
    if (!keysOn || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "")) return;
    if (document.body.classList.contains("no-scroll")) return;     // menu or sheet open
    if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
  });

  /* pointer: parallax for everyone, glass cursor for the mouse */
  let overCard = false, overBtn = false, overStage = false, down = false;
  function curState() {
    cursor.classList.toggle("is-drag", dragging || (!overCard && !overBtn && overStage));
    cursor.classList.toggle("is-try", !dragging && overCard);
    cursor.classList.toggle("is-btn", !dragging && !overCard && overBtn);
    cursor.classList.toggle("is-down", down);
  }
  root.addEventListener("pointermove", (e) => {
    const r = root.getBoundingClientRect();
    tsx = (e.clientX - r.left) / r.width - .5; tsy = (e.clientY - r.top) / r.height - .5;
    if (!finePtr || e.pointerType !== "mouse") return;
    tcx = e.clientX; tcy = e.clientY;
    if (!hov) { hov = true; ccx = tcx; ccy = tcy; root.classList.add("hov"); cursor.classList.add("is-vis"); }
    const t = e.target;
    overCard = !!t.closest(".v2-card"); overBtn = !!t.closest("button, a"); overStage = !!t.closest(".v2-stage");
    curState();
  });
  root.addEventListener("pointerleave", () => {
    tsx = tsy = 0;
    if (!hov) return;
    hov = false; root.classList.remove("hov"); cursor.classList.remove("is-vis");
  });
  root.addEventListener("pointerdown", () => { down = true; curState(); });
  addEventListener("pointerup", () => { down = false; curState(); });

  /* ---------- start ---------- */
  let inView = true;
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting; keysOn = e.intersectionRatio > .5;
    document.body.classList.toggle("v2-hero-in", inView);          // the «nel carrello» notice sits above the buy card
    if (inView) start(); else stop();
  }, { threshold: [0, .5] }).observe(root);
  addEventListener("resize", () => requestAnimationFrame(layout));
  const buyH = () => { root.style.setProperty("--buyH", buy.offsetHeight + "px"); document.documentElement.style.setProperty("--v2buyH", buy.offsetHeight + "px"); };
  if ("ResizeObserver" in window) new ResizeObserver(buyH).observe(buy);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout());

  root.v2state = () => ({ pos, target, shown, dragging, touched, intro, ready, inView, raf: !!raf });
  layout();
  paintIntro(reduce ? 1 : 0);
  updateBuy(0);
  const pre = LOOKS.map((L) => { const im = new Image(); im.src = src(L); return im; });
  const first = pre[0].decode ? pre[0].decode().catch(() => {}) : Promise.resolve();
  Promise.race([first, new Promise((r) => setTimeout(r, 1500))]).then(() => { ready = true; start(); });
  if (!reduce) autoT = setInterval(() => {
    if (!touched && !dragging && inView && ready && !document.hidden && Math.abs(target - pos) < .05) target += 1;
  }, 5200);
})();
