/* ============ TYLER'S MEMORIES v3 — carregamento de assets ============ */
'use strict';

const ASSETS = {
  player: { frente: [], costas: [], lado: [] },
  sol: [], lua: [], ceu: [], cenarios: [],
  menu: {}, hp: [],
};
const IMG_BASE = 'assets/img/';

function buildManifest() {
  const list = [];
  const add = (path, cb) => list.push({ path: IMG_BASE + path, cb });
  [1, 2, 3].forEach(i => add(`player/frente/${i}.png`, im => ASSETS.player.frente.push(im)));
  [1, 2, 3].forEach(i => add(`player/costas/${i}.png`, im => ASSETS.player.costas.push(im)));
  [1, 2, 3, 4, 6].forEach(i => add(`player/lado/${i}.png`, im => ASSETS.player.lado.push(im)));
  [1, 2, 3, 4, 6].forEach(i => add(`npc_sol/${i}.png`, im => ASSETS.sol.push(im)));
  [1, 2, 3, 4, 5, 6].forEach(i => add(`npc_lua/${i}.png`, im => ASSETS.lua.push(im)));
  for (let i = 1; i <= 7; i++) add(`ceu/${i}.jpg`, im => ASSETS.ceu.push(im));
  for (let i = 1; i <= 4; i++) add(`cenarios/parte_${i}.jpg`, im => ASSETS.cenarios.push(im));
  ['titulo', 'computador', 'jogar', 'opcoes', 'sair', 'tela', 'quarto'].forEach(n => {
    const ext = (n === 'tela' || n === 'quarto') ? '.jpg' : '.png';
    add(`menu/${n}${ext}`, im => ASSETS.menu[n] = im);
  });
  ['vida_cheia', 'dano_1', 'dano_2', 'dano_3', 'dano_4'].forEach(n =>
    add(`hud/${n}.jpeg`, im => ASSETS.hp.push(im)));
  return list;
}

function loadAssets(onProgress) {
  return new Promise((resolve, reject) => {
    const list = buildManifest();
    let done = 0; const fail = [];
    list.forEach(item => {
      const im = new Image();
      im.onload = () => { item.cb(im); done++; onProgress(done / list.length); if (done + fail.length === list.length) finish(); };
      im.onerror = () => { fail.push(item.path); if (done + fail.length === list.length) finish(); };
      im.src = item.path;
    });
    function finish() { fail.length ? reject(new Error('Assets faltando: ' + fail.join(', '))) : resolve(ASSETS); }
  });
}
