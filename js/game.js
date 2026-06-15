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
  // Portrait de secours si une clé manque.
  const FALLBACK_PORTRAIT = '<svg viewBox="0 0 200 200"><circle cx="100" cy="80" r="42" fill="#ffd1dc"/><rect x="40" y="120" width="120" height="80" rx="40" fill="#7e5bd8"/></svg>';

  /* ---------- Helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const haptic = (p) => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };
  const resolve = (x, f) => (typeof x === "function" ? x(f) : x);

  /* ---------- Constantes ---------- */
  const KEYS = ["p", "s", "e", "v"];
  const START = 50;
  const BEST_M = "ppp2027.best.measures";
  const BEST_S = "ppp2027.best.survival";

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
  function playIntro(done) {
    const intro = $("#intro");
    $("#introLogo").innerHTML = ICONS.phi;
    $("#introCrowd").innerHTML = buildCrowd();
    $("#introTitle").textContent = "Président·e du Peuple";
    intro.classList.add("run");
    let ended = false;
    const finish = () => {
      if (ended) return; ended = true;
      intro.classList.add("out");
      setTimeout(() => { intro.hidden = true; if (done) done(); }, 600);
    };
    $("#introSkip").onclick = () => { firstGesture(); finish(); };
    setTimeout(finish, 4200);
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
    $("#logoPhi").innerHTML = ICONS.phi;
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
        '<div class="g-ring" id="ring-' + k + '"><span class="g-ico">' + ICONS[def.icon] + "</span></div>" +
        '<div class="g-name">' + def.name + "</div>";
      wrap.appendChild(el);
    });
    paintGauges();
  }
  function paintGauges() {
    KEYS.forEach((k) => {
      const ring = $("#ring-" + k); const v = clamp(S.g[k], 0, 100);
      ring.style.setProperty("--p", v);
      ring.parentElement.classList.toggle("danger", v <= 22);
    });
  }
  function flashDelta(k, d) {
    if (!d) return;
    const el = $("#delta-" + k);
    el.textContent = (d > 0 ? "+" : "") + d;
    el.className = "g-delta show " + (d > 0 ? "up" : "down");
    setTimeout(() => (el.className = "g-delta"), 1100);
  }

  /* ---------- Démarrage ---------- */
  function newGame(mode) {
    S = { mode, flags: {}, g: { p: START, s: START, e: START, v: START },
      turn: 0, month: 0, measures: [], queue: [], storyIdx: 0, lastId: null, current: null };
    busy = false;
    buildGauges();
    $("#playScore").textContent = "0";
    updateMandate();
    show("play");
    SOUND.sfx("click");
    setTimeout(nextCard, 420);
  }

  function updateMandate() {
    if (S.mode === "story") {
      const total = STORY.filter((x) => typeof x === "string").length;
      const pct = Math.min(100, (S.turn / total) * 100);
      $("#mandateFill").style.width = pct + "%";
      $("#mandateLabel").textContent = "Mandat présidentiel";
      $("#mandateYear").textContent = 2027 + Math.min(5, Math.floor((S.turn / total) * 5));
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
        if (c && (!c.cond || c.cond(S.flags))) return id;
        i--; // sauté : on continue
      }
    }
    return null;
  }

  /* ---------- Sélection de la prochaine carte ---------- */
  function pickInfinite() {
    // Crise plus probable avec le temps.
    const eligible = POOL.filter((id) => {
      const c = CARDS[id];
      return id !== S.lastId && (!c.cond || c.cond(S.flags));
    });
    const crisisProb = clamp(0.12 + S.month * 0.02, 0, 0.55);
    const pool = (Math.random() < crisisProb)
      ? eligible.filter((id) => CARDS[id].crisis) : [];
    const list = pool.length ? pool : eligible;
    return list[(Math.random() * list.length) | 0];
  }

  function nextCard() {
    updateMandate();
    const ready = popReady();
    if (ready) return renderCard(ready);

    if (S.mode === "story") {
      while (S.storyIdx < STORY.length) {
        const item = STORY[S.storyIdx++];
        if (typeof item === "object" && item.act) { return showAct(item); }
        const c = CARDS[item];
        if (c && (!c.cond || c.cond(S.flags))) return renderCard(item);
      }
      return endGame("story_end", null);
    } else {
      return renderCard(pickInfinite());
    }
  }

  /* ---------- Overlay d'acte ---------- */
  function showAct(act) {
    const ov = $("#actOverlay");
    $("#actScene").innerHTML = (SCENES && SCENES[act.scene]) || "";
    $("#actKicker").textContent = act.act;
    $("#actTitle").textContent = act.title;
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
    const c = CARDS[id]; const f = S.flags; const theme = GAUGES[c.tag];
    const card = $("#card");

    card.style.transition = "none";
    card.style.transform = "translate(-50%, 0) rotate(0deg)";
    card.style.opacity = "0";
    card.classList.toggle("is-crisis", !!c.crisis);
    card.style.setProperty("--accent", theme.color);

    $("#cardScene").innerHTML = (SCENES && SCENES[c.scene]) || "";
    $("#cardRibbon").hidden = !c.topical;
    const av = $("#cardAvatar");
    av.innerHTML = (CHAR_ART && CHAR_ART[c.char]) || FALLBACK_PORTRAIT;
    av.style.boxShadow = "0 0 0 3px " + theme.color + "55, 0 10px 24px -6px rgba(0,0,0,.6)";

    $("#cardWho").textContent = CHARACTERS[c.char] || "—";
    $("#cardText").innerHTML = resolve(c.text, f);
    $("#choiceLlabel").textContent = c.left.label;
    $("#choiceRlabel").textContent = c.right.label;
    $("#stampL").textContent = c.left.label;
    $("#stampR").textContent = c.right.label;
    setHints(0);
    if (c.crisis) SOUND.sfx("crisis");

    requestAnimationFrame(() => {
      card.style.transition = "transform .45s cubic-bezier(.2,1,.3,1), opacity .35s ease";
      card.style.transform = "translate(-50%, 0) rotate(0deg)";
      card.style.opacity = "1";
      busy = false;
    });
  }

  function setHints(dx) {
    const r = clamp(dx / 120, -1, 1);
    $("#stampR").style.opacity = r > 0 ? r : 0;
    $("#stampL").style.opacity = r < 0 ? -r : 0;
    $("#hintR").style.opacity = r > 0 ? r * 0.9 : 0;
    $("#hintL").style.opacity = r < 0 ? -r * 0.9 : 0;
    $("#choiceR").classList.toggle("hot", r > 0.25);
    $("#choiceL").classList.toggle("hot", r < -0.25);
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
    const c = CARDS[S.current]; const opt = c[side];
    const dir = side === "right" ? 1 : -1;
    SOUND.sfx("swipe"); haptic(12);

    const card = $("#card");
    card.style.transition = "transform .42s cubic-bezier(.4,0,.6,1), opacity .42s ease";
    card.style.transform = "translate(-50%,0) translateX(" + dir * 140 + "vw) rotate(" + dir * 22 + "deg)";
    card.style.opacity = "0";
    setHints(0);

    // Effets
    const fx = opt.fx || {};
    KEYS.forEach((k) => { if (fx[k]) { S.g[k] = clamp(S.g[k] + fx[k], 0, 100); flashDelta(k, fx[k]); } });

    // Drapeaux + arcs
    if (opt.set) opt.set.forEach((fl) => (S.flags[fl] = true));
    if (opt.then) enqueue(opt.then);
    if (opt.measure && S.measures.indexOf(opt.measure) === -1) {
      S.measures.push(opt.measure);
      $("#playScore").textContent = S.measures.length;
    }

    S.turn++; S.month += 3;
    // Pression du pouvoir : difficulté (drift croissant, surtout en survie).
    applyPressure();
    // Décrément des arcs en attente.
    S.queue.forEach((q) => (q.in--));
    paintGauges();

    setTimeout(() => showFeedback(opt), 260);
  }

  function applyPressure() {
    let drift = 1;
    if (S.mode === "infinite") drift = 1 + Math.floor(S.month / 9);
    else drift = S.turn > 6 ? 2 : 1;
    // pilier le plus haut subit la pression (force l'équilibre), + un aléatoire
    const sorted = KEYS.slice().sort((a, b) => S.g[b] - S.g[a]);
    S.g[sorted[0]] = clamp(S.g[sorted[0]] - drift, 0, 100);
    const r = KEYS[(Math.random() * KEYS.length) | 0];
    S.g[r] = clamp(S.g[r] - Math.max(1, drift - 1), 0, 100);
  }

  function showFeedback(opt) {
    const fx = opt.fx || {};
    const dead = KEYS.find((k) => S.g[k] <= 0);
    SOUND.sfx(opt.measure ? "good" : (Object.values(fx).some((x) => x < 0) ? "bad" : "good"));
    const chips = KEYS.filter((k) => fx[k]).map((k) =>
      '<span class="d-chip ' + (fx[k] > 0 ? "up" : "down") + '" style="--gc:' + GAUGES[k].color + '">' +
      '<span class="d-ico">' + ICONS[GAUGES[k].icon] + "</span>" + (fx[k] > 0 ? "+" : "") + fx[k] + "</span>").join("");
    $("#feedbackDeltas").innerHTML = chips;
    $("#feedbackResult").innerHTML = opt.result;
    $("#feedbackNote").innerHTML = "<strong>📖 L'Avenir en commun —</strong> " + opt.note;
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
    const survivedMonths = S.month;
    if (S.measures.length > bestM()) localStorage.setItem(BEST_M, String(S.measures.length));
    if (survivedMonths > bestS()) localStorage.setItem(BEST_S, String(survivedMonths));

    const emblem = $("#endEmblem");
    emblem.style.opacity = "1";
    $("#endYearsLbl").textContent = S.mode === "infinite" ? "mois tenus" : "années tenues";

    if (kind === "defeat") {
      const d = DEFEATS[deadKey];
      emblem.innerHTML = ICONS.trophy; emblem.style.opacity = ".5";
      $("#endKicker").textContent = "Présidence interrompue";
      $("#endTitle").textContent = d.title;
      $("#endSub").innerHTML = d.text + " Mais le combat continue. ✊";
      SOUND.sfx("lose");
    } else {
      // Fin du mode histoire
      const healthy = KEYS.every((k) => S.g[k] >= 35);
      const sixth = S.flags.sixth_republic;
      emblem.innerHTML = ICONS.phi;
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
      SOUND.sfx("win");
    }

    $("#endMeasures").textContent = S.measures.length;
    $("#endYears").textContent = S.mode === "infinite" ? survivedMonths : Math.min(5, Math.round(S.turn / STORY.filter((x) => typeof x === "string").length * 5));
    $("#endGrade").textContent = grade(kind, S.measures.length);

    const list = $("#endMeasureList");
    list.innerHTML = S.measures.length
      ? '<p class="eml-title">Mesures de L\'Avenir en commun adoptées</p><div class="eml-chips">' +
        S.measures.map((m) => '<span class="eml-chip">✓ ' + m + "</span>").join("") + "</div>"
      : '<p class="eml-title">Aucune mesure adoptée… rejoue pour appliquer le programme&nbsp;!</p>';

    show("end");
    if (kind !== "defeat") startConfetti();
  }

  function grade(kind, n) {
    if (kind === "defeat") return "✊";
    if (n >= 18) return "A+"; if (n >= 14) return "A"; if (n >= 10) return "B"; if (n >= 6) return "C"; return "D";
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
  async function shareResult() {
    const text = "✊ Dans « Président·e du Peuple », j'ai gouverné selon L'Avenir en commun : " +
      S.measures.length + " mesures adoptées" + (S.mode === "infinite" ? ", " + S.month + " mois tenus" : "") +
      " !\nÀ toi de tenir le mandat jusqu'en 2032. #PlaceAuPeuple #2027";
    try {
      if (navigator.share) await navigator.share({ title: "Président·e du Peuple", text });
      else { await navigator.clipboard.writeText(text); toast("Bilan copié — à partager&nbsp;!"); }
    } catch (e) {}
  }

  /* ---------- Modale ---------- */
  function openModal(t, h) { $("#modalTitle").textContent = t; $("#modalBody").innerHTML = h; $("#modal").hidden = false; }
  function closeModal() { $("#modal").hidden = true; }

  const HOW_HTML =
    '<p class="lead">Tu viens d\'être élu·e Président·e en 2027. Des personnages te soumettent un dilemme.</p>' +
    "<ul>" +
    "<li><b>◀ ▶</b> Glisse la carte à gauche ou à droite (ou les deux boutons) pour décider.</li>" +
    "<li><b>4 piliers</b> évoluent : ✊ Peuple, ⚖️ Social, 🌍 Planète, 🕊️ Souveraineté.</li>" +
    "<li><b>Tes choix ont des suites&nbsp;:</b> ils déclenchent des arcs, et les personnages se souviennent.</li>" +
    "<li><b>La pression du pouvoir grignote tes piliers chaque mois</b> : garde l'équilibre.</li>" +
    "<li><b>Un pilier à zéro = chute</b> (censure, révolte, effondrement, tutelle).</li>" +
    "<li><b>Mode Histoire&nbsp;:</b> mène le quinquennat jusqu'à la 6ᵉ République. <b>Mode Survie&nbsp;:</b> tiens le plus longtemps possible.</li>" +
    "</ul>" +
    "<p>Chaque décision dévoile sa conséquence et une note <em>L'Avenir en commun</em>.</p>";

  const ABOUT_HTML =
    "<p><b>Président·e du Peuple</b> est un <b>jeu citoyen non officiel</b>, pour faire découvrir le programme " +
    "<em>L'Avenir en commun</em> et soutenir la candidature de Jean-Luc Mélenchon en 2027.</p>" +
    "<p>Les dilemmes et mesures viennent du programme. Les crises s'inspirent de l'actualité 2025-2026 (tarifs de Trump et crise du Groenland, budget d'austérité et 49.3, détroit d'Ormuz, canicules et COP30, Ukraine, Gaza, AI Act…).</p>" +
    "<p>Aucune donnée collectée : seuls tes records restent sur l'appareil.</p>" +
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
    playIntro();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
