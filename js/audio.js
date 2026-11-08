/* ============ TYLER'S MEMORIES v3 — áudio ============ */
'use strict';

const AudioMan = {
  ctx: null, musicVol: 0.7, sfxVol: 0.8, muted: false,
  terror: null, horror: null,
  horrorTarget: 0, horrorGain: 0, terrorGain: 0, terrorTarget: 0,
  started: false, _stepFlip: false, _drone: null, _heart: null,

  init() {
    if (this.started) return;
    this.started = true;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; }
    this.terror = new Audio('assets/audio/terror.mp3');
    this.terror.loop = true; this.terror.volume = 0; this.terror.preload = 'auto';
    this.horror = new Audio('assets/audio/horror.mp3');
    this.horror.loop = true; this.horror.volume = 0; this.horror.preload = 'auto';
    this.terror.play().catch(() => {});
    this.horror.play().catch(() => {});
    this.terrorTarget = 1;
    this._ramp();
  },
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  _ramp() {
    const step = () => {
      const mv = this.muted ? 0 : this.musicVol;
      this.terrorGain += (this.terrorTarget * mv - this.terrorGain) * 0.04;
      this.horrorGain += (this.horrorTarget * mv - this.horrorGain) * 0.06;
      if (this.terror) this.terror.volume = Math.min(1, Math.max(0, this.terrorGain));
      if (this.horror) this.horror.volume = Math.min(1, Math.max(0, this.horrorGain));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  setMusic(v) { this.musicVol = v; },
  setSfx(v) { this.sfxVol = v; },
  toggleMute() { this.muted = !this.muted; if (this.muted) this.heartbeatOff(); return this.muted; },
  stareOn() { this.horrorTarget = 0.85; this.terrorTarget = 0.35; this.droneOn(); },
  stareOff() { this.horrorTarget = 0; this.terrorTarget = 1; this.droneOff(); },
  musicLevel(t, h) { this.terrorTarget = t; this.horrorTarget = h; },
  duckForVideo(on) { this.terrorTarget = on ? 0.08 : 1; this.horrorTarget = 0; if (on) { this.droneOff(); this.heartbeatOff(); } },

  _env(type, freq, dur, vol, slideTo) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(vol * this.sfxVol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },
  _noise(dur, vol, freq) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime, n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
    const g = this.ctx.createGain(); g.gain.value = vol * this.sfxVol;
    src.connect(f).connect(g).connect(this.ctx.destination);
    src.start(t);
  },
  click() { this._env('square', 660, 0.07, 0.12, 440); },
  hover() { this._env('sine', 880, 0.05, 0.05); },
  step() { this._stepFlip = !this._stepFlip; this._noise(0.07, 0.09, this._stepFlip ? 500 : 380); },
  blip() { this._env('square', 520 + Math.random() * 160, 0.03, 0.045); },
  pickup() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this._env('sine', f, 0.28, 0.16), i * 90)); },
  item() { this._env('triangle', 700, 0.12, 0.14, 950); this._env('sine', 1050, 0.2, 0.1); },
  heal() { [392, 523, 659].forEach((f, i) => setTimeout(() => this._env('sine', f, 0.3, 0.14), i * 100)); },
  jump() { this._env('sine', 300, 0.18, 0.12, 620); },
  stomp() { this._noise(0.12, 0.2, 700); this._env('square', 180, 0.12, 0.14, 90); },
  hurt() { this._env('sawtooth', 220, 0.25, 0.22, 90); this._noise(0.15, 0.18, 1200); },
  glitch() { this._noise(0.08, 0.1, 3000); this._env('square', 1400, 0.05, 0.06, 300); },
  quest() { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => this._env('triangle', f, 0.35, 0.15), i * 110)); },
  trustUp() { this._env('sine', 660, 0.2, 0.12, 880); },
  lamp() { this._env('sine', 900, 0.3, 0.12, 1400); this._noise(0.2, 0.05, 2000); },
  unlock() { [392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this._env('triangle', f, 0.5, 0.15), i * 130)); },
  doorLocked() { this._env('sawtooth', 110, 0.3, 0.14, 70); },
  doorOpen() { this._env('triangle', 220, 1.4, 0.18, 880); this._noise(1.2, 0.06, 900); },
  death() { [330, 262, 208, 165, 131, 98].forEach((f, i) => setTimeout(() => this._env('sawtooth', f, 0.7, 0.15), i * 220)); this._noise(1.4, 0.12, 600); },
  stareHit() { this._env('sawtooth', 60, 0.8, 0.2, 40); },

  /* batimento cardíaco quando a vida está baixa */
  heartbeatOn() {
    if (this._heart || this.muted) return;
    this._heart = setInterval(() => {
      this._env('sine', 55, 0.12, 0.3, 40);
      setTimeout(() => this._env('sine', 50, 0.1, 0.22, 38), 160);
    }, 900);
  },
  heartbeatOff() { if (this._heart) { clearInterval(this._heart); this._heart = null; } },

  droneOn() {
    if (!this.ctx || this.muted || this._drone) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain(), l = this.ctx.createOscillator(), lg = this.ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = 48;
    l.type = 'sine'; l.frequency.value = 0.7; lg.gain.value = 6;
    l.connect(lg).connect(o.frequency);
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.09 * this.sfxVol, this.ctx.currentTime + 1.2);
    o.connect(g).connect(this.ctx.destination);
    o.start(); l.start();
    this._drone = { o, g, l };
  },
  droneOff() {
    if (!this._drone) return;
    const { o, g, l } = this._drone; this._drone = null;
    try { g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8); o.stop(this.ctx.currentTime + 0.9); l.stop(this.ctx.currentTime + 0.9); } catch (e) {}
  },
};
