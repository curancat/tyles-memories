/* ============ TYLER'S MEMORIES v3 — orquestração ============ */
'use strict';

const $ = id => document.getElementById(id);
const SAVE_KEY = 'tm_save_v3', SET_KEY = 'tm_settings';

let state = 'loader';
let game = null;
let ui = { dialogue: false, memory: false, pause: false, options: false, over: false, puzzle: false, inventory: false, quests: false, tape: false };
let keys = { left: false, right: false, up: false, down: false };
let settings = { music: 70, sfx: 80, gentle: false, crt: true };
let optionsFrom = 'menu';
let pendingAllDone = false;
let hintTimer = null;
let currentDialogue = null;
let currentMemoryTw = null;
let introTw = null, endingTw = null;
let endingStatsShown = false;
let tapeFrag = null;

const INTRO_TEXT =
`Tyler não lembra de ter deitado na grama.

Mas o frio é real. A terra molhada nas mãos é real. E o escuro — o escuro só abre um círculo de luz ao redor dele, como se o mundo inteiro tivesse vergonha de olhar.

Ele se lembra do hospital. Do leito 312. Da mão da mãe ficando fria.

Ele não se lembra do que fez depois. Ou finge não lembrar.

As flores pequenas sussurram uma palavra quando ele passa: assassino.

Dois vultos esperam no campo. O Sol, que acusa. A Lua, que é o remorso.

Oito memórias. Seis trancas escondidas. Duas fitas que eles guardam.

No fim do campo, uma porta. Ela só abre para quem carrega tudo — inclusive a verdade.`;

const ENDING_TEXT =
`A porta não rangeu. Estava esperando por ele.

Do outro lado não havia branco, nem túnel, nem perdão.

Havia uma sala. Uma cadeira. Uma câmera no canto, com a luz vermelha acesa.

Ele se sentou. Olhou para a lente. E disse, em voz alta, pela primeira vez:

“Fui eu. Ela pediu para parar, e eu disse a mim mesmo que era piedade. Mas era cansaço. Eu estava cansado, e usei o cansaço dela como desculpa. Às 14:07 eu empurrei o êmbolo. Fui eu.”

A câmera não respondeu. Não absolveu. Não condenou.

Só gravou.

Lembrar não absolve. Confessar não apaga. Mas é o primeiro passo de quem decidiu parar de fugir.

No corredor, a luz continuou acesa. E Tyler, pela primeira vez em anos, não apagou.

FIM`;

/* ---------- utilidades ---------- */
function anyUi() { return ui.dialogue || ui.memory || ui.pause || ui.options || ui.over || ui.puzzle || ui.inventory || ui.quests || ui.tape; }
function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
function fade(on, white) { const f = $('fade'); f.classList.toggle('white', !!white); f.classList.toggle('on', on); }
function transition(fn, white) { fade(true, white); setTimeout(() => { fn(); setTimeout(() => fade(false, white), 80); }, 650); }

function typewrite(el, text, speed, onDone) {
  let i = 0, done = false, timer = null;
  el.textContent = '';
  const tick = () => {
    if (i >= text.length) { done = true; if (onDone) onDone(); return; }
    const ch = text[i++];
    el.textContent += ch;
    if (ch !== ' ' && ch !== '\n' && i % 3 === 0) AudioMan.blip();
    timer = setTimeout(tick, ch === '\n' ? speed * 6 : speed);
  };
  tick();
  return {
    get done() { return done; },
    finish() { clearTimeout(timer); el.textContent = text; done = true; if (onDone) onDone(); },
    cancel() { clearTimeout(timer); },
  };
}

function showHint(text, dur = 4500) {
  const h = $('hint');
  h.textContent = text;
  h.classList.add('show');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => h.classList.remove('show'), dur);
}

/* ---------- save / settings ---------- */
function loadSettings() {
  try { Object.assign(settings, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch (e) {}
  $('opt-music').value = settings.music; $('opt-music-val').textContent = settings.music;
  $('opt-sfx').value = settings.sfx; $('opt-sfx-val').textContent = settings.sfx;
  $('opt-gentle').checked = settings.gentle;
  $('opt-crt').checked = settings.crt;
  document.body.classList.toggle('no-crt', !settings.crt);
  AudioMan.setMusic(settings.music / 100);
  AudioMan.setSfx(settings.sfx / 100);
  if (game) game.gentle = settings.gentle;
}
function saveSettings() { localStorage.setItem(SET_KEY, JSON.stringify(settings)); }
function getSave() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; } }
function writeSave() { if (game && state === 'game') localStorage.setItem(SAVE_KEY, JSON.stringify(game.serialize())); }
function clearSave() { localStorage.removeItem(SAVE_KEY); updateSaveHint(); }
function updateSaveHint() { $('save-hint').classList.toggle('hidden', !getSave()); }

/* ---------- HUD ---------- */
function buildHud() {
  const box = $('hud-frags');
  box.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const s = document.createElement('div');
    s.className = 'frag-slot'; s.id = 'slot' + i;
    if (i >= 6) s.classList.add('tape-slot');
    box.appendChild(s);
  }
  const c = document.createElement('span');
  c.className = 'frag-count'; c.id = 'frag-count';
  box.appendChild(c);
}
function hpImage(hp) {
  if (hp >= 85) return 'vida_cheia';
  if (hp >= 60) return 'dano_1';
  if (hp >= 35) return 'dano_2';
  if (hp >= 15) return 'dano_3';
  return 'dano_4';
}
function updateHud() {
  if (!game) return;
  game.frags.forEach((f, i) => $('slot' + i).classList.toggle('got', f.taken));
  $('frag-count').textContent = game.fragsGot + '/8 memórias';
  const img = $('hud-hp-img');
  const src = 'assets/img/hud/' + hpImage(game.hp) + '.jpeg';
  if (!img.src.endsWith(src)) img.src = src;
  img.classList.toggle('critical', game.hp <= 25);
  $('trust-sol').style.width = game.trust.sol + '%';
  $('trust-lua').style.width = game.trust.lua + '%';
}

/* ---------- estados ---------- */
function goMenu() {
  writeSave();
  state = 'menu';
  if (ui.puzzle) Puzzles.close();
  ui = { dialogue: false, memory: false, pause: false, options: false, over: false, puzzle: false, inventory: false, quests: false, tape: false };
  ['game-screen', 'intro', 'ending', 'exit', 'dialogue', 'memory', 'pause', 'gameover', 'options', 'puzzle', 'stare-warning', 'touch', 'inventory', 'quests', 'tape'].forEach(id => hide($(id)));
  show($('menu'));
  updateSaveHint();
  AudioMan.stareOff(); AudioMan.heartbeatOff();
  AudioMan.musicLevel(1, 0);
}

function startIntro() {
  transition(() => {
    hide($('menu')); show($('intro'));
    state = 'intro';
    $('intro-hint').style.visibility = 'hidden';
    introTw = typewrite($('intro-text'), INTRO_TEXT, 24, () => { $('intro-hint').style.visibility = 'visible'; });
  });
}

function startGame(resume) {
  transition(() => {
    if (ui.puzzle) Puzzles.close();
    ['menu', 'intro', 'ending', 'exit'].forEach(id => hide($(id)));
    show($('game-screen'));
    state = 'game';
    if (resume) { game.restore(getSave()); showHint('você continua de onde parou. o campo não esqueceu.'); }
    else { game.reset(true); showHint('WASD / setas — andar · Espaço — pular · E — interagir · I — inventário · J — missões', 8000); }
    game.gentle = settings.gentle;
    buildHud(); updateHud();
    AudioMan.musicLevel(1, 0);
    if (isTouch()) show($('touch'));
    writeSave();
  });
}

function startEnding() {
  writeSave();
  AudioMan.doorOpen();
  AudioMan.musicLevel(0.25, 0);
  transition(() => {
    hide($('game-screen')); hide($('touch'));
    show($('ending'));
    state = 'ending';
    endingStatsShown = false;
    hide($('ending-stats'));
    $('ending-text').style.display = '';
    clearSave();
    endingTw = typewrite($('ending-text'), ENDING_TEXT, 32, showEndingStats);
  }, true);
}

function showEndingStats() {
  if (endingStatsShown) return;
  endingStatsShown = true;
  const m = Math.floor(game.playTime / 60), s = Math.floor(game.playTime % 60);
  $('stats-line').textContent = `8/8 memórias carregadas · ${m}min ${String(s).padStart(2, '0')}s · ${game.deaths} queda${game.deaths === 1 ? '' : 's'}`;
  $('ending-text').style.display = 'none';
  show($('ending-stats'));
}

/* ---------- diálogo ---------- */
function openDialogue(kind, lines, actionType) {
  ui.dialogue = true;
  currentDialogue = { kind, lines, page: 0, tw: null, action: actionType };
  const img = kind === 'sol' ? ASSETS.sol[0] : ASSETS.lua[0];
  $('dlg-img').src = img.src;
  const name = $('dlg-name');
  name.textContent = kind === 'sol' ? '☀ SOL' : '☾ LUA';
  name.className = kind;
  show($('dialogue'));
  dialoguePage();
}
function dialoguePage() {
  const d = currentDialogue;
  $('dlg-next').style.visibility = 'hidden';
  d.tw = typewrite($('dlg-text'), d.lines[d.page], 24, () => { $('dlg-next').style.visibility = 'visible'; });
}
function advanceDialogue() {
  const d = currentDialogue;
  if (!d) return;
  if (!d.tw.done) { d.tw.finish(); return; }
  d.page++;
  if (d.page < d.lines.length) dialoguePage();
  else {
    const kind = d.kind, act = d.action;
    ui.dialogue = false; currentDialogue = null;
    hide($('dialogue'));
    if (act === 'accept') game.acceptQuest(kind);
    else if (act === 'complete') game.completeQuest(kind);
    else if (act === 'game') Puzzles.openGame(kind);
    updateHud(); writeSave();
  }
}

/* ---------- memória ---------- */
function openMemory(frag) {
  ui.memory = true;
  $('mem-num').textContent = frag.video ? '📼' : (frag.id + 1);
  $('mem-title').textContent = frag.title;
  show($('memory'));
  currentMemoryTw = typewrite($('mem-text'), frag.text, 20);
  updateHud(); writeSave();
}
function closeMemory() {
  if (currentMemoryTw && !currentMemoryTw.done) { currentMemoryTw.finish(); return; }
  ui.memory = false;
  hide($('memory'));
  if (pendingAllDone) { pendingAllDone = false; showHint('Você carregou tudo. A porta no fim do campo está aberta. Vá até ela.', 7000); }
}

/* ---------- fita (vídeo) ---------- */
function openTape(kind, frag) {
  tapeFrag = frag;
  ui.tape = true;
  $('tape-label').textContent = kind === 'sol' ? '📼 FITA 01 — O CORREDOR' : '📼 FITA 02 — O QUE FICOU';
  const v = $('tape-video');
  v.src = 'assets/video/' + kind + '.mp4';
  v.muted = AudioMan.muted;
  v.volume = Math.min(1, settings.sfx / 100);
  AudioMan.duckForVideo(true);
  show($('tape'));
  $('tape-hint').textContent = 'a fita está rodando… (E para pular)';
  v.play().catch(() => { finishTape(); });
}
function finishTape() {
  const v = $('tape-video');
  v.pause();
  ui.tape = false;
  hide($('tape'));
  AudioMan.duckForVideo(false);
  const f = tapeFrag; tapeFrag = null;
  if (f) openMemory(f);
}
$('tape-video').addEventListener('ended', () => { if (ui.tape) finishTape(); });

/* ---------- inventário ---------- */
function openInventory() {
  ui.inventory = true;
  renderInventory();
  show($('inventory'));
}
function renderInventory() {
  const grid = $('inv-grid');
  grid.innerHTML = '';
  const ids = Object.keys(game.inv).filter(id => game.inv[id] > 0);
  if (!ids.length) { grid.innerHTML = '<p class="inv-empty">Suas mãos estão vazias. O campo está cheio de coisas que você deixou para trás.</p>'; return; }
  ids.forEach(id => {
    const def = ITEMS[id];
    const b = document.createElement('button');
    b.className = 'inv-item' + (def.use ? ' usable' : '');
    b.innerHTML = `<span class="inv-icon">${def.icon}</span><span class="inv-name">${def.name}</span>${game.inv[id] > 1 ? `<span class="inv-count">×${game.inv[id]}</span>` : ''}`;
    b.addEventListener('click', () => {
      $('inv-detail').innerHTML = `<b>${def.icon} ${def.name}</b> — ${def.desc}` + (def.use ? ` <button class="ui-btn small" id="use-item">Usar (+${def.use} vida)</button>` : '');
      if (def.use) $('use-item').addEventListener('click', () => { if (game.useItem(id)) { renderInventory(); updateHud(); } });
    });
    grid.appendChild(b);
  });
}
function closeInventory() { ui.inventory = false; hide($('inventory')); }

/* ---------- missões ---------- */
function openQuests() { ui.quests = true; renderQuests(); show($('quests')); }
function renderQuests() {
  const list = $('quest-list');
  list.innerHTML = '';
  ['sol', 'lua'].forEach(kind => {
    const head = document.createElement('h3');
    head.className = 'quest-npc ' + kind;
    head.textContent = (kind === 'sol' ? '☀ SOL — o acusador' : '☾ LUA — o remorso') + ` · confiança ${game.trust[kind]}%`;
    list.appendChild(head);
    QUESTS[kind].forEach((q, i) => {
      const done = i < game.questIndex[kind];
      const active = i === game.questIndex[kind] && game.questAccepted[kind];
      const div = document.createElement('div');
      div.className = 'quest-item' + (done ? ' done' : active ? ' active' : ' locked');
      let inner = `<b>${done ? '✓' : active ? '▸' : '🔒'} ${q.title}</b>`;
      if (done) inner += '<span class="q-status">concluída</span>';
      else if (active) {
        inner += `<p>${q.desc}</p>`;
        const prog = game.questProgress(kind);
        if (prog) inner += '<ul class="q-prog">' + prog.parts.map(p => `<li class="${p.done ? 'ok' : ''}">${p.done ? '✓' : '○'} ${p.txt}</li>`).join('') + '</ul>';
      } else inner += '<span class="q-status">fale com ' + (kind === 'sol' ? 'o Sol' : 'a Lua') + ' para revelar</span>';
      div.innerHTML = inner;
      list.appendChild(div);
    });
    if (game.questIndex[kind] >= 3) {
      const g = document.createElement('div');
      g.className = 'quest-item ' + (game.gameDone[kind] ? 'done' : 'active');
      g.innerHTML = `<b>${game.gameDone[kind] ? '✓' : '▸'} ${kind === 'sol' ? 'JOGO: Interrogatório' : 'JOGO: Não Pisque'}</b><span class="q-status">${game.gameDone[kind] ? 'fita assistida' : 'fale com ' + (kind === 'sol' ? 'o Sol' : 'a Lua') + ' para jogar e ganhar a fita'}</span>`;
      list.appendChild(g);
    }
  });
}
function closeQuests() { ui.quests = false; hide($('quests')); }

/* ---------- ação (E) roteada ---------- */
function action() {
  AudioMan.resume();
  if (state === 'intro') { if (introTw && !introTw.done) introTw.finish(); else startGame(false); return; }
  if (state === 'ending') { if (endingTw && !endingTw.done) endingTw.finish(); else showEndingStats(); return; }
  if (state !== 'game') return;
  if (ui.tape) { finishTape(); return; }
  if (ui.puzzle) { Puzzles.key('e'); return; }
  if (ui.dialogue) { advanceDialogue(); return; }
  if (ui.memory) { closeMemory(); return; }
  if (ui.inventory || ui.quests) return;
  if (anyUi()) return;
  game.interact();
}

/* ---------- hooks do jogo ---------- */
const hooks = {
  onFragment: f => openMemory(f),
  onPuzzle: f => Puzzles.open(f),
  onDialogue: (kind, lines, act) => openDialogue(kind, lines, act),
  onHint: txt => showHint(txt),
  onAllDone: () => { pendingAllDone = true; },
  onStare: on => { $('stare-warning').classList.toggle('hidden', !on); },
  onInv: () => { if (ui.inventory) renderInventory(); updateHud(); },
  onQuest: () => { if (ui.quests) renderQuests(); },
  onTrust: () => updateHud(),
  onVideo: (kind, frag) => openTape(kind, frag),
  onGameOver: () => {
    if (ui.puzzle) Puzzles.close();
    ui.over = true;
    hide($('stare-warning'));
    show($('gameover'));
    writeSave();
  },
  onExit: () => startEnding(),
};

/* ---------- input ---------- */
const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };
document.addEventListener('keydown', e => {
  firstGesture();
  if (state === 'game' && ui.puzzle) {
    if (e.key === 'Escape') { e.preventDefault(); Puzzles.abort(); return; }
    if (e.key === 'm' || e.key === 'M') { AudioMan.toggleMute(); return; }
    e.preventDefault();
    if (!e.repeat || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd'].includes(e.key)) Puzzles.key(e.key);
    return;
  }
  const k = KEYMAP[e.key];
  if (k) { keys[k] = true; e.preventDefault(); return; }
  if (e.key === ' ') { e.preventDefault(); if (state === 'game' && !anyUi() && !e.repeat) game.jump(); return; }
  if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) action(); return; }
  if (e.key === 'i' || e.key === 'I') {
    if (state === 'game' && !ui.over && !ui.dialogue && !ui.memory && !ui.puzzle && !ui.tape) { ui.inventory ? closeInventory() : (ui.quests && closeQuests(), openInventory()); }
    return;
  }
  if (e.key === 'j' || e.key === 'J') {
    if (state === 'game' && !ui.over && !ui.dialogue && !ui.memory && !ui.puzzle && !ui.tape) { ui.quests ? closeQuests() : (ui.inventory && closeInventory(), openQuests()); }
    return;
  }
  if (e.key === 'Escape') {
    if (ui.options) { closeOptions(); return; }
    if (ui.inventory) { closeInventory(); return; }
    if (ui.quests) { closeQuests(); return; }
    if (ui.tape) { finishTape(); return; }
    if (state === 'game' && !ui.dialogue && !ui.memory && !ui.over) {
      ui.pause = !ui.pause;
      $('pause').classList.toggle('hidden', !ui.pause);
      if (ui.pause) writeSave();
    }
    return;
  }
  if (e.key === 'm' || e.key === 'M') { const m = AudioMan.toggleMute(); if (state === 'game') showHint(m ? 'som desligado' : 'som ligado', 1800); }
});
document.addEventListener('keyup', e => { const k = KEYMAP[e.key]; if (k) keys[k] = false; });

function isTouch() { return matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window; }
document.querySelectorAll('.t-btn').forEach(btn => {
  const k = btn.dataset.key;
  const down = e => {
    e.preventDefault(); firstGesture();
    if (k === 'action') action();
    else if (k === 'jump') { if (state === 'game' && !anyUi()) game.jump(); }
    else if (state === 'game' && ui.puzzle) Puzzles.key(k);
    else keys[k] = true;
  };
  const up = e => { e.preventDefault(); if (k !== 'action' && k !== 'jump') keys[k] = false; };
  btn.addEventListener('pointerdown', down);
  btn.addEventListener('pointerup', up);
  btn.addEventListener('pointercancel', up);
  btn.addEventListener('pointerleave', up);
});

['intro', 'dialogue', 'memory', 'ending'].forEach(id => { $(id).addEventListener('click', () => { if (state !== 'menu') action(); }); });
$('tape').addEventListener('click', e => { if (e.target.id !== 'tape-video' && ui.tape) finishTape(); });

let gestured = false;
function firstGesture() {
  if (gestured) return;
  gestured = true;
  AudioMan.init();
  AudioMan.setMusic(settings.music / 100);
  AudioMan.setSfx(settings.sfx / 100);
}
document.addEventListener('pointerdown', firstGesture);

/* ---------- opções ---------- */
function openOptions(from) { optionsFrom = from; ui.options = true; if (from === 'pause') hide($('pause')); show($('options')); }
function closeOptions() { ui.options = false; hide($('options')); saveSettings(); if (optionsFrom === 'pause') show($('pause')); }
$('opt-music').addEventListener('input', e => { settings.music = +e.target.value; $('opt-music-val').textContent = settings.music; AudioMan.setMusic(settings.music / 100); });
$('opt-sfx').addEventListener('input', e => { settings.sfx = +e.target.value; $('opt-sfx-val').textContent = settings.sfx; AudioMan.setSfx(settings.sfx / 100); AudioMan.click(); });
$('opt-gentle').addEventListener('change', e => { settings.gentle = e.target.checked; if (game) game.gentle = settings.gentle; });
$('opt-crt').addEventListener('change', e => { settings.crt = e.target.checked; document.body.classList.toggle('no-crt', !settings.crt); });
$('btn-wipe').addEventListener('click', () => { clearSave(); const b = $('btn-wipe'); const old = b.textContent; b.textContent = 'progresso apagado ✓'; setTimeout(() => { b.textContent = old; }, 1600); });
$('btn-opt-back').addEventListener('click', () => { AudioMan.click(); closeOptions(); });

/* ---------- botões ---------- */
function wire(id, fn) { $(id).addEventListener('click', e => { e.stopPropagation(); firstGesture(); AudioMan.click(); fn(); }); }
wire('btn-jogar', () => { getSave() ? startGame(true) : startIntro(); });
wire('btn-opcoes', () => openOptions('menu'));
wire('btn-sair', () => { transition(() => { hide($('menu')); show($('exit')); state = 'exit'; }); });
wire('btn-back-menu', () => { transition(() => { hide($('exit')); show($('menu')); state = 'menu'; }); });
wire('btn-continue', () => { ui.pause = false; hide($('pause')); });
wire('btn-pause-options', () => openOptions('pause'));
wire('btn-newgame', () => { ui.pause = false; hide($('pause')); clearSave(); startGame(false); });
wire('btn-tomenu', () => { ui.pause = false; hide($('pause')); transition(goMenu); });
wire('btn-retry', () => { ui.over = false; hide($('gameover')); game.respawn(); updateHud(); writeSave(); showHint('o que você já carregou continua com você. levante.', 4000); });
wire('btn-over-menu', () => { ui.over = false; hide($('gameover')); game.respawn(); transition(goMenu); });
wire('btn-again', () => { clearSave(); startGame(false); });
wire('btn-end-menu', () => transition(goMenu));
wire('btn-inv', () => { if (state === 'game' && !anyUi()) openInventory(); });
wire('btn-quests', () => { if (state === 'game' && !anyUi()) openQuests(); });
document.querySelectorAll('.menu-btn').forEach(b => b.addEventListener('mouseenter', () => AudioMan.hover()));

window.addEventListener('beforeunload', writeSave);
document.addEventListener('visibilitychange', () => { if (document.hidden) writeSave(); });

/* ---------- loop ---------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state === 'game' && game) {
    if (!anyUi()) game.update(dt, keys);
    game.render();
    updateHud();
  }
  requestAnimationFrame(loop);
}

/* ---------- boot ---------- */
loadSettings();
loadAssets(p => {
  $('loader-fill').style.width = Math.round(p * 100) + '%';
  $('loader-pct').textContent = Math.round(p * 100) + '%';
}).then(() => {
  game = new Game($('game'), hooks);
  game.gentle = settings.gentle;
  buildHud();
  setTimeout(() => {
    transition(() => { hide($('loader')); show($('menu')); state = 'menu'; updateSaveHint(); });
  }, 400);
  requestAnimationFrame(loop);
}).catch(err => {
  $('loader-pct').textContent = 'erro ao carregar o campo 😢';
  document.querySelector('.loader-text').textContent = 'erro: ' + err.message;
});
