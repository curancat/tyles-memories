/* ============ TYLER'S MEMORIES v3.1 — o campo do julgamento ============
   Todos os textos/diálogos ficam em js/textos.js (edite lá!).
   Aqui fica só a lógica: mundo, missões, itens, luz, puzzles.            */
'use strict';

const WORLD_W = 4000, WORLD_H = 600;
const VIEW_W = 960, VIEW_H = 540;
const S = VIEW_H / WORLD_H;
const VIS_W = VIEW_W / S;
const GROUND_TOP = 372, GROUND_BOT = 414;
const SKY_H = 316;
const PLAYER_SCALE = 118 / 805;
const NPC_SCALE = 0.213;
const SEG_ORDER = [0, 1, 2, 2, 3];
const DOOR_X = 3894, DOOR_HALF = 62;
const EYE_SEQ = [0, 1, 2, 3, 2, 1, 0, 4, 5, 6, 5, 4];

/* ---------- itens: ícone/efeito no código, nome/descrição em TEXTOS ---------- */
const ITEM_META = {
  pa: { icon: '⛏️' }, chave: { icon: '🗝️' }, relogio: { icon: '🕑' }, cracha: { icon: '🪪' },
  foto1: { icon: '🖼️' }, foto2: { icon: '🖼️' }, foto3: { icon: '🖼️' },
  osso: { icon: '🦴' }, coleira: { icon: '📿' }, lampiao: { icon: '🏮' },
  carta1: { icon: '✉️' }, carta2: { icon: '✉️' }, carta3: { icon: '✉️' },
  comprimido: { icon: '💊', use: 25 }, bandagem: { icon: '🩹', use: 15 },
};
const ITEMS = {};
for (const id in ITEM_META) ITEMS[id] = Object.assign({}, TEXTOS.items[id], ITEM_META[id]);

/* ---------- memórias: posição/puzzle/gate no código, textos em TEXTOS ---------- */
const FRAG_META = [
  { id: 0, x: 1235, y: 352, puzzle: 'simon', gate: 'pa' },
  { id: 1, x: 520, y: 362, puzzle: 'code', gate: 'chave' },
  { id: 2, x: 1150, y: 384, puzzle: 'maze', gate: 'bidu' },
  { id: 3, x: 2055, y: 352, puzzle: 'lights', gate: 'lampiao' },
  { id: 4, x: 2755, y: 356, puzzle: 'pulse', gate: 'foto' },
  { id: 5, x: 3450, y: 360, puzzle: 'letter', gate: 'carta' },
  { id: 6, x: 0, y: 0, video: 'sun' },
  { id: 7, x: 0, y: 0, video: 'moon' },
];
const FRAGMENTS = FRAG_META.map(m => Object.assign({}, m, TEXTOS.memories[m.id]));

/* ---------- missões: objetivos/recompensas no código, títulos/descrições em TEXTOS ---------- */
const QUEST_META = {
  sol: [
    { id: 's1', need: { items: ['cracha'] }, reward: { trust: 34, items: ['chave', 'pa'] } },
    { id: 's2', need: { items: ['relogio'] }, reward: { trust: 33, heal: 20 } },
    { id: 's3', need: { items: ['foto1', 'foto2', 'foto3'] }, reward: { trust: 33 } },
  ],
  lua: [
    { id: 'l1', need: { items: ['osso', 'coleira'] }, reward: { trust: 34, items: ['lampiao'] } },
    { id: 'l2', need: { lamps: 4 }, reward: { trust: 33, items: ['comprimido'] } },
    { id: 'l3', need: { items: ['carta1', 'carta2', 'carta3'] }, reward: { trust: 33 } },
  ],
};
const QUESTS = {};
for (const k in QUEST_META) QUESTS[k] = QUEST_META[k].map(q => Object.assign({}, q, TEXTOS.quests[q.id]));

/* Itens do mundo: cada um ligado a uma missão (só aparece quando a missão está ativa). */
const WORLD_ITEMS = [
  { item: 'cracha', quest: 's1', x: 3720, y: 396 },
  { item: 'relogio', quest: 's2', x: 1760, y: 396 },
  { item: 'bandagem', quest: 's2', x: 920, y: 396 },
  { item: 'foto1', quest: 's3', x: 450, y: 388 },
  { item: 'foto2', quest: 's3', x: 2230, y: 396 },
  { item: 'foto3', quest: 's3', x: 3560, y: 388 },
  { item: 'osso', quest: 'l1', x: 1180, y: 400 },
  { item: 'coleira', quest: 'l1', x: 2620, y: 392 },
  { item: 'bandagem', quest: 'l1', x: 2840, y: 392 },
  { item: 'carta1', quest: 'l3', x: 720, y: 392 },
  { item: 'carta2', quest: 'l3', x: 1930, y: 396 },
  { item: 'carta3', quest: 'l3', x: 3120, y: 392 },
];

class Game {
  constructor(canvas, hooks) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.hooks = hooks; this.gentle = false;
    this.darkCv = document.createElement('canvas');
    this.darkCv.width = VIEW_W; this.darkCv.height = VIEW_H;
    this.dctx = this.darkCv.getContext('2d');
    this.reset(true);
  }

  reset(full) {
    this.player = { x: 140, y: 396, z: 0, vz: 0, dir: 'frente', face: 1, frame: 0, animT: 0, stepT: 0, moving: false, iframes: 0 };
    this.camX = 0; this.t = 0;
    this.hp = 100; this.dead = false; this.deathT = 0;
    this.glitchT = 0; this.ambientGlitch = 14; this.whisperT = 12;
    this.stare = { active: false, t: 0, next: 26 + Math.random() * 12 };
    this.eyeIdx = 0; this.eyeT = 0;
    this.doorOpen = false; this.doorHintShown = false;
    this.floats = [];
    this.npcs = [
      { kind: 'sol', x: 980, y: 392, animT: 0, frame: 0 },
      { kind: 'lua', x: 2950, y: 392, animT: 0, frame: 0 },
    ];
    if (full) {
      this.frags = FRAGMENTS.map(f => Object.assign({}, f, { taken: false }));
      this.inv = {};
      this.trust = { sol: 0, lua: 0 };
      this.questIndex = { sol: 0, lua: 0 };
      this.questAccepted = { sol: false, lua: false };
      this.gameDone = { sol: false, lua: false };
      this.playTime = 0; this.deaths = 0;
      this.met = { sol: false, lua: false };
      this.lamps = [620, 1720, 2520, 3420].map(x => ({ x, y: 388, lit: false }));
      this.items = WORLD_ITEMS.map((it, i) => Object.assign({}, it, { id: i, taken: false }));
      this.heals = [300, 800, 1350, 1650, 2000, 2300, 2650, 2900, 3200, 3500, 3750, 3850].map((x, i) => ({ x, y: 380 + (i % 3) * 12, taken: false }));
      this.allDoneShown = false;
    }
  }

  /* ---------- inventário / progresso ---------- */
  has(id) { return (this.inv[id] || 0) > 0; }
  addItem(id, n = 1) { this.inv[id] = (this.inv[id] || 0) + n; }
  consume(id, n = 1) { if (this.inv[id]) { this.inv[id] -= n; if (this.inv[id] <= 0) delete this.inv[id]; } }
  hasFoto() { return this.has('foto1') && this.has('foto2') && this.has('foto3'); }
  hasCarta() { return this.has('carta1') && this.has('carta2') && this.has('carta3'); }
  get fragsGot() { return this.frags.filter(f => f.taken).length; }
  get lampsLit() { return this.lamps.filter(l => l.lit).length; }

  /* Uma memória fica visível quando seu gate é satisfeito (item na mão ou missão concluída). */
  gateMet(f) {
    if (!f.gate) return true;
    if (f.gate === 'foto') return this.questIndex.sol >= 3;
    if (f.gate === 'carta') return this.questIndex.lua >= 3;
    if (f.gate === 'bidu') return this.questIndex.lua >= 1;
    return this.has(f.gate);
  }

  /* Um item do mundo só aparece quando a missão dele está aceita e em andamento. */
  itemActive(it) {
    if (!it.quest) return true;
    const kind = it.quest[0] === 's' ? 'sol' : 'lua';
    const idx = parseInt(it.quest.slice(1), 10) - 1;
    return this.questAccepted[kind] && this.questIndex[kind] === idx;
  }

  useItem(id) {
    const def = ITEMS[id];
    if (!def || !def.use || !this.has(id)) return false;
    if (this.hp >= 100) { this.hooks.onHint(TEXTOS.hints.hpFull); return false; }
    this.hp = Math.min(100, this.hp + def.use);
    this.consume(id);
    AudioMan.heal();
    this.float(this.player.x, this.player.y - 90, '+' + def.use, '#7fe0b0');
    this.hooks.onInv();
    return true;
  }

  /* ---------- missões ---------- */
  questProgress(kind) {
    const q = QUESTS[kind][this.questIndex[kind]];
    if (!q) return null;
    const parts = [];
    if (q.need.items) q.need.items.forEach(it => parts.push({ txt: `${ITEMS[it].name}: ${this.has(it) ? '✓' : '✗'}`, done: this.has(it) }));
    if (q.need.lamps) parts.push({ txt: TEXTOS.ui.lampsProgress.replace('{a}', this.lampsLit).replace('{b}', q.need.lamps), done: this.lampsLit >= q.need.lamps });
    return { q, parts, complete: parts.every(p => p.done) };
  }

  npcDialogue(kind) {
    const T = TEXTOS.npc[kind];
    const qi = this.questIndex[kind];
    if (qi >= 3) {
      if (!this.gameDone[kind]) return { action: 'game', lines: T.game.slice() };
      return { action: 'final', lines: T.final.slice() };
    }
    const q = QUESTS[kind][qi];
    if (!this.questAccepted[kind]) {
      const intro = this.met[kind] ? T.return : T.first;
      return { action: 'accept', lines: [...intro, `${TEXTOS.ui.missionLabel}: ${q.title}.`, q.desc] };
    }
    const prog = this.questProgress(kind);
    if (prog.complete) return { action: 'complete', lines: T.complete.slice() };
    const remind = T.remind.map(l => l.replace('{missao}', q.desc));
    return { action: 'hint', lines: remind };
  }

  acceptQuest(kind) {
    this.questAccepted[kind] = true; this.met[kind] = true;
    this.hooks.onQuest();
    this.hooks.onHint(TEXTOS.hints.itemsSpawned);
  }

  completeQuest(kind) {
    const q = QUESTS[kind][this.questIndex[kind]];
    if (!q) return;
    if (q.need.items) q.need.items.forEach(it => this.consume(it));
    const r = q.reward;
    this.trust[kind] = Math.min(100, this.trust[kind] + r.trust);
    if (r.items) r.items.forEach(it => { this.addItem(it); this.float(this.player.x, this.player.y - 100, '+ ' + ITEMS[it].name, '#ffd97a'); });
    if (r.heal) this.hp = Math.min(100, this.hp + r.heal);
    this.questIndex[kind]++;
    this.questAccepted[kind] = false;
    AudioMan.quest(); AudioMan.trustUp();
    this.hooks.onQuest(); this.hooks.onInv(); this.hooks.onTrust();
    this.hooks.onHint(TEXTOS.hints.questDone.replace('{titulo}', q.title).replace('{npc}', kind === 'sol' ? 'Sol' : 'Lua'));
  }

  grantVideoMemory(kind) {
    const id = kind === 'sol' ? 6 : 7;
    const f = this.frags.find(f => f.id === id);
    if (f && !f.taken) {
      f.taken = true; this.gameDone[kind] = true;
      this.trust[kind] = 100;
      this.hooks.onVideo(kind, f);
      this.checkAllDone();
    }
  }

  /* ---------- interação ---------- */
  get nearNpc() { return this.npcs.find(n => Math.abs(n.x - this.player.x) < 85 && Math.abs(n.y - this.player.y) < 42) || null; }
  get nearFrag() {
    return this.frags.find(f => !f.taken && !f.video && this.gateMet(f) && Math.abs(f.x - this.player.x) < 48 && Math.abs((f.y + 26) - this.player.y) < 52) || null;
  }
  get nearItem() { return this.items.find(it => !it.taken && this.itemActive(it) && Math.abs(it.x - this.player.x) < 40 && Math.abs(it.y - this.player.y) < 40) || null; }
  get nearLamp() { return this.lamps.find(l => !l.lit && Math.abs(l.x - this.player.x) < 44 && Math.abs(l.y - this.player.y) < 40) || null; }
  get nearDoor() { return Math.abs(this.player.x - DOOR_X) < DOOR_HALF + 14; }

  interact() {
    if (this.dead) return;
    const npc = this.nearNpc;
    if (npc) { const d = this.npcDialogue(npc.kind); this.hooks.onDialogue(npc.kind, d.lines, d.action); return; }
    const frag = this.nearFrag;
    if (frag) { this.hooks.onPuzzle(frag); return; }
    const it = this.nearItem;
    if (it) { it.taken = true; this.addItem(it.item); AudioMan.item(); this.float(it.x, it.y - 40, '+ ' + ITEMS[it.item].name, '#ffd97a'); this.hooks.onInv(); this.hooks.onQuest(); return; }
    const lamp = this.nearLamp;
    if (lamp) {
      if (!this.has('lampiao')) { this.hooks.onHint(TEXTOS.hints.needLampiao); return; }
      lamp.lit = true; AudioMan.lamp(); this.float(lamp.x, lamp.y - 60, TEXTOS.floats.lampLit, '#ffd97a'); this.hooks.onQuest(); return;
    }
    const hidden = this.frags.find(f => !f.taken && !f.video && !this.gateMet(f) && Math.abs(f.x - this.player.x) < 60);
    if (hidden) { this.hooks.onHint(hidden.hint); return; }
    if (this.nearDoor) {
      if (this.doorOpen) this.hooks.onExit();
      else { AudioMan.doorLocked(); this.hooks.onHint(TEXTOS.hints.doorLocked.replace('{n}', this.fragsGot)); }
    }
  }

  collect(id) {
    const f = this.frags.find(f => f.id === id);
    if (!f || f.taken) return;
    f.taken = true;
    AudioMan.pickup();
    this.hooks.onFragment(f);
    if (this.fragsGot === 1) { this.hooks.onHint(TEXTOS.hints.fieldWoke, 7000); AudioMan.musicLevel(1, 0); }
    this.checkAllDone();
  }

  checkAllDone() {
    if (this.fragsGot === 8 && !this.allDoneShown) {
      this.allDoneShown = true; this.doorOpen = true;
      AudioMan.unlock();
      this.hooks.onAllDone();
    }
  }

  /* ---------- dano / cura / morte ---------- */
  penalty(n) {
    this.hp = Math.max(0, this.hp - n);
    this.glitchT = Math.max(this.glitchT, 0.25);
    AudioMan.hurt();
    if (this.hp <= 0) { this.die(); return true; }
    return false;
  }
  healDot() { this.hp = Math.min(100, this.hp + 12); AudioMan.heal(); this.float(this.player.x, this.player.y - 90, '+12', '#7fe0b0'); }
  die() {
    if (this.dead) return;
    this.dead = true; this.deathT = 0;
    AudioMan.death(); AudioMan.stareOff(); AudioMan.heartbeatOff();
    this.glitchT = 2.2;
  }
  respawn() {
    this.deaths++;
    this.dead = false; this.deathT = 0;
    this.hp = 60; this.player.x = 140; this.player.y = 396; this.player.z = 0; this.player.vz = 0;
    this.player.iframes = 2; this.camX = 0;
    this.stare.active = false; this.stare.next = 26;
    this.hooks.onStare(false);
  }
  float(x, y, text, color) { this.floats.push({ x, y, text, color, t: 0 }); }

  jump() {
    if (this.dead || this.player.z > 0) return;
    this.player.vz = 265; AudioMan.jump();
  }

  /* ---------- update ---------- */
  update(dt, keys) {
    if (this.dead) {
      this.deathT += dt; this.glitchT = Math.max(0, this.glitchT - dt);
      if (this.deathT > 2.3) this.hooks.onGameOver();
      return;
    }
    this.t += dt; this.playTime += dt;
    const p = this.player;
    const calm = this.fragsGot === 0;   // começo calmo: o campo só "acorda" após a 1ª memória
    p.iframes = Math.max(0, p.iframes - dt);
    this.glitchT = Math.max(0, this.glitchT - dt);
    if (!calm) {
      this.ambientGlitch -= dt;
      if (this.ambientGlitch <= 0) { this.glitchT = Math.max(this.glitchT, 0.12); AudioMan.glitch(); this.ambientGlitch = 16 + Math.random() * 14; }
      // sussurros do campo (atmosfera, sem monstros)
      this.whisperT -= dt;
      if (this.whisperT <= 0) {
        this.whisperT = 22 + Math.random() * 18;
        const w = TEXTOS.whispers[Math.floor(Math.random() * TEXTOS.whispers.length)];
        this.float(p.x + (Math.random() * 140 - 70), p.y - 80, w, '#b98a8a');
      }
    }

    let vx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    let vy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
    p.moving = !!(vx || vy);
    if (p.moving) {
      p.x += vx * 175 * dt; p.y += vy * 95 * dt;
      p.x = Math.max(40, Math.min(WORLD_W - 40, p.x));
      p.y = Math.max(GROUND_TOP, Math.min(GROUND_BOT, p.y));
      if (vx) { p.dir = 'lado'; p.face = vx; } else p.dir = vy < 0 ? 'costas' : 'frente';
      p.animT += dt; const spd = p.dir === 'lado' ? 0.1 : 0.14;
      if (p.animT >= spd) { p.animT = 0; p.frame++; }
      if (p.z === 0) { p.stepT += dt; if (p.stepT >= 0.27) { p.stepT = 0; AudioMan.step(); } }
    } else { p.frame = 0; p.animT = 0; }
    if (p.z > 0 || p.vz > 0) {
      p.z += p.vz * dt; p.vz -= 720 * dt;
      if (p.z <= 0) { p.z = 0; p.vz = 0; }
    }

    const target = Math.max(0, Math.min(WORLD_W - VIS_W, p.x - VIS_W / 2));
    this.camX += (target - this.camX) * Math.min(1, dt * 5);

    this.eyeT += dt;
    if (this.eyeT >= 0.8) { this.eyeT = 0; this.eyeIdx = (this.eyeIdx + 1) % EYE_SEQ.length; }
    for (const n of this.npcs) { n.animT += dt; if (n.animT >= 0.18) { n.animT = 0; n.frame++; } }

    this.updatePickups();

    // O Olhar — só depois da 1ª memória. Drena vida se parado.
    const st = this.stare;
    if (calm) {
      if (st.active) { st.active = false; this.hooks.onStare(false); AudioMan.stareOff(); }
    } else if (!st.active) {
      st.next -= dt;
      if (st.next <= 0) { st.active = true; st.t = this.gentle ? 5 : 7; this.hooks.onStare(true); AudioMan.stareOn(); if (!this.gentle) AudioMan.stareHit(); }
    } else {
      st.t -= dt;
      const drain = this.gentle ? (p.moving ? 0.6 : 1.6) : (p.moving ? 1.2 : 3.2);
      this.hp = Math.max(0, this.hp - drain * dt);
      if (Math.random() < dt * 1.5) AudioMan.glitch();
      if (st.t <= 0) { st.active = false; st.next = 24 + Math.random() * 16; this.hooks.onStare(false); AudioMan.stareOff(); }
      if (this.hp <= 0) this.die();
    }

    if (this.hp <= 25 && this.hp > 0) AudioMan.heartbeatOn(); else AudioMan.heartbeatOff();

    for (const fl of this.floats) fl.t += dt;
    this.floats = this.floats.filter(fl => fl.t < 1.6);

    if (this.nearDoor && !this.doorHintShown) {
      this.doorHintShown = true;
      this.hooks.onHint(this.doorOpen ? TEXTOS.hints.doorOpen : TEXTOS.hints.doorNeed);
    }
  }

  updatePickups() {
    const p = this.player;
    for (const h of this.heals) {
      if (!h.taken && Math.abs(h.x - p.x) < 30 && Math.abs(h.y - p.y) < 34 && p.z < 20) {
        if (this.hp < 100) { h.taken = true; this.healDot(); }
      }
    }
  }

  /* ---------- save ---------- */
  serialize() {
    return {
      v: 3, hp: this.hp, x: this.player.x, y: this.player.y,
      frags: this.frags.filter(f => f.taken).map(f => f.id),
      inv: this.inv, trust: this.trust, questIndex: this.questIndex,
      questAccepted: this.questAccepted, gameDone: this.gameDone,
      lamps: this.lamps.map(l => l.lit),
      items: this.items.filter(i => i.taken).map(i => i.id),
      heals: this.heals.map(h => h.taken),
      playTime: this.playTime, deaths: this.deaths, met: this.met,
    };
  }
  restore(d) {
    this.reset(true);
    if (!d || d.v !== 3) return;
    (d.frags || []).forEach(id => { const f = this.frags.find(f => f.id === id); if (f) f.taken = true; });
    this.hp = d.hp != null ? d.hp : 100;
    this.player.x = d.x || 140; this.player.y = d.y || 396;
    this.inv = d.inv || {}; this.trust = d.trust || { sol: 0, lua: 0 };
    this.questIndex = d.questIndex || { sol: 0, lua: 0 };
    this.questAccepted = d.questAccepted || { sol: false, lua: false };
    this.gameDone = d.gameDone || { sol: false, lua: false };
    this.playTime = d.playTime || 0; this.deaths = d.deaths || 0; this.met = d.met || {};
    (d.lamps || []).forEach((lit, i) => { if (this.lamps[i]) this.lamps[i].lit = lit; });
    (d.items || []).forEach(id => { const it = this.items.find(i => i.id === id); if (it) it.taken = true; });
    (d.heals || []).forEach((t, i) => { if (this.heals[i]) this.heals[i].taken = t; });
    this.doorOpen = this.fragsGot === 8;
    this.camX = Math.max(0, Math.min(WORLD_W - VIS_W, this.player.x - VIS_W / 2));
  }

  /* ================= RENDER ================= */
  render() {
    const ctx = this.ctx, t = this.t, p = this.player;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.setTransform(S, 0, 0, S, -this.camX * S, 0);

    for (let i = 0; i < SEG_ORDER.length; i++) {
      const x = i * 800;
      if (x + 800 > this.camX - 10 && x < this.camX + VIS_W + 10) ctx.drawImage(ASSETS.cenarios[SEG_ORDER[i]], x, 0);
    }
    const stareOn = this.stare.active;
    const eyeFrame = stareOn ? ASSETS.ceu[3] : ASSETS.ceu[EYE_SEQ[this.eyeIdx]];
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = stareOn ? (this.gentle ? 0.6 : 0.9) : (this.fragsGot === 0 ? 0.18 : (this.gentle ? 0.28 : 0.4));
    const off = this.camX * 0.55, start = Math.floor(off / 800) - 1;
    for (let k = start; k <= start + 3; k++) {
      const x = k * 800 - off + this.camX;
      ctx.drawImage(eyeFrame, 0, 0, 800, SKY_H, x, 0, 800, SKY_H);
    }
    ctx.restore();

    if (this.doorOpen) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 2.4);
      const g = ctx.createRadialGradient(DOOR_X, 268, 8, DOOR_X, 268, 150);
      g.addColorStop(0, `rgba(255,240,190,${0.85 * pulse})`); g.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = g; ctx.fillRect(DOOR_X - 150, 118, 300, 300);
      ctx.fillStyle = `rgba(255,244,210,${0.8 * pulse})`; ctx.fillRect(DOOR_X - 54, 200, 108, 130);
    }

    for (const l of this.lamps) {
      ctx.fillStyle = '#2a2a38'; ctx.fillRect(l.x - 3, l.y - 46, 6, 46);
      ctx.beginPath(); ctx.arc(l.x, l.y - 50, 8, 0, 7);
      ctx.fillStyle = l.lit ? '#ffd97a' : '#3a3a48'; ctx.fill();
      if (l.lit) { const g = ctx.createRadialGradient(l.x, l.y - 50, 2, l.x, l.y - 50, 40); g.addColorStop(0, 'rgba(255,217,122,.5)'); g.addColorStop(1, 'rgba(255,217,122,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y - 50, 40, 0, 7); ctx.fill(); }
    }

    // itens (só os da missão ativa)
    for (const it of this.items) {
      if (it.taken || !this.itemActive(it)) continue;
      const bob = Math.sin(t * 2 + it.id) * 3;
      ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ITEMS[it.item].icon, it.x, it.y - 14 + bob);
    }
    for (const h of this.heals) {
      if (h.taken) continue;
      const bob = Math.sin(t * 3 + h.x) * 3;
      const g = ctx.createRadialGradient(h.x, h.y - 10 + bob, 1, h.x, h.y - 10 + bob, 12);
      g.addColorStop(0, 'rgba(127,224,176,.95)'); g.addColorStop(1, 'rgba(127,224,176,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y - 10 + bob, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#bfe8d4'; ctx.beginPath(); ctx.arc(h.x, h.y - 10 + bob, 3.5, 0, 7); ctx.fill();
    }

    // memórias visíveis (gate satisfeito) e não coletadas
    for (const f of this.frags) {
      if (f.taken || f.video || !this.gateMet(f)) continue;
      const near = Math.abs(f.x - p.x) < 160;
      if (!near) continue;
      const fy = f.y + Math.sin(t * 2.2 + f.id) * 5;
      const pulse = 0.7 + 0.3 * Math.sin(t * 3 + f.id);
      const g = ctx.createRadialGradient(f.x, fy, 2, f.x, fy, 24);
      g.addColorStop(0, 'rgba(255,250,225,.9)'); g.addColorStop(1, 'rgba(255,217,122,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, fy, 26, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(160,170,200,${0.5 + 0.3 * pulse})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(f.x, fy, 14, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(20,22,34,.9)'; ctx.fillRect(f.x - 5, fy - 3, 10, 8);
    }

    for (const n of this.npcs) {
      const frames = n.kind === 'sol' ? ASSETS.sol : ASSETS.lua;
      const seq = n.kind === 'sol' ? [0, 1, 2, 3, 4, 3, 2, 1] : [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
      const im = frames[seq[n.frame % seq.length]];
      const w = im.width * NPC_SCALE, h = im.height * NPC_SCALE;
      ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(Math.sin(t * 0.9 + (n.kind === 'sol' ? 0 : 2)) * 0.022);
      ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
    }

    // player
    const frames = ASSETS.player[p.dir];
    const im = frames[p.frame % frames.length];
    const w = im.width * PLAYER_SCALE, h = im.height * PLAYER_SCALE;
    ctx.fillStyle = 'rgba(0,0,0,.45)';
    ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, 24 * (1 - p.z / 200), 6, 0, 0, 7); ctx.fill();
    ctx.save();
    ctx.translate(p.x, p.y - p.z);
    if (this.dead) { ctx.rotate(Math.min(1.5, this.deathT * 1.2)); ctx.globalAlpha = Math.max(0, 1 - this.deathT / 2.3); }
    else if (p.iframes > 0 && Math.floor(t * 12) % 2 === 0) ctx.globalAlpha = 0.4;
    if (p.dir === 'lado' && p.face < 0) ctx.scale(-1, 1);
    ctx.drawImage(im, -w / 2, -h, w, h);
    ctx.restore();

    // prompts
    const near = this.nearNpc, nf = this.nearFrag, ni = this.nearItem, nl = this.nearLamp;
    let px = null, py = null;
    if (near) { px = near.x; py = near.y - (near.kind === 'sol' ? 175 : 160); }
    else if (nf) { px = nf.x; py = nf.y - 46; }
    else if (ni) { px = ni.x; py = ni.y - 44; }
    else if (nl) { px = nl.x; py = nl.y - 80; }
    else if (this.nearDoor) { px = DOOR_X; py = 175; }
    if (px != null && !this.dead) {
      const bob = Math.sin(t * 4) * 3, bw = 34, bh = 30, bx = px - bw / 2, by = py + bob;
      ctx.fillStyle = 'rgba(10,10,20,.85)'; ctx.strokeStyle = '#ffd97a'; ctx.lineWidth = 2;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 7); else ctx.rect(bx, by, bw, bh); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffd97a'; ctx.font = 'bold 17px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('E', px, by + bh / 2 + 1);
    }

    for (const fl of this.floats) {
      ctx.globalAlpha = Math.max(0, 1 - fl.t / 1.6);
      ctx.fillStyle = fl.color; ctx.font = 'bold 14px "Courier New", monospace'; ctx.textAlign = 'center';
      ctx.fillText(fl.text, fl.x, fl.y - fl.t * 30);
      ctx.globalAlpha = 1;
    }

    /* ---- ATMOSFERA: levemente escuro, mapa visível, vibe de mistério ---- */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const calm = this.fragsGot === 0;
    const dctx = this.dctx;
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.globalCompositeOperation = 'source-over';
    dctx.clearRect(0, 0, VIEW_W, VIEW_H);
    const baseDark = calm ? 0.32 : (stareOn ? 0.52 : 0.42);
    dctx.fillStyle = `rgba(8,8,24,${baseDark})`; dctx.fillRect(0, 0, VIEW_W, VIEW_H);
    dctx.globalCompositeOperation = 'destination-out';
    const lights = [];
    const pr = (this.has('lampiao') ? 430 : 330) * (stareOn ? 0.8 : 1) * S;
    lights.push({ x: (p.x - this.camX) * S, y: (p.y - p.z - 40) * S, r: pr, a: 0.95 });
    for (const l of this.lamps) if (l.lit) lights.push({ x: (l.x - this.camX) * S, y: (l.y - 50) * S, r: 150 * S, a: 0.8 });
    for (const n of this.npcs) lights.push({ x: (n.x - this.camX) * S, y: (n.y - 70) * S, r: 110 * S, a: 0.7 });
    for (const it of this.items) if (!it.taken && this.itemActive(it)) lights.push({ x: (it.x - this.camX) * S, y: (it.y - 14) * S, r: 55 * S, a: 0.6 });
    for (const h of this.heals) if (!h.taken) lights.push({ x: (h.x - this.camX) * S, y: (h.y - 10) * S, r: 42 * S, a: 0.5 });
    for (const f of this.frags) if (!f.taken && !f.video && this.gateMet(f)) lights.push({ x: (f.x - this.camX) * S, y: f.y * S, r: 80 * S, a: 0.7 });
    if (this.doorOpen) lights.push({ x: (DOOR_X - this.camX) * S, y: 268 * S, r: 180 * S, a: 0.85 });
    for (const L of lights) {
      const flick = 1 + Math.sin(t * 5 + L.x) * 0.02;
      const g = dctx.createRadialGradient(L.x, L.y, L.r * 0.1, L.x, L.y, L.r * flick);
      g.addColorStop(0, `rgba(0,0,0,${L.a})`); g.addColorStop(0.55, `rgba(0,0,0,${L.a * 0.5})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = g; dctx.beginPath(); dctx.arc(L.x, L.y, L.r * flick, 0, 7); dctx.fill();
    }
    dctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(this.darkCv, 0, 0);

    const v = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.45, VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.95);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(4,4,18,${stareOn ? 0.5 : 0.3})`);
    ctx.fillStyle = v; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    if (stareOn && !this.gentle) { ctx.fillStyle = `rgba(120,0,0,${0.06 + 0.04 * Math.sin(t * 7)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    if (this.hp <= 25 && !this.dead) { ctx.fillStyle = `rgba(120,0,0,${0.08 + 0.06 * Math.sin(t * 5)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }

    /* ---- GLITCH ---- */
    if (this.glitchT > 0) {
      const n = 5 + Math.floor(this.glitchT * 8);
      for (let i = 0; i < n; i++) {
        const y = Math.random() * VIEW_H, hh = 6 + Math.random() * 22, dx = (Math.random() - 0.5) * 46;
        ctx.drawImage(this.cv, 0, y, VIEW_W, hh, dx, y, VIEW_W, hh);
      }
      ctx.fillStyle = `rgba(255,0,70,${0.05 * this.glitchT})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = `rgba(0,255,220,${0.04 * this.glitchT})`; ctx.fillRect(2, 0, VIEW_W, VIEW_H);
    }
    if (this.dead) { ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, this.deathT / 2.3)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
  }
}
