/* ======================================================================
   TYLER'S MEMORIES — ARQUIVO DE TEXTOS
   ======================================================================
   ✏️ EDITE TUDO AQUI! Este é o único arquivo que você precisa mexer
   para mudar diálogos, história, nomes e mensagens do jogo.

   REGRAS SIMPLES:
   - Mantenha as aspas e as vírgulas no lugar.
   - Cada 'frase' entre aspas dentro de [ ] é UMA página de diálogo
     (o jogador aperta E para passar). Pode adicionar/remover frases.
   - {missao}, {titulo}, {npc}, {n}, {a}, {b} são "buracos" que o jogo
     preenche sozinho — pode movê-los dentro da frase, mas não apague.
   - \n pula linha nos textos longos (intro/final).
   - Não renomeie as CHAVES (sol, lua, s1, l1, simon, pa...) — só os textos.
   ====================================================================== */
'use strict';

const TEXTOS = {

  /* ================= INTRODUÇÃO (antes de começar) ================= */
  intro:
`Tyler não lembra de ter deitado na grama.

Mas o frio é real. A terra molhada nas mãos é real. E o escuro — o escuro só abre um círculo de luz ao redor dele, como se o mundo inteiro tivesse vergonha de olhar.

Ele se lembra do hospital. Do leito 312. Da mão da mãe ficando fria.

Ele não se lembra do que fez depois. Ou finge não lembrar.

O vento sussurra uma palavra quando ele passa: assassino.

Dois vultos esperam no campo. O Sol, que acusa. A Lua, que é o remorso.

Oito memórias. Seis trancas escondidas. Duas fitas que eles guardam.

No fim do campo, uma porta. Ela só abre para quem carrega tudo — inclusive a verdade.`,

  /* ================= FINAL (depois da porta) ================= */
  ending:
`A porta não rangeu. Estava esperando por ele.

Do outro lado não havia branco, nem túnel, nem perdão.

Havia uma sala. Uma cadeira. Uma câmera no canto, com a luz vermelha acesa.

Ele se sentou. Olhou para a lente. E disse, em voz alta, pela primeira vez:

“Fui eu. Ela pediu para parar, e eu disse a mim mesmo que era piedade. Mas era cansaço. Eu estava cansado, e usei o cansaço dela como desculpa. Às 14:07 eu empurrei o êmbolo. Fui eu.”

A câmera não respondeu. Não absolveu. Não condenou.

Só gravou.

Lembrar não absolve. Confessar não apaga. Mas é o primeiro passo de quem decidiu parar de fugir.

No corredor, a luz continuou acesa. E Tyler, pela primeira vez em anos, não apagou.

FIM`,

  /* ================= SUSSURROS DO CAMPO =================
     Aparecem flutuando perto do Tyler de tempos em tempos. */
  whispers: ['assassino…', 'foi você…', '14:07…', 'suas mãos…', 'faz parar…'],

  /* ================= DIÁLOGOS DOS NPCS =================
     first    = primeira conversa (apresentação)
     return   = conversas seguintes, antes de aceitar a missão da vez
     complete = quando você entrega a missão
     remind   = lembrete enquanto a missão não acabou ({missao} = descrição da missão)
     game     = quando propõem a brincadeira (confiança 100%)
     final    = depois que você já viu a fita                        */
  npc: {
    sol: {
      first: [
        'Você chegou, Tyler. Sentiu o frio? Aqui tudo é verdade.',
        'Este campo fica no fim de tudo. E todo mundo aqui sabe o que você fez.',
        'Eu sou o Sol. Eu acuso. Eu mostro. O campo sussurra “assassino” porque é o que você é.',
      ],
      return: ['Vamos ao que interessa, Tyler.'],
      complete: [
        'Você trouxe. Bom. A verdade não espera.',
        'Cada passo seu nesse campo é um passo na direção do que você fez.',
      ],
      remind: ['Ainda não acabou. {missao}', 'Ande. O campo inteiro está olhando.'],
      game: [
        'Você fez tudo que eu pedi. Provou que encara a verdade.',
        'Agora um último jogo, Tyler. Chama-se INTERROGATÓRIO. Encontre os pares do que você fez.',
        'Se vencer, eu te mostro a fita. A fita que a câmera gravou. Você vai querer ver? Não. Mas precisa.',
      ],
      final: [
        'A fita não mente, Tyler. Você estava lá. Suas mãos estavam lá.',
        'Não há absolvição aqui. Só a verdade. Carregue-a até a porta.',
      ],
    },
    lua: {
      first: [
        'Shhh. Eu sou a Lua. Eu sou o que você sente quando ninguém está olhando.',
        'Eu não te acuso, Tyler. Eu só te lembro. É pior.',
        'A árvore ali atrás era um homem que não quis lembrar. Virou raiz. Você não vai ter essa sorte.',
      ],
      return: ['De volta, Tyler. O remorso não vai embora.'],
      complete: [
        'Você trouxe. Obrigada, Tyler. Bidu merecia.',
        'Cada luz que você acende é um pedaço que você para de esconder.',
      ],
      remind: ['Ainda falta, querido. {missao}', 'Não desista. Desistir é o que você fez da primeira vez.'],
      game: [
        'Você cuidou do que restou. Acendeu luzes. Leu a carta.',
        'Agora brincamos de NÃO PISQUE. Os olhos vão abrir — e você olha de volta.',
        'Se aguentar, eu te mostro a segunda fita. A do quarto escuro. A que você carrega por trás dos olhos.',
      ],
      final: [
        'O remorso não grita. Ele fica de pé no escuro, olhando o chão.',
        'Você não vai se livrar dele. Mas pode parar de fugir. Vá até a porta.',
      ],
    },
  },

  /* ================= MISSÕES (título e descrição) =================
     s1/s2/s3 = Sol · l1/l2/l3 = Lua. A ordem importa! */
  quests: {
    s1: { title: 'O visitante',
      desc: 'Traga o crachá de visita do hospital. Quero ver o seu nome registrado no dia em que ela morreu.' },
    s2: { title: 'A hora exata',
      desc: 'Encontre o relógio parado no campo e traga para mim. Quero que você veja a hora.' },
    s3: { title: 'A testemunha',
      desc: 'Junte os 3 pedaços da foto rasgada. Eu quero ver o rosto de quem estava lá.' },
    l1: { title: 'O que restou de Bidu',
      desc: 'Traga o osso e a coleira vermelha de Bidu. Ele mereceu um enterro. Você não foi ao primeiro.' },
    l2: { title: 'Luz no escuro',
      desc: 'Com o lampião, acenda as 4 lâmpadas apagadas do campo. Onde há luz, há memória.' },
    l3: { title: 'A carta não enviada',
      desc: 'Junte os 3 pedaços da carta que você escreveu e nunca mandou. Leia para mim.' },
  },

  /* ================= MEMÓRIAS (0 a 7) =================
     title = nome · hint = dica quando ainda está trancada · text = o texto da memória */
  memories: {
    0: { title: 'A caixa de remédios',
      hint: 'Algo foi enterrado atrás da árvore. O Sol guarda uma pá — ajude-o primeiro.',
      text: 'Aos onze anos eu aprendi a ler bulas antes de aprender a andar de bicicleta. Mamãe chamava as crises de “dias cinzentos”. Eu organizava as cápsulas por cor, porque era o único jeito que eu tinha de consertar alguma coisa. Ela dizia que eu era o enfermeiro dela. Eu não sabia que estava aprendendo a dosar a morte.' },
    1: { title: 'O telefone mudo',
      hint: 'Uma caixa trancada. O Sol guarda a chave do quarto 312.',
      text: 'Quando ela piorou, o telefone virou um bicho. Todos ligavam para ajudar. Eu deixava tocar. Atender significava dizer “ela está morrendo” em voz alta. Um dia o telefone parou. O silêncio tinha o formato exato dela. E eu comecei a achar que o mundo inteiro me julgava por não atender.' },
    2: { title: 'Bidu esperou',
      hint: 'A cova de Bidu. Traga o osso e a coleira para a Lua primeiro.',
      text: 'Bidu envelheceu esperando na porta do meu quarto. Nos meses em que eu não levantava, era ele que me trazia o mundo. Quando o levaram ao veterinário pela última vez, eu não fui. Eu não consegui. Disseram que ele procurou por mim na sala, até o fim. A primeira vida que eu deixei morrer esperando por mim.' },
    3: { title: 'As cortinas',
      hint: 'Um breu total. Só o lampião revela o que há aqui.',
      text: 'Depois do enterro, fiquei onze meses sem abrir as cortinas. A depressão não era tristeza — era um quarto sem ar. Ela teria odiado aquilo. Um dia abri um palmo. A luz doeu como água fervida. Mas doeu para dentro, e alguma coisa descongelou um dedo. Eu só não sabia que a luz também mostra o que a gente fez.' },
    4: { title: 'Leito 312',
      hint: 'A lembrança do hospital. O Sol precisa da foto completa para abrir.',
      text: 'Quarto 312. Ela já não abria os olhos, mas apertou minha mão. “Faz parar, meu filho”, ela disse. Ou eu quis ouvir isso. O monitor foi ficando lento. Eu segurei a mão dela até o bip virar uma linha só. Não teve despedida de cinema. Teve uma mão ficando fria na minha — e a minha outra mão, que já tinha decidido.' },
    5: { title: 'A dose extra',
      hint: 'A verdade final. A Lua precisa da carta completa para revelar.',
      text: 'Eu puxei uma dose que não era dela. O enfermeiro tinha virado as costas. “Faz parar”, ela disse — e eu repeti isso como um mantra enquanto empurrava o êmbolo. Não foi piedade. Foi cansaço. Foi o meu cansaço vestindo a roupa dela. Às 14:07 o monitor calou. Eu saí do quarto andando devagar, como quem não fez nada. A câmera do corredor me viu.' },
    6: { title: 'FITA 01 — O corredor',
      text: 'A câmera de segurança do corredor. 14:06: você entra no 312. 14:07: você sai. Entre um minuto e outro, o coração dela parou. A fita não mente. Você estava lá. Suas mãos estavam lá. O Sol assistiu a fita inteira — e agora você também.' },
    7: { title: 'FITA 02 — O que ficou',
      text: 'A segunda fita. Você, de pé, no quarto escuro, depois. No chão, o que você derramou e nunca limpou. A Lua não te acusa. Ela só te mostra. O remorso não grita — ele fica de pé no escuro, olhando o chão, para sempre. Você carregou essa imagem por trás dos olhos cada dia desde então.' },
  },

  /* ================= ITENS (nome e descrição do inventário) ================= */
  items: {
    pa:        { name: 'Pá enferrujada', desc: 'Serve para cavar o que foi enterrado atrás da árvore.' },
    chave:     { name: 'Chave do 312', desc: 'Abre a caixa trancada no começo do campo.' },
    relogio:   { name: 'Relógio parado', desc: 'Os ponteiros congelaram em 14:07.' },
    cracha:    { name: 'Crachá de visita', desc: 'Hospital São Lucas · visitante: Tyler.' },
    foto1:     { name: 'Foto rasgada (1/3)', desc: 'Um terço de uma foto. O Sol quer ver.' },
    foto2:     { name: 'Foto rasgada (2/3)', desc: 'Um terço de uma foto. O Sol quer ver.' },
    foto3:     { name: 'Foto rasgada (3/3)', desc: 'Um terço de uma foto. O Sol quer ver.' },
    osso:      { name: 'Osso de Bidu', desc: 'O que restou do seu melhor amigo.' },
    coleira:   { name: 'Coleira vermelha', desc: 'A coleira que Bidu usava.' },
    lampiao:   { name: 'Lampião', desc: 'Aumenta sua luz. Acende as lâmpadas do campo.' },
    carta1:    { name: 'Carta rasgada (1/3)', desc: 'Um terço de uma carta nunca enviada.' },
    carta2:    { name: 'Carta rasgada (2/3)', desc: 'Um terço de uma carta nunca enviada.' },
    carta3:    { name: 'Carta rasgada (3/3)', desc: 'Um terço de uma carta nunca enviada.' },
    comprimido:{ name: 'Comprimido', desc: 'Restaura 25 de vida.' },
    bandagem:  { name: 'Bandagem', desc: 'Restaura 15 de vida.' },
  },

  /* ================= FITAS (rótulo do player de vídeo) ================= */
  tapes: {
    sol: { label: '📼 FITA 01 — O CORREDOR' },
    lua: { label: '📼 FITA 02 — O QUE FICOU' },
  },

  /* ================= PUZZLES E BRINCADEIRAS (título e instrução) ================= */
  puzzles: {
    simon: { title: 'A CAIXA DE REMÉDIOS', desc: 'A ordem em que você dosava. Observe e repita. Cinco rodadas — a sequência cresce até sete cápsulas. Errar custa vida.' },
    code: { title: 'O CELULAR DELA', desc: 'A senha de 4 dígitos. No verso da foto, a letra trêmula deixou as pistas. Você tem 3 tentativas antes de a tela bloquear.' },
    maze: { title: 'O CAMINHO DE BIDU', desc: 'O último passeio, no escuro. Você só enxerga dois passos ao redor. Leve Bidu para casa antes que os passos acabem.' },
    lights: { title: 'AS CORTINAS', desc: 'Dezesseis luzes. Tocar numa vira também as vizinhas. Acenda todas. Você tem 40 toques.' },
    pulse: { title: 'LEITO 312', desc: 'O monitor marca o ritmo. Aperte E na zona verde. Sete batimentos, cada vez mais rápido. Errar desfaz dois.' },
    letter: { title: 'A DOSE EXTRA', desc: 'As frases da confissão se embaralharam. Toque na ordem em que aconteceram. Errar devolve tudo ao início.' },
    pairs: { title: 'INTERROGATÓRIO', desc: 'O Sol espalhou as provas. Encontre os 8 pares do que você fez. Você tem 30 viradas. Olhe bem — ele está olhando.' },
    reaction: { title: 'NÃO PISQUE', desc: 'A Lua abre os olhos. Quando abrirem, olhe de volta (E). Se piscar antes ou demorar, você perde. Cinco rodadas.' },
  },

  /* Pistas da senha (aceita HTML simples: <p>, <b>...) */
  puzzleClues: {
    code: '<p>“A hora em que o relógio parou.</p><p>Os dois primeiros dígitos: a hora, no formato de 24 horas (duas da tarde).</p><p>Os dois últimos: o minuto — metade da hora, com um zero à frente.”</p>',
  },

  /* Frases da confissão (puzzle da carta) — a ordem certa é definida no código */
  puzzleLines: {
    letter: [
      'Ela disse “faz parar, meu filho”.',
      'Ou eu quis ouvir isso.',
      'O enfermeiro virou as costas.',
      'Eu puxei uma dose que não era dela.',
      'Empurrei o êmbolo devagar.',
      'Às 14:07 o monitor calou.',
      'Eu saí andando, como quem não fez nada.',
    ],
  },

  /* Mensagens quando você ERRAR um puzzle */
  puzzleFail: {
    simon: 'A ordem se perdeu. As cápsulas rolam de volta.',
    code: 'A tela bloqueou. Você forçou a memória e ela sangrou.',
    maze: 'Bidu se perdeu no escuro. Ele volta ao começo, esperando.',
    lights: 'As luzes se apagaram de novo. O escuro é paciente.',
    pulse: 'O traço escapou. Respire. Ela ainda está aqui.',
    letter: 'Não era essa a ordem. A confissão volta para o começo.',
    pairs: 'O Sol fecha o álbum. “Você não quis ver.”',
    reactionSlow: 'Você demorou. O olho se fechou e te engoliu um pedaço.',
    reactionEarly: 'Você piscou antes. A Lua viu seu medo.',
  },

  /* ================= AVISOS E DICAS (mensagens rápidas na tela) ================= */
  hints: {
    hpFull: 'Sua vida já está cheia.',
    needLampiao: 'Está apagada. Você precisa de um lampião.',
    doorLocked: 'A porta exige as 8 memórias. Você carregou {n}/8.',
    doorNeed: 'A porta exige que você carregue as 8 memórias.',
    doorOpen: 'A porta está aberta. Pressione E para atravessar.',
    questDone: 'Missão concluída: {titulo}. Confiança de {npc} aumentou.',
    itemsSpawned: 'Algo apareceu no campo. Procure — a missão deixou rastros.',
    puzzleAbort: 'Você recua. A verdade continua lá, esperando.',
    resume: 'você continua de onde parou. o campo não esqueceu.',
    newGame: 'WASD / setas — andar · Espaço — pular · E — interagir · I — inventário · J — missões',
    respawn: 'o que você já carregou continua com você. levante.',
    allDone: 'Você carregou tudo. A porta no fim do campo está aberta. Vá até ela.',
    fieldWoke: 'A primeira memória abriu algo. O campo acordou — o Olhar agora te procura. Não pare de andar.',
    objective: 'Objetivo principal: encontre e carregue as 8 memórias escondidas. As missões dos NPCs ajudam a revelá-las.',
    muteOn: 'som desligado',
    muteOff: 'som ligado',
  },

  /* Textinhos que flutuam no mundo */
  floats: { lampLit: 'luz acesa' },

  /* ================= TEXTOS DE TELA ================= */
  ui: {
    missionLabel: 'MISSÃO',
    npcNames: { sol: '☀ SOL', lua: '☾ LUA' },
    stareWarning: '👁 O OLHAR · NÃO PARE DE ANDAR 👁',
    gameOverTitle: 'A CULPA TE DERRUBOU',
    gameOverText: 'O Olhar te encontrou parado, e o escuro fechou como uma mão.<br>Mas o que você já lembrou, ninguém tira.<br>A culpa não te mata — ela te espera de pé.',
    exitText: 'Você fechou os olhos.<br><br>O campo continua lá. O escuro, os olhos, a porta.<br>A culpa sempre continua — com ou sem você.',
    credits: 'uma história sobre confessar, mesmo quando não há perdão<br>arte, fitas e trilha originais · obrigado por jogar 🖤<br><span class="cvv">se esta história ecoou em você, fale com alguém — CVV: ligue 188 (Brasil, 24h, gratuito)</span>',
    tapeHint: 'a fita está rodando… (E para pular)',
    invEmpty: 'Suas mãos estão vazias. Aceite missões — os itens aparecem no campo conforme você avança.',
    invDetail: 'Toque em um item para ver. Comprimidos e bandagens podem ser usados aqui.',
    questLocked: 'fale com {npc} para revelar',
    questGameHint: 'fale com {npc} para jogar e ganhar a fita',
    questDoneLabel: 'concluída',
    tapeWatched: 'fita assistida',
    lampsProgress: 'Lâmpadas acesas: {a}/{b}',
  },
};
