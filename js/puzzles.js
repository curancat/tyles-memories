/* ============ TYLER'S MEMORIES — as trancas e os jogos dos NPCs ============
   Títulos, pistas, frases e mensagens de erro ficam em js/textos.js.        */
'use strict';

const Puzzles = {
  frag: null, type: null, st: null, timers: [], cursor: 0,
  mode: 'frag', gameKind: null,
  META: TEXTOS.puzzles,

  open(frag) {
    this.mode = 'frag'; this.gameKind = null;
    this.frag = frag; this.type = frag.puzzle; this.st = {}; this.cursor = 0;
    ui.puzzle = true; keys.left = keys.right = keys.up = keys.down = false;
    const m = this.META[this.type];
    $('pz-title').textContent = m.title; $('pz-desc').textContent = m.desc;
    $('pz-status').textContent = ''; $('pz-status').className = '';
    $('pz-stage').innerHTML = ''; show($('puzzle'));
    AudioMan.click(); this['build_' + this.type]();
  },

  openGame(kind) {
    this.mode = 'game'; this.gameKind = kind;
    this.frag = null; this.type = kind === 'sol' ? 'pairs' : 'reaction'; this.st = {}; this.cursor = 0;
    ui.puzzle = true; keys.left = keys.right = keys.up = keys.down = false;
    const m = this.META[this.type];
    $('pz-title').textContent = m.title; $('pz-desc').textContent = m.desc;
    $('pz-status').textContent = ''; $('pz-status').className = '';
    $('pz-stage').innerHTML = ''; show($('puzzle'));
    AudioMan.click(); this['build_' + this.type]();
  },

  close() {
    this.timers.forEach(t => { clearTimeout(t); clearInterval(t); }); this.timers = [];
    ui.puzzle = false; hide($('puzzle'));
    this.frag = null; this.st = null; this.type = null; this.gameKind = null;
  },
  abort() { if (this.type) { this.close(); showHint(TEXTOS.hints.puzzleAbort); } },
  win() {
    AudioMan.unlock();
    if (this.mode === 'game') { const k = this.gameKind; this.close(); game.grantVideoMemory(k); }
    else { const id = this.frag.id; this.close(); game.collect(id); }
  },
  fail(cost, msg) { AudioMan.doorLocked(); this.status(msg, 'bad'); return game.penalty(cost); },
  status(msg, cls) { const el = $('pz-status'); el.textContent = msg; el.className = cls || ''; },
  later(fn, ms) { const t = setTimeout(fn, ms); this.timers.push(t); return t; },
  every(fn, ms) { const t = setInterval(fn, ms); this.timers.push(t); return t; },
  key(k) {
    if (!this.type) return;
    const map = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right',
      ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
      left: 'left', right: 'right', up: 'up', down: 'down', e: 'e', E: 'e', Enter: 'e', ' ': 'e', Backspace: 'back' };
    const kk = map[k] || (/^[0-9]$/.test(k) ? k : null);
    if (!kk) return;
    const h = this['key_' + this.type]; if (h) h.call(this, kk);
  },

  /* ===== 1) SIMON — 5 rodadas, até 7 ===== */
  build_simon() {
    this.st = { round: 0, seq: [], pos: 0, phase: 'wait' };
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71'];
    const wrap = document.createElement('div'); wrap.className = 'simon-wrap';
    colors.forEach((c, i) => {
      const b = document.createElement('button'); b.className = 'simon-btn'; b.id = 'simon' + i;
      b.style.setProperty('--c', c); b.innerHTML = `<span class="pill"></span>${i + 1}`;
      b.addEventListener('click', () => this.simonPress(i)); wrap.appendChild(b);
    });
    $('pz-stage').appendChild(wrap);
    for (let i = 0; i < 3; i++) this.st.seq.push(Math.floor(Math.random() * 4));
    this.later(() => this.simonShow(), 600);
  },
  simonShow() {
    const st = this.st; if (!st) return;
    st.phase = 'show'; st.pos = 0;
    this.status(`Rodada ${st.round + 1}/5 — observe…`);
    const gap = Math.max(300, 560 - st.round * 50);
    st.seq.forEach((c, i) => {
      this.later(() => { const b = $('simon' + c); if (b) b.classList.add('lit'); }, 400 + i * gap);
      this.later(() => { const b = $('simon' + c); if (b) b.classList.remove('lit'); }, 400 + i * gap + gap * 0.6);
    });
    this.later(() => { if (!this.st) return; st.phase = 'input'; this.status(`Sua vez — 0/${st.seq.length}`); }, 400 + st.seq.length * gap);
  },
  simonPress(i) {
    const st = this.st; if (!st || st.phase !== 'input') return;
    const b = $('simon' + i); b.classList.add('lit'); this.later(() => b.classList.remove('lit'), 180);
    AudioMan.blip();
    if (i !== st.seq[st.pos]) {
      st.phase = 'wait';
      if (this.fail(7, TEXTOS.puzzleFail.simon)) return;
      this.later(() => this.simonShow(), 1000); return;
    }
    st.pos++; this.status(`Sua vez — ${st.pos}/${st.seq.length}`);
    if (st.pos === st.seq.length) {
      st.round++;
      if (st.round >= 5) { this.win(); return; }
      st.phase = 'wait'; st.seq.push(Math.floor(Math.random() * 4));
      this.status('Certo. Mais uma cápsula…', 'good');
      this.later(() => this.simonShow(), 900);
    }
  },
  key_simon(k) { if (['1', '2', '3', '4'].includes(k)) this.simonPress(+k - 1); },

  /* ===== 2) SENHA — 1407, 3 tentativas ===== */
  build_code() {
    this.st = { entered: '', tries: 3 };
    const clues = document.createElement('div'); clues.className = 'code-clues';
    clues.innerHTML = TEXTOS.puzzleClues.code;
    $('pz-stage').appendChild(clues);
    const disp = document.createElement('div'); disp.className = 'code-display'; disp.id = 'code-display';
    $('pz-stage').appendChild(disp);
    const pad = document.createElement('div'); pad.className = 'code-pad';
    ['1','2','3','4','5','6','7','8','9','⌫','0','✔'].forEach(n => {
      const b = document.createElement('button'); b.className = 'code-key'; b.textContent = n;
      b.addEventListener('click', () => this.codePress(n)); pad.appendChild(b);
    });
    $('pz-stage').appendChild(pad);
    this.codeRender(); this.status('Digite os 4 dígitos e confirme em ✔');
  },
  codeRender() { const e = this.st.entered; $('code-display').textContent = (e + '____'.slice(e.length)).split('').join(' '); },
  codePress(n) {
    const st = this.st; if (!st) return;
    AudioMan.blip();
    if (n === '⌫') { st.entered = st.entered.slice(0, -1); this.codeRender(); return; }
    if (n === '✔') {
      if (st.entered.length < 4) { this.status('Quatro dígitos.'); return; }
      if (st.entered === '1407') { this.win(); return; }
      st.tries--; st.entered = ''; this.codeRender();
      if (st.tries <= 0) {
        if (this.fail(8, TEXTOS.puzzleFail.code)) return;
        st.tries = 3; this.status('Bloqueada… mas a memória volta a tentar. 3 tentativas.', 'bad');
      } else this.status(`Senha incorreta. Restam ${st.tries} tentativa${st.tries > 1 ? 's' : ''}.`, 'bad');
      return;
    }
    if (st.entered.length < 4) { st.entered += n; this.codeRender(); }
  },
  key_code(k) { if (/^[0-9]$/.test(k)) this.codePress(k); else if (k === 'back') this.codePress('⌫'); else if (k === 'e') this.codePress('✔'); },

  /* ===== 3) LABIRINTO — 15x11, névoa ===== */
  build_maze() {
    const W = 15, H = 11;
    const g = Array.from({ length: H }, () => Array(W).fill(1));
    const stack = [[1, 1]]; g[1][1] = 0;
    const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]];
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const opts = dirs.map(([dx, dy]) => [x + dx, y + dy, dx, dy]).filter(([nx, ny]) => nx > 0 && nx < W - 1 && ny > 0 && ny < H - 1 && g[ny][nx] === 1);
      if (!opts.length) { stack.pop(); continue; }
      const [nx, ny, dx, dy] = opts[Math.floor(Math.random() * opts.length)];
      g[y + dy / 2][x + dx / 2] = 0; g[ny][nx] = 0; stack.push([nx, ny]);
    }
    const dist = Array.from({ length: H }, () => Array(W).fill(-1));
    const q = [[1, 1]]; dist[1][1] = 0;
    while (q.length) { const [x, y] = q.shift(); [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (g[ny] && g[ny][nx] === 0 && dist[ny][nx] < 0) { dist[ny][nx] = dist[y][x] + 1; q.push([nx, ny]); } }); }
    this.st = { g, W, H, x: 1, y: 1, gx: W - 2, gy: H - 2, steps: 0, limit: dist[H - 2][W - 2] + 10 };
    const grid = document.createElement('div'); grid.className = 'maze-grid'; grid.id = 'maze-grid';
    grid.style.gridTemplateColumns = `repeat(${W}, 20px)`;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = document.createElement('div'); c.className = 'maze-cell' + (g[y][x] ? ' wall' : ''); c.id = `mz${x}_${y}`; grid.appendChild(c); }
    $('pz-stage').appendChild(grid); this.mazeRender();
  },
  mazeRender() {
    const st = this.st;
    for (let y = 0; y < st.H; y++) for (let x = 0; x < st.W; x++) {
      const c = $(`mz${x}_${y}`);
      const visible = Math.abs(x - st.x) <= 2 && Math.abs(y - st.y) <= 2;
      c.classList.toggle('fog', !visible);
      c.textContent = !visible ? '' : (x === st.x && y === st.y) ? '🐕' : (x === st.gx && y === st.gy ? '🏠' : '');
    }
    this.status(`Passos: ${st.steps}/${st.limit} — leve Bidu para casa.`);
  },
  key_maze(k) {
    const st = this.st; if (!st) return;
    const d = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[k]; if (!d) return;
    const nx = st.x + d[0], ny = st.y + d[1];
    if (!st.g[ny] || st.g[ny][nx] !== 0) return;
    st.x = nx; st.y = ny; st.steps++; AudioMan.step();
    if (nx === st.gx && ny === st.gy) { this.win(); return; }
    if (st.steps >= st.limit) { st.x = 1; st.y = 1; st.steps = 0; if (this.fail(7, TEXTOS.puzzleFail.maze)) return; }
    this.mazeRender();
  },

  /* ===== 4) LUZES — 4x4 ===== */
  build_lights() {
    const N = 4, g = Array(N * N).fill(true);
    const press = i => { const x = i % N, y = (i / N) | 0; [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx >= 0 && nx < N && ny >= 0 && ny < N) g[ny * N + nx] = !g[ny * N + nx]; }); };
    const used = new Set(); while (used.size < 8) { const i = Math.floor(Math.random() * 16); if (!used.has(i)) { used.add(i); press(i); } }
    if (g.every(v => v)) press(5);
    this.st = { g, N, moves: 0, limit: 40 };
    const grid = document.createElement('div'); grid.className = 'lights-grid'; grid.id = 'lights-grid';
    grid.style.gridTemplateColumns = `repeat(${N}, 60px)`;
    for (let i = 0; i < N * N; i++) { const b = document.createElement('button'); b.className = 'light-cell'; b.id = 'lt' + i; b.addEventListener('click', () => this.lightsPress(i)); grid.appendChild(b); }
    $('pz-stage').appendChild(grid); this.lightsRender();
  },
  lightsRender() {
    const st = this.st;
    st.g.forEach((on, i) => { const b = $('lt' + i); b.classList.toggle('on', on); b.classList.toggle('cursor', i === this.cursor); b.textContent = on ? '💡' : ''; });
    this.status(`Toques: ${st.moves}/${st.limit} — acenda as 16 luzes.`);
  },
  lightsPress(i) {
    const st = this.st; if (!st) return;
    this.cursor = i; const N = st.N, x = i % N, y = (i / N) | 0;
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx >= 0 && nx < N && ny >= 0 && ny < N) st.g[ny * N + nx] = !st.g[ny * N + nx]; });
    st.moves++; AudioMan.blip();
    if (st.g.every(v => v)) { this.win(); return; }
    if (st.moves >= st.limit) { if (this.fail(7, TEXTOS.puzzleFail.lights)) return; $('pz-stage').innerHTML = ''; this.build_lights(); return; }
    this.lightsRender();
  },
  key_lights(k) {
    const N = this.st.N, d = { left: -1, right: 1, up: -N, down: N }[k];
    if (d != null) { const n = this.cursor + d; if (n >= 0 && n < N * N && !(d === -1 && this.cursor % N === 0) && !(d === 1 && this.cursor % N === N - 1)) this.cursor = n; this.lightsRender(); }
    else if (k === 'e') this.lightsPress(this.cursor);
  },

  /* ===== 5) PULSO — 7 batimentos ===== */
  build_pulse() {
    this.st = { p: 0, dir: 1, speed: 2.4, z0: 40, w: 20, hits: 0, need: 7 };
    const wrap = document.createElement('div'); wrap.className = 'pulse-wrap';
    wrap.innerHTML = '<div class="pulse-heart" id="pulse-heart">❤</div><div class="pulse-track" id="pulse-track"><div class="pulse-zone" id="pulse-zone"></div><div class="pulse-marker" id="pulse-marker"></div></div><button class="ui-btn pulse-btn" id="pulse-btn">E — fique com ela</button>';
    $('pz-stage').appendChild(wrap);
    $('pulse-track').addEventListener('click', () => this.pulseHit());
    $('pulse-btn').addEventListener('click', () => this.pulseHit());
    this.pulseZone();
    this.every(() => {
      const st = this.st; if (!st) return;
      st.p += st.dir * st.speed;
      if (st.p >= 100) { st.p = 100; st.dir = -1; } if (st.p <= 0) { st.p = 0; st.dir = 1; }
      const mk = $('pulse-marker'); if (mk) mk.style.left = st.p + '%';
      const h = $('pulse-heart'); if (h) h.style.transform = `scale(${1 + 0.12 * Math.sin(Date.now() / 180)})`;
    }, 26);
    this.status(`Batimentos: 0/${this.st.need}`);
  },
  pulseZone() { const st = this.st; st.z0 = 8 + Math.random() * (84 - st.w); const z = $('pulse-zone'); z.style.left = st.z0 + '%'; z.style.width = st.w + '%'; },
  pulseHit() {
    const st = this.st; if (!st) return;
    if (st.p >= st.z0 && st.p <= st.z0 + st.w) {
      st.hits++; AudioMan.blip();
      if (st.hits >= st.need) { this.win(); return; }
      st.speed += 0.5; st.w = Math.max(8, st.w - 2); this.pulseZone();
      this.status(`Batimentos: ${st.hits}/${st.need} — não solte a mão dela.`, 'good');
    } else {
      st.hits = Math.max(0, st.hits - 2);
      if (this.fail(6, TEXTOS.puzzleFail.pulse)) return;
      this.status(`Batimentos: ${st.hits}/${st.need}`);
    }
  },
  key_pulse(k) { if (k === 'e') this.pulseHit(); },

  /* ===== 6) CARTA / CONFISSÃO — 7 frases ===== */
  build_letter() {
    const lines = TEXTOS.puzzleLines.letter;
    const order = [3, 0, 5, 2, 6, 1, 4];
    this.st = { lines, order, picked: [] };
    const wrap = document.createElement('div'); wrap.className = 'letter-wrap';
    order.forEach((li, pos) => {
      const b = document.createElement('button'); b.className = 'letter-line'; b.id = 'll' + pos;
      b.innerHTML = `<span class="ll-num">${pos + 1}</span> ${lines[li]}`;
      b.addEventListener('click', () => this.letterPress(pos)); wrap.appendChild(b);
    });
    $('pz-stage').appendChild(wrap); this.status('Toque na primeira frase da confissão.');
  },
  letterPress(pos) {
    const st = this.st; if (!st || st.picked.includes(pos)) return;
    if (st.order[pos] === st.picked.length) {
      st.picked.push(pos); const b = $('ll' + pos); b.classList.add('picked');
      b.querySelector('.ll-num').textContent = st.picked.length; AudioMan.blip();
      if (st.picked.length === 7) { this.win(); return; }
      this.status(`Frase ${st.picked.length}/7. Continue.`, 'good');
    } else {
      st.picked = [];
      st.order.forEach((li, p) => { const b = $('ll' + p); b.classList.remove('picked'); b.querySelector('.ll-num').textContent = p + 1; });
      this.fail(5, TEXTOS.puzzleFail.letter);
    }
  },
  key_letter(k) { if (['1', '2', '3', '4', '5', '6', '7'].includes(k)) this.letterPress(+k - 1); },

  /* ===== JOGO DO SOL — INTERROGATÓRIO (pares) ===== */
  build_pairs() {
    const symbols = ['🔪', '💉', '🕑', '📼', '🚪', '👁️', '🩸', '✉️'];
    let deck = [...symbols, ...symbols].map((s, i) => ({ s, id: i }));
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    this.st = { deck, flipped: [], matched: new Set(), flips: 0, limit: 30, lock: false };
    const grid = document.createElement('div'); grid.className = 'pairs-grid'; grid.id = 'pairs-grid';
    deck.forEach((c, i) => { const b = document.createElement('button'); b.className = 'pair-card'; b.id = 'pc' + i; b.textContent = '?'; b.addEventListener('click', () => this.pairFlip(i)); grid.appendChild(b); });
    $('pz-stage').appendChild(grid); this.status(`Viradas: 0/${this.st.limit} — encontre os 8 pares.`);
  },
  pairFlip(i) {
    const st = this.st; if (!st || st.lock || st.matched.has(i) || st.flipped.includes(i)) return;
    const b = $('pc' + i); b.textContent = st.deck[i].s; b.classList.add('open');
    st.flipped.push(i); st.flips++; AudioMan.blip();
    this.status(`Viradas: ${st.flips}/${st.limit} — encontre os 8 pares.`);
    if (st.flipped.length === 2) {
      st.lock = true;
      const [a, c] = st.flipped;
      if (st.deck[a].s === st.deck[c].s) {
        st.matched.add(a); st.matched.add(c); st.flipped = []; st.lock = false;
        $('pc' + a).classList.add('done'); $('pc' + c).classList.add('done');
        if (st.matched.size === 16) { this.win(); return; }
      } else {
        this.later(() => {
          if (!this.st) return;
          $('pc' + a).textContent = '?'; $('pc' + a).classList.remove('open');
          $('pc' + c).textContent = '?'; $('pc' + c).classList.remove('open');
          st.flipped = []; st.lock = false;
          if (st.flips >= st.limit) { if (this.fail(8, TEXTOS.puzzleFail.pairs)) return; $('pz-stage').innerHTML = ''; this.build_pairs(); }
        }, 750);
      }
    }
  },
  key_pairs(k) {
    const N = 4, d = { left: -1, right: 1, up: -N, down: N }[k];
    if (d != null) { const n = this.cursor + d; if (n >= 0 && n < 16 && !(d === -1 && this.cursor % N === 0) && !(d === 1 && this.cursor % N === N - 1)) { document.querySelectorAll('.pair-card').forEach(c => c.classList.remove('cursor')); this.cursor = n; $('pc' + n).classList.add('cursor'); } }
    else if (k === 'e') this.pairFlip(this.cursor);
  },

  /* ===== JOGO DA LUA — NÃO PISQUE (reação) ===== */
  build_reaction() {
    this.st = { round: 0, need: 5, phase: 'wait', window: 1.3 };
    const wrap = document.createElement('div'); wrap.className = 'react-wrap';
    wrap.innerHTML = '<div class="react-eye closed" id="react-eye"><div class="react-pupil"></div></div><button class="ui-btn" id="react-btn">E — olhe de volta quando abrir</button>';
    $('pz-stage').appendChild(wrap);
    $('react-btn').addEventListener('click', () => this.reactPress());
    $('react-eye').addEventListener('click', () => this.reactPress());
    this.status('Os olhos estão fechados. Espere…');
    this.later(() => this.reactRound(), 900);
  },
  reactRound() {
    const st = this.st; if (!st) return;
    st.phase = 'wait';
    const eye = $('react-eye'); if (eye) eye.className = 'react-eye closed';
    this.status(`Rodada ${st.round + 1}/${st.need} — espere abrir…`);
    const delay = 900 + Math.random() * 2200;
    this.later(() => {
      if (!this.st) return;
      st.phase = 'open';
      const e = $('react-eye'); if (e) e.className = 'react-eye open';
      AudioMan.blip();
      this.status('AGORA — olhe de volta (E)!');
      this.later(() => {
        if (!this.st || st.phase !== 'open') return;
        st.phase = 'wait';
        if (this.fail(6, TEXTOS.puzzleFail.reactionSlow)) return;
        this.later(() => this.reactRound(), 700);
      }, st.window * 1000);
    }, delay);
  },
  reactPress() {
    const st = this.st; if (!st) return;
    if (st.phase === 'open') {
      st.phase = 'wait'; st.round++; st.window = Math.max(0.55, st.window - 0.15);
      AudioMan.trustUp();
      if (st.round >= st.need) { this.win(); return; }
      this.status(`Você olhou de volta. ${st.round}/${st.need}.`, 'good');
      this.later(() => this.reactRound(), 700);
    } else {
      if (this.fail(6, TEXTOS.puzzleFail.reactionEarly)) return;
      this.status('Cedo demais. Espere abrir…', 'bad');
    }
  },
  key_reaction(k) { if (k === 'e') this.reactPress(); },
};
