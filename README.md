# 🌙 Tyler's Memories

> *Lembrar não absolve. Confessar não apaga. Mas é o primeiro passo de quem decidiu parar de fugir.*

Um jogo de exploração **horror psicológico / mistério** em HTML5 + CSS + JavaScript puro (sem dependências),
construído com a arte, as fitas e as trilhas sonoras originais do projeto.

**v3.1 — "O Julgamento":** Tyler acordou num campo **levemente escuro, mas visível**, com uma vibe de mistério.
**O começo é calmo** — o campo só "acorda" depois da primeira memória. Não há monstros: o objetivo principal é
**encontrar e carregar as 8 memórias**. O Sol acusa; a Lua é o remorso. Os **itens aparecem no campo conforme as missões**,
uma missão de cada vez.

> ⚠️ **Aviso de conteúdo:** violência, morte, depressão e culpa. Se isso ecoar em você,
> fale com alguém. **CVV — ligue 188** (Brasil, 24h, gratuito).

## ✏️ Editar os textos e diálogos
**Tudo o que é texto fica em um único arquivo: [`js/textos.js`](js/textos.js).**
Abra esse arquivo e edite à vontade — diálogos dos NPCs, introdução, final, memórias, missões,
itens, puzzles, avisos e telas. As instruções de como editar estão no topo do próprio arquivo.
Você não precisa tocar em mais nada para mudar a história.

## 🎮 Como jogar

| Tecla | Ação |
|---|---|
| `WASD` ou setas | Andar (4 direções) |
| `Espaço` | Pular |
| `E` / `Enter` | Interagir com memórias, NPCs, itens, lâmpadas e porta · avançar diálogos |
| `I` | Inventário (use comprimidos e bandagens aqui) |
| `J` | Missões (objetivos e progresso) |
| `Esc` | Pausar · desistir de uma tranca (pode voltar depois) |
| `M` | Mutar o som |

### 🎯 Objetivo principal: as 8 memórias
- **6 memórias** estão escondidas no campo e só aparecem quando você cumpre a condição delas
  (um item na mão ou uma missão concluída). Cada uma é protegida por um **puzzle**.
- **2 memórias são fitas em vídeo** (`sun.mp4`, `moon.mp4`), ganhas ao vencer as **brincadeiras** dos NPCs com confiança 100%.
- Carregue as **8** para abrir a porta no fim do campo.

### 🌒 Começo calmo + mistério
- O mapa fica **um pouco escuro, mas dá para ver quase tudo** — um brilho suave acompanha o Tyler.
- **Sem monstros.** Nos primeiros passos o campo é silencioso e contemplativo.
- Depois da **primeira memória**, o campo "acorda": o **Olhar** passa a drenar vida se você ficar parado,
  e sussurros começam a aparecer. Continue andando quando o céu acordar.

### ❤️ Vida (sem regeneração)
- A barra usa a arte original (`vida_cheia` → `dano_4`): o coração racha conforme você sofre.
- **A vida NÃO se regenera sozinha.** Cure-se com **pontinhos de cura** verdes, **comprimidos** (+25) e
  **bandagens** (+15) no inventário, ou recompensas de missão.
- Vida muito baixa = batimento cardíaco + tela pulsando. Morrer = animação de queda + glitch;
  você renasce com 60 de vida **mantendo todo o progresso**.

### 📦 Itens aparecem conforme as missões
- Os itens **não ficam espalhados desde o início**: cada um surge no campo quando a missão correspondente é aceita
  (uma missão de cada vez). Aceitou a missão → o item aparece → você coleta → entrega.

## 🧩 As 6 trancas + 2 brincadeiras
1. **A caixa de remédios** — sequência de cápsulas (5 rodadas, até 7). *Precisa da pá.*
2. **O celular dela** — senha de 4 dígitos, 3 tentativas. *Precisa da chave do 312.*
3. **O caminho de Bidu** — labirinto 15×11 com névoa, passos contados. *Missão da Lua.*
4. **As cortinas** — 16 luzes (tocar vira as vizinhas), 40 toques. *Precisa do lampião.*
5. **Leito 312** — 7 batimentos na zona verde, cada vez mais rápido. *Foto completa (Sol).*
6. **A dose extra** — 7 frases da confissão na ordem certa. *Carta completa (Lua).*
- ☀ **Sol → INTERROGATÓRIO** (jogo da memória) → **FITA 01** (`sun.mp4`).
- ☾ **Lua → NÃO PISQUE** (reação) → **FITA 02** (`moon.mp4`).

❌ Errar custa **vida**. 💾 Progresso salvo automaticamente no navegador. 📱 Controles touch automáticos.

## 📜 As 6 missões (3 por NPC)
Cada missão concluída aumenta a **barra de confiança**. Com 100%, o NPC propõe sua brincadeira e entrega a fita.
- **Sol (o acusador):** O visitante · A hora exata · A testemunha.
- **Lua (o remorso):** O que restou de Bidu · Luz no escuro · A carta não enviada.

## 🚀 Publicar no GitHub Pages
1. Envie **todo o conteúdo desta pasta** para a raiz de um repositório.
2. **Settings → Pages** → Source: **Deploy from a branch** → Branch **main** / **/ (root)** → Save.
   (Ou use o workflow corrigido em `correcao-github-pages.zip`, já com as actions em Node 24.)
3. Em ~1 minuto: `https://SEU-USUARIO.github.io/tylers-memories/`.

> 💡 Local: abra o `index.html` ou rode `python3 -m http.server 8000` na pasta.
> Os vídeos (`sun.mp4` 12,9 MB · `moon.mp4` 9,4 MB) ficam abaixo do limite de 100 MB do GitHub.

## 🗂 Estrutura
```
tylers-memories/
├── index.html          # telas do jogo
├── css/style.css       # estética + CRT + glitches + puzzles
├── js/
│   ├── textos.js       # ✏️ TODOS OS TEXTOS E DIÁLOGOS (edite aqui!)
│   ├── assets.js       # carregador de imagens
│   ├── audio.js        # trilhas + efeitos
│   ├── game.js         # mundo, missões, itens, luz, memórias
│   ├── puzzles.js      # as 6 trancas + os 2 jogos dos NPCs
│   └── main.js         # estados, diálogos, fitas, inventário, save
└── assets/
    ├── img/            # arte original + hud/ (barra de vida)
    ├── video/          # sun.mp4 · moon.mp4 (as fitas)
    └── audio/          # terror.mp3 · horror.mp3
```

## 🎨 Créditos
- **Arte, sprites, cenários, fitas e trilhas:** acervo original do projeto (pastas `dream`, `fitas`, `barra de vida`).
- **Game design, código e montagem:** feito com ajuda de IA (Arena.ai Agent Mode).

A arte e as trilhas pertencem aos seus autores originais — verifique os direitos antes de redistribuir comercialmente.
