/* =========================================================
   Place au Peuple 2027 — moteur de jeu (vanilla JS)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Bibliothèque d'icônes SVG ---------- */
  // Toutes dessinées en "currentColor" pour s'adapter à la couleur du thème.
  const ICONS = {
    phi:
      '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#ff2b46"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="30" stroke="url(#pg)" stroke-width="9"/>' +
      '<rect x="45" y="10" width="10" height="80" rx="5" fill="url(#pg)"/></svg>',
    republique:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 40h36"/><path d="M9 40V22M19 40V22M29 40V22M39 40V22"/><path d="M6 22 24 8l18 14z"/><path d="M22 30h4"/></svg>',
    richesses:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 6v36"/><path d="M8 14h26a6 6 0 0 1 0 12H14a6 6 0 0 0 0 12h26"/></svg>',
    ecologie:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 42c0-14 6-26 18-30C40 24 36 38 24 42z"/><path d="M24 42C12 38 8 24 6 12c12 4 18 16 18 30z"/><path d="M24 42V20"/></svg>',
    europe:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="24" cy="24" r="18"/><path d="M24 6v36M6 24h36"/><path d="M12 12c8 6 16 6 24 0M12 36c8-6 16-6 24 0"/></svg>',
    paix:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M40 10c-14 0-26 8-26 22 0 0 8-2 12-8"/><path d="M14 32l-6 8M14 32c10 0 14-8 14-8"/><path d="M40 10c-6 4-10 10-12 14"/></svg>',
    progres:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 42c10 0 16-7 16-18S34 6 24 6 8 13 8 24s6 18 16 18z"/><path d="M24 16v16M16 24h16"/></svg>',
    frontieres:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M24 4c8 4 12 12 12 22l-12 12L12 26C12 16 16 8 24 4z"/><circle cx="24" cy="20" r="4"/><path d="M16 38c-2 4-2 6-2 6s2 0 6-2M32 38c2 4 2 6 2 6s-2 0-6-2"/></svg>',
    trophy:
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 8h20v10a10 10 0 0 1-20 0z"/><path d="M14 12H8v4a6 6 0 0 0 6 6M34 12h6v4a6 6 0 0 1-6 6"/><path d="M24 28v6M18 40h12M20 34h8l2 6H18z"/></svg>'
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const haptic = (ms) => { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} };

  /* ---------- État ---------- */
  const BASE_PCT = 12;       // socle de départ (clin d'œil aux ~20% de 2017)
  const STORE_KEY = "ppp2027.save.v1";
  const BEST_KEY = "ppp2027.best.v1";

  let state = {
    score: 0,
    progress: {},   // { themeId: { done:true, stars:n, good:n } }
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) {}
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function bestScore() {
    return parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  }
  function setBest(v) {
    if (v > bestScore()) localStorage.setItem(BEST_KEY, String(v));
  }

  // Index de la première étape non terminée.
  function currentIndex() {
    for (let i = 0; i < THEMES.length; i++) {
      if (!state.progress[THEMES[i].id] || !state.progress[THEMES[i].id].done) return i;
    }
    return THEMES.length; // tout terminé
  }
  function completedCount() {
    return THEMES.filter((t) => state.progress[t.id] && state.progress[t.id].done).length;
  }
  // Pourcentage de soutien : socle + part proportionnelle aux étoiles gagnées.
  function supportPct() {
    let stars = 0;
    THEMES.forEach((t) => { if (state.progress[t.id]) stars += state.progress[t.id].stars || 0; });
    const maxStars = THEMES.length * 3;
    const gain = Math.round(((50 - BASE_PCT) + 8) * (stars / maxStars)); // jusqu'à ~58% si parfait
    return Math.min(58, BASE_PCT + gain);
  }

  /* ---------- Navigation entre écrans ---------- */
  let activeScreen = "home";
  function show(id) {
    $$(".screen").forEach((s) => {
      const on = s.id === "screen-" + id;
      if (on) {
        s.hidden = false;
        requestAnimationFrame(() => s.classList.add("is-active"));
      } else {
        s.classList.remove("is-active");
        setTimeout(() => { if (!s.classList.contains("is-active")) s.hidden = true; }, 380);
      }
    });
    activeScreen = id;
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => (t.hidden = true), 300);
    }, 1900);
  }

  /* ---------- Accueil ---------- */
  function initHome() {
    $("#logoPhi").innerHTML = ICONS.phi;
    const b = bestScore();
    if (b > 0) {
      $("#homeBest").hidden = false;
      $("#homeBestScore").textContent = b.toLocaleString("fr-FR");
    }
  }

  /* ---------- Carte de campagne ---------- */
  function renderMap() {
    $("#mapScore").textContent = state.score.toLocaleString("fr-FR");
    const pct = supportPct();
    $("#gaugePct").textContent = pct + " %";
    $("#gaugeFill").style.width = pct + "%";
    const cur = currentIndex();
    $("#gaugeHint").textContent =
      cur >= THEMES.length
        ? "Campagne terminée — rejoue une étape pour grimper encore !"
        : "Atteins 50 % pour gagner l'élection de 2027.";

    const path = $("#path");
    path.innerHTML = "";
    THEMES.forEach((t, i) => {
      const prog = state.progress[t.id];
      let stateName = "locked";
      if (prog && prog.done) stateName = "done";
      else if (i === cur) stateName = "current";

      const node = document.createElement("div");
      node.className = "node " + (i % 2 === 0 ? "node--left" : "node--right");
      node.dataset.state = stateName;
      node.style.color = t.color;

      const stars = prog ? prog.stars : 0;
      const starHtml =
        stateName === "done"
          ? Array.from({ length: 3 }, (_, k) => (k < stars ? "★" : '<span class="off">★</span>')).join("")
          : "";

      node.innerHTML =
        (i > 0 ? '<span class="node-link"></span>' : "") +
        '<div class="node-dot">' + ICONS[t.icon] + "</div>" +
        '<div class="node-info">' +
        '<span class="node-step">Étape ' + t.num + "</span>" +
        '<span class="node-name">' + t.title + "</span>" +
        '<span class="node-stars">' + starHtml + "</span>" +
        "</div>";

      if (stateName !== "locked") {
        node.addEventListener("click", () => { haptic(8); openIntro(i); });
      } else {
        node.addEventListener("click", () => toast("Termine d'abord l'étape précédente 🔒"));
      }
      path.appendChild(node);
    });

    // Si tout est terminé, proposer l'écran de victoire.
    if (cur >= THEMES.length) {
      setTimeout(() => openWin(false), 400);
    }
  }

  /* ---------- Intro de thème ---------- */
  let activeTheme = null;
  function openIntro(index) {
    activeTheme = THEMES[index];
    const t = activeTheme;
    $("#introTop").textContent = "Étape " + t.num;
    $("#introBadge").innerHTML = ICONS[t.icon];
    $("#introBadge").style.background = "linear-gradient(135deg," + t.color + ", rgba(255,255,255,.15))";
    $("#introBadge").style.color = "#fff";
    $("#introNum").textContent = "Étape " + t.num + " / " + THEMES.length;
    $("#introTitle").textContent = t.title;
    $("#introSubtitle").textContent = t.subtitle;
    $("#introText").innerHTML = t.intro;
    $("#introQuote").textContent = t.quote;
    show("intro");
  }

  /* ---------- Moteur de quiz ---------- */
  let quiz = null; // { theme, qIndex, good, combo, answers:[] }
  const TIME_MS = 18000;     // temps "souple" par question
  const VOIX_BASE = 100;     // voix par bonne réponse
  const VOIX_SPEED = 60;     // bonus rapidité max
  let timerRAF = null, timerStart = 0, timerActive = false;

  function startTheme() {
    quiz = { theme: activeTheme, qIndex: 0, good: 0, combo: 0, voix: 0, answers: [] };
    $("#quizChip").textContent = activeTheme.title;
    renderPips();
    show("quiz");
    setTimeout(loadQuestion, 360);
  }

  function renderPips() {
    const wrap = $("#quizProgress");
    wrap.innerHTML = "";
    quiz.theme.questions.forEach((_, i) => {
      const p = document.createElement("span");
      p.className = "pip";
      if (i < quiz.qIndex) p.classList.add(quiz.answers[i] ? "done-ok" : "done-ko");
      else if (i === quiz.qIndex) p.classList.add("active");
      wrap.appendChild(p);
    });
  }

  function loadQuestion() {
    const q = quiz.theme.questions[quiz.qIndex];
    renderPips();
    $("#feedback").classList.remove("show", "ok", "ko");

    // combo affichage
    const comboEl = $("#combo");
    if (quiz.combo >= 2) { comboEl.hidden = false; $("#comboN").textContent = quiz.combo; }
    else comboEl.hidden = true;

    $("#questionText").textContent = q.q;
    const opts = $("#options");
    opts.className = "options";
    opts.innerHTML = "";

    let choices;
    if (q.type === "vf") {
      choices = [{ label: "Vrai", val: true }, { label: "Faux", val: false }];
    } else {
      choices = q.options.map((label, idx) => ({ label, val: idx }));
    }

    choices.forEach((c, i) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.innerHTML =
        '<span class="opt-key">' + (q.type === "vf" ? (c.val ? "✓" : "✕") : String.fromCharCode(65 + i)) + "</span>" +
        "<span>" + c.label + "</span>";
      btn.addEventListener("click", () => answer(c.val, btn));
      opts.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    const bar = $("#timerBar");
    bar.style.transition = "none";
    bar.style.transform = "scaleX(1)";
    timerStart = performance.now();
    timerActive = true;
    cancelAnimationFrame(timerRAF);
    const tick = (now) => {
      if (!timerActive) return;
      const left = Math.max(0, 1 - (now - timerStart) / TIME_MS);
      bar.style.transform = "scaleX(" + left + ")";
      if (left <= 0) { answer("__timeout__", null); return; }
      timerRAF = requestAnimationFrame(tick);
    };
    timerRAF = requestAnimationFrame(tick);
  }

  function answer(value, btn) {
    if (!timerActive) return;
    timerActive = false;
    cancelAnimationFrame(timerRAF);

    const q = quiz.theme.questions[quiz.qIndex];
    const correctVal = q.type === "vf" ? q.answer : q.answer;
    const isCorrect = value === correctVal;
    const elapsed = performance.now() - timerStart;

    // Verrouille et révèle.
    const opts = $("#options");
    opts.classList.add("locked");
    $$(".option", opts).forEach((el, i) => {
      const isThis = el === btn;
      const thisVal = q.type === "vf" ? (i === 0) : i;
      if (thisVal === correctVal) el.classList.add("correct");
      else if (isThis) el.classList.add("wrong");
      else el.classList.add("dim");
    });

    quiz.answers[quiz.qIndex] = isCorrect;

    if (isCorrect) {
      quiz.good++;
      quiz.combo++;
      const speedBonus = Math.round(VOIX_SPEED * Math.max(0, 1 - elapsed / TIME_MS));
      const comboBonus = (quiz.combo - 1) * 25;
      const gained = VOIX_BASE + speedBonus + comboBonus;
      quiz.voix += gained;
      state.score += gained;
      haptic(12);
      showFeedback(true, q.why, "+" + gained + " voix" + (quiz.combo >= 2 ? "  🔥 x" + quiz.combo : ""));
    } else {
      quiz.combo = 0;
      haptic([8, 40, 8]);
      const head = value === "__timeout__" ? "Temps écoulé !" : "Pas tout à fait…";
      showFeedback(false, q.why, head);
    }
    save();
  }

  function showFeedback(ok, why, head) {
    const fb = $("#feedback");
    fb.classList.add("show", ok ? "ok" : "ko");
    $("#feedbackHead").textContent = ok ? (head.includes("🔥") ? "Excellent ! " + head : "Bravo ! " + head) : head;
    $("#feedbackWhy").innerHTML = why;
    renderPips();
  }

  function nextQuestion() {
    $("#feedback").classList.remove("show");
    quiz.qIndex++;
    if (quiz.qIndex >= quiz.theme.questions.length) {
      setTimeout(finishTheme, 250);
    } else {
      setTimeout(loadQuestion, 320);
    }
  }

  /* ---------- Résultat d'étape ---------- */
  function finishTheme() {
    const t = quiz.theme;
    const total = t.questions.length;
    const good = quiz.good;
    let stars = 0;
    if (good === total) stars = 3;
    else if (good >= Math.ceil(total * 0.6)) stars = 2;
    else if (good >= 1) stars = 1;

    const prev = state.progress[t.id] || { stars: 0 };
    state.progress[t.id] = {
      done: true,
      stars: Math.max(prev.stars || 0, stars),
      good: good
    };
    setBest(state.score);
    save();

    // Affichage
    $("#resultBadge").innerHTML = ICONS[t.icon];
    $("#resultBadge").style.background = "linear-gradient(135deg," + t.color + ", rgba(255,255,255,.15))";
    $("#resultBadge").style.color = "#fff";
    $("#resultTitle").textContent = stars === 3 ? "Étape conquise !" : stars === 2 ? "Belle progression !" : "Étape franchie";
    $("#resultSub").textContent =
      "Badge débloqué : « " + t.title + " ». " +
      (stars === 3 ? "Score parfait, le peuple se rassemble derrière toi !" : "Rejoue pour décrocher les 3 étoiles.");
    $("#resGood").textContent = good + "/" + total;
    $("#resVoix").textContent = "+" + quiz.voix;
    const before = supportPctExcluding();
    const after = supportPct();
    $("#resPct").textContent = "+" + Math.max(0, after - before) + " %";
    $("#resultQuote").textContent = t.quote;

    // étoiles animées
    const starEls = $$("#stars span");
    starEls.forEach((s, i) => {
      s.classList.remove("lit");
      if (i < stars) setTimeout(() => s.classList.add("lit"), 300 + i * 220);
    });

    show("result");
  }

  // Soutien recalculé en ignorant l'étape qui vient d'être jouée (pour afficher le gain).
  function supportPctExcluding() {
    const t = quiz.theme;
    let stars = 0;
    THEMES.forEach((th) => {
      if (th.id === t.id) return;
      if (state.progress[th.id]) stars += state.progress[th.id].stars || 0;
    });
    const maxStars = THEMES.length * 3;
    const gain = Math.round(((50 - BASE_PCT) + 8) * (stars / maxStars));
    return Math.min(58, BASE_PCT + gain);
  }

  /* ---------- Victoire / fin de campagne ---------- */
  function openWin(animate) {
    const pct = supportPct();
    const win = pct >= 50;
    $("#winEmblem").innerHTML = win ? ICONS.phi : ICONS.trophy;
    $("#winKicker").textContent = "Élection présidentielle 2027";
    $("#winTitle").textContent = win ? "Victoire !" : "Campagne bouclée";
    $("#winSub").innerHTML = win
      ? "Avec <strong>" + pct + " %</strong> de soutien populaire, le peuple l'emporte. Place à la convocation de l'Assemblée constituante et à la 6<sup>e</sup> République !"
      : "Tu rassembles <strong>" + pct + " %</strong> du soutien populaire. Rejoue les étapes pour viser les 3 étoiles partout et franchir la barre des 50 %.";
    $("#winScore").textContent = state.score.toLocaleString("fr-FR");
    setBest(state.score);

    // Galerie de badges
    const wrap = $("#winBadges");
    wrap.innerHTML = "";
    THEMES.forEach((t) => {
      const prog = state.progress[t.id];
      if (!prog || !prog.done) return;
      const chip = document.createElement("div");
      chip.className = "badge-chip";
      chip.innerHTML =
        '<span class="bc-ico" style="background:' + t.color + '">' + ICONS[t.icon] + "</span>" +
        "<span>" + t.title + " " + "★".repeat(prog.stars) + "</span>";
      wrap.appendChild(chip);
    });

    show("win");
    if (win) startConfetti();
  }

  /* ---------- Confettis (canvas) ---------- */
  let confettiRAF = null;
  function startConfetti() {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; }
    size();
    const colors = ["#ff2b46", "#ffd166", "#ff8aa0", "#fff7f9", "#7e5bd8"];
    const N = 140;
    const parts = Array.from({ length: N }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * -cv.height,
      r: (4 + Math.random() * 6) * dpr,
      c: colors[(Math.random() * colors.length) | 0],
      vy: (2 + Math.random() * 4) * dpr,
      vx: (Math.random() - 0.5) * 2 * dpr,
      a: Math.random() * Math.PI,
      va: (Math.random() - 0.5) * 0.3
    }));
    let frames = 0;
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach((p) => {
        p.y += p.vy; p.x += p.vx; p.a += p.va;
        if (p.y > cv.height + 20) { p.y = -20; p.x = Math.random() * cv.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      frames++;
      confettiRAF = requestAnimationFrame(draw);
      if (frames > 480) { cancelAnimationFrame(confettiRAF); } // s'arrête après ~8s
    }
    cancelAnimationFrame(confettiRAF);
    draw();
  }

  /* ---------- Partage ---------- */
  async function shareResult() {
    const pct = supportPct();
    const text =
      "🔥 J'ai rassemblé " + state.score.toLocaleString("fr-FR") +
      " voix et " + pct + " % de soutien populaire sur « Place au Peuple 2027 » !\n" +
      "Découvre L'Avenir en commun et joue toi aussi. #PlaceAuPeuple #2027";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Place au Peuple 2027", text });
      } else {
        await navigator.clipboard.writeText(text);
        toast("Résultat copié — à partager !");
      }
    } catch (e) { /* annulé */ }
  }

  /* ---------- Modale (aide / à propos) ---------- */
  function openModal(title, html) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    $("#modal").hidden = false;
  }
  function closeModal() { $("#modal").hidden = true; }

  const HOW_HTML =
    '<p class="lead">Mène une campagne citoyenne en 7 étapes — une par chapitre du programme <em>L\'Avenir en commun</em>.</p>' +
    "<ul>" +
    "<li><b>1.</b> Sur la carte, ouvre l'étape qui clignote.</li>" +
    "<li><b>2.</b> Réponds aux questions : vite et juste pour un max de <b>voix</b>.</li>" +
    "<li><b>3.</b> Enchaîne les bonnes réponses pour déclencher des <b>combos 🔥</b>.</li>" +
    "<li><b>4.</b> Chaque étape gagne des <b>étoiles</b> et fait monter le <b>soutien populaire</b>.</li>" +
    "<li><b>5.</b> Franchis la barre des <b>50 %</b> pour gagner l'élection de 2027 !</li>" +
    "</ul>" +
    "<p>Bonne ou mauvaise réponse, une explication apparaît à chaque fois : on apprend le programme en jouant.</p>";

  const ABOUT_HTML =
    "<p>Place au Peuple 2027 est un <b>jeu citoyen non officiel</b>, conçu pour faire découvrir de façon ludique le programme " +
    "<em>L'Avenir en commun</em> et soutenir la candidature de Jean-Luc Mélenchon en 2027.</p>" +
    "<p>Toutes les questions s'appuient sur le programme <em>L'Avenir en commun</em> (version actualisée) et les documents de campagne de la France insoumise.</p>" +
    "<p>Aucune donnée n'est collectée : ta progression reste sur ton appareil.</p>" +
    '<p style="color:#d7b9d6;font-size:.85rem">Fait avec passion pour la révolution citoyenne. ✊</p>';

  /* ---------- Réinitialisation ---------- */
  function resetCampaign() {
    state.score = 0;
    state.progress = {};
    save();
  }

  /* ---------- Liaison des événements ---------- */
  function bind() {
    $("#btnPlay").addEventListener("click", () => { haptic(10); renderMap(); show("map"); });
    $("#btnHow").addEventListener("click", () => openModal("Comment jouer", HOW_HTML));
    $("#btnAbout").addEventListener("click", () => openModal("À propos", ABOUT_HTML));
    $("#modalClose").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

    $("#mapHome").addEventListener("click", () => show("home"));
    $("#introBack").addEventListener("click", () => { renderMap(); show("map"); });
    $("#introStart").addEventListener("click", () => { haptic(10); startTheme(); });

    $("#quizQuit").addEventListener("click", () => {
      timerActive = false; cancelAnimationFrame(timerRAF);
      renderMap(); show("map");
    });
    $("#feedbackNext").addEventListener("click", nextQuestion);

    $("#resultNext").addEventListener("click", () => {
      renderMap();
      if (currentIndex() >= THEMES.length) openWin(true);
      else show("map");
    });

    $("#winShare").addEventListener("click", shareResult);
    $("#winReplay").addEventListener("click", () => {
      resetCampaign(); renderMap(); show("map");
      toast("Nouvelle campagne lancée !");
    });

    // Empêche le zoom double-tap sur iOS pour les boutons.
    document.addEventListener("gesturestart", (e) => e.preventDefault());
  }

  /* ---------- Service worker (PWA) ---------- */
  function registerSW() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  /* ---------- Démarrage ---------- */
  function init() {
    load();
    initHome();
    bind();
    registerSW();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
