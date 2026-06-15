/* =========================================================
   Président·e du Peuple — moteur de jeu (vanilla JS)
   Jeu de décision « swipe » basé sur L'Avenir en commun.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icônes SVG (dessinées en currentColor) ---------- */
  const ICONS = {
    phi:
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#ff2b46"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="30" fill="none" stroke="url(#pg)" stroke-width="9"/>' +
      '<rect x="45" y="10" width="10" height="80" rx="5" fill="url(#pg)"/></svg>',
    // Jauges
    fist:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10h1V5a1.5 1.5 0 0 1 3 0v5h1V6.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-1.5a1.5 1.5 0 0 1 3 0V11z"/><rect x="6" y="2" width="12" height="2.4" rx="1.2"/></svg>',
    social:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M5 8h11a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h11"/></svg>',
    leaf:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c0-7 3-13 9-15-1 9-4 13-9 15z"/><path d="M12 21C6 19 3 14 3 6c6 1 9 6 9 15z"/></svg>',
    globe:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5 7c4 3 10 3 14 0M5 17c4-3 10-3 14 0"/></svg>',
    trophy:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8h20v10a10 10 0 0 1-20 0z"/><path d="M14 12H8v4a6 6 0 0 0 6 6M34 12h6v4a6 6 0 0 1-6 6"/><path d="M24 28v6M18 40h12M20 34h8l2 6H18z"/></svg>',
    // Avatars (tête + symbole)
    suit:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="22" r="11"/><path d="M14 54c2-11 9-16 18-16s16 5 18 16"/><path d="M32 38l-5 16M32 38l5 16"/><path d="M28 33l4 5 4-5"/></svg>',
    worker:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="26" r="10"/><path d="M16 18a16 16 0 0 1 32 0z"/><path d="M14 54c2-10 9-15 18-15s16 5 18 15"/></svg>',
    youth:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="26" r="10"/><path d="M20 22c0-7 5-10 12-10s12 3 12 10l4 2"/><path d="M14 54c2-10 9-15 18-15s16 5 18 15"/></svg>',
    scientist:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="24" r="11"/><circle cx="27" cy="23" r="3"/><circle cx="37" cy="23" r="3"/><path d="M30 23h4"/><path d="M14 54c2-11 9-16 18-16s16 5 18 16"/></svg>',
    general:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="28" r="10"/><path d="M16 22h32l-4-6H20z"/><path d="M32 14v-2"/><path d="M14 56c2-10 9-15 18-15s16 5 18 15"/></svg>',
    eu:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="20"/><g fill="currentColor" stroke="none"><circle cx="32" cy="14" r="2"/><circle cx="46" cy="20" r="2"/><circle cx="50" cy="34" r="2"/><circle cx="44" cy="46" r="2"/><circle cx="32" cy="50" r="2"/><circle cx="20" cy="46" r="2"/><circle cx="14" cy="34" r="2"/><circle cx="18" cy="20" r="2"/></g></svg>',
    citizen:
      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="24" r="11"/><path d="M14 54c2-11 9-16 18-16s16 5 18 16"/></svg>'
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const haptic = (p) => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };

  /* ---------- Constantes ---------- */
  const KEYS = ["p", "s", "e", "v"];
  const START = 55;            // valeur de départ de chaque pilier
  const TURNS_TO_WIN = 18;     // cartes à tenir = mandat 2027 → 2032
  const BEST_KEY = "ppp2027.president.best";

  /* ---------- État de partie ---------- */
  let g = {};                  // valeurs des piliers
  let turn = 0;                // numéro de carte
  let measures = [];           // mesures adoptées (libellés)
  let deck = [];               // pioche mélangée
  let current = null;          // carte affichée
  let busy = false;            // verrou pendant l'animation

  function bestScore() { return parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0; }
  function setBest(v) { if (v > bestScore()) localStorage.setItem(BEST_KEY, String(v)); }

  /* ---------- Navigation entre écrans ---------- */
  function show(id) {
    $$(".screen").forEach((s) => {
      const on = s.id === "screen-" + id;
      if (on) { s.hidden = false; requestAnimationFrame(() => s.classList.add("is-active")); }
      else {
        s.classList.remove("is-active");
        setTimeout(() => { if (!s.classList.contains("is-active")) s.hidden = true; }, 380);
      }
    });
  }

  function toast(msg) {
    const t = $("#toast");
    t.innerHTML = msg; t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.classList.remove("show"); setTimeout(() => (t.hidden = true), 300); }, 2200);
  }

  /* ---------- Accueil ---------- */
  function initHome() {
    $("#logoPhi").innerHTML = ICONS.phi;
    const b = bestScore();
    if (b > 0) { $("#homeBest").hidden = false; $("#homeBestScore").textContent = b; }
  }

  /* ---------- Jauges ---------- */
  function buildGauges() {
    const wrap = $("#gauges");
    wrap.innerHTML = "";
    KEYS.forEach((k) => {
      const def = GAUGES[k];
      const el = document.createElement("div");
      el.className = "gauge2";
      el.dataset.g = k;
      el.style.setProperty("--gc", def.color);
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
      const ring = $("#ring-" + k);
      const v = clamp(g[k], 0, 100);
      ring.style.setProperty("--p", v);
      const item = ring.parentElement;
      item.classList.toggle("danger", v <= 20);
    });
  }

  function flashDelta(k, d) {
    if (!d) return;
    const el = $("#delta-" + k);
    el.textContent = (d > 0 ? "+" : "") + d;
    el.className = "g-delta show " + (d > 0 ? "up" : "down");
    setTimeout(() => (el.className = "g-delta"), 1100);
  }

  /* ---------- Démarrage de partie ---------- */
  function newGame() {
    g = { p: START, s: START, e: START, v: START };
    turn = 0;
    measures = [];
    deck = shuffle(CARDS.slice());
    busy = false;
    buildGauges();
    $("#playScore").textContent = "0";
    updateMandate();
    show("play");
    setTimeout(nextCard, 380);
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function updateMandate() {
    const pct = Math.min(100, (turn / TURNS_TO_WIN) * 100);
    $("#mandateFill").style.width = pct + "%";
    const year = 2027 + Math.floor((turn / TURNS_TO_WIN) * 5);
    $("#mandateLabel").textContent = "Mandat présidentiel";
    $("#mandateYear").textContent = Math.min(2032, year);
  }

  /* ---------- Affichage d'une carte ---------- */
  function nextCard() {
    if (turn >= TURNS_TO_WIN) { return endGame(true, null); }
    if (deck.length === 0) deck = shuffle(CARDS.slice());
    current = deck.pop();
    const theme = GAUGES[current.theme];

    const card = $("#card");
    card.style.transition = "none";
    card.style.transform = "translate(-50%, 0) rotate(0deg)";
    card.style.opacity = "0";
    card.classList.toggle("is-crisis", !!current.crisis);
    card.style.setProperty("--accent", theme.color);

    const av = $("#cardAvatar");
    av.innerHTML = ICONS[current.avatar] || ICONS.citizen;
    av.style.color = theme.color;
    av.style.background = "radial-gradient(circle at 30% 30%, " + theme.color + "33, rgba(255,255,255,.05))";

    $("#cardWho").textContent = current.who.replace(/<[^>]+>/g, "");
    $("#cardWho").innerHTML = current.who;
    $("#cardText").innerHTML = current.text;
    $("#choiceLlabel").textContent = current.left.label;
    $("#choiceRlabel").textContent = current.right.label;
    $("#stampL").textContent = current.left.label;
    $("#stampR").textContent = current.right.label;
    setHints(0);

    requestAnimationFrame(() => {
      card.style.transition = "transform .45s cubic-bezier(.2,1,.3,1), opacity .35s ease";
      card.style.transform = "translate(-50%, 0) rotate(0deg)";
      card.style.opacity = "1";
      busy = false;
    });
    updateMandate();
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

  /* ---------- Glisser-déposer (swipe) ---------- */
  let drag = null;
  function bindSwipe() {
    const card = $("#card");
    const start = (x, y) => { if (busy) return; drag = { x, y, dx: 0 }; card.style.transition = "none"; };
    const move = (x, y) => {
      if (!drag) return;
      drag.dx = x - drag.x;
      const rot = drag.dx / 18;
      card.style.transform = "translate(-50%, " + (Math.abs(drag.dx) * 0.04) + "px) translateX(" + drag.dx + "px) rotate(" + rot + "deg)";
      setHints(drag.dx);
    };
    const end = () => {
      if (!drag) return;
      const dx = drag.dx;
      drag = null;
      if (Math.abs(dx) > 95) commit(dx > 0 ? "right" : "left");
      else {
        card.style.transition = "transform .3s cubic-bezier(.3,1.4,.4,1)";
        card.style.transform = "translate(-50%, 0) rotate(0deg)";
        setHints(0);
      }
    };

    card.addEventListener("touchstart", (e) => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    card.addEventListener("touchmove", (e) => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    card.addEventListener("touchend", end);
    card.addEventListener("mousedown", (e) => { start(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener("mousemove", (e) => { if (drag) move(e.clientX, e.clientY); });
    window.addEventListener("mouseup", end);

    $("#choiceL").addEventListener("click", () => { if (!busy) commit("left"); });
    $("#choiceR").addEventListener("click", () => { if (!busy) commit("right"); });
  }

  /* ---------- Validation d'un choix ---------- */
  function commit(side) {
    if (busy || !current) return;
    busy = true;
    const opt = current[side];
    const card = $("#card");
    const dir = side === "right" ? 1 : -1;

    haptic(12);
    card.style.transition = "transform .42s cubic-bezier(.4,0,.6,1), opacity .42s ease";
    card.style.transform = "translate(-50%,0) translateX(" + dir * 140 + "vw) rotate(" + dir * 22 + "deg)";
    card.style.opacity = "0";
    setHints(0);

    // Applique les effets
    const fx = opt.fx || {};
    KEYS.forEach((k) => {
      if (fx[k]) { g[k] = clamp(g[k] + fx[k], 0, 100); flashDelta(k, fx[k]); }
    });
    paintGauges();

    if (opt.measure && measures.indexOf(opt.measure) === -1) {
      measures.push(opt.measure);
      $("#playScore").textContent = measures.length;
    }
    turn++;

    setTimeout(() => showFeedback(opt), 260);
  }

  function showFeedback(opt) {
    const fb = $("#feedback");
    // Récap des deltas
    const fx = opt.fx || {};
    const chips = KEYS.filter((k) => fx[k]).map((k) =>
      '<span class="d-chip ' + (fx[k] > 0 ? "up" : "down") + '" style="--gc:' + GAUGES[k].color + '">' +
      '<span class="d-ico">' + ICONS[GAUGES[k].icon] + "</span>" +
      (fx[k] > 0 ? "+" : "") + fx[k] + "</span>"
    ).join("");
    $("#feedbackDeltas").innerHTML = chips;
    $("#feedbackResult").innerHTML = opt.result;
    $("#feedbackNote").innerHTML = "<strong>📖 L'Avenir en commun —</strong> " + opt.note;
    $("#feedbackTag").innerHTML = opt.measure ? "✅ Mesure adoptée : " + opt.measure : "📖 L'Avenir en commun";
    fb.classList.add("show");
  }

  function afterFeedback() {
    $("#feedback").classList.remove("show");
    // Vérifie la défaite (un pilier à zéro)
    const dead = KEYS.find((k) => g[k] <= 0);
    if (dead) { setTimeout(() => endGame(false, dead), 320); return; }
    setTimeout(nextCard, 280);
  }

  /* ---------- Fin de partie ---------- */
  function endGame(survived, deadKey) {
    setBest(measures.length);
    const emblem = $("#endEmblem");
    const years = Math.min(5, (turn / TURNS_TO_WIN) * 5);

    if (survived) {
      const healthy = KEYS.every((k) => g[k] >= 40);
      emblem.innerHTML = ICONS.phi;
      $("#endKicker").textContent = "Mandat accompli · 2032";
      $("#endTitle").textContent = healthy && measures.length >= 12 ? "Raz-de-marée populaire !" : "Mandat accompli !";
      $("#endSub").innerHTML = healthy
        ? "Tu as tenu les cinq ans en gardant les quatre piliers solides. <strong>La 6<sup>e</sup> République est proclamée</strong> et l'avenir s'écrit en commun. ✊"
        : "Tu as bouclé ton mandat. Quelques équilibres ont vacillé, mais le cap de <em>L'Avenir en commun</em> a tenu.";
    } else {
      const d = DEFEATS[deadKey];
      emblem.innerHTML = ICONS.trophy;
      emblem.style.opacity = ".5";
      $("#endKicker").textContent = "Présidence interrompue";
      $("#endTitle").textContent = d.title;
      $("#endSub").innerHTML = d.text + " Mais le combat continue.";
    }

    $("#endMeasures").textContent = measures.length;
    $("#endYears").textContent = years.toFixed(years < 5 ? 1 : 0).replace(".0", "");
    $("#endGrade").textContent = grade(measures.length, survived);

    const list = $("#endMeasureList");
    if (measures.length) {
      list.innerHTML = '<p class="eml-title">Mesures de L\'Avenir en commun adoptées</p>' +
        '<div class="eml-chips">' +
        measures.map((m) => '<span class="eml-chip">✓ ' + m + "</span>").join("") + "</div>";
    } else {
      list.innerHTML = '<p class="eml-title">Aucune mesure adoptée… rejoue pour appliquer le programme&nbsp;!</p>';
    }

    show("end");
    if (survived) startConfetti();
  }

  function grade(n, survived) {
    if (!survived) return "✊";
    if (n >= 14) return "A+";
    if (n >= 11) return "A";
    if (n >= 8) return "B";
    if (n >= 5) return "C";
    return "D";
  }

  /* ---------- Confettis ---------- */
  let confettiRAF = null;
  function startConfetti() {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr;
    const colors = ["#ff2b46", "#ffd166", "#ff8aa0", "#fff7f9", "#7e5bd8", "#2bd97a"];
    const parts = Array.from({ length: 130 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * -cv.height,
      r: (4 + Math.random() * 6) * dpr, c: colors[(Math.random() * colors.length) | 0],
      vy: (2 + Math.random() * 4) * dpr, vx: (Math.random() - 0.5) * 2 * dpr,
      a: Math.random() * Math.PI, va: (Math.random() - 0.5) * 0.3
    }));
    let frames = 0;
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => {
        p.y += p.vy; p.x += p.vx; p.a += p.va;
        if (p.y > cv.height + 20) { p.y = -20; p.x = Math.random() * cv.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); ctx.restore();
      });
      if (++frames < 500) confettiRAF = requestAnimationFrame(draw);
    }
    cancelAnimationFrame(confettiRAF); draw();
  }

  /* ---------- Partage ---------- */
  async function shareResult() {
    const text =
      "✊ J'ai gouverné selon L'Avenir en commun et adopté " + measures.length +
      " mesures du programme dans « Président·e du Peuple » !\n" +
      "À toi de tenir le mandat jusqu'en 2032. #PlaceAuPeuple #2027";
    try {
      if (navigator.share) await navigator.share({ title: "Président·e du Peuple", text });
      else { await navigator.clipboard.writeText(text); toast("Bilan copié — à partager&nbsp;!"); }
    } catch (e) {}
  }

  /* ---------- Modale ---------- */
  function openModal(title, html) { $("#modalTitle").textContent = title; $("#modalBody").innerHTML = html; $("#modal").hidden = false; }
  function closeModal() { $("#modal").hidden = true; }

  const HOW_HTML =
    '<p class="lead">Tu viens d\'être élu·e Président·e en 2027. Des personnages viennent te soumettre un dilemme.</p>' +
    "<ul>" +
    "<li><b>◀ ▶</b> Glisse la carte à gauche ou à droite (ou utilise les deux boutons) pour décider.</li>" +
    "<li><b>4 piliers</b> évoluent à chaque choix : ✊ Peuple, ⚖️ Social, 🌍 Planète, 🕊️ Souveraineté.</li>" +
    "<li><b>Gouverner, c'est arbitrer&nbsp;:</b> appliquer le programme renforce le peuple, mais attention à l'équilibre.</li>" +
    "<li><b>Si un pilier tombe à zéro, ta présidence chute</b> (révocation, révolte, effondrement, mise sous tutelle).</li>" +
    "<li><b>Objectif&nbsp;:</b> tenir ton mandat jusqu'en <b>2032</b> en adoptant un maximum de <b>mesures phares</b>.</li>" +
    "</ul>" +
    "<p>Chaque décision dévoile sa conséquence et une note <em>L'Avenir en commun</em> : on apprend le programme en gouvernant.</p>";

  const ABOUT_HTML =
    "<p><b>Président·e du Peuple</b> est un <b>jeu citoyen non officiel</b>, conçu pour faire découvrir de façon vivante le programme " +
    "<em>L'Avenir en commun</em> et soutenir la candidature de Jean-Luc Mélenchon en 2027.</p>" +
    "<p>Tous les dilemmes et mesures s'appuient sur le programme <em>L'Avenir en commun</em> et les documents de campagne de la France insoumise.</p>" +
    "<p>Aucune donnée n'est collectée : seul ton record reste sur ton appareil.</p>" +
    '<p style="color:#d7b9d6;font-size:.85rem">Fait avec passion pour la révolution citoyenne. ✊</p>';

  /* ---------- Liaisons ---------- */
  function bind() {
    $("#btnPlay").addEventListener("click", () => { haptic(10); newGame(); });
    $("#btnHow").addEventListener("click", () => openModal("Comment jouer", HOW_HTML));
    $("#btnAbout").addEventListener("click", () => openModal("À propos", ABOUT_HTML));
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

    $("#playQuit").addEventListener("click", () => show("home"));
    $("#feedbackNext").addEventListener("click", afterFeedback);

    $("#endReplay").addEventListener("click", () => { $("#endEmblem").style.opacity = "1"; newGame(); });
    $("#endShare").addEventListener("click", shareResult);

    bindSwipe();
    document.addEventListener("gesturestart", (e) => e.preventDefault());
  }

  function registerSW() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
      navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  function init() { initHome(); bind(); registerSW(); }
  document.addEventListener("DOMContentLoaded", init);
})();
