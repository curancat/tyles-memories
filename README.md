# 🌙 Tyler's Memories

> *Lembrar não absolve. Confessar não apaga. Mas é o primeiro passo de quem decidiu parar de fugir.*

Um jogo de exploração **horror psicológico** em HTML5 + CSS + JavaScript puro (sem dependências),
construído com a arte, as fitas e as trilhas sonoras originais do projeto.

**v3.0 — "O Julgamento":** o campo agora é **escuro** — só um círculo de luz acompanha Tyler.
Tudo ali o acusa de um assassinato que ele cometeu e enterrou na memória. **O Sol acusa; a Lua é o remorso.**
São **8 memórias** (6 trancas escondidas + **2 fitas em vídeo** guardadas pelos NPCs), **6 missões**,
**inventário**, **pulo**, **flores que atacam**, **barra de confiança** e uma **barra de vida que não se regenera sozinha**.

> ⚠️ **Aviso de conteúdo:** violência, morte, depressão e culpa. Se isso ecoar em você,
> fale com alguém. **CVV — ligue 188** (Brasil, 24h, gratuito).

## 🎮 Como jogar

| Tecla | Ação |
|---|---|
| `WASD` ou setas | Andar (4 direções) |
| `Espaço` | **Pular** (pule na cabeça das flores para silenciá-las) |
| `E` / `Enter` | Interagir com trancas, NPCs, itens, lâmpadas e porta · avançar diálogos |
| `I` | **Inventário** (use comprimidos e bandagens aqui) |
| `J` | **Missões** (objetivos e progresso) |
| `Esc` | Pausar · desistir de uma tranca (pode voltar depois) |
| `M` | Mutar o som |

### ❤️ Vida (sem regeneração)
- A barra de vida usa a arte original (`vida_cheia` → `dano_4`): o coração racha conforme você apanha.
- **A vida NÃO se regenera sozinha.** Cure-se com **pontinhos de cura** verdes espalhados pelo campo,
  **comprimidos** (+25) e **bandagens** (+15) no inventário, ou recompensas de missão.
- Vida muito baixa = **batimento cardíaco** + tela pulsando em vermelho.
- Morrer toca uma **animação de queda + glitch**; você renasce no início com 60 de vida, **mantendo todo o progresso**.

### 👁 O Olhar e as flores
- Quando o céu acordar, **continue andando** — parado, o Olhar drena sua vida.
- **Flores pequenas** (sprites dos NPCs encolhidos) sussurram *"assassino…"* e atacam.
  Pule na cabeça delas para silenciá-las (às vezes deixam um ponto de cura).

### 🔦 Escuridão
- Só há luz ao redor de Tyler. Ache o **lampião** para aumentar o círculo de luz e **acender as 4 lâmpadas** do campo.

## 🧩 As 8 memórias

**6 trancas escondidas** (só aparecem perto da luz; algumas exigem itens/missões):
1. **A caixa de remédios** — sequência de cápsulas (5 rodadas, cresce até 7). *Enterre com a pá.*
2. **O celular dela** — senha de 4 dígitos, 3 tentativas. *Precisa da chave do 312.*
3. **O caminho de Bidu** — labirinto 15×11 **com névoa** (2 passos de visão), passos contados. *Missão da Lua.*
4. **As cortinas** — **16 luzes** (tocar vira as vizinhas), 40 toques. *Precisa do lampião.*
5. **Leito 312** — **7 batimentos** na zona verde, cada vez mais rápido e menor. *Foto completa (Sol).*
6. **A dose extra** — **7 frases** da confissão na ordem certa. *Carta completa (Lua).*

**2 fitas em vídeo** (memórias 7 e 8) — ganhas ao vencer as **brincadeiras** dos NPCs com confiança 100%:
- ☀ **Sol → INTERROGATÓRIO** (jogo da memória com as provas) → **FITA 01 — O corredor** (`sun.mp4`).
- ☾ **Lua → NÃO PISQUE** (reação: olhe de volta quando o olho abrir) → **FITA 02 — O que ficou** (`moon.mp4`).

- ❌ **Errar custa VIDA.** Sem dreno passivo durante a tranca — mas cada erro sangra.
- 💾 Progresso salvo automaticamente no navegador (`localStorage`).
- 📱 Controles touch automáticos no celular (com botão de pulo) · 🎧 fones recomendados.

## 📜 As 6 missões (3 por NPC)
Cada missão concluída aumenta a **barra de confiança**. Com 100%, o NPC propõe sua brincadeira e entrega a fita.
- **Sol (o acusador):** Cale os sussurros · A hora exata · A testemunha.
- **Lua (o remorso):** O que restou de Bidu · Luz no escuro · A carta não enviada.

Itens espalhados pelo mapa: pá, chave, relógio, crachá, 3 pedaços de foto, osso, coleira, lampião,
3 pedaços de carta, comprimidos e bandagens.

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
├── index.html          # telas: menu, intro, jogo, trancas, fitas, inventário, missões, final…
├── css/style.css       # estética horror + CRT + glitches + puzzles
├── js/
│   ├── assets.js       # carregador de imagens (inclui a barra de vida)
│   ├── audio.js        # trilhas + efeitos (dano, batimento, morte, glitch…)
│   ├── game.js         # mundo escuro, pulo, flores, itens, missões, confiança, O Olhar
│   ├── puzzles.js      # as 6 trancas + os 2 jogos dos NPCs
│   └── main.js         # estados, diálogos, fitas de vídeo, inventário, save, controles
└── assets/
    ├── img/            # arte original processada + hud/ (barra de vida)
    ├── video/          # sun.mp4 · moon.mp4 (as fitas)
    └── audio/          # terror.mp3 · horror.mp3
```

## 🎨 Créditos
- **Arte, sprites, cenários, fitas e trilhas:** acervo original do projeto (pastas `dream`, `fitas`, `barra de vida`).
- **Game design, código e montagem:** feito com ajuda de IA (Arena.ai Agent Mode).

A arte e as trilhas pertencem aos seus autores originais — verifique os direitos antes de redistribuir comercialmente.
