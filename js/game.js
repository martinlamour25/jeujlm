/* =========================================================
   Président·e du Peuple — moteur narratif (vanilla JS)
   Modes Histoire & Survie · arcs (drapeaux) · difficulté · son.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icônes d'UI ---------- */
  const ICONS = {
    phi:
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#ff2b46"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="30" fill="none" stroke="url(#pg)" stroke-width="9"/><rect x="45" y="10" width="10" height="80" rx="5" fill="url(#pg)"/></svg>',
    fist: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10h1V5a1.5 1.5 0 0 1 3 0v5h1V6.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-1.5a1.5 1.5 0 0 1 3 0V11z"/><rect x="6" y="2" width="12" height="2.4" rx="1.2"/></svg>',
    social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c0-7 3-13 9-15-1 9-4 13-9 15z"/><path d="M12 21C6 19 3 14 3 6c6 1 9 6 9 15z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5 7c4 3 10 3 14 0M5 17c4-3 10-3 14 0"/></svg>',
    trophy: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8h20v10a10 10 0 0 1-20 0z"/><path d="M14 12H8v4a6 6 0 0 0 6 6M34 12h6v4a6 6 0 0 1-6 6"/><path d="M24 28v6M18 40h12M20 34h8l2 6H18z"/></svg>'
  };
  // Le φ utilise un dégradé : il faut un id UNIQUE par copie, sinon plusieurs
  // SVG partagent "#pg" et le remplissage disparaît quand l'un d'eux est masqué.
  let _phiN = 0;
  function phiSVG() { const id = "pg" + (++_phiN); return ICONS.phi.replace(/pg/g, id); }

  // Portrait de secours si une clé manque.
  const FALLBACK_PORTRAIT = '<svg viewBox="0 0 200 200"><circle cx="100" cy="80" r="42" fill="#ffd1dc"/><rect x="40" y="120" width="120" height="80" rx="40" fill="#7e5bd8"/></svg>';

  /* ---------- Helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const haptic = (p) => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };
  const resolve = (x, f) => (typeof x === "function" ? x(f) : x);
  // Les bons choix (côté "programme") n'enlèvent JAMAIS de points : on retire les malus.
  // Les mauvais choix et les événements subis gardent leurs malus.
  function effFx(card, logical) {
    const fx = (card[logical] && card[logical].fx) || {};
    if (card.event || logical !== "right") return fx;
    const o = {}; for (const k in fx) if (fx[k] > 0) o[k] = fx[k];
    return o;
  }

  /* ---------- Constantes & équilibrage ---------- */
  const KEYS = ["p", "s", "e", "v"];
  const BEST_M = "ppp2027.best.measures";
  const BEST_S = "ppp2027.best.survival";
  const DIFF_KEY = "ppp2027.diff";
  const GAME_URL = "https://martinlamour25.github.io/jeujlm/";
  const GAME_URL_SHORT = "martinlamour25.github.io/jeujlm";

  const BALANCE = {
    comboBase: 60,           // voix par bonne décision
    diff: {
      decouverte: { start: 62, drift: 0, grace: 4, preview: "num",   label: "Découverte" },
      normal:     { start: 50, drift: 1, grace: 3, preview: "arrow", label: "Normal" },
      insoumis:   { start: 44, drift: 2, grace: 2, preview: "weak",  label: "Insoumis·e" },
      hardcore:   { start: 38, drift: 3, grace: 0, preview: "none",  label: "Hardcore" }
    }
  };
  let difficulty = localStorage.getItem(DIFF_KEY) || "normal";

  /* ---------- État ---------- */
  let S = null;
  let busy = false;

  function bestM() { return parseInt(localStorage.getItem(BEST_M) || "0", 10) || 0; }
  function bestS() { return parseInt(localStorage.getItem(BEST_S) || "0", 10) || 0; }

  /* ---------- Navigation ---------- */
  function show(id) {
    $$(".screen").forEach((s) => {
      const on = s.id === "screen-" + id;
      if (on) { s.hidden = false; requestAnimationFrame(() => s.classList.add("is-active")); }
      else { s.classList.remove("is-active"); setTimeout(() => { if (!s.classList.contains("is-active")) s.hidden = true; }, 380); }
    });
  }
  function toast(msg) {
    const t = $("#toast"); t.innerHTML = msg; t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.classList.remove("show"); setTimeout(() => (t.hidden = true), 300); }, 2400);
  }

  /* ---------- Intro / générique ---------- */
  function buildCrowd() {
    // Foule de silhouettes avec poings levés.
    let g = '<svg viewBox="0 0 400 120" preserveAspectRatio="xMidYMax meet">';
    for (let i = 0; i < 26; i++) {
      const x = 6 + i * 15.2 + (i % 2) * 4;
      const h = 46 + (i % 5) * 7;
      g += '<g fill="#1c0622" opacity="' + (0.5 + (i % 3) * 0.18) + '">' +
        '<circle cx="' + x + '" cy="' + (120 - h) + '" r="7"/>' +
        '<rect x="' + (x - 8) + '" y="' + (120 - h + 6) + '" width="16" height="' + h + '" rx="7"/>' +
        '<rect x="' + (x + 3) + '" y="' + (120 - h - 14) + '" width="4.5" height="18" rx="2"/>' +
        '<circle cx="' + (x + 5) + '" cy="' + (120 - h - 15) + '" r="4"/></g>';
    }
    return g + "</svg>";
  }
  // Cinématique d'ouverture : le chaos du bilan Macron → le peuple se lève → victoire.
  const CINE = [
    { scene: "france_chaos", cls: "dark", kicker: "FRANCE · 2027", title: "LE BILAN",
      lines: ["Hôpitaux saturés, 49.3 à répétition.", "Dette record, services publics à l'os.", "La colère gronde partout."], ms: 3400 },
    { scene: "france_chaos", cls: "dark", kicker: "PENDANT CE TEMPS…", title: "LE POGNON DE DINGUE",
      lines: ["Les milliardaires n'ont jamais été si riches.", "« En même temps »… rien ne change.", "Macron quitte le navire."], ms: 3300 },
    { scene: "meeting", cls: "rise", kicker: "MAIS LE PEUPLE…", title: "SE LÈVE",
      lines: ["Des millions dans la rue.", "Une marée humaine, un seul mot d'ordre :", "« Place au peuple ! »"], ms: 3100 },
    { scene: "election_win", cls: "win", kicker: "SECOND TOUR · MAI 2027", title: "LA FRANCE INSOUMISE\nL'EMPORTE !",
      lines: ["63 % au second tour. Le peuple a tranché.", "Jean-Luc Mélenchon est élu Président.", "À toi, maintenant, de gouverner."], ms: 4200 }
  ];
  function playIntro(done) {
    const intro = $("#intro");
    intro.hidden = false;
    let i = -1, timer = null, ended = false;
    function finish() {
      if (ended) return; ended = true; clearTimeout(timer);
      intro.classList.add("out");
      setTimeout(() => { intro.hidden = true; intro.className = "intro"; if (done) done(); }, 600);
    }
    function renderSlide() {
      const s = CINE[i];
      intro.className = "intro cine " + s.cls + " run";
      intro.innerHTML =
        '<div class="cine-scene">' + ((typeof SCENES !== "undefined" && SCENES[s.scene]) || "") + "</div>" +
        '<div class="cine-vignette"></div>' +
        '<div class="cine-content">' +
        '<p class="cine-kicker">' + s.kicker + "</p>" +
        '<h1 class="cine-title block-text">' + s.title.replace(/\n/g, "<br>") + "</h1>" +
        '<div class="cine-lines">' + s.lines.map((l) => "<span>" + l + "</span>").join("") + "</div>" +
        (s.cls === "win" ? '<div class="cine-phi">' + phiSVG() + "</div>" : "") +
        "</div>" +
        '<button class="intro-skip" id="introSkip">Passer ›</button>' +
        '<p class="cine-hint">Touche pour continuer</p>';
      $("#introSkip").onclick = (e) => { e.stopPropagation(); firstGesture(); finish(); };
      if (s.cls === "win") { SOUND.sfx("fanfare"); SOUND.setMusicLevel(2); }
      else if (s.cls === "rise") { SOUND.sfx("hero"); SOUND.setMusicLevel(1); }
      else { SOUND.sfx("breaking"); SOUND.setMusicLevel(0); }
      haptic(s.cls === "dark" ? [10, 60, 10] : 14);
    }
    function advance() {
      i++; if (i >= CINE.length) { finish(); return; }
      renderSlide(); clearTimeout(timer); timer = setTimeout(advance, CINE[i].ms);
    }
    intro.onclick = () => { firstGesture(); if (!SOUND.isMuted()) SOUND.startMusic(); advance(); };
    advance();
  }

  /* ---------- Audio : premier geste ---------- */
  let unlocked = false;
  function firstGesture() {
    if (unlocked) return; unlocked = true;
    SOUND.unlock();
    if (!SOUND.isMuted()) SOUND.startMusic();
    refreshAudioBtn();
  }
  function refreshAudioBtn() { $("#audioBtn").textContent = SOUND.isMuted() ? "🔇" : "🔊"; }

  /* ---------- Accueil ---------- */
  function initHome() {
    $("#logoPhi").innerHTML = phiSVG();
    const m = bestM(), s = bestS();
    if (m > 0 || s > 0) {
      $("#homeBest").hidden = false;
      $("#homeBestScore").textContent = m;
      $("#homeBestSurv").textContent = s;
    }
  }

  /* ---------- Jauges ---------- */
  function buildGauges() {
    const wrap = $("#gauges"); wrap.innerHTML = "";
    KEYS.forEach((k) => {
      const def = GAUGES[k];
      const el = document.createElement("div");
      el.className = "gauge2"; el.dataset.g = k; el.style.setProperty("--gc", def.color);
      el.innerHTML =
        '<div class="g-delta" id="delta-' + k + '"></div>' +
        '<div class="g-arrow" id="arr-' + k + '"></div>' +
        '<div class="g-ring" id="ring-' + k + '"><span class="g-ico">' + ICONS[def.icon] + "</span></div>" +
        '<div class="g-name">' + def.name + "</div>";
      wrap.appendChild(el);
    });
    paintGauges();
  }
  function paintGauges() {
    let lowest = 100;
    KEYS.forEach((k) => {
      const ring = $("#ring-" + k); const v = clamp(S.g[k], 0, 100);
      ring.style.setProperty("--p", v);
      ring.parentElement.classList.toggle("danger", v <= 22);
      lowest = Math.min(lowest, v);
    });
    // Tension musicale : monte quand un pilier faiblit.
    SOUND.setTension(clamp((40 - lowest) / 40, 0, 1));
  }
  // Aperçu d'impact pendant le drag (flèches ↑/↓ sur les jauges).
  function previewImpact(side, intensity) {
    const prev = BALANCE.diff[S.diff].preview;
    KEYS.forEach((k) => {
      const a = $("#arr-" + k); if (!a) return;
      const fx = S.current ? effFx(CARDS[S.current], S.sideMap[side]) : {}; const v = fx[k] || 0;
      if (!v || prev === "none" || intensity < 0.18) { a.className = "g-arrow"; a.textContent = ""; return; }
      a.className = "g-arrow show " + (v > 0 ? "up" : "down");
      a.style.opacity = Math.min(1, intensity);
      a.textContent = prev === "num" ? (v > 0 ? "+" + v : "" + v) : (v > 0 ? "▲" : "▼");
    });
  }
  function clearPreview() { KEYS.forEach((k) => { const a = $("#arr-" + k); if (a) { a.className = "g-arrow"; a.textContent = ""; } }); }
  function flashDelta(k, d) {
    if (!d) return;
    const el = $("#delta-" + k);
    el.textContent = (d > 0 ? "+" : "") + d;
    el.className = "g-delta show " + (d > 0 ? "up" : "down");
    setTimeout(() => (el.className = "g-delta"), 1100);
  }

  /* ---------- Démarrage ---------- */
  function newGame(mode) {
    const cfg = BALANCE.diff[difficulty] || BALANCE.diff.normal;
    S = { mode, diff: difficulty, flags: {}, rep: {}, seen: {}, recent: [],
      sideMap: { left: "left", right: "right" },
      g: { p: cfg.start, s: cfg.start, e: cfg.start, v: cfg.start },
      turn: 0, month: 0, measures: [], heads: [], voix: 0, combo: 0, maxCombo: 0,
      queue: [], storyIdx: 0, lastId: null, current: null };
    SOUND.setMusicLevel(0);
    busy = false;
    buildGauges();
    $("#playScore").textContent = "0";
    $("#comboBadge").hidden = true;
    updateMandate();
    show("play");
    SOUND.sfx("click");
    setTimeout(nextCard, 420);
  }

  function updateMandate() {
    if (S.mode === "story") {
      // Progression basée sur l'avancée du SCÉNARIO (pas sur le nb de tours,
      // que les événements gonflent) : la barre suit vraiment l'histoire.
      const frac = Math.min(1, S.storyIdx / STORY.length);
      $("#mandateFill").style.width = (frac * 100) + "%";
      $("#mandateLabel").textContent = "Mandat présidentiel";
      $("#mandateYear").textContent = 2027 + Math.min(5, Math.floor(frac * 5));
    } else {
      $("#mandateFill").style.width = ((S.month % 12) / 12 * 100) + "%";
      $("#mandateLabel").textContent = "Survie";
      $("#mandateYear").textContent = "mois " + S.month;
    }
  }

  /* ---------- File d'arcs (then) ---------- */
  function enqueue(then) { if (then && CARDS[then.id]) S.queue.push({ id: then.id, in: then.in || 1 }); }
  function popReady() {
    for (let i = 0; i < S.queue.length; i++) {
      if (S.queue[i].in <= 0) {
        const id = S.queue[i].id; S.queue.splice(i, 1);
        const c = CARDS[id];
        if (c && !S.seen[id] && (!c.cond || c.cond(S.flags))) return id; // arc one-shot, pas de doublon
        i--;
      }
    }
    return null;
  }

  /* ---------- Sélection de la prochaine carte ---------- */
  function pickInfinite() {
    // Évite les répétitions récentes (anti-doublon).
    const recent = S.recent.slice(-Math.min(10, POOL.length - 2));
    let eligible = POOL.filter((id) => {
      const c = CARDS[id];
      return !recent.includes(id) && (!c.cond || c.cond(S.flags));
    });
    if (!eligible.length) eligible = POOL.filter((id) => id !== S.lastId);
    const crisisProb = clamp(0.12 + S.month * 0.02, 0, 0.55);
    const pool = (Math.random() < crisisProb)
      ? eligible.filter((id) => CARDS[id].crisis) : [];
    const list = pool.length ? pool : eligible;
    return list[(Math.random() * list.length) | 0];
  }

  // Événement aléatoire SUBI (non choisi) : matraquage médiatique, manif d'extrême
  // droite, agences de notation… Plus probable quand un pilier est très haut.
  function maybeEvent() {
    if (!EVENTS || !EVENTS.length) return false;
    const cfg = BALANCE.diff[S.diff] || BALANCE.diff.normal;
    if (S.turn < cfg.grace + 1) return false;
    if (S.turn - (S.lastEventTurn == null ? -9 : S.lastEventTurn) < 2) return false;
    const maxG = Math.max.apply(null, KEYS.map((k) => S.g[k]));
    let p = 0.18 + cfg.drift * 0.04 + (maxG > 75 ? 0.18 : maxG > 60 ? 0.09 : 0) +
      (S.mode === "infinite" ? Math.min(0.18, S.month / 220) : 0);
    if (Math.random() > p) return false;
    S.lastEventTurn = S.turn;
    renderCard(pickEvent());
    return true;
  }
  function pickEvent() {
    const top = KEYS.slice().sort((a, b) => S.g[b] - S.g[a])[0];
    const targeted = EVENTS.filter((id) => CARDS[id].hits === top);
    const pool = (Math.random() < 0.65 && targeted.length) ? targeted : EVENTS;
    let id = pool[(Math.random() * pool.length) | 0];
    if (id === S.lastId && pool.length > 1) id = pool[(pool.indexOf(id) + 1) % pool.length];
    return id;
  }

  function nextCard() {
    updateMandate();
    if (S.mode === "infinite") SOUND.setMusicLevel(Math.min(4, Math.floor(S.month / 21)));
    const ready = popReady();
    if (ready) return renderCard(ready);
    if (maybeEvent()) return;

    if (S.mode === "story") {
      while (S.storyIdx < STORY.length) {
        const item = STORY[S.storyIdx++];
        if (typeof item === "object" && item.act) { return showAct(item); }
        const c = CARDS[item];
        if (c && !S.seen[item] && (!c.cond || c.cond(S.flags))) return renderCard(item);
      }
      return endGame("story_end", null);
    } else {
      return renderCard(pickInfinite());
    }
  }

  /* ---------- Overlay d'acte ---------- */
  function showAct(act) {
    S.actNum = (S.actNum || 0) + 1;
    SOUND.setMusicLevel(Math.min(4, S.actNum)); // chaque acte = musique plus rapide/rythmée
    const ov = $("#actOverlay");
    $("#actScene").innerHTML = (SCENES && SCENES[act.scene]) || "";
    $("#actKicker").textContent = act.act;
    $("#actTitle").textContent = act.title;
    $("#actTitle").className = "act-title block-text";
    ov.hidden = false; ov.classList.remove("out");
    requestAnimationFrame(() => ov.classList.add("show"));
    SOUND.sfx("crisis");
    let gone = false;
    const close = () => {
      if (gone) return; gone = true;
      ov.classList.add("out"); ov.classList.remove("show");
      setTimeout(() => { ov.hidden = true; ov.onclick = null; nextCard(); }, 500);
    };
    ov.onclick = close;
    setTimeout(close, 2600);
  }

  /* ---------- Rendu d'une carte ---------- */
  function renderCard(id) {
    S.current = id; S.lastId = id;
    S.seen[id] = true;
    S.recent.push(id); if (S.recent.length > 12) S.recent.shift();
    // Alterne aléatoirement le côté du bon choix (le "programme" n'est plus toujours à droite).
    const flip = Math.random() < 0.5;
    S.sideMap = { left: flip ? "right" : "left", right: flip ? "left" : "right" };
    const c = CARDS[id]; const f = S.flags; const theme = GAUGES[c.tag];
    const card = $("#card");

    card.style.transition = "none";
    card.style.transform = "translate(-50%, 0) rotate(0deg)";
    card.style.opacity = "0";
    card.classList.toggle("is-crisis", !!c.crisis);
    card.style.setProperty("--accent", theme.color);

    card.classList.toggle("is-hero", !!c.hero);
    card.classList.toggle("is-rare", c.rarity === "rare" || c.rarity === "legendary");
    card.classList.toggle("is-event", !!c.event);
    $("#cardScene").innerHTML = (SCENES && SCENES[c.scene]) || "";
    const ribbon = $("#cardRibbon");
    ribbon.hidden = !(c.topical || c.event);
    ribbon.textContent = c.event ? "🔴 IMPRÉVU" : (c.crisis ? "🔴 BREAKING" : "⚡ ACTUALITÉ");
    // Les événements ont désormais deux vraies options (on subit moins bêtement).
    $("#choiceL").style.display = "";
    $("#choiceR").classList.remove("full");
    const av = $("#cardAvatar");
    av.innerHTML = (CHAR_ART && CHAR_ART[c.char]) || FALLBACK_PORTRAIT;
    av.style.boxShadow = "0 0 0 3px " + theme.color + "55, 0 10px 24px -6px rgba(0,0,0,.6)";

    $("#cardWho").textContent = (typeof CHARACTERS[c.char] === "string" ? CHARACTERS[c.char] : (CHARACTERS[c.char] && CHARACTERS[c.char].name)) || "";
    $("#cardText").innerHTML = resolve(c.text, f);
    $("#choiceLlabel").textContent = c[S.sideMap.left].label;
    $("#choiceRlabel").textContent = c[S.sideMap.right].label;
    $("#stampL").textContent = c[S.sideMap.left].label;
    $("#stampR").textContent = c[S.sideMap.right].label;
    renderPeek();
    setHints(0);
    clearPreview();
    if (c.hero) SOUND.sfx("hero");
    else if (c.crisis && c.topical) SOUND.sfx("breaking");
    else if (c.crisis) SOUND.sfx("crisis");

    requestAnimationFrame(() => {
      card.style.transition = "transform .45s cubic-bezier(.2,1,.3,1), opacity .35s ease";
      card.style.transform = "translate(-50%, 0) rotate(0deg)";
      card.style.opacity = "1";
      busy = false;
    });
  }

  // Effet « pile de cartes » : carte fantôme derrière.
  function renderPeek() {
    const p = $("#cardPeek"); if (!p) return;
    if (!p.dataset.init) { p.innerHTML = '<div class="peek-phi">' + phiSVG() + "</div>"; p.dataset.init = "1"; }
  }

  // Petite secousse d'écran.
  function shake(intensity) {
    const app = $("#app"); app.style.setProperty("--shk", (intensity || 6) + "px");
    app.classList.remove("shake"); void app.offsetWidth; app.classList.add("shake");
  }

  // Gerbe d'emojis depuis le centre de la carte.
  function burst(emoji, n) {
    const deck = $("#deck"); const rect = deck.getBoundingClientRect();
    for (let i = 0; i < (n || 10); i++) {
      const el = document.createElement("div"); el.className = "particle"; el.textContent = emoji;
      el.style.left = rect.width / 2 + "px"; el.style.top = rect.height / 2 + "px";
      const ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 120;
      el.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      el.style.setProperty("--dy", (Math.sin(ang) * dist - 40) + "px");
      el.style.fontSize = (16 + Math.random() * 16) + "px";
      deck.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  function updateCombo(gain) {
    const b = $("#comboBadge");
    if (S.combo >= 2) {
      b.hidden = false; $("#comboX").textContent = S.combo;
      $("#comboVoix").textContent = "+" + (gain || 0);
      b.classList.remove("pulse"); void b.offsetWidth; b.classList.add("pulse");
    } else { b.hidden = true; }
  }

  function setHints(dx) {
    const r = clamp(dx / 120, -1, 1);
    $("#stampR").style.opacity = r > 0 ? r : 0;
    $("#stampL").style.opacity = r < 0 ? -r : 0;
    $("#hintR").style.opacity = r > 0 ? r * 0.9 : 0;
    $("#hintL").style.opacity = r < 0 ? -r * 0.9 : 0;
    $("#choiceR").classList.toggle("hot", r > 0.25);
    $("#choiceL").classList.toggle("hot", r < -0.25);
    if (Math.abs(r) < 0.18) clearPreview();
    else previewImpact(r > 0 ? "right" : "left", Math.abs(r));
  }

  /* ---------- Swipe ---------- */
  let drag = null;
  function bindSwipe() {
    const card = $("#card");
    const start = (x) => { if (busy) return; drag = { x, dx: 0 }; card.style.transition = "none"; };
    const move = (x) => {
      if (!drag) return; drag.dx = x - drag.x;
      card.style.transform = "translate(-50%, " + (Math.abs(drag.dx) * 0.04) + "px) translateX(" + drag.dx + "px) rotate(" + (drag.dx / 18) + "deg)";
      setHints(drag.dx);
    };
    const end = () => {
      if (!drag) return; const dx = drag.dx; drag = null;
      if (Math.abs(dx) > 95) commit(dx > 0 ? "right" : "left");
      else { card.style.transition = "transform .3s cubic-bezier(.3,1.4,.4,1)"; card.style.transform = "translate(-50%, 0) rotate(0deg)"; setHints(0); }
    };
    card.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
    card.addEventListener("touchmove", (e) => move(e.touches[0].clientX), { passive: true });
    card.addEventListener("touchend", end);
    card.addEventListener("mousedown", (e) => { start(e.clientX); e.preventDefault(); });
    window.addEventListener("mousemove", (e) => { if (drag) move(e.clientX); });
    window.addEventListener("mouseup", end);
    $("#choiceL").addEventListener("click", () => { if (!busy) commit("left"); });
    $("#choiceR").addEventListener("click", () => { if (!busy) commit("right"); });
  }

  /* ---------- Validation d'un choix ---------- */
  function commit(side) {
    if (busy || !S.current) return;
    busy = true;
    const c = CARDS[S.current]; const logical = S.sideMap[side]; const opt = c[logical];
    const dir = side === "right" ? 1 : -1;
    SOUND.sfx("swipe"); haptic(12);
    clearPreview();

    const card = $("#card");
    card.style.transition = "transform .42s cubic-bezier(.4,0,.6,1), opacity .42s ease";
    card.style.transform = "translate(-50%,0) translateX(" + dir * 140 + "vw) rotate(" + dir * 22 + "deg)";
    card.style.opacity = "0";
    setHints(0);

    // Effets sur les jauges (bons choix : malus retirés via effFx)
    const fx = effFx(c, logical);
    KEYS.forEach((k) => { if (fx[k]) { S.g[k] = clamp(S.g[k] + fx[k], 0, 100); flashDelta(k, fx[k]); } });

    // Réputation des personnages
    if (opt.rep) Object.keys(opt.rep).forEach((id) => { S.rep[id] = clamp((S.rep[id] || 0) + opt.rep[id], -3, 3); });

    // Drapeaux + arcs + mesures
    if (opt.set) opt.set.forEach((fl) => (S.flags[fl] = true));
    if (opt.then) enqueue(opt.then);
    if (opt.head) S.heads.push(opt.head);
    if (opt.measure && S.measures.indexOf(opt.measure) === -1) {
      S.measures.push(opt.measure);
      $("#playScore").textContent = S.measures.length;
    }

    // Élan populaire (combo) + voix — basé sur le CONTENU (choix conforme), pas le côté
    const program = !c.event && !opt.betray && (logical === "right" || !!opt.measure);
    let gain = 0;
    if (program) {
      S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo);
      const mult = 1 + Math.floor(S.combo / 2) * 0.5;
      gain = Math.round(BALANCE.comboBase * mult);
      S.voix += gain;
      if (S.combo >= 3) SOUND.sfx("combo");
      if (opt.measure) { SOUND.sfx("coin"); burst("✊", 12); }
      else burst("✊", 5);
    } else if (opt.betray) {
      if (S.combo >= 2) toast("💔 Élan populaire brisé !");
      S.combo = 0; burst("💸", 8);
    }
    updateCombo(gain); S.lastGain = gain;

    S.turn++; S.month += 3;
    applyPressure();
    S.queue.forEach((q) => (q.in--));
    paintGauges();

    // Secousse si crise ou pilier en danger
    if (c.crisis || KEYS.some((k) => S.g[k] <= 22)) shake(c.crisis ? 9 : 6);

    setTimeout(() => showFeedback(opt, fx), 260);
  }

  function applyPressure() {
    const cfg = BALANCE.diff[S.diff] || BALANCE.diff.normal;
    if (S.turn < cfg.grace) return;            // garde-fou : pas de pression au début
    let drift = cfg.drift;
    if (S.mode === "infinite") drift = cfg.drift + Math.floor(S.month / 10);
    else if (S.turn > 8) drift += 1;
    if (drift <= 0) return;
    // le pilier le plus haut subit la pression (force l'équilibre) + un aléatoire
    const sorted = KEYS.slice().sort((a, b) => S.g[b] - S.g[a]);
    S.g[sorted[0]] = clamp(S.g[sorted[0]] - drift, 0, 100);
    const r = KEYS[(Math.random() * KEYS.length) | 0];
    S.g[r] = clamp(S.g[r] - Math.max(1, drift - 1), 0, 100);
  }

  function showFeedback(opt, fx) {
    fx = fx || opt.fx || {};
    if (!opt.measure) SOUND.sfx(Object.values(fx).some((x) => x < 0) ? "bad" : "good");
    const chips = KEYS.filter((k) => fx[k]).map((k) =>
      '<span class="d-chip ' + (fx[k] > 0 ? "up" : "down") + '" style="--gc:' + GAUGES[k].color + '">' +
      '<span class="d-ico">' + ICONS[GAUGES[k].icon] + "</span>" + (fx[k] > 0 ? "+" : "") + fx[k] + "</span>").join("");
    let voixChip = S.lastGain ? '<span class="d-chip voix">🔥 +' + S.lastGain + " voix</span>" : "";
    $("#feedbackDeltas").innerHTML = chips + voixChip;
    $("#feedbackResult").innerHTML = opt.result + (opt.quip ? ' <span class="quip">' + opt.quip + "</span>" : "");
    $("#feedbackNote").innerHTML = "<strong>📖 L'Avenir en commun :</strong> " + opt.note;
    $("#feedbackTag").innerHTML = opt.measure ? "✅ Mesure adoptée : " + opt.measure : "📖 L'Avenir en commun";
    if (opt.measure) toast("✅ " + opt.measure);
    $("#feedback").classList.add("show");
  }

  function afterFeedback() {
    $("#feedback").classList.remove("show");
    const dead = KEYS.find((k) => S.g[k] <= 0);
    if (dead) { setTimeout(() => endGame("defeat", dead), 320); return; }
    setTimeout(nextCard, 260);
  }

  /* ---------- Fin de partie ---------- */
  function endGame(kind, deadKey) {
    SOUND.stopMusic();
    S.outcome = kind === "defeat" ? "defeat" : "win";
    const survivedMonths = S.month;
    if (S.measures.length > bestM()) localStorage.setItem(BEST_M, String(S.measures.length));
    if (survivedMonths > bestS()) localStorage.setItem(BEST_S, String(survivedMonths));

    const mascot = $("#endMascot");
    $("#endYearsLbl").textContent = S.mode === "infinite" ? "mois tenus" : "années tenues";

    if (kind === "defeat") {
      const d = DEFEATS[deadKey];
      mascot.src = "assets/turtle/turtle-balai.png"; // la tortue balaie les dégâts
      $("#endKicker").textContent = "Présidence interrompue";
      $("#endTitle").textContent = d.title;
      $("#endSub").innerHTML = d.text + " Mais le combat continue. ✊";
      setUne("defeat", deadKey);
      SOUND.sfx("lose");
    } else {
      // Fin du mode histoire
      const healthy = KEYS.every((k) => S.g[k] >= 35);
      const sixth = S.flags.sixth_republic;
      mascot.src = "assets/turtle/turtle-megaphone.png"; // la tortue haranguе la foule
      $("#endKicker").textContent = "Mandat accompli · 2032";
      if (sixth && healthy && S.measures.length >= 16) {
        $("#endTitle").textContent = "Raz-de-marée populaire !";
        $("#endSub").innerHTML = "Tu as tenu les cinq ans et fait adopter l'essentiel du programme. <strong>La 6<sup>e</sup> République est proclamée</strong> et l'avenir s'écrit en commun.";
      } else if (sixth) {
        $("#endTitle").textContent = "La 6ᵉ République !";
        $("#endSub").innerHTML = "Tu as bouclé ton mandat et proclamé la 6<sup>e</sup> République. Le peuple devient souverain.";
      } else {
        $("#endTitle").textContent = "Mandat accompli";
        $("#endSub").innerHTML = "Tu as tenu jusqu'en 2032, mais sans aller au bout de la rupture démocratique. Le combat continue.";
      }
      setUne("win", null);
      SOUND.sfx("fanfare");
    }

    $("#endMeasures").textContent = S.measures.length;
    $("#endYears").textContent = S.mode === "infinite" ? survivedMonths : Math.min(5, Math.round(S.turn / STORY.filter((x) => typeof x === "string").length * 5));
    $("#endGrade").textContent = grade(kind, S.measures.length);

    const list = $("#endMeasureList");
    const vline = '<p class="eml-voix">🔥 ' + S.voix.toLocaleString("fr-FR") + " voix rassemblées · meilleur combo ×" + S.maxCombo + "</p>";
    list.innerHTML = vline + (S.measures.length
      ? '<p class="eml-title">Mesures de L\'Avenir en commun adoptées</p><div class="eml-chips">' +
        S.measures.map((m) => '<span class="eml-chip">✓ ' + m + "</span>").join("") + "</div>"
      : '<p class="eml-title">Aucune mesure adoptée… rejoue pour appliquer le programme&nbsp;!</p>');

    show("end");
    if (kind !== "defeat") startConfetti();
  }

  function setUne(kind, deadKey) {
    const une = $("#une"), head = $("#uneHead");
    let txt;
    if (kind === "win") {
      txt = S.flags.sixth_republic ? "LA 6ᵉ RÉPUBLIQUE EST PROCLAMÉE"
        : (S.heads.length ? S.heads[S.heads.length - 1] : "MANDAT ACCOMPLI");
    } else {
      txt = { p: "LE PEUPLE DESTITUE LE POUVOIR", s: "LA FRANCE SE SOULÈVE",
        e: "LA PLANÈTE EN FEU, LE PAYS SUFFOQUE", v: "LA FRANCE PLACÉE SOUS TUTELLE" }[deadKey] || "FIN DE PARTIE";
    }
    head.textContent = txt; une.hidden = false;
  }

  function grade(kind, n) {
    const bonus = S.maxCombo >= 6 ? 1 : 0;
    if (kind === "defeat") return "✊";
    if (n + bonus >= 18) return "A+"; if (n + bonus >= 14) return "A";
    if (n + bonus >= 10) return "B"; if (n + bonus >= 6) return "C"; return "D";
  }

  /* ---------- Confettis ---------- */
  let confettiRAF = null;
  function startConfetti() {
    const cv = $("#confetti"); const ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
    const colors = ["#ff2b46", "#ffd166", "#ff8aa0", "#fff7f9", "#7e5bd8", "#2bd97a"];
    const parts = Array.from({ length: 130 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * -cv.height, r: (4 + Math.random() * 6) * dpr,
      c: colors[(Math.random() * colors.length) | 0], vy: (2 + Math.random() * 4) * dpr,
      vx: (Math.random() - 0.5) * 2 * dpr, a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3
    }));
    let frames = 0;
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => {
        p.y += p.vy; p.x += p.vx; p.a += p.va;
        if (p.y > cv.height + 20) { p.y = -20; p.x = Math.random() * cv.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore();
      });
      if (++frames < 500) confettiRAF = requestAnimationFrame(draw);
    }
    cancelAnimationFrame(confettiRAF); draw();
  }

  /* ---------- Partage ---------- */
  function shareText() {
    return "✊ J'ai gouverné selon L'Avenir en commun dans « Président·e du Peuple » : " +
      S.measures.length + " mesures, " + S.voix.toLocaleString("fr-FR") + " voix" +
      (S.mode === "infinite" ? ", " + S.month + " mois tenus" : "") + "  ·  bilan « " +
      $("#endTitle").textContent + " ».\n\n🐢 Tiens-tu le mandat jusqu'en 2032 ? Joue (gratuit) : " +
      GAME_URL + "\n#PlaceAuPeuple #Mélenchon2027";
  }
  async function shareResult() {
    const text = shareText();
    try {
      if (navigator.share) await navigator.share({ title: "Président·e du Peuple", text, url: GAME_URL });
      else { await navigator.clipboard.writeText(text); toast("Lien + bilan copiés, à partager&nbsp;! 🔥"); }
    } catch (e) {}
  }

  function loadImg(src) {
    return new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  }
  function ringOn(ctx, cx, cy, r, val, color, label) {
    ctx.lineCap = "round"; ctx.lineWidth = 20;
    ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = color; ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (Math.max(0, val) / 100)); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "800 38px 'Bricolage Grotesque', Inter, sans-serif";
    ctx.fillText(Math.round(val) + "", cx, cy + 13);
    ctx.fillStyle = "#e9d3e8"; ctx.font = "700 23px Inter, sans-serif"; ctx.fillText(label, cx, cy + r + 38);
  }
  function wrapLines(ctx, text, maxW) {
    const words = String(text).split(" "); const lines = []; let line = "";
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line); return lines;
  }
  function fitLines(ctx, text, maxW, startPx, minPx, weight) {
    let px = startPx, lines;
    do { ctx.font = weight + " " + px + "px 'Bricolage Grotesque', Inter, sans-serif";
      lines = wrapLines(ctx, text, maxW); px -= 3; } while (lines.length > 2 && px > minPx);
    return { lines: lines, px: px + 3 };
  }

  // Image de bilan personnalisée, fun & partageable (1080×1350) avec lien + tortue.
  async function shareImage() {
    const cv = $("#shareCanvas"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
    const win = S.outcome !== "defeat";
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#4a1450"); grad.addColorStop(1, "#1c0622");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 50; i++) ctx.fillRect((i * 53) % W, (i * 89) % H, 3, 3);
    ["#3f7fe0", "#fff7f9", "#ff2b46"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, 14 + i * 9, W, 9); });

    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffd166"; ctx.font = "800 34px 'Bricolage Grotesque', Inter, sans-serif";
    ctx.fillText("✊  PRÉSIDENT·E DU PEUPLE", W / 2, 86);
    ctx.fillStyle = "#d7b9d6"; ctx.font = "600 23px Inter, sans-serif";
    ctx.fillText("Mode " + (S.mode === "infinite" ? "Survie" : "Histoire") + " · " + ((BALANCE.diff[S.diff] || {}).label || ""), W / 2, 120);

    // Titre de fin (auto-ajusté, centré)
    const tFit = fitLines(ctx, ($("#endTitle").textContent || "").toUpperCase(), W - 120, 52, 34, "800");
    ctx.fillStyle = win ? "#ffd166" : "#ff8aa0"; ctx.font = "800 " + tFit.px + "px 'Bricolage Grotesque', Inter, sans-serif";
    const tLh = tFit.px + 8; const ty = 180;
    tFit.lines.forEach((l, i) => ctx.fillText(l, W / 2, ty + i * tLh));

    // Bandeau « Une » (taille adaptée au texte, centré)
    const hFit = fitLines(ctx, $("#uneHead").textContent || "", W - 180, 30, 21, "800");
    const bandTop = ty + (tFit.lines.length - 1) * tLh + 34;
    const hLh = hFit.px + 6;
    const bandH = 54 + hFit.lines.length * hLh;
    ctx.fillStyle = "#fff7f9"; ctx.fillRect(50, bandTop, W - 100, bandH);
    ctx.fillStyle = "#ff2b46"; ctx.fillRect(50, bandTop, W - 100, 6);
    ctx.fillStyle = "#ff2b46"; ctx.font = "800 20px 'Bricolage Grotesque', Inter, sans-serif";
    ctx.fillText("LA UNE DU PEUPLE", W / 2, bandTop + 32);
    ctx.fillStyle = "#1a0820"; ctx.font = "800 " + hFit.px + "px 'Bricolage Grotesque', Inter, sans-serif";
    hFit.lines.forEach((l, i) => ctx.fillText(l, W / 2, bandTop + 56 + i * hLh));

    // 4 jauges finales (anneaux), centrées
    const gy = bandTop + bandH + 96;
    [["p", "✊ Peuple"], ["s", "⚖ Social"], ["e", "🌱 Planète"], ["v", "🕊 Souver."]]
      .forEach((c, i) => ringOn(ctx, W / 2 + (i - 1.5) * 246, gy, 58, S.g[c[0]], GAUGES[c[0]].color, c[1]));

    // Stats (centrées)
    const sy = gy + 158;
    const stat = (x, big, lab) => {
      ctx.fillStyle = "#ffd166"; ctx.font = "800 66px 'Bricolage Grotesque', Inter, sans-serif"; ctx.fillText(big, x, sy);
      ctx.fillStyle = "#d7b9d6"; ctx.font = "600 24px Inter, sans-serif"; ctx.fillText(lab, x, sy + 36);
    };
    stat(W / 2 - 300, String(S.measures.length), "mesures");
    stat(W / 2, S.voix > 999 ? (S.voix / 1000).toFixed(1) + "k" : String(S.voix), "voix");
    stat(W / 2 + 300, $("#endGrade").textContent, "bilan");

    // Pied : LIEN bien visible + incitation (bande pleine largeur en bas)
    const fb = H - 104;
    ctx.fillStyle = "#ff5c6e"; ctx.fillRect(0, fb, W, 104);
    ctx.fillStyle = "#fff7f9"; ctx.textAlign = "center"; ctx.font = "800 28px 'Bricolage Grotesque', Inter, sans-serif";
    ctx.fillText("Tiens-tu le mandat jusqu'en 2032 ?", W / 2, fb + 44);
    ctx.fillStyle = "#fff"; ctx.font = "800 40px 'Bricolage Grotesque', Inter, sans-serif";
    ctx.fillText(GAME_URL_SHORT, W / 2, fb + 86);

    // Tortue mascotte (bas-gauche, posée sur la bande, sans croiser le texte centré)
    const im = await loadImg(win ? "assets/turtle/turtle-megaphone.png" : "assets/turtle/turtle-balai.png");
    if (im) { const tw = 150, th = tw * (im.height / im.width || 1.2); ctx.drawImage(im, 12, fb - th + 56, tw, th); }

    cv.toBlob((blob) => {
      if (!blob) { toast("Image indisponible ici (essaie en ligne)"); return; }
      const file = new File([blob], "mon-bilan-president-du-peuple.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Président·e du Peuple", text: shareText(), url: GAME_URL }).catch(() => {});
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
        a.download = file.name; a.click(); toast("Image enregistrée, partage-la&nbsp;! 🔥");
      }
    }, "image/png");
  }
  function wrapText(ctx, text, x, y, maxW, lh) {
    const words = String(text).split(" "); let line = "", yy = y;
    for (const w of words) {
      if (ctx.measureText(line + w).width > maxW && line) { ctx.fillText(line.trim(), x, yy); line = ""; yy += lh; }
      line += w + " ";
    }
    ctx.fillText(line.trim(), x, yy); return yy;
  }

  /* ---------- Modale ---------- */
  function openModal(t, h) { $("#modalTitle").textContent = t; $("#modalBody").innerHTML = h; $("#modal").hidden = false; }
  function closeModal() { $("#modal").hidden = true; }

  const HOW_HTML =
    '<div class="how-hero"><img src="assets/turtle/turtle-tract.png" alt="" /></div>' +
    '<p class="lead">Tu viens d\'être élu·e Président·e en 2027. Des personnages viennent te voir avec un dilemme.</p>' +
    '<ul class="how">' +
    '<li><span class="how-ico">👆</span><span>Glisse la carte à gauche ou à droite (ou les deux boutons) pour décider.</span></li>' +
    '<li><span class="how-ico">📊</span><span>Tes décisions font bouger 4 piliers : <b>Peuple</b>, <b>Social</b>, <b>Planète</b>, <b>Souveraineté</b>.</span></li>' +
    '<li><span class="how-ico">🔗</span><span>Tes choix ont des suites : ils déclenchent des événements et les personnages s\'en souviennent.</span></li>' +
    '<li><span class="how-ico">⏳</span><span>La pression du pouvoir et les crises grignotent tes piliers : garde l\'équilibre.</span></li>' +
    '<li><span class="how-ico">💥</span><span>Si un pilier tombe à zéro, c\'est la chute (censure, révolte, effondrement, tutelle).</span></li>' +
    '<li><span class="how-ico">🔥</span><span>Enchaîne les bons choix pour gagner des combos et des voix. Les bons choix ne coûtent jamais de points.</span></li>' +
    '<li><span class="how-ico">🐢</span><span>Affronte Macron, Le Pen, Bardella, Bolloré… et reçois l\'appui de Jean-Luc Mélenchon.</span></li>' +
    "</ul>" +
    '<p class="how-foot">En fin de partie, partage ta <em>Une du Peuple</em> et défie tes amis !</p>';

  const ABOUT_HTML =
    "<p><b>Président·e du Peuple</b> est un <b>jeu citoyen non officiel</b>, pour faire découvrir le programme " +
    "<em>L'Avenir en commun</em> et soutenir la candidature de Jean-Luc Mélenchon en 2027.</p>" +
    "<p>Les dilemmes et mesures viennent du programme. Les crises s'inspirent de l'actualité 2025-2026 (tarifs de Trump et crise du Groenland, budget d'austérité et 49.3, détroit d'Ormuz, canicules et COP30, Ukraine, Gaza, AI Act…).</p>" +
    "<p>Aucune donnée collectée : seuls tes records restent sur l'appareil.</p>" +
    '<p>🐢 Joue en ligne &amp; partage : <a href="' + GAME_URL + '" style="color:#ffd166;font-weight:700">martinlamour25.github.io/jeujlm</a></p>' +
    '<p style="color:#d7b9d6;font-size:.85rem">Fait avec passion pour la révolution citoyenne. ✊</p>';

  /* ---------- Liaisons ---------- */
  function bind() {
    document.addEventListener("pointerdown", firstGesture, { once: false });

    $("#btnPlay").addEventListener("click", () => { SOUND.sfx("click"); show("modes"); });
    $("#btnHow").addEventListener("click", () => { SOUND.sfx("click"); openModal("Comment jouer", HOW_HTML); });
    $("#btnAbout").addEventListener("click", () => { SOUND.sfx("click"); openModal("À propos", ABOUT_HTML); });
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

    $("#modesBack").addEventListener("click", () => show("home"));
    $("#modeStory").addEventListener("click", () => { firstGesture(); if (!SOUND.isMuted()) SOUND.startMusic(); newGame("story"); });
    $("#modeInfinite").addEventListener("click", () => { firstGesture(); if (!SOUND.isMuted()) SOUND.startMusic(); newGame("infinite"); });

    $("#playQuit").addEventListener("click", () => { SOUND.stopMusic(); show("home"); });
    $("#feedbackNext").addEventListener("click", afterFeedback);

    $("#endReplay").addEventListener("click", () => { if (!SOUND.isMuted()) SOUND.startMusic(); newGame(S ? S.mode : "story"); });
    $("#endShare").addEventListener("click", shareResult);
    $("#endImage").addEventListener("click", shareImage);

    // Sélecteur de difficulté
    $$(".diff-chip").forEach((chip) => chip.addEventListener("click", () => {
      $$(".diff-chip").forEach((c) => c.classList.remove("is-on"));
      chip.classList.add("is-on"); difficulty = chip.dataset.d;
      localStorage.setItem(DIFF_KEY, difficulty); SOUND.sfx("click");
    }));

    $("#audioBtn").addEventListener("click", () => {
      const muted = SOUND.toggle();
      if (!muted) { SOUND.unlock(); SOUND.startMusic(); }
      refreshAudioBtn();
    });

    bindSwipe();
    document.addEventListener("gesturestart", (e) => e.preventDefault());
  }

  function registerSW() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
      navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  function init() {
    initHome(); bind(); registerSW(); refreshAudioBtn();
    $$(".diff-chip").forEach((c) => c.classList.toggle("is-on", c.dataset.d === difficulty));
    playIntro();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
