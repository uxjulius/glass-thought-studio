/* ==========================================================================
   components-bibliotheque.js — Glass Thought Studio : bibliothèque d'illustrations
   sur mesure en verre : bulb (ampoule), phone (téléphone), hook (hameçon),
   brain (cerveau), search (recherche), copy (copier-coller), chip (puce IA),
   seat (siège + robot), order (ordre 1/2), notepad (carnet), relay (relais),
   globe (globe). Déterministe : tout est fonction du temps t du plan.
   ========================================================================== */
(function () {
  const G = window.GLOW, h = G.h, C = G.C;
  const TH = (o, scene) => G.theme(o.world || scene.world);
  const seg = G.seg, E = G.E, clamp = G.clamp;
  const defs = (id) => `<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.24)"/><stop offset=".45" stop-color="rgba(255,255,255,.05)"/><stop offset="1" stop-color="rgba(255,255,255,.13)"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#7D839C"/><stop offset=".55" stop-color="#EDEFFF"/><stop offset=".8" stop-color="#5A5E76"/><stop offset="1" stop-color="#CFD3E6"/></linearGradient>
    <filter id="${id}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="${id}F" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>`;
  const sheenX = (t, a, w) => (-w * .5 + ((t * .45 + (a || 0)) % 1.6) * w * 1.1).toFixed(1);
  const mountKid = (el, comp) => { const m = G.mount({}, comp.w, comp.h, comp.el); el.appendChild(m); return m; };

  /* AMPOULE en verre : le filament s'allume lentement (o.lightFrom → o.lightAt)
     ou s'éteint (o.fadeFrom → o.fadeTo). o.marks : points d'interrogation qui flottent. */
  C.bulb = function (o, scene) {
    const th = TH(o, scene), S = o.size || 230, id = G.uid('bu');
    const B = 'M50 6 C26 6 12 24 12 44 C12 60 22 70 30 80 C34 86 35 92 35 98 L65 98 C65 92 66 86 70 80 C78 70 88 60 88 44 C88 24 74 6 50 6 Z';
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${S}" height="${S * 1.4}" viewBox="0 0 100 140" style="overflow:visible"><defs>${defs(id)}<clipPath id="${id}c"><path d="${B}"/></clipPath></defs>
      <circle id="${id}halo" cx="50" cy="46" r="46" fill="${th.accent}" filter="url(#${id}F)" opacity="0"/>
      <path d="${B}" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="1.8"/>
      <circle id="${id}core" cx="50" cy="58" r="22" fill="#FFFFFF" filter="url(#${id}f)" opacity="0"/>
      <path id="${id}fil" d="M42 98 L42 72 Q44 56 47 66 Q50 76 53 66 Q56 56 58 72 L58 98" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.2" stroke-linejoin="round"/>
      <g clip-path="url(#${id}c)"><rect id="${id}sh" x="-40" y="-10" width="16" height="140" fill="#fff" opacity=".18" transform="rotate(22)"/>
        <ellipse cx="34" cy="26" rx="9" ry="5" fill="#fff" opacity=".35" transform="rotate(-35 34 26)"/></g>
      <rect x="34" y="100" width="32" height="7" rx="3" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="1.4"/>
      <rect x="35" y="109" width="30" height="7" rx="3" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="1.4"/>
      <rect x="36" y="118" width="28" height="7" rx="3" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="1.4"/>
      <path d="M42 127 Q50 136 58 127" fill="url(#${id}s)"/></svg>`);
    const halo = el.querySelector(`#${id}halo`), core = el.querySelector(`#${id}core`), fil = el.querySelector(`#${id}fil`), sh = el.querySelector(`#${id}sh`);
    const marks = (o.marks ? [[-.55, .1, 0], [.62, .02, .9], [-.42, .62, 1.6]] : []).map(([dx, dy, ph]) => {
      const m = h('div', `position:absolute;left:0;top:0;font:600 ${S * .2}px Poppins;color:#fff;text-shadow:0 0 14px ${th.glow};`, '?');
      el.appendChild(m); return { m, dx, dy, ph };
    });
    return { el, w: S, h: S * 1.4, update(t) {
      let L = o.lit0 ?? 0;
      if (o.lightAt !== undefined) L = E.inOutSine(seg(t, o.lightFrom ?? 0, o.lightAt));
      if (o.fadeTo !== undefined) { const q = seg(t, o.fadeFrom ?? 0, o.fadeTo); L = 1 - .92 * E.inOutCubic(q); L *= 1 - (q > 0 && q < 1 ? .35 * Math.max(0, Math.sin(t * 23)) * Math.max(0, Math.sin(t * 7.3)) : 0); }
      halo.setAttribute('opacity', (.85 * L).toFixed(3));
      core.setAttribute('opacity', (.7 * L).toFixed(3));
      fil.setAttribute('stroke', L > .05 ? '#FFFFFF' : 'rgba(255,255,255,.35)');
      fil.style.filter = `drop-shadow(0 0 ${(6 * L).toFixed(1)}px #fff)`;
      fil.setAttribute('opacity', (.45 + .55 * L).toFixed(3));
      sh.setAttribute('x', sheenX(t, 0, 100));
      marks.forEach(({ m, dx, dy, ph }) => {
        const a = clamp((t - (o.at || 0) - .3 - ph * .3) * 1.5) * (o.fadeTo !== undefined ? 1 - seg(t, o.fadeFrom ?? 0, o.fadeTo) : 1);
        const x = S / 2 + dx * S + Math.sin(t * .9 + ph) * 8 - S * .06, y = S * .55 + dy * S + Math.sin(t * 1.3 + ph * 2) * 10 - S * .12;
        m.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(Math.sin(t + ph) * 12).toFixed(1)}deg)`; m.style.opacity = (a * .85).toFixed(3);
      });
    } };
  };

  /* TÉLÉPHONE en verre : une question, puis la réponse qui tombe d'un coup + chrono */
  C.phone = function (o, scene) {
    const th = TH(o, scene), w = o.w || 270, hh = o.h || 500;
    const el = h('div', `position:absolute;inset:0;${G.glassCSS('dark', th, 42)}overflow:hidden;`);
    el.innerHTML = `<div style="position:absolute;left:50%;top:14px;width:90px;height:22px;margin-left:-45px;border-radius:11px;background:#000;border:1px solid rgba(255,255,255,.18)"></div>
      <div style="position:absolute;left:0;right:0;top:52px;text-align:center;font:500 15px Poppins;letter-spacing:.14em;color:${th.dim}">${o.title || 'ASSISTANT IA'}</div>
      <div class="q" style="position:absolute;right:20px;top:100px;max-width:${w - 70}px;padding:12px 18px;border-radius:20px 20px 4px 20px;background:linear-gradient(90deg,${th.accent2},${th.accent});font:500 18px Poppins;color:#fff;box-shadow:0 0 18px ${th.glow}">${o.question || 'J’ai une question…'}</div>
      <div class="dots" style="position:absolute;left:22px;top:178px;width:76px;height:40px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25)"><i></i><i></i><i></i></div>
      <div class="a" style="position:absolute;left:20px;top:178px;width:${w - 60}px;height:${hh * .42}px;padding:18px;border-radius:20px 20px 20px 4px;background:rgba(255,255,255,.09);border:1.5px solid rgba(255,255,255,.35)"></div>
      <div class="chip" style="position:absolute;right:20px;bottom:30px;padding:8px 16px;border-radius:18px;background:rgba(0,0,0,.4);border:1.5px solid ${th.accent2};font:600 20px Poppins;color:#fff;box-shadow:0 0 16px ${th.glow}">⏱ 3 s</div>`;
    const dots = [...el.querySelectorAll('.dots i')];
    dots.forEach((d, i) => d.style.cssText = `position:absolute;left:${16 + i * 18}px;top:16px;width:9px;height:9px;border-radius:50%;background:#fff`);
    const a = el.querySelector('.a'), q = el.querySelector('.q'), dw = el.querySelector('.dots'), chip = el.querySelector('.chip');
    const lines = [1, .86, .94, .7, .9, .55].map(f => { const l = h('div', `height:10px;border-radius:5px;margin:0 0 14px;width:${(f * 100).toFixed(0)}%;background:rgba(255,255,255,.75);transform-origin:0 0`); a.appendChild(l); return l; });
    const qa = o.askAt ?? .3, ra = o.answerAt ?? 1.2;
    return { el, w, h: hh, update(t) {
      const pq = E.outBack(seg(t, qa, qa + .35)); q.style.opacity = clamp(pq * 2).toFixed(3); q.style.transform = `scale(${(.7 + .3 * pq).toFixed(3)})`; q.style.transformOrigin = '100% 100%';
      const typing = t > qa + .3 && t < ra; dw.style.opacity = typing ? 1 : 0;
      dots.forEach((d, i) => { const ph = (t * 2.4 - i * .2) % 1; d.style.transform = `translateY(${(-Math.max(0, Math.sin(ph * Math.PI * 2)) * 6).toFixed(1)}px)`; });
      const pa = E.outExpo(seg(t, ra, ra + .3)); a.style.opacity = clamp(pa * 2).toFixed(3); a.style.transform = `translateY(${((1 - pa) * 20).toFixed(1)}px)`;
      lines.forEach((l, i) => l.style.transform = `scaleX(${E.outCubic(seg(t, ra + .05 + i * .06, ra + .25 + i * .06)).toFixed(3)})`);
      const pc = E.outBack(seg(t, ra + .35, ra + .7)); chip.style.opacity = clamp(pc * 2).toFixed(3); chip.style.transform = `scale(${(.6 + .4 * pc).toFixed(3)})`;
    } };
  };

  /* HAMEÇON : une ligne descend, l'appât « réponse rapide » brille ; sur o.trapAt, la pointe étincelle */
  C.hook = function (o, scene) {
    const th = TH(o, scene), S = o.size || 300, id = G.uid('hk'), W = S, H = S * 1.5;
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${W}" height="${H}" viewBox="0 0 200 300" style="overflow:visible"><defs>${defs(id)}</defs>
      <g id="${id}grp"><line x1="100" y1="-420" x2="100" y2="120" stroke="rgba(255,255,255,.55)" stroke-width="1.6"/>
        <circle cx="100" cy="120" r="7" fill="none" stroke="url(#${id}s)" stroke-width="3"/>
        <path id="${id}glow" d="M100 127 L100 220 C100 262 60 268 52 236 L66 226" fill="none" stroke="${th.accent}" stroke-width="10" stroke-linecap="round" filter="url(#${id}f)" opacity=".35"/>
        <path d="M100 127 L100 220 C100 262 60 268 52 236 L66 226" fill="none" stroke="url(#${id}s)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M100 127 L100 220 C100 262 60 268 52 236" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-linecap="round"/></g></svg>`);
    const grp = el.querySelector(`#${id}grp`), glow = el.querySelector(`#${id}glow`);
    const bait = C.pill({ text: o.bait || 'Réponse rapide', w: S * .72, h: S * .17, fontSize: S * .062 }, scene); const bm = mountKid(el, bait);
    const sp = C.sparkle({ size: S * .28, glow: th.glow }, scene); const spm = mountKid(el, sp);
    const at = o.at || 0, tr = o.trapAt ?? at + 1.5, k = W / 200;
    return { el, w: W, h: H, update(t) {
      const drop = E.outBack(seg(t, at, at + 1.1)), bob = Math.sin(t * 1.6) * 6;
      const dy = (1 - drop) * -260 + bob, sw = Math.sin(t * 1.1) * 2.5;
      grp.setAttribute('transform', `translate(0 ${dy.toFixed(1)}) rotate(${sw.toFixed(2)} 100 -420)`);
      G.applyT(bm, { x: 100 * k + Math.sin(t * 1.1) * 3, y: (205 + dy) * k, rz: sw * .6, op: clamp(drop * 1.5) }, bait.w, bait.h);
      const p = seg(t, tr, tr + .5); glow.setAttribute('opacity', (.35 + .65 * Math.sin(p * Math.PI)).toFixed(3));
      G.applyT(spm, { x: 66 * k, y: (228 + dy) * k, op: Math.sin(p * Math.PI), s: .6 + .7 * p }, sp.w, sp.h); sp.update(t);
    } };
  };

  /* CERVEAU en verre : la lumière intérieure s'éteint (o.dimAt) ; barre « ENTRAÎNEMENT » qui se vide */
  C.brain = function (o, scene) {
    const th = TH(o, scene), W = o.size || 380, id = G.uid('br'), H = W * .75 + 110;
    const P = 'M30 70 C16 70 8 58 13 46 C6 36 15 21 30 22 C33 10 51 5 61 13 C71 5 92 9 94 23 C107 25 111 42 103 50 C109 62 99 75 86 72 C82 83 66 85 60 77 C52 85 36 83 30 70 Z';
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${W}" height="${W * .75}" viewBox="0 0 120 90" style="overflow:visible"><defs>${defs(id)}<clipPath id="${id}c"><path d="${P}"/></clipPath></defs>
      <path id="${id}halo" d="${P}" fill="${th.accent}" filter="url(#${id}F)" opacity=".8"/>
      <path d="${P}" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="1.5"/>
      <g id="${id}gy" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity=".9">
        <path d="M60 14 C58 30 63 45 60 76"/><path d="M28 34 C36 30 42 38 50 34"/><path d="M22 52 C32 46 40 58 50 52"/><path d="M34 66 C40 60 48 66 52 62"/>
        <path d="M70 30 C78 24 86 34 94 30"/><path d="M68 48 C78 44 88 54 100 48"/><path d="M70 64 C76 58 84 66 90 62"/></g>
      <g clip-path="url(#${id}c)"><rect id="${id}sh" x="-30" y="-10" width="14" height="120" fill="#fff" opacity=".16" transform="rotate(22)"/></g></svg>
      <div style="position:absolute;left:${W * .14}px;top:${W * .75 + 40}px;width:${W * .72}px;">
        <div style="font:500 15px Poppins;letter-spacing:.16em;color:${th.dim};margin-bottom:10px;text-align:center">${o.label || 'ENTRAÎNEMENT'}</div>
        <div style="position:relative;height:16px;border-radius:8px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.35);overflow:hidden"><div class="bar" style="position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:8px;background:linear-gradient(90deg,${th.accent},${th.accent2});box-shadow:0 0 14px ${th.glow};transform-origin:0 0"></div></div></div>`);
    const halo = el.querySelector(`#${id}halo`), gy = el.querySelector(`#${id}gy`), sh = el.querySelector(`#${id}sh`), bar = el.querySelector('.bar');
    const at = o.at || 0, dm = o.dimAt ?? at + 1.5;
    return { el, w: W, h: H, update(t) {
      const q = E.inOutCubic(seg(t, dm - .8, dm + .6));
      const flick = q > 0 && q < 1 ? .4 * Math.max(0, Math.sin(t * 31)) : 0;
      halo.setAttribute('opacity', ((.8 - .72 * q) * (1 - flick) + .04 * Math.sin(t * 2)).toFixed(3));
      gy.setAttribute('opacity', (.9 - .6 * q).toFixed(3));
      sh.setAttribute('x', sheenX(t, 0, 120));
      bar.style.transform = `scaleX(${(1 - .9 * E.inOutCubic(seg(t, at + .3, dm + .4))).toFixed(3)})`;
    } };
  };

  /* BARRE DE RECHERCHE qui s'éteint (o.stopAt) puis bouton VALIDER cliqué (o.clickAt) */
  C.search = function (o, scene) {
    const th = TH(o, scene), w = o.w || 520, hh = o.h || 330;
    const el = h('div', 'position:absolute;inset:0;');
    const bar = h('div', `position:absolute;left:0;top:0;width:${w}px;height:84px;${G.glassCSS('dark', th, 42)}`, `<svg width="34" height="34" viewBox="0 0 24 24" style="position:absolute;left:28px;top:25px"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M15 15 L21 21" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>
      <div class="tx" style="position:absolute;left:80px;top:24px;font:500 24px Poppins;color:#fff;white-space:nowrap">${o.text || 'Je cherche par moi-même'}<span class="caret" style="display:inline-block;width:2px;height:26px;margin-left:4px;vertical-align:-4px;background:#fff"></span></div>
      <div class="strike" style="position:absolute;left:72px;top:41px;height:3px;width:${w - 110}px;background:${th.accent2};box-shadow:0 0 10px ${th.glow};transform-origin:0 0"></div>`);
    el.appendChild(bar);
    const tx = bar.querySelector('.tx'), caret = bar.querySelector('.caret'), strike = bar.querySelector('.strike');
    const btn = C.pill({ text: o.button || 'VALIDER', w: 280, h: 86, fontSize: 30 }, scene); const bm = mountKid(el, btn);
    const cur = C.cursor({ size: 54 }, scene); const cm = mountKid(el, cur);
    const ck = C.icon({ name: 'check', size: 64 }, scene); const km = mountKid(el, ck);
    const st = o.stopAt ?? .8, ca = o.clickAt ?? 1.5;
    return { el, w, h: hh, update(t) {
      const n = (o.text || 'Je cherche par moi-même').length, typed = Math.floor(clamp((t - .1) / .9) * n);
      tx.firstChild.nodeValue = (o.text || 'Je cherche par moi-même').slice(0, Math.max(1, typed));
      caret.style.opacity = (Math.floor(t * 2.4) % 2 && t < st) ? 0 : (t < st ? 1 : 0);
      const ps = E.outCubic(seg(t, st, st + .35)); strike.style.transform = `scaleX(${ps.toFixed(3)})`; strike.style.opacity = ps > 0 ? 1 : 0;
      bar.style.opacity = (1 - .55 * ps).toFixed(3); bar.style.filter = ps > 0 ? `blur(${(1.5 * ps).toFixed(2)}px)` : '';
      const pb = E.outBack(seg(t, st + .1, st + .5)); G.applyT(bm, { x: w / 2, y: 240, s: .7 + .3 * pb, op: clamp(pb * 2) }, btn.w, btn.h);
      const pc = E.outCubic(seg(t, Math.max(st + .2, ca - .5), ca)), press = t > ca && t < ca + .15 ? .94 : 1;
      G.applyT(cm, { x: w / 2 + 260 - 180 * pc, y: 380 - 120 * pc, op: clamp(seg(t, st + .2, st + .4)) }, cur.w, cur.h);
      if (press !== 1) G.applyT(bm, { x: w / 2, y: 240, s: press }, btn.w, btn.h);
      const pk = E.outBack(seg(t, ca + .08, ca + .4)); G.applyT(km, { x: w / 2 + 130, y: 196, s: pk, op: clamp(pk * 2) }, ck.w, ck.h);
    } };
  };

  /* COPIER-COLLER : touches « Ctrl » + « C » enfoncées sur o.copyAt, le texte se duplique d'une feuille à l'autre */
  C.copy = function (o, scene) {
    const th = TH(o, scene), w = o.w || 520, hh = o.h || 420, dw = 200, dh = 250;
    const el = h('div', 'position:absolute;inset:0;');
    const doc = (x, label) => {
      const d = h('div', `position:absolute;left:${x}px;top:0;width:${dw}px;height:${dh}px;${G.glassCSS('dark', th, 16)}overflow:hidden;`,
        `<div style="position:absolute;left:20px;top:16px;font:600 14px Poppins;letter-spacing:.12em;color:${th.dim}">${label}</div>`);
      const ls = [1, .82, .94, .66, .88, .5].map((f, i) => { const l = h('div', `position:absolute;left:20px;top:${52 + i * 30}px;height:9px;width:${((dw - 40) * f).toFixed(0)}px;border-radius:5px;background:rgba(255,255,255,.75);transform-origin:0 0`); d.appendChild(l); return l; });
      el.appendChild(d); return { d, ls };
    };
    const A = doc(0, o.left || 'RÉPONSE'), B = doc(w - dw, o.right || 'MON TEXTE');
    const ghost = h('div', `position:absolute;left:0;top:0;width:${dw - 40}px;height:170px;border-radius:12px;border:1.5px dashed ${th.accent2};background:rgba(110,134,255,.12);box-shadow:0 0 20px ${th.glow}`);
    el.appendChild(ghost);
    const key = (x, txt, kw) => { const k = h('div', `position:absolute;left:${x}px;top:${dh + 60}px;width:${kw}px;height:74px;${G.glassCSS('dark', th, 14)}display:flex;align-items:center;justify-content:center;font:600 26px Poppins;color:#fff;transform-origin:50% 100%`, txt); el.appendChild(k); return k; };
    const k1 = key(w / 2 - 150, o.key1 || 'Ctrl', 150), k2 = key(w / 2 + 14, o.key2 || 'C', 86);
    const ca = o.copyAt ?? 1;
    return { el, w, h: hh, update(t) {
      A.ls.forEach((l, i) => l.style.transform = `scaleX(${E.outCubic(seg(t, .1 + i * .08, .35 + i * .08)).toFixed(3)})`);
      const press = (tt) => { const p = seg(t, tt, tt + .12), r = seg(t, tt + .3, tt + .45); return 1 - .1 * (p - r); };
      const p1 = press(ca - .25), p2 = press(ca - .12);
      k1.style.transform = `scaleY(${p1.toFixed(3)})`; k2.style.transform = `scaleY(${p2.toFixed(3)})`;
      k1.style.boxShadow = p1 < .99 ? `0 0 26px ${th.glow}` : ''; k2.style.boxShadow = p2 < .99 ? `0 0 26px ${th.glow}` : '';
      const g = E.inOutCubic(seg(t, ca, ca + .55));
      ghost.style.transform = `translate(${(20 + (w - dw) * g).toFixed(1)}px,${(48 - Math.sin(g * Math.PI) * 60).toFixed(1)}px)`;
      ghost.style.opacity = (seg(t, ca - .05, ca + .1) * (1 - seg(t, ca + .5, ca + .7))).toFixed(3);
      B.ls.forEach((l, i) => l.style.transform = `scaleX(${(t >= ca + .5 ? 1 : 0)})`);
    } };
  };

  /* PUCE IA en verre : circuits qui pulsent ; panneau d'alerte qui apparaît puis se fait barrer (o.crossAt) */
  C.chip = function (o, scene) {
    const th = TH(o, scene), S = o.size || 280, id = G.uid('ch');
    let pins = '', traces = '';
    for (let i = 0; i < 5; i++) { const p = 64 + i * 18;
      pins += `<rect x="${p - 3}" y="34" width="6" height="16" rx="2" fill="url(#${id}s)"/><rect x="${p - 3}" y="150" width="6" height="16" rx="2" fill="url(#${id}s)"/><rect x="34" y="${p - 3}" width="16" height="6" rx="2" fill="url(#${id}s)"/><rect x="150" y="${p - 3}" width="16" height="6" rx="2" fill="url(#${id}s)"/>`;
      traces += `<path class="tr" d="M${p} 34 L${p} ${8 - i * 2} L${p + (i - 2) * 14} ${-10 - i * 4}" /><path class="tr" d="M${p} 166 L${p} ${190 + i * 2} L${p - (i - 2) * 14} ${208 + i * 4}"/><path class="tr" d="M34 ${p} L${6 - i * 2} ${p} L${-12 - i * 4} ${p + (i - 2) * 14}"/><path class="tr" d="M166 ${p} L${194 + i * 2} ${p} L${212 + i * 4} ${p - (i - 2) * 14}"/>`; }
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${S}" height="${S}" viewBox="0 0 200 200" style="overflow:visible"><defs>${defs(id)}</defs>
      <g fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.6" stroke-linecap="round">${traces}</g>
      <g id="${id}pulse" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" style="filter:drop-shadow(0 0 4px #fff)">${traces}</g>
      ${pins}
      <rect x="44" y="44" width="112" height="112" rx="16" fill="${th.accent}" filter="url(#${id}F)" opacity=".55"/>
      <rect x="44" y="44" width="112" height="112" rx="16" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="2.4"/>
      <rect x="58" y="58" width="84" height="84" rx="10" fill="rgba(0,0,0,.35)" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
      <text x="100" y="114" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="40" fill="#FFFFFF" style="filter:drop-shadow(0 0 8px ${th.glow})">IA</text>
      <g id="${id}warn" opacity="0"><path d="M168 10 L200 66 L136 66 Z" fill="rgba(0,0,0,.6)" stroke="url(#${id}s)" stroke-width="3" stroke-linejoin="round"/>
        <text x="168" y="60" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="34" fill="#FFFFFF">!</text>
        <path id="${id}x" d="M130 4 L206 72" stroke="${th.accent2}" stroke-width="6" stroke-linecap="round" style="filter:drop-shadow(0 0 6px ${th.glow})"/></g></svg>`);
    const pulses = [...el.querySelectorAll(`#${id}pulse .tr`)], warn = el.querySelector(`#${id}warn`), x = el.querySelector(`#${id}x`);
    let lens = null; const at = o.at || 0, wa = o.warnAt ?? at + .6, cr = o.crossAt ?? at + 1.6;
    return { el, w: S, h: S, update(t) {
      if (!lens) lens = pulses.map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = `10 ${L}`; return L; });
      pulses.forEach((p, i) => { const L = lens[i]; const ph = ((t * .9 + i * .137) % 1.4); p.style.strokeDashoffset = (10 - ph * (L + 10)).toFixed(1); p.style.opacity = ph < 1 ? .9 : 0; });
      const pw = E.outBack(seg(t, wa, wa + .35)); warn.setAttribute('opacity', clamp(pw * 2).toFixed(3));
      warn.setAttribute('transform', `translate(168 40) scale(${(.6 + .4 * pw).toFixed(3)}) translate(-168 -40)`);
      const c = E.outCubic(seg(t, cr, cr + .3)); x.style.strokeDasharray = 102; x.style.strokeDashoffset = (102 * (1 - c)).toFixed(1);
    } };
  };

  /* SIÈGE « TA PLACE » : un petit robot vient s'asseoir à ta place (o.sitAt) */
  C.seat = function (o, scene) {
    const th = TH(o, scene), S = o.size || 420, id = G.uid('st'), W = S, H = S;
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${W}" height="${H}" viewBox="0 0 200 200" style="overflow:visible"><defs>${defs(id)}</defs>
      <ellipse cx="100" cy="186" rx="70" ry="7" fill="${th.accent}" filter="url(#${id}f)" opacity=".5"/>
      <path d="M58 40 Q58 28 70 28 L130 28 Q142 28 142 40 L142 118 L58 118 Z" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="2.4"/>
      <rect x="48" y="114" width="104" height="18" rx="8" fill="url(#${id}g)" stroke="url(#${id}s)" stroke-width="2.4"/>
      <path d="M62 132 L56 184 M138 132 L144 184" stroke="url(#${id}s)" stroke-width="6" stroke-linecap="round"/>
      <text x="100" y="127.5" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="10.5" letter-spacing="2" fill="rgba(255,255,255,.85)">${o.label || 'TA PLACE'}</text></svg>`);
    const R = 120, rb = h('div', 'position:absolute;left:0;top:0;', `<svg width="${R}" height="${R * 1.25}" viewBox="0 0 100 125" style="overflow:visible"><defs>${defs(id + 'r')}</defs>
      <line x1="50" y1="6" x2="50" y2="22" stroke="url(#${id}rs)" stroke-width="3"/><circle class="ant" cx="50" cy="6" r="6" fill="#FFFFFF" style="filter:drop-shadow(0 0 6px #fff)"/>
      <rect x="14" y="22" width="72" height="56" rx="18" fill="url(#${id}rg)" stroke="url(#${id}rs)" stroke-width="2.4"/>
      <rect x="22" y="32" width="56" height="34" rx="12" fill="rgba(0,0,0,.55)"/>
      <rect class="eye" x="33" y="42" width="10" height="14" rx="5" fill="#FFFFFF" style="filter:drop-shadow(0 0 5px #fff)"/><rect class="eye" x="57" y="42" width="10" height="14" rx="5" fill="#FFFFFF" style="filter:drop-shadow(0 0 5px #fff)"/>
      <rect x="26" y="82" width="48" height="36" rx="12" fill="url(#${id}rg)" stroke="url(#${id}rs)" stroke-width="2.4"/>
      <circle cx="50" cy="100" r="6" fill="${th.accent}" style="filter:drop-shadow(0 0 6px ${th.glow})"/></svg>`);
    el.appendChild(rb);
    const eyes = [...rb.querySelectorAll('.eye')], k = W / 200, sa = o.sitAt ?? 1.2, st = Math.max(0, sa - 1.1);
    return { el, w: W, h: H, update(t) {
      const p = E.inOutCubic(seg(t, st, sa)), hop = Math.abs(Math.sin(p * Math.PI * 3)) * 16 * (1 - p);
      const land = E.outBack(seg(t, sa, sa + .3));
      const x = (230 - 130 * p) * k, y = (78 - hop - 4 * Math.sin(land * Math.PI)) * k + Math.sin(t * 2.2) * 2 * (t > sa ? 1 : 0);
      rb.style.transform = `translate(${(x - R / 2).toFixed(1)}px,${(y - R * .62).toFixed(1)}px) rotate(${((1 - p) * -8).toFixed(2)}deg)`;
      rb.style.opacity = clamp(seg(t, st - .1, st + .2)).toFixed(3);
      const bl = ((t + .7) % 2.6) < .12 ? .15 : 1; eyes.forEach(e => { e.style.transform = `scaleY(${bl})`; e.style.transformOrigin = 'center'; e.style.transformBox = 'fill-box'; });
    } };
  };

  /* ORDRE : « 1 » et « 2 » restent fixes, les étiquettes s'échangent sur o.swapAt (Toi passe en premier) */
  C.order = function (o, scene) {
    const th = TH(o, scene), w = o.w || 480, hh = o.h || 270, rowH = 100;
    const el = h('div', 'position:absolute;inset:0;');
    const badge = (y, n) => el.appendChild(h('div', `position:absolute;left:0;top:${y}px;width:${rowH}px;height:${rowH}px;border-radius:50%;${G.glassCSS('dark', th, rowH / 2)}display:flex;align-items:center;justify-content:center;font:700 40px Poppins;color:#fff`, n));
    badge(0, '1'); badge(hh - rowH, '2');
    const card = (txt) => { const c = h('div', `position:absolute;left:0;top:0;width:${w - rowH - 26}px;height:${rowH - 10}px;${G.glassCSS('dark', th, 22)}display:flex;align-items:center;padding-left:30px;font:600 32px Poppins;color:#fff;`, txt); el.appendChild(c); return c; };
    const A = card(o.first || 'La machine'), B = card(o.second || 'Toi');
    const sw = o.swapAt ?? 1;
    return { el, w, h: hh, update(t) {
      const p = E.inOutCubic(seg(t, sw, sw + .6)), x0 = rowH + 26, y0 = 5, y1 = hh - rowH + 5;
      A.style.transform = `translate(${(x0 + Math.sin(p * Math.PI) * 50).toFixed(1)}px,${(y0 + (y1 - y0) * p).toFixed(1)}px)`;
      B.style.transform = `translate(${(x0 - Math.sin(p * Math.PI) * 50).toFixed(1)}px,${(y1 + (y0 - y1) * p).toFixed(1)}px)`;
      A.style.opacity = (1 - .5 * p).toFixed(3);
      B.style.boxShadow = `0 40px 90px rgba(0,0,0,.75),0 0 ${(34 * p).toFixed(1)}px ${th.glow}`; B.style.color = p > .5 ? th.accent2 : '#fff';
    } };
  };

  /* CARNET : une main invisible écrit une ligne manuscrite, rature un mot, continue ; un stylo en verre suit la pointe */
  C.notepad = function (o, scene) {
    const th = TH(o, scene), w = o.w || 380, hh = o.h || 400, id = G.uid('np');
    const wave = (y0, x0, x1, amp) => { let d = `M ${x0} ${y0}`; for (let x = x0; x <= x1; x += 6) { const y = y0 + Math.sin(x * .19) * amp + Math.sin(x * .07) * amp * .6; d += ` L ${x} ${y.toFixed(1)}`; } return d; };
    const L1 = wave(150, 40, w - 50, 7), L2 = wave(215, 40, w * .55, 7), X = `M 40 ${206} L ${w * .52} 222 M 44 222 L ${w * .5} 206`, L3 = wave(280, 40, w - 90, 7);
    let rings = ''; for (let i = 0; i < 7; i++) rings += `<rect x="${40 + i * ((w - 80) / 6) - 5}" y="-12" width="10" height="30" rx="5" fill="url(#${id}s)"/>`;
    const el = h('div', `position:absolute;inset:0;${G.glassCSS('dark', th, 18)}`, `<svg width="${w}" height="${hh}" style="position:absolute;inset:0;overflow:visible"><defs>${defs(id)}</defs>${rings}
      <text x="40" y="80" font-family="Poppins" font-weight="600" font-size="20" letter-spacing="2.5" fill="${th.accent2}">${o.title || 'PREMIÈRE IDÉE'}</text>
      ${[150, 215, 280, 345].map(y => `<line x1="30" x2="${w - 30}" y1="${y + 14}" y2="${y + 14}" stroke="rgba(255,255,255,.1)" stroke-width="1"/>`).join('')}
      <g fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 4px rgba(255,255,255,.6))">
      <path class="w" d="${L1}"/><path class="w" d="${L2}"/><path class="w" d="${X}" stroke="${th.accent2}"/><path class="w" d="${L3}"/></g></svg>`);
    const paths = [...el.querySelectorAll('.w')];
    const pen = h('div', 'position:absolute;left:0;top:0;', `<svg width="40" height="150" viewBox="0 0 40 150" style="overflow:visible"><defs>${defs(id + 'p')}</defs>
      <path d="M14 0 L26 0 L26 112 L20 134 L14 112 Z" fill="url(#${id}pg)" stroke="url(#${id}ps)" stroke-width="2"/><path d="M17 120 L20 134 L23 120 Z" fill="#fff"/><rect x="14" y="0" width="12" height="18" rx="3" fill="url(#${id}ps)"/></svg>`);
    el.appendChild(pen);
    let lens = null; const at = o.at || 0, d0 = o.dur || 3;
    const spans = [[0, .34], [.38, .58], [.6, .7], [.72, 1]];
    return { el, w, h: hh, update(t) {
      if (!lens) lens = paths.map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return L; });
      let tip = null;
      paths.forEach((p, i) => { const [a, b] = spans[i]; const q = seg(t, at + .2 + a * d0, at + .2 + b * d0); p.style.strokeDashoffset = (lens[i] * (1 - q)).toFixed(1); if (q > 0 && q < 1) tip = p.getPointAtLength(lens[i] * q); else if (q >= 1 && i === paths.length - 1) tip = p.getPointAtLength(lens[i]); });
      if (!tip) tip = { x: 40, y: 150 };
      pen.style.transform = `translate(${(tip.x - 20).toFixed(1)}px,${(tip.y - 134).toFixed(1)}px) rotate(28deg)`; pen.style.transformOrigin = '20px 134px';
      pen.style.opacity = clamp(seg(t, at, at + .3)).toFixed(3);
    } };
  };

  /* RELAIS : ton idée (TOI) part, rejoint l'IA, puis la ligne file plus loin (o.extendAt) */
  C.relay = function (o, scene) {
    const th = TH(o, scene), w = o.w || 520, hh = o.h || 420, id = G.uid('rl');
    const P1 = `M 70 ${hh - 70} C 150 ${hh - 70} 190 ${hh * .55} 260 ${hh * .55}`, P2 = `M 260 ${hh * .55} C 340 ${hh * .55} 380 ${hh * .2} ${w - 50} 60`;
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${w}" height="${hh}" style="overflow:visible"><defs>${defs(id)}</defs>
      <path d="${P1}" stroke="rgba(255,255,255,.14)" stroke-width="14" fill="none" stroke-linecap="round"/><path d="${P2}" stroke="rgba(255,255,255,.14)" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path class="p" d="${P1}" stroke="${th.accent2}" stroke-width="6" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 8px ${th.glow})"/>
      <path class="p" d="${P2}" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${th.glow})"/>
      <path id="${id}h" d="M ${w - 78} 58 L ${w - 50} 60 L ${w - 62} 86" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg>`);
    const ps = [...el.querySelectorAll('.p')], hd = el.querySelector(`#${id}h`);
    const lab = (txt, x, y) => { const c = C.pill({ text: txt, w: 110, h: 44, fontSize: 18 }, scene); const m = mountKid(el, c); return { c, m, x, y }; };
    const me = C.orb({ size: 56, c1: '#FFFFFF', c2: th.accent2, c3: th.accent }, scene), mm = mountKid(el, me);
    const ia = C.chip({ size: 120, warnAt: 999, crossAt: 999 }, scene), im = mountKid(el, ia);
    const l1 = lab(o.left || 'Toi', 70, hh - 18), l2 = lab(o.mid || 'IA', 260, hh * .55 + 82), l3 = lab(o.far || 'Plus loin', w - 70, 18);
    let lens = null; const at = o.at || 0, ex = o.extendAt ?? at + 1.4;
    return { el, w, h: hh, update(t) {
      if (!lens) lens = ps.map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return L; });
      const q1 = E.inOutCubic(seg(t, at + .3, at + 1.1)), q2 = E.inOutCubic(seg(t, ex, ex + .8));
      ps[0].style.strokeDashoffset = (lens[0] * (1 - q1)).toFixed(1); ps[1].style.strokeDashoffset = (lens[1] * (1 - q2)).toFixed(1);
      hd.setAttribute('opacity', seg(t, ex + .7, ex + .85).toFixed(2));
      G.applyT(mm, { x: 70, y: hh - 70, s: E.outBack(seg(t, at, at + .4)) }, me.w, me.h); me.update(t);
      const pi = E.outBack(seg(t, at + .9, at + 1.3)); G.applyT(im, { x: 260, y: hh * .55, s: pi, op: clamp(pi * 2) }, ia.w, ia.h); ia.update(t);
      [[l1, at + .2], [l2, at + 1.1], [l3, ex + .7]].forEach(([L, a]) => { const p = E.outBack(seg(t, a, a + .35)); G.applyT(L.m, { x: L.x, y: L.y, s: .6 + .4 * p, op: clamp(p * 2) }, L.c.w, L.c.h); });
    } };
  };

  /* GLOBE en verre (ta façon de voir le monde) : bouton « GÉNÉRER » qui échoue (o.failAt), puis le globe s'embrase (o.liveAt) */
  C.globe = function (o, scene) {
    const th = TH(o, scene), S = o.size || 300, id = G.uid('gb');
    let par = ''; for (const k of [-.6, -.3, 0, .3, .6]) { const y = 100 + k * 80, rx = 80 * Math.sqrt(1 - k * k); par += `<ellipse cx="100" cy="${y}" rx="${rx.toFixed(1)}" ry="${(rx * .16).toFixed(1)}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/>`; }
    const el = h('div', 'position:absolute;inset:0;', `<svg width="${S}" height="${S}" viewBox="0 0 200 200" style="overflow:visible"><defs>${defs(id)}
      <radialGradient id="${id}r" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="rgba(255,255,255,.35)"/><stop offset=".5" stop-color="rgba(110,134,255,.18)"/><stop offset="1" stop-color="rgba(20,30,90,.45)"/></radialGradient>
      <clipPath id="${id}c"><circle cx="100" cy="100" r="80"/></clipPath></defs>
      <circle id="${id}halo" cx="100" cy="100" r="86" fill="${th.accent}" filter="url(#${id}F)" opacity=".45"/>
      <circle cx="100" cy="100" r="80" fill="url(#${id}r)"/>
      <g clip-path="url(#${id}c)">${par}<g id="${id}mer" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.2"></g>
        <rect id="${id}sh" x="-40" y="-10" width="22" height="240" fill="#fff" opacity=".14" transform="rotate(22)"/></g>
      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#${id}s)" stroke-width="2.6"/>
      <circle id="${id}core" cx="100" cy="100" r="34" fill="#FFFFFF" filter="url(#${id}F)" opacity="0"/>
      <ellipse cx="72" cy="62" rx="16" ry="9" fill="#fff" opacity=".3" transform="rotate(-35 72 62)"/></svg>`);
    const halo = el.querySelector(`#${id}halo`), mer = el.querySelector(`#${id}mer`), sh = el.querySelector(`#${id}sh`), core = el.querySelector(`#${id}core`);
    const ems = [0, 1, 2, 3, 4, 5].map(() => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); e.setAttribute('cx', 100); e.setAttribute('cy', 100); e.setAttribute('ry', 80); mer.appendChild(e); return e; });
    const rays = C.rays({ n: 20, r1: S * .56, r2: S * .72, stroke: 5, at: o.liveAt ?? 2.5 }, scene), rm = mountKid(el, rays);
    const btn = C.pill({ text: o.button || 'GÉNÉRER', w: 240, h: 70, fontSize: 26 }, scene), bm = mountKid(el, btn);
    const xx = h('div', `position:absolute;left:0;top:0;width:250px;height:5px;border-radius:3px;background:${th.accent2};box-shadow:0 0 12px ${th.glow};transform-origin:0 50%`); el.appendChild(xx);
    const fa = o.failAt ?? 1.2, la = o.liveAt ?? 2.5;
    return { el, w: S, h: S, update(t) {
      ems.forEach((e, i) => { const a = t * .5 + i * Math.PI / 6; e.setAttribute('rx', Math.abs(80 * Math.cos(a)).toFixed(1)); });
      sh.setAttribute('x', sheenX(t, 0, 200));
      const L = E.outCubic(seg(t, la - .1, la + .5));
      halo.setAttribute('opacity', (.45 + .5 * L + .05 * Math.sin(t * 3)).toFixed(3)); core.setAttribute('opacity', (.85 * L).toFixed(3));
      G.applyT(rm, { x: S / 2, y: S / 2 }, rays.w, rays.h); rays.update(t);
      const pb = E.outBack(seg(t, fa - .5, fa - .2)), shake = t > fa && t < fa + .4 ? Math.sin(t * 60) * 8 * (1 - seg(t, fa, fa + .4)) : 0;
      const out = seg(t, la - .4, la);
      G.applyT(bm, { x: S / 2 + shake, y: S + 70, s: .7 + .3 * pb, op: clamp(pb * 2) * (1 - .6 * out) }, btn.w, btn.h);
      const c = E.outCubic(seg(t, fa, fa + .25));
      xx.style.transform = `translate(${(S / 2 - 125 + shake).toFixed(1)}px,${(S + 68).toFixed(1)}px) rotate(-8deg) scaleX(${c.toFixed(3)})`; xx.style.opacity = (c > 0 ? 1 : 0) * (1 - .6 * out);
    } };
  };
})();
