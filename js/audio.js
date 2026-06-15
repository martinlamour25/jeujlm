/* =========================================================
   audio.js — moteur sonore (Web Audio API, sans fichier).
   Musique d'ambiance synthétisée + effets sonores + mute.
   ========================================================= */
const SOUND = (function () {
  "use strict";
  let ctx = null;
  let master = null;        // volume global
  let musicGain = null;     // volume musique
  let muted = false;
  let musicTimer = null;
  let step = 0;
  let started = false;

  const MUTE_KEY = "ppp2027.muted";
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch (e) {}

  // Gamme mineure mélodique (la mineur) — solennel mais ouvert.
  const SCALE = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0];
  // Basse (progression d'accords i - VI - III - VII, esprit hymne).
  const BASS = [110.0, 87.31, 130.81, 98.0];

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.16;
    musicGain.connect(master);
  }

  function note(freq, t, dur, type, gain, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  /* ---------- Musique : boucle d'arpèges + nappe + basse ---------- */
  function tickMusic() {
    if (!ctx || muted) return;
    const t = ctx.currentTime + 0.02;
    const chord = step % 4;
    // basse
    if (step % 2 === 0) note(BASS[chord], t, 1.4, "triangle", 0.5, musicGain);
    // arpège
    const idx = [0, 2, 4, 2, 5, 4, 2, 0][step % 8];
    note(SCALE[idx], t, 0.5, "sine", 0.32, musicGain);
    if (step % 4 === 2) note(SCALE[idx] * 2, t, 0.4, "triangle", 0.12, musicGain);
    step++;
  }

  function startMusic() {
    ensure();
    if (!ctx || musicTimer) return;
    musicTimer = setInterval(tickMusic, 360);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  /* ---------- Effets sonores ---------- */
  function sfx(name) {
    ensure();
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    switch (name) {
      case "click": note(520, t, 0.08, "square", 0.18); break;
      case "swipe": {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.setValueAtTime(700, t);
        o.frequency.exponentialRampToValueAtTime(180, t + 0.18);
        g.gain.setValueAtTime(0.16, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.22); break;
      }
      case "good":
        note(523.25, t, 0.18, "sine", 0.3); note(659.25, t + 0.07, 0.2, "sine", 0.3);
        note(783.99, t + 0.14, 0.28, "sine", 0.3); break;
      case "bad":
        note(196, t, 0.22, "sawtooth", 0.22); note(155.56, t + 0.08, 0.3, "sawtooth", 0.2); break;
      case "crisis":
        note(880, t, 0.16, "square", 0.18); note(880, t + 0.22, 0.16, "square", 0.18); break;
      case "win":
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          note(f, t + i * 0.12, 0.5, "triangle", 0.28)); break;
      case "lose":
        [392, 329.63, 261.63, 196].forEach((f, i) =>
          note(f, t + i * 0.16, 0.5, "sawtooth", 0.22)); break;
    }
  }

  /* ---------- API ---------- */
  function unlock() {
    ensure();
    if (ctx && ctx.state === "suspended") ctx.resume();
    started = true;
  }
  function setMuted(m) {
    muted = m;
    try { localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch (e) {}
    if (master) master.gain.value = m ? 0 : 0.9;
    if (m) stopMusic();
  }
  function toggle() { setMuted(!muted); return muted; }
  function isMuted() { return muted; }

  return { unlock, sfx, startMusic, stopMusic, toggle, isMuted, setMuted, started: () => started };
})();
