/* KIOS · prototipo, terza variante del primo schermo: «la sfilata».
   One number drives everything: p, the current look as a float. Every figure reads its place from the
   depth table, the rail of pieces and the look counter are computed from p alone.
   Figures: img/v3-look-N.webp, cut out of Instagram @kios_sanna_ posts (see _src/build_v3.py).
   Pieces: either a product of the catalogue (data.js, same name and price as on the product page) or an item
   named in the caption of the same post; "post" = price written in that caption, the others are indicative. */
(function () {
  const D = window.KIOS_DATA, K = window.KIOS;
  const $ = (id) => document.getElementById(id);
  const byId = (id) => D.products.find((p) => p.id === id);
  const DONNA = ["38", "40", "42", "44", "46", "48", "50", "52"];
  const SHOES = ["36", "37", "38", "39", "40", "41"];

  // w × h of each webp; box = detail of the figure shown in the rail [x0, y0, x1, y1] as fractions
  const LOOKS = [
    { w: 453, h: 1100, name: "Pelliccia con alamari", post: "DPYp7gHDenX", pieces: [
      { id: "pelliccia-alamari", label: "Pelliccia con alamari", box: [0, .15, 1, .55] },
      { name: "Tronchetto scamosciato", price: 49, src: "post 04.10.2025", sizes: SHOES, box: [.3, .8, 1, 1] }] },
    { w: 418, h: 1100, name: "Pantalone zebrato", post: "De1MB3lO5cE", pieces: [
      { name: "Pantalone zebrato", price: 49, sizes: DONNA, box: [0, .38, .78, .93] },
      { name: "Top nero", price: 25, sizes: DONNA, box: [.05, .16, .8, .44] }] },
    { w: 437, h: 1100, name: "Cappotto bordeaux", post: "DC34-4NsK8T", pieces: [
      { id: "cappotto-bordeaux", box: [0, .08, 1, 1] },
      { name: "Cardigan a righe", price: 45, sizes: DONNA, box: [.28, .18, .82, .44] }] },
    { w: 332, h: 1100, name: "Tailleur grigio", post: "DAVaSZRsN2P", pieces: [
      { name: "Giacca monopetto Two Way", price: 99, sizes: DONNA, box: [0, .14, .98, .55] },
      { name: "Pantalone a zampa Two Way", price: 59, sizes: DONNA, box: [0, .46, .7, 1] }] },
    { w: 390, h: 1100, name: "Maxi maglione", post: "DRCQ2UTjXX9", pieces: [
      { id: "maxi-maglione", box: [0, .17, .95, .64] },
      { name: "Stivale", price: 59, src: "post 14.11.2025", sizes: SHOES, box: [.3, .66, 1, 1] }] },
    { w: 393, h: 1100, name: "Total black", post: "DD1cafzMNWj", pieces: [
      { name: "Palazzo Kontatto con spacchi", price: 69, sizes: DONNA, box: [0, .38, .78, 1] },
      { name: "Top Susymix con applicazioni", price: 39, sizes: DONNA, box: [.2, .18, .8, .42] }] }
  ];
  const N = LOOKS.length;
  const src = (i) => "img/v3-look-" + (i + 1) + ".webp";

  // depth stops from d = -1 (leaving past the rail) to d = 5 (arriving out of the haze), fractions of the stage
  const KX = [1.2, .744, .496, .346, .235, .15, .085], KF = [1.14, .89, .777, .704, .651, .616, .59],
        KH = [1.18, .832, .574, .436, .334, .258, .19], KB = [0, 0, 1.5, 4, 8, 12, 17], KO = [1, 1, 1, 1, .86, .5, 0];

  const NS = "http://www.w3.org/2000/svg";
  const wrap = (x, n) => ((x % n) + n) % n;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the piece is the figure itself seen through an svg window, nothing outside the box can show
  function crop(href, box, w, h) {
    const x0 = Math.round(box[0] * w), y0 = Math.round(box[1] * h), cw = Math.round((box[2] - box[0]) * w), ch = Math.round((box[3] - box[1]) * h);
    const vb = `${x0} ${y0} ${cw} ${ch}`;
    const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", vb); s.setAttribute("aria-hidden", "true");
    const f = document.createElementNS(NS, "svg");
    [["x", x0], ["y", y0], ["width", cw], ["height", ch], ["viewBox", vb]].forEach(([k, v]) => f.setAttribute(k, v));
    const i = document.createElementNS(NS, "image"); i.setAttribute("href", href); i.setAttribute("width", w); i.setAttribute("height", h);
    f.append(i); s.append(f); return s;
  }

  function init() {
    const rw = $("runway"), stage = $("rw-stage"), line = $("rw-line"), rail = $("rw-rail"), ring = $("rw-ring");
    const roll = $("rw-roll"), names = $("rw-names"), status = $("rw-status"), wait = $("rw-wait");
    if (!rw) return;

    /* ---------- figures ---------- */
    const people = LOOKS.map((L, i) => {
      const e = document.createElement("div"); e.className = "rw-m"; e.dataset.i = i;
      const img = new Image(); img.alt = ""; img.decoding = "async"; img.draggable = false;
      if (i < 3) img.fetchPriority = "high";
      img.src = src(i);
      e.append(img); line.append(e);
      return { e, img, r: L.w / L.h, f: "", o: "", z: "" };
    });

    /* ---------- pieces ---------- */
    const pieces = LOOKS.flatMap((L, li) => L.pieces.map((pc) => {
      const prod = pc.id ? byId(pc.id) : null;
      const sizes = prod ? Object.keys(prod.sizes).sort((a, b) => a - b) : pc.sizes;
      // label: the shorter name of the Instagram caption, where the catalogue name does not fit two lines on a phone
      return { ...pc, look: li, prod, sizes, name: pc.label || (prod ? prod.name : pc.name), price: prod ? prod.price : pc.price,
        stock: (s) => (prod ? (prod.sizes[s] || 0) > 0 : true) };
    }));
    const cards = pieces.map((pc, k) => {
      const e = document.createElement("article");
      e.className = "rw-card" + (k % 2 ? " alt" : ""); e.dataset.k = k;
      const shot = pc.prod
        ? `<a class="rw-shot" href="prodotto.html?id=${pc.id}" aria-label="${pc.name}: scheda prodotto"></a>`
        : `<button class="rw-shot" type="button" aria-label="${pc.name}: scegli la taglia"></button>`;
      const chips = pc.sizes.map((s) => `<button type="button" data-s="${s}" class="${pc.stock(s) ? "" : "off"}" ${pc.stock(s) ? "" : 'aria-disabled="true"'}>${s}</button>`).join("");
      e.innerHTML = `<button class="rw-fav" type="button" aria-pressed="false" aria-label="Salva: ${pc.name}">${K.icons.heart}</button>${shot}
        <div class="rw-meta"><h3>${pc.name}</h3><span class="rw-price">${K.eur(pc.price)}<span class="ind">prezzo indicativo</span></span>
          <button class="rw-add" type="button" aria-label="Scegli la taglia: ${pc.name}"></button></div>
        <div class="rw-sizes" role="group" aria-label="Taglie: ${pc.name}">
          <p>${pc.prod ? "Scegli la taglia" : "Taglia · conferma su WhatsApp"}</p>
          <div class="rw-chips">${chips}</div>
          <button class="rw-x" type="button" aria-label="Chiudi le taglie">${K.icons.close}</button></div>`;
      e.querySelector(".rw-shot").append(crop(src(pc.look), pc.box, LOOKS[pc.look].w, LOOKS[pc.look].h));
      rail.append(e); return e;
    });

    /* ---------- counters ---------- */
    for (let i = 0; i <= N; i++) {
      const b = document.createElement("b"); b.textContent = String((i % N) + 1).padStart(2, "0"); roll.append(b);
      const n = document.createElement("b"); n.textContent = LOOKS[i % N].name; names.append(n);
    }

    /* ---------- state ---------- */
    let W = 0, H = 0, base = 0, cardS = 0, rb = 0, nb = 0, side = false, dirty = true, p = 0, target = 0, last = 0, shown = -1;
    // the line walks by itself every AUTO_EVERY ms, the mouse over it does not stop it; a drag, swipe, wheel,
    // key, arrow or tap pauses it for AUTO_RESUME ms, an open size picker holds it until it closes
    const AUTO_EVERY = 4000, AUTO_RESUME = 7000;
    let lastAct = 0, idleUntil = 0, inView = true;
    const pause = () => { idleUntil = performance.now() + AUTO_RESUME; };
    const look = () => wrap(Math.round(target), N);

    function setTop() { rw.style.setProperty("--rw-top", Math.round(rw.getBoundingClientRect().top + scrollY) + "px"); }
    function size() {
      W = stage.clientWidth; H = stage.clientHeight; base = H * 1.2; side = matchMedia("(max-width: 820px)").matches;
      people.forEach((m) => { m.e.style.width = base * m.r + "px"; m.e.style.height = base + "px"; });
      cards.forEach((c) => (c.style.height = side ? "" : rail.clientHeight / 3 + "px"));
      cardS = side ? cards[0].offsetWidth : rail.clientHeight / 3;
      rb = roll.firstChild.offsetHeight; nb = names.firstChild.offsetHeight;
      dirty = true;
    }

    function paint() {
      people.forEach((m, i) => {
        let d = wrap(i - p, N); if (d > N - 1) d -= N;
        const k = clamp(d + 1, 0, 6), a = Math.floor(k), b = Math.min(6, a + 1), t = k - a, mix = (A) => A[a] + (A[b] - A[a]) * t;
        const h = mix(KH) * H, s = h / base, w = h * m.r, x = mix(KX) * W - w / 2, y = mix(KF) * H - h;
        m.e.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
        const f = mix(KB) / s, fs = f < 0.2 ? "none" : `blur(${f.toFixed(1)}px)`, o = mix(KO).toFixed(3), z = String(100 - Math.round(d * 10));
        if (fs !== m.f) { m.f = fs; m.e.style.filter = fs; }
        if (o !== m.o) { m.o = o; m.e.style.opacity = o; }
        if (z !== m.z) { m.z = z; m.e.style.zIndex = z; }
      });
      const all = cardS * pieces.length;
      cards.forEach((c, i) => {
        let y = wrap(i * cardS - p * 2 * cardS, all); if (y > all - cardS) y -= all;
        c.style.transform = side ? `translate3d(${y.toFixed(1)}px,0,0)` : `translate3d(0,${y.toFixed(1)}px,0)`;
      });
      roll.style.transform = `translate3d(0,${(-wrap(p, N) * rb).toFixed(1)}px,0)`;
      names.style.transform = `translate3d(0,${(-wrap(p, N) * nb).toFixed(1)}px,0)`;
      // close an open size picker once its look has left the top of the rail
      if (Math.abs(target - p) < 0.02) {
        const cur = look();
        if (cur !== shown) {
          shown = cur; status.textContent = `Look ${cur + 1} di ${N}: ${LOOKS[cur].name}`;
          cards.forEach((c) => { if (c.classList.contains("pick") && pieces[+c.dataset.k].look !== cur) c.classList.remove("pick"); });
        }
      }
    }

    function frame(now) {
      const dt = Math.min(50, now - last) || 16; last = now;
      const was = p;
      if (calm) p = target; else p += (target - p) * (1 - Math.exp(-dt * 0.0072));
      if (Math.abs(target - p) < 0.0004) p = target;
      if (p !== was || dirty) { dirty = false; paint(); }
      if (ring.classList.contains("show")) {
        cx += (mx - cx) * 0.32; cy += (my - cy) * 0.32;
        ring.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`;
      }
      if (!calm && lastAct && inView && !document.hidden && !down && !rdown && now > idleUntil && now - lastAct > AUTO_EVERY && !rail.querySelector(".pick")) {
        target = Math.round(target) + 1; lastAct = now;
      }
      requestAnimationFrame(frame);
    }

    /* ---------- stage: drag, click, wheel, keys ---------- */
    let mx = 0, my = 0, cx = 0, cy = 0, down = false, sx = 0, st = 0, moved = 0, wheelT = 0;
    const pull = () => Math.max(150, W * 0.2);
    stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") ring.classList.add("show"); });
    stage.addEventListener("pointerleave", () => ring.classList.remove("show"));
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!down) return;
      const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); target = st + dx / pull();
    });
    stage.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || e.target.closest("a,button")) return;
      down = true; sx = e.clientX; st = target; moved = 0; pause();
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
      ring.classList.add("drag");
    });
    function release(e, cancelled) {
      if (!down) return; down = false; ring.classList.remove("drag");
      if (moved < 6 && !cancelled) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList && x.classList.contains("rw-m"));
        if (hit) { const d = Math.round(wrap(+hit.dataset.i - target, N)); if (d > 0 && d < N) target = Math.round(target) + d; }
      } else target = Math.round(target);
    }
    stage.addEventListener("pointerup", (e) => release(e, false));
    stage.addEventListener("pointercancel", (e) => release(e, true));
    // horizontal swipes on a trackpad walk the line; the vertical wheel keeps scrolling the page
    stage.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); pause();
      target -= clamp(e.deltaX, -120, 120) / 420;
      clearTimeout(wheelT); wheelT = setTimeout(() => (target = Math.round(target)), 150);
    }, { passive: false });
    const step = (n) => { pause(); target = Math.round(target) + n; };
    stage.addEventListener("keydown", (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); step(1); }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); step(-1); }
    });
    addEventListener("keydown", (e) => {
      if (e.defaultPrevented || !inView || e.altKey || e.ctrlKey || e.metaKey || stage.contains(e.target) || rail.contains(e.target)) return;
      if (e.target.closest && e.target.closest("input,textarea,select,[contenteditable]")) return;
      if (document.querySelector(".drawer.on,.search-panel.on,.sheet.on")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    $("rw-prev").addEventListener("click", () => step(-1));
    $("rw-next").addEventListener("click", () => step(1));

    /* ---------- rail: drag the cards too, pick a size, save ---------- */
    let rdown = false, rsx = 0, rsy = 0, rst = 0, rdrag = false, railDragged = false;
    rail.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || e.target.closest(".rw-sizes")) return;
      rdown = true; rsx = e.clientX; rsy = e.clientY; rst = target; rdrag = false;
    });
    rail.addEventListener("pointermove", (e) => {
      if (!rdown) return;
      const d = side ? e.clientX - rsx : e.clientY - rsy, o = side ? e.clientY - rsy : e.clientX - rsx;
      if (!rdrag) {
        if (Math.abs(d) < 8 || Math.abs(d) < Math.abs(o)) return;
        rdrag = true; pause();
        try { rail.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
      }
      target = rst - d / (2 * cardS);
    });
    const rup = () => {
      if (!rdown) return; rdown = false;
      if (rdrag) { railDragged = true; target = Math.round(target); setTimeout(() => (railDragged = false), 60); }
    };
    rail.addEventListener("pointerup", rup); rail.addEventListener("pointercancel", rup);
    // a press that ends outside the stage or the rail (or a lost window focus) must not hold the line forever
    const letGo = (e) => { if (down) release(e, true); rup(); };
    addEventListener("pointerup", letGo); addEventListener("pointercancel", letGo);
    addEventListener("blur", () => { if (down) { down = false; ring.classList.remove("drag"); target = Math.round(target); } rdown = false; });

    const closePicks = (keep) => cards.forEach((c) => c !== keep && c.classList.remove("pick"));
    function openPick(card) {
      pause(); closePicks(card); card.classList.add("pick");
      const first = card.querySelector(".rw-chips button:not(.off)");
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 120);
    }
    function choose(pc, s, card) {
      card.classList.remove("pick");
      if (pc.prod) {
        K.Cart.add(pc.id, s);
        K.toast(`${pc.name}, taglia ${s}: nel carrello`, "carrello.html", "Vai al carrello");
      } else {
        open(K.wa(`Ciao! Vorrei ${pc.name.toLowerCase()} del look «${LOOKS[pc.look].name}» in taglia ${s}. È disponibile?`), "_blank", "noopener");
        K.toast(`${pc.name}, taglia ${s}: ti rispondiamo su WhatsApp`);
      }
    }
    rail.addEventListener("click", (e) => {
      if (railDragged) { e.preventDefault(); e.stopPropagation(); railDragged = false; return; }
      pause();
      const card = e.target.closest(".rw-card"); if (!card) return;
      const pc = pieces[+card.dataset.k];
      const fav = e.target.closest(".rw-fav");
      if (fav) { const on = fav.getAttribute("aria-pressed") !== "true"; fav.setAttribute("aria-pressed", on); if (on) K.toast("Salvato tra i preferiti"); return; }
      if (e.target.closest(".rw-x")) { card.classList.remove("pick"); return; }
      const chip = e.target.closest(".rw-chips button");
      if (chip) { if (!chip.classList.contains("off")) choose(pc, chip.dataset.s, card); return; }
      if (e.target.closest(".rw-add") || e.target.closest("button.rw-shot")) { card.classList.contains("pick") ? card.classList.remove("pick") : openPick(card); }
    }, true);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && rail.querySelector(".pick")) { closePicks(); pause(); } });
    $("rw-shop").addEventListener("click", () => { target = Math.round(target); openPick(cards[2 * look()]); });

    /* ---------- start ---------- */
    new IntersectionObserver(([en]) => (inView = en.isIntersecting && en.intersectionRatio > 0.4), { threshold: [0, 0.4, 0.6] }).observe(rw);
    addEventListener("resize", () => { setTop(); size(); });
    setTop(); size(); requestAnimationFrame(frame);
    const ready = Promise.all(people.slice(0, 3).map((m) => m.img.decode().catch(() => {}))).then(() => document.fonts.ready);
    Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      setTop(); size(); paint(); wait.classList.add("gone"); lastAct = performance.now();
    });
  }

  window.KIOSv3 = { init, LOOKS };
})();
