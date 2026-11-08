/* ============ TYLER'S MEMORIES v3 — o campo do julgamento ============ */
'use strict';

const WORLD_W = 4000, WORLD_H = 600;
const VIEW_W = 960, VIEW_H = 540;
const S = VIEW_H / WORLD_H;
const VIS_W = VIEW_W / S;
const GROUND_TOP = 372, GROUND_BOT = 414;
const SKY_H = 316;
const PLAYER_SCALE = 118 / 805;
const NPC_SCALE = 0.213;
const SEG_ORDER = [0, 1, 2, 2, 3];       // 5 peças de 800 → mundo 4000
const DOOR_X = 3894, DOOR_HALF = 62;
const EYE_SEQ = [0, 1, 2, 3, 2, 1, 0, 4, 5, 6, 5, 4];

/* ---------- catálogo de itens ---------- */
const ITEMS = {
  pa:       { name: 'Pá enferrujada', icon: '⛏️', desc: 'Serve para cavar o que foi enterrado atrás da árvore.' },
  chave:    { name: 'Chave do 312', icon: '🗝️', desc: 'Abre a caixa trancada no começo do campo.' },
  relogio:  { name: 'Relógio parado', icon: '🕑', desc: 'Os ponteiros congelaram em 14:07.' },
  cracha:   { name: 'Crachá de visita', icon: '🪪', desc: 'Hospital São Lucas · visitante: Tyler.' },
  foto1:    { name: 'Foto rasgada (1/3)', icon: '🖼️', desc: 'Um terço de uma foto. O Sol quer ver.' },
  foto2:    { name: 'Foto rasgada (2/3)', icon: '🖼️', desc: 'Um terço de uma foto. O Sol quer ver.' },
  foto3:    { name: 'Foto rasgada (3/3)', icon: '🖼️', desc: 'Um terço de uma foto. O Sol quer ver.' },
  osso:     { name: 'Osso de Bidu', icon: '🦴', desc: 'O que restou do seu melhor amigo.' },
  coleira:  { name: 'Coleira vermelha', icon: '📿', desc: 'A coleira que Bidu usava.' },
  lampiao:  { name: 'Lampião', icon: '🏮', desc: 'Aumenta sua luz. Acende as lâmpadas do campo.' },
  carta1:   { name: 'Carta rasgada (1/3)', icon: '✉️', desc: 'Um terço de uma carta nunca enviada.' },
  carta2:   { name: 'Carta rasgada (2/3)', icon: '✉️', desc: 'Um terço de uma carta nunca enviada.' },
  carta3:   { name: 'Carta rasgada (3/3)', icon: '✉️', desc: 'Um terço de uma carta nunca enviada.' },
  comprimido:{ name: 'Comprimido', icon: '💊', desc: 'Restaura 25 de vida.', use: 25 },
  bandagem: { name: 'Bandagem', icon: '🩹', desc: 'Restaura 15 de vida.', use: 15 },
};

/* ---------- memórias (8) ---------- */
const FRAGMENTS = [
  { id: 0, x: 1235, y: 352, title: 'A caixa de remédios', puzzle: 'simon', gate: 'pa',
    hint: 'Algo foi enterrado atrás da árvore. Você precisa de uma pá.',
    text: 'Aos onze anos eu aprendi a ler bulas antes de aprender a andar de bicicleta. Mamãe chamava as crises de “dias cinzentos”. Eu organizava as cápsulas por cor, porque era o único jeito que eu tinha de consertar alguma coisa. Ela dizia que eu era o enfermeiro dela. Eu não sabia que estava aprendendo a dosar a morte.' },
  { id: 1, x: 520, y: 362, title: 'O telefone mudo', puzzle: 'code', gate: 'chave',
    hint: 'Uma caixa trancada. Precisa da chave do quarto 312.',
    text: 'Quando ela piorou, o telefone virou um bicho. Todos ligavam para ajudar. Eu deixava tocar. Atender significava dizer “ela está morrendo” em voz alta. Um dia o telefone parou. O silêncio tinha o formato exato dela. E eu comecei a achar que o mundo inteiro me julgava por não atender.' },
  { id: 2, x: 1150, y: 384, title: 'Bidu esperou', puzzle: 'maze', gate: 'bidu',
    hint: 'A cova de Bidu. Traga o osso e a coleira para a Lua primeiro.',
    text: 'Bidu envelheceu esperando na porta do meu quarto. Nos meses em que eu não levantava, era ele que me trazia o mundo. Quando o levaram ao veterinário pela última vez, eu não fui. Eu não consegui. Disseram que ele procurou por mim na sala, até o fim. A primeira vida que eu deixei morrer esperando por mim.' },
  { id: 3, x: 2055, y: 352, title: 'As cortinas', puzzle: 'lights', gate: 'lampiao',
    hint: 'Um breu total. Só o lampião revela o que há aqui.',
    text: 'Depois do enterro, fiquei onze meses sem abrir as cortinas. A depressão não era tristeza — era um quarto sem ar. Ela teria odiado aquilo. Um dia abri um palmo. A luz doeu como água fervida. Mas doeu para dentro, e alguma coisa descongelou um dedo. Eu só não sabia que a luz também mostra o que a gente fez.' },
  { id: 4, x: 2755, y: 356, title: 'Leito 312', puzzle: 'pulse', gate: 'foto',
    hint: 'A lembrança do hospital. O Sol precisa da foto completa para abrir.',
    text: 'Quarto 312. Ela já não abria os olhos, mas apertou minha mão. “Faz parar, meu filho”, ela disse. Ou eu quis ouvir isso. O monitor foi ficando lento. Eu segurei a mão dela até o bip virar uma linha só. Não teve despedida de cinema. Teve uma mão ficando fria na minha — e a minha outra mão, que já tinha decidido.' },
  { id: 5, x: 3450, y: 360, title: 'A dose extra', puzzle: 'letter', gate: 'carta',
    hint: 'A verdade final. A Lua precisa da carta completa para revelar.',
    text: 'Eu puxei uma dose que não era dela. O enfermeiro tinha virado as costas. “Faz parar”, ela disse — e eu repeti isso como um mantra enquanto empurrava o êmbolo. Não foi piedade. Foi cansaço. Foi o meu cansaço vestindo a roupa dela. Às 14:07 o monitor calou. Eu saí do quarto andando devagar, como quem não fez nada. A câmera do corredor me viu.' },
  { id: 6, x: 0, y: 0, title: 'FITA 01 — O corredor', video: 'sun',
    text: 'A câmera de segurança do corredor. 14:06: você entra no 312. 14:07: você sai. Entre um minuto e outro, o coração dela parou. A fita não mente. Você estava lá. Suas mãos estavam lá. O Sol assistiu a fita inteira — e agora você também.' },
  { id: 7, x: 0, y: 0, title: 'FITA 02 — O que ficou', video: 'moon',
    text: 'A segunda fita. Você, de pé, no quarto escuro, depois. No chão, o que você derramou e nunca limpou. A Lua não te acusa. Ela só te mostra. O remorso não grita — ele fica de pé no escuro, olhando o chão, para sempre. Você carregou essa imagem por trás dos olhos cada dia desde então.' },
];

/* ---------- missões (3 por NPC) ---------- */
const QUESTS = {
  sol: [
    { id: 's1', title: 'Cale os sussurros',
      desc: 'As flores repetem o que você fez. Derrote 4 delas e traga o crachá de visita do hospital.',
      need: { kills: 4, items: ['cracha'] }, reward: { trust: 34, items: ['chave'], heal: 0 } },
    { id: 's2', title: 'A hora exata',
      desc: 'Encontre o relógio parado no campo e traga para mim. Quero que você veja a hora.',
      need: { items: ['relogio'] }, reward: { trust: 33, heal: 20 } },
    { id: 's3', title: 'A testemunha',
      desc: 'Junte os 3 pedaços da foto rasgada. Eu quero ver o rosto de quem estava lá.',
      need: { items: ['foto1', 'foto2', 'foto3'] }, reward: { trust: 33, reveal: 4 } },
  ],
  lua: [
    { id: 'l1', title: 'O que restou de Bidu',
      desc: 'Traga o osso e a coleira vermelha de Bidu. Ele mereceu um enterro. Você não foi ao primeiro.',
      need: { items: ['osso', 'coleira'] }, reward: { trust: 34, items: ['lampiao'], reveal: 2 } },
    { id: 'l2', title: 'Luz no escuro',
      desc: 'Com o lampião, acenda as 4 lâmpadas apagadas do campo. Onde há luz, há memória.',
      need: { lamps: 4 }, reward: { trust: 33, items: ['comprimido'] } },
    { id: 'l3', title: 'A carta não enviada',
      desc: 'Junte os 3 pedaços da carta que você escreveu e nunca mandou. Leia para mim.',
      need: { items: ['carta1', 'carta2', 'carta3'] }, reward: { trust: 33, reveal: 5 } },
  ],
};

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
    this.glitchT = 0; this.ambientGlitch = 14;
    this.stare = { active: false, t: 0, next: 26 + Math.random() * 12 };
    this.eyeIdx = 0; this.eyeT = 0;
    this.doorOpen = false; this.doorHintShown = false;
    this.floats = [];
    this.npcs = [
      { kind: 'sol', x: 980, y: 392, animT: 0, frame: 0 },
      { kind: 'lua', x: 2950, y: 392, animT: 0, frame: 0 },
    ];
    if (full) {
      this.frags = FRAGMENTS.map(f => ({ ...f, taken: false, revealed: !f.gate }));
      this.inv = {};
      this.trust = { sol: 0, lua: 0 };
      this.questIndex = { sol: 0, lua: 0 };
      this.questAccepted = { sol: false, lua: false };
      this.gameDone = { sol: false, lua: false };
      this.kills = 0; this.playTime = 0; this.deaths = 0;
      this.met = { sol: false, lua: false };
      this.lamps = [620, 1720, 2520, 3420].map(x => ({ x, y: 388, lit: false }));
      this.items = [
        { item: 'pa', x: 3320, y: 392 }, { item: 'relogio', x: 1760, y: 396 },
        { item: 'cracha', x: 3720, y: 396 },
        { item: 'foto1', x: 450, y: 388 }, { item: 'foto2', x: 2230, y: 396 }, { item: 'foto3', x: 3560, y: 388 },
        { item: 'osso', x: 1180, y: 400 }, { item: 'coleira', x: 2620, y: 392 },
        { item: 'carta1', x: 720, y: 392 }, { item: 'carta2', x: 1930, y: 396 }, { item: 'carta3', x: 3120, y: 392 },
        { item: 'comprimido', x: 1520, y: 396 }, { item: 'bandagem', x: 920, y: 396 }, { item: 'bandagem', x: 2840, y: 392 },
      ].map((it, i) => ({ ...it, id: i, taken: false }));
      this.heals = [300, 800, 1350, 1650, 2000, 2300, 2650, 2900, 3200, 3500, 3750, 3850].map((x, i) => ({ x, y: 380 + (i % 3) * 12, taken: false }));
      this.enemies = [];
      const spots = [420, 760, 1300, 1600, 1900, 2150, 2400, 2700, 3000, 3300, 3600, 3800];
      spots.forEach((x, i) => this.enemies.push(this.makeEnemy(x, i % 2 ? 'lua' : 'sol')));
      this.allDoneShown = false;
    }
  }

  makeEnemy(x, type) {
    return { x, y: 392, homeX: x, type, state: 'wander', t: Math.random() * 3, dir: Math.random() < .5 ? -1 : 1, dead: false, respawnT: 0, whisperT: 0, lungeT: 0 };
  }

  /* ---------- inventário / progresso ---------- */
  has(id) { return (this.inv[id] || 0) > 0; }
  addItem(id, n = 1) { this.inv[id] = (this.inv[id] || 0) + n; }
  consume(id, n = 1) { if (this.inv[id]) { this.inv[id] -= n; if (this.inv[id] <= 0) delete this.inv[id]; } }
  hasFoto() { return this.has('foto1') && this.has('foto2') && this.has('foto3'); }
  hasCarta() { return this.has('carta1') && this.has('carta2') && this.has('carta3'); }
  get fragsGot() { return this.frags.filter(f => f.taken).length; }
  get lampsLit() { return this.lamps.filter(l => l.lit).length; }

  gateMet(f) {
    if (!f.gate) return true;
    if (f.gate === 'foto') return this.questIndex.sol >= 3;
    if (f.gate === 'carta') return this.questIndex.lua >= 3;
    if (f.gate === 'bidu') return this.questIndex.lua >= 1;
    return this.has(f.gate);
  }

  useItem(id) {
    const def = ITEMS[id];
    if (!def || !def.use || !this.has(id)) return false;
    if (this.hp >= 100) { this.hooks.onHint('Sua vida já está cheia.'); return false; }
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
    if (q.need.kills) parts.push({ txt: `Flores derrotadas: ${Math.min(this.kills, q.need.kills)}/${q.need.kills}`, done: this.kills >= q.need.kills });
    if (q.need.items) q.need.items.forEach(it => parts.push({ txt: `${ITEMS[it].name}: ${this.has(it) ? '✓' : '✗'}`, done: this.has(it) }));
    if (q.need.lamps) parts.push({ txt: `Lâmpadas acesas: ${this.lampsLit}/${q.need.lamps}`, done: this.lampsLit >= q.need.lamps });
    return { q, parts, complete: parts.every(p => p.done) };
  }

  npcDialogue(kind) {
    const qi = this.questIndex[kind];
    const name = kind === 'sol' ? 'SOL' : 'LUA';
    if (qi >= 3) {
      if (!this.gameDone[kind]) {
        return { action: 'game', lines: kind === 'sol'
          ? ['Você fez tudo que eu pedi. Provou que encara a verdade.', 'Agora um último jogo, Tyler. Chama-se INTERROGATÓRIO. Encontre os pares do que você fez.', 'Se vencer, eu te mostro a fita. A fita que a câmera gravou. Você vai querer ver? Não. Mas precisa.']
          : ['Você cuidou do que restou. Acendeu luzes. Leu a carta.', 'Agora brincamos de NÃO PISQUE. Os olhos vão abrir — e você olha de volta.', 'Se aguentar, eu te mostro a segunda fita. A do quarto escuro. A que você carrega por trás dos olhos.'] };
      }
      return { action: 'final', lines: kind === 'sol'
        ? ['A fita não mente, Tyler. Você estava lá. Suas mãos estavam lá.', 'Não há absolvição aqui. Só a verdade. Carregue-a até a porta.']
        : ['O remorso não grita. Ele fica de pé no escuro, olhando o chão.', 'Você não vai se livrar dele. Mas pode parar de fugir. Vá até a porta.'] };
    }
    const q = QUESTS[kind][qi];
    if (!this.questAccepted[kind]) {
      const intro = kind === 'sol'
        ? (this.met.sol ? ['Vamos ao que interessa, Tyler.'] : ['Você chegou, Tyler. Sentiu o frio? Aqui tudo é verdade.', 'Este campo fica no fim de tudo. E todo mundo aqui sabe o que você fez.', 'Eu sou o Sol. Eu acuso. Eu mostro. As flores sussurram “assassino” porque é o que você é.'])
        : (this.met.lua ? ['De volta, Tyler. O remorso não vai embora.'] : ['Shhh. Eu sou a Lua. Eu sou o que você sente quando ninguém está olhando.', 'Eu não te acuso, Tyler. Eu só te lembro. É pior.', 'A árvore ali atrás era um homem que não quis lembrar. Virou raiz. Você não vai ter essa sorte.']);
      return { action: 'accept', lines: [...intro, `MISSÃO: ${q.title}.`, q.desc] };
    }
    const prog = this.questProgress(kind);
    if (prog.complete) {
      const lines = kind === 'sol'
        ? ['Você trouxe. Bom. A verdade não espera.', 'Cada passo seu nesse campo é um passo na direção do que você fez.']
        : ['Você trouxe. Obrigada, Tyler. Bidu merecia.', 'Cada luz que você acende é um pedaço que você para de esconder.'];
      return { action: 'complete', lines };
    }
    const remind = kind === 'sol'
      ? ['Ainda não acabou. ' + q.desc, 'Ande. O campo inteiro está olhando.']
      : ['Ainda falta, querido. ' + q.desc, 'Não desista. Desistir é o que você fez da primeira vez.'];
    return { action: 'hint', lines: remind };
  }

  acceptQuest(kind) { this.questAccepted[kind] = true; this.met[kind] = true; this.hooks.onQuest(); }

  completeQuest(kind) {
    const q = QUESTS[kind][this.questIndex[kind]];
    if (!q) return;
    if (q.need.items) q.need.items.forEach(it => this.consume(it));
    if (q.need.kills) this.kills = 0;
    const r = q.reward;
    this.trust[kind] = Math.min(100, this.trust[kind] + r.trust);
    if (r.items) r.items.forEach(it => { this.addItem(it); this.float(this.player.x, this.player.y - 100, '+ ' + ITEMS[it].name, '#ffd97a'); });
    if (r.heal) this.hp = Math.min(100, this.hp + r.heal);
    if (r.reveal != null) { const f = this.frags.find(f => f.id === r.reveal); if (f) f.revealed = true; }
    this.questIndex[kind]++;
    this.questAccepted[kind] = false;
    AudioMan.quest(); AudioMan.trustUp();
    this.hooks.onQuest(); this.hooks.onInv(); this.hooks.onTrust();
    this.hooks.onHint(`Missão concluída: ${q.title}. Confiança de ${kind === 'sol' ? 'Sol' : 'Lua'} aumentou.`);
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
    return this.frags.find(f => !f.taken && !f.video && f.revealed && Math.abs(f.x - this.player.x) < 48 && Math.abs((f.y + 26) - this.player.y) < 52) || null;
  }
  get nearItem() { return this.items.find(it => !it.taken && Math.abs(it.x - this.player.x) < 40 && Math.abs(it.y - this.player.y) < 40) || null; }
  get nearLamp() { return this.lamps.find(l => !l.lit && Math.abs(l.x - this.player.x) < 44 && Math.abs(l.y - this.player.y) < 40) || null; }
  get nearDoor() { return Math.abs(this.player.x - DOOR_X) < DOOR_HALF + 14; }

  interact() {
    if (this.dead) return;
    const npc = this.nearNpc;
    if (npc) { const d = this.npcDialogue(npc.kind); this.hooks.onDialogue(npc.kind, d.lines, d.action); return; }
    const frag = this.nearFrag;
    if (frag) {
      if (!this.gateMet(frag)) { this.hooks.onHint(frag.hint); return; }
      this.hooks.onPuzzle(frag); return;
    }
    const it = this.nearItem;
    if (it) { it.taken = true; this.addItem(it.item); AudioMan.item(); this.float(it.x, it.y - 40, '+ ' + ITEMS[it.item].name, '#ffd97a'); this.hooks.onInv(); this.hooks.onQuest(); return; }
    const lamp = this.nearLamp;
    if (lamp) {
      if (!this.has('lampiao')) { this.hooks.onHint('Está apagada. Você precisa de um lampião.'); return; }
      lamp.lit = true; AudioMan.lamp(); this.float(lamp.x, lamp.y - 60, 'luz acesa', '#ffd97a'); this.hooks.onQuest(); return;
    }
    // memória escondida não revelada → dica
    const hidden = this.frags.find(f => !f.taken && !f.video && !f.revealed && Math.abs(f.x - this.player.x) < 60);
    if (hidden) { this.hooks.onHint(hidden.hint); return; }
    if (this.nearDoor) {
      if (this.doorOpen) this.hooks.onExit();
      else { AudioMan.doorLocked(); this.hooks.onHint(`A porta exige as 8 memórias. Você carregou ${this.fragsGot}/8.`); }
    }
  }

  collect(id) {
    const f = this.frags.find(f => f.id === id);
    if (!f || f.taken) return;
    f.taken = true;
    AudioMan.pickup();
    this.hooks.onFragment(f);
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
  damage(n, srcX) {
    if (this.dead || this.player.iframes > 0) return;
    this.hp = Math.max(0, this.hp - n);
    this.player.iframes = 1.1;
    this.glitchT = Math.max(this.glitchT, 0.35);
    AudioMan.hurt();
    this.float(this.player.x, this.player.y - 96, '-' + n, '#ff5a5a');
    if (srcX != null) this.player.x += (this.player.x < srcX ? -1 : 1) * 26;
    if (this.hp <= 0) this.die();
  }
  penalty(n) { // custo de puzzle (sem iframes)
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
    p.iframes = Math.max(0, p.iframes - dt);
    this.glitchT = Math.max(0, this.glitchT - dt);
    this.ambientGlitch -= dt;
    if (this.ambientGlitch <= 0) { this.glitchT = Math.max(this.glitchT, 0.12); AudioMan.glitch(); this.ambientGlitch = 16 + Math.random() * 14; }

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
    // pulo
    if (p.z > 0 || p.vz > 0) {
      p.z += p.vz * dt; p.vz -= 720 * dt;
      if (p.z <= 0) { p.z = 0; p.vz = 0; }
    }

    const target = Math.max(0, Math.min(WORLD_W - VIS_W, p.x - VIS_W / 2));
    this.camX += (target - this.camX) * Math.min(1, dt * 5);

    this.eyeT += dt;
    if (this.eyeT >= 0.8) { this.eyeT = 0; this.eyeIdx = (this.eyeIdx + 1) % EYE_SEQ.length; }
    for (const n of this.npcs) { n.animT += dt; if (n.animT >= 0.18) { n.animT = 0; n.frame++; } }

    this.updateEnemies(dt);
    this.updatePickups();

    // O Olhar — drena vida se parado
    const st = this.stare;
    if (!st.active) {
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

    // vida baixa → batimento
    if (this.hp <= 25 && this.hp > 0) AudioMan.heartbeatOn(); else AudioMan.heartbeatOff();

    for (const fl of this.floats) fl.t += dt;
    this.floats = this.floats.filter(fl => fl.t < 1.6);

    if (this.nearDoor && !this.doorHintShown) {
      this.doorHintShown = true;
      this.hooks.onHint(this.doorOpen ? 'A porta está aberta. Pressione E para atravessar.' : 'A porta exige que você carregue as 8 memórias.');
    }
  }

  updateEnemies(dt) {
    const p = this.player;
    for (const e of this.enemies) {
      if (e.dead) { e.respawnT -= dt; if (e.respawnT <= 0) { e.dead = false; e.x = e.homeX; e.state = 'wander'; } continue; }
      e.t += dt; e.whisperT -= dt;
      const dx = p.x - e.x, dy = p.y - e.y, dist = Math.hypot(dx, dy);
      if (e.state === 'wander') {
        e.x += e.dir * 26 * dt;
        if (Math.abs(e.x - e.homeX) > 80) e.dir *= -1;
        if (dist < 140 && !this.dead) { e.state = 'chase'; if (e.whisperT <= 0) { this.float(e.x, e.y - 50, 'assassino…', '#c99'); e.whisperT = 6; } }
      } else if (e.state === 'chase') {
        if (dist > 220) { e.state = 'wander'; continue; }
        const sp = 62; e.x += Math.sign(dx) * sp * dt; e.y += Math.sign(dy) * sp * 0.5 * dt;
        e.y = Math.max(GROUND_TOP, Math.min(GROUND_BOT, e.y));
        if (dist < 46) { e.state = 'lunge'; e.lungeT = 0.38; e.dir = Math.sign(dx) || 1; }
      } else if (e.state === 'lunge') {
        e.lungeT -= dt; e.x += e.dir * 165 * dt;
        if (e.lungeT <= 0) e.state = 'chase';
      }
      // dano por contato (se não estiver pulando alto)
      if (dist < 30 && p.z < 16) this.damage(10, e.x);
      // pisotão (pulo caindo em cima)
      if (p.z > 4 && p.vz < 0 && Math.abs(dx) < 26 && Math.abs(dy) < 22 && p.z < 26) {
        e.dead = true; e.respawnT = 45; this.kills++;
        p.vz = 190; AudioMan.stomp();
        this.float(e.x, e.y - 40, 'silenciada', '#ffd97a');
        if (Math.random() < 0.4) this.heals.push({ x: e.x, y: e.y, taken: false });
        this.hooks.onQuest();
      }
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
      revealed: this.frags.filter(f => f.revealed).map(f => f.id),
      inv: this.inv, trust: this.trust, questIndex: this.questIndex,
      questAccepted: this.questAccepted, gameDone: this.gameDone,
      kills: this.kills, lamps: this.lamps.map(l => l.lit),
      items: this.items.filter(i => i.taken).map(i => i.id),
      heals: this.heals.map(h => h.taken),
      playTime: this.playTime, deaths: this.deaths, met: this.met,
    };
  }
  restore(d) {
    this.reset(true);
    if (!d || d.v !== 3) return;
    (d.frags || []).forEach(id => { const f = this.frags.find(f => f.id === id); if (f) f.taken = true; });
    (d.revealed || []).forEach(id => { const f = this.frags.find(f => f.id === id); if (f) f.revealed = true; });
    this.hp = d.hp != null ? d.hp : 100;
    this.player.x = d.x || 140; this.player.y = d.y || 396;
    this.inv = d.inv || {}; this.trust = d.trust || { sol: 0, lua: 0 };
    this.questIndex = d.questIndex || { sol: 0, lua: 0 };
    this.questAccepted = d.questAccepted || { sol: false, lua: false };
    this.gameDone = d.gameDone || { sol: false, lua: false };
    this.kills = d.kills || 0; this.playTime = d.playTime || 0; this.deaths = d.deaths || 0; this.met = d.met || {};
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
    // olhos do céu
    const stareOn = this.stare.active;
    const eyeFrame = stareOn ? ASSETS.ceu[3] : ASSETS.ceu[EYE_SEQ[this.eyeIdx]];
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = stareOn ? (this.gentle ? 0.6 : 0.9) : (this.gentle ? 0.3 : 0.45);
    const off = this.camX * 0.55, start = Math.floor(off / 800) - 1;
    for (let k = start; k <= start + 3; k++) {
      const x = k * 800 - off + this.camX;
      ctx.drawImage(eyeFrame, 0, 0, 800, SKY_H, x, 0, 800, SKY_H);
    }
    ctx.restore();

    // porta
    if (this.doorOpen) {
      const pulse = 0.75 + 0.25 * Math.sin(t * 2.4);
      const g = ctx.createRadialGradient(DOOR_X, 268, 8, DOOR_X, 268, 150);
      g.addColorStop(0, `rgba(255,240,190,${0.85 * pulse})`); g.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = g; ctx.fillRect(DOOR_X - 150, 118, 300, 300);
      ctx.fillStyle = `rgba(255,244,210,${0.8 * pulse})`; ctx.fillRect(DOOR_X - 54, 200, 108, 130);
    }

    // lâmpadas
    for (const l of this.lamps) {
      ctx.fillStyle = '#2a2a38'; ctx.fillRect(l.x - 3, l.y - 46, 6, 46);
      ctx.beginPath(); ctx.arc(l.x, l.y - 50, 8, 0, 7);
      ctx.fillStyle = l.lit ? '#ffd97a' : '#3a3a48'; ctx.fill();
      if (l.lit) { const g = ctx.createRadialGradient(l.x, l.y - 50, 2, l.x, l.y - 50, 40); g.addColorStop(0, 'rgba(255,217,122,.5)'); g.addColorStop(1, 'rgba(255,217,122,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y - 50, 40, 0, 7); ctx.fill(); }
    }

    // itens
    for (const it of this.items) {
      if (it.taken) continue;
      const bob = Math.sin(t * 2 + it.id) * 3;
      ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ITEMS[it.item].icon, it.x, it.y - 14 + bob);
    }
    // pontos de cura
    for (const h of this.heals) {
      if (h.taken) continue;
      const bob = Math.sin(t * 3 + h.x) * 3;
      const g = ctx.createRadialGradient(h.x, h.y - 10 + bob, 1, h.x, h.y - 10 + bob, 12);
      g.addColorStop(0, 'rgba(127,224,176,.95)'); g.addColorStop(1, 'rgba(127,224,176,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h.x, h.y - 10 + bob, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#bfe8d4'; ctx.beginPath(); ctx.arc(h.x, h.y - 10 + bob, 3.5, 0, 7); ctx.fill();
    }

    // memórias reveladas e não coletadas
    for (const f of this.frags) {
      if (f.taken || f.video || !f.revealed) continue;
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

    // NPCs
    for (const n of this.npcs) {
      const frames = n.kind === 'sol' ? ASSETS.sol : ASSETS.lua;
      const seq = n.kind === 'sol' ? [0, 1, 2, 3, 4, 3, 2, 1] : [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
      const im = frames[seq[n.frame % seq.length]];
      const w = im.width * NPC_SCALE, h = im.height * NPC_SCALE;
      ctx.save(); ctx.translate(n.x, n.y); ctx.rotate(Math.sin(t * 0.9 + (n.kind === 'sol' ? 0 : 2)) * 0.022);
      ctx.drawImage(im, -w / 2, -h, w, h); ctx.restore();
    }

    // inimigos (flores pequenas)
    for (const e of this.enemies) {
      if (e.dead) continue;
      const im = (e.type === 'sol' ? ASSETS.sol : ASSETS.lua)[0];
      const h = 46, w = im.width / im.height * h;
      const hop = Math.abs(Math.sin(t * 6 + e.homeX)) * 4;
      ctx.save(); ctx.translate(e.x, e.y - hop); if (e.dir < 0) ctx.scale(-1, 1);
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

    // textos flutuantes
    for (const fl of this.floats) {
      ctx.globalAlpha = Math.max(0, 1 - fl.t / 1.6);
      ctx.fillStyle = fl.color; ctx.font = 'bold 14px "Courier New", monospace'; ctx.textAlign = 'center';
      ctx.fillText(fl.text, fl.x, fl.y - fl.t * 30);
      ctx.globalAlpha = 1;
    }

    /* ---- ESCURIDÃO (círculo de luz) ---- */
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dctx = this.dctx;
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.globalCompositeOperation = 'source-over';
    dctx.clearRect(0, 0, VIEW_W, VIEW_H);
    dctx.fillStyle = 'rgba(0,0,4,0.93)'; dctx.fillRect(0, 0, VIEW_W, VIEW_H);
    dctx.globalCompositeOperation = 'destination-out';
    const lights = [];
    const pr = (this.has('lampiao') ? 185 : 125) * (stareOn ? 0.7 : 1) * S;
    lights.push({ x: (p.x - this.camX) * S, y: (p.y - p.z - 40) * S, r: pr });
    for (const l of this.lamps) if (l.lit) lights.push({ x: (l.x - this.camX) * S, y: (l.y - 50) * S, r: 95 * S });
    for (const n of this.npcs) lights.push({ x: (n.x - this.camX) * S, y: (n.y - 70) * S, r: 70 * S });
    for (const it of this.items) if (!it.taken) lights.push({ x: (it.x - this.camX) * S, y: (it.y - 14) * S, r: 30 * S });
    for (const h of this.heals) if (!h.taken) lights.push({ x: (h.x - this.camX) * S, y: (h.y - 10) * S, r: 24 * S });
    for (const f of this.frags) if (!f.taken && !f.video && f.revealed && Math.abs(f.x - p.x) < 160) lights.push({ x: (f.x - this.camX) * S, y: f.y * S, r: 40 * S });
    if (this.doorOpen) lights.push({ x: (DOOR_X - this.camX) * S, y: 268 * S, r: 130 * S });
    for (const L of lights) {
      const flick = 1 + Math.sin(t * 7 + L.x) * 0.03;
      const g = dctx.createRadialGradient(L.x, L.y, L.r * 0.25, L.x, L.y, L.r * flick);
      g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.7, 'rgba(0,0,0,0.7)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      dctx.fillStyle = g; dctx.beginPath(); dctx.arc(L.x, L.y, L.r * flick, 0, 7); dctx.fill();
    }
    dctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(this.darkCv, 0, 0);

    // vinheta + olhar
    const v = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.3, VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.85);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,10,${stareOn ? 0.7 : 0.45})`);
    ctx.fillStyle = v; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    if (stareOn && !this.gentle) { ctx.fillStyle = `rgba(120,0,0,${0.07 + 0.05 * Math.sin(t * 7)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    if (this.hp <= 25 && !this.dead) { ctx.fillStyle = `rgba(120,0,0,${0.1 + 0.08 * Math.sin(t * 5)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }

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
