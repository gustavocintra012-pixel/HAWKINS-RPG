// ==============================================
// CONECTA COM O HTML (tela e input)
// ==============================================
const screen = document.getElementById("screen");
const input = document.getElementById("cmd");

// ==============================================
// ÁUDIO DO JOGO
// ==============================================
const audio = new Audio();
audio.loop = true;
audio.volume = 0.4;

const telefoneAudio = new Audio();
telefoneAudio.loop = true;
telefoneAudio.volume = 0.6;

const mensagemAudio = new Audio();
mensagemAudio.loop = false;
mensagemAudio.volume = 0.8;

const inicioAudio = new Audio();
inicioAudio.loop = true;
inicioAudio.volume = 0.5;

// ==============================================
// FUNÇÃO QUE MOSTRA TEXTO LETRA POR LETRA
// ==============================================
function print(text, speed = 15) {
  return new Promise((resolve) => {
    let i = 0;

    function type() {
      if (i < text.length) {
        screen.innerText += text.charAt(i);
        i++;
        screen.scrollTop = screen.scrollHeight;
        setTimeout(type, speed);
      } else {
        screen.innerText += "\n";
        screen.scrollTop = screen.scrollHeight;
        resolve();
      }
    }

    type();
  });
}

// ==============================================
// FUNÇÕES DE CONTROLE DE SOM
// ==============================================
function tocarSom(nome) {
  telefoneAudio.pause();
  telefoneAudio.currentTime = 0;

  mensagemAudio.pause();
  mensagemAudio.currentTime = 0;

  inicioAudio.pause();
  inicioAudio.currentTime = 0;

  audio.pause();
  audio.src = "sounds/" + nome;
  audio.loop = true;
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

function tocarInicio() {
  inicioAudio.pause();
  inicioAudio.currentTime = 0;
  inicioAudio.src = "sounds/inicio.wav";
  inicioAudio.play().catch(() => {});
}

function tocarTelefone() {
  audio.pause();

  mensagemAudio.pause();
  mensagemAudio.currentTime = 0;

  telefoneAudio.pause();
  telefoneAudio.currentTime = 0;
  telefoneAudio.src = "sounds/telefone.wav";
  telefoneAudio.play().catch(() => {});
}

function pararTelefone() {
  telefoneAudio.pause();
  telefoneAudio.currentTime = 0;
}

function voltarSomAmbiente() {
  pararTelefone();

  audio.pause();
  audio.src = "sounds/" + rooms[current_room].som;
  audio.loop = true;
  audio.volume = 0.4;
  audio.play().catch(() => {});
}

function tocarMensagemTelefone() {
  pararTelefone();

  audio.pause();

  mensagemAudio.pause();
  mensagemAudio.currentTime = 0;
  mensagemAudio.src = "sounds/mensagem.wav";
  mensagemAudio.play().catch(() => {});

  mensagemAudio.onended = function () {
    voltarSomAmbiente();
  };
}

// ==============================================
// EFEITOS VISUAIS
// ==============================================
function glitchTela() {
  const terminal = document.querySelector(".terminal");

  terminal.classList.add("glitch");

  setTimeout(() => {
    terminal.classList.remove("glitch");
  }, 150);
}

function distorcerTela() {
  const terminal = document.querySelector(".terminal");

  terminal.classList.remove("distorcendo");

  void terminal.offsetWidth;

  terminal.classList.add("distorcendo");

  setTimeout(() => {
    terminal.classList.remove("distorcendo");
  }, 1500);
}

function atualizarPiscadas() {
  const terminal = document.querySelector(".terminal");

  const locaisPiscando = [
    "praca_hawkins",
    "rua_principal",
    "delegacia",
    "laboratorio_entrada",
    "recepcao_lab",
    "sala_eletrica",
    "corredor_a",
    "subsolo",
    "portal",
  ];

  if (locaisPiscando.includes(current_room)) {
    terminal.classList.add("piscando");
  } else {
    terminal.classList.remove("piscando");
  }
}

function atualizarPortalVisual() {
  if (current_room === "portal") {
    screen.classList.add("portal-alerta");
  } else {
    screen.classList.remove("portal-alerta");
  }
}

function corromperTexto(texto) {
  const simbolos = ["#", "@", "%", "&", "?", "█"];

  let resultado = "";

  for (let i = 0; i < texto.length; i++) {
    if (Math.random() < 0.05) {
      resultado += simbolos[Math.floor(Math.random() * simbolos.length)];
    } else {
      resultado += texto[i];
    }
  }

  return resultado;
}

// ==============================================
// ESTADO DO JOGO (variáveis importantes)
// ==============================================
let player_name = "";
let inventory = [];
let current_room = "praca_hawkins";

let etapa_jogo = "inicio";
let introIniciada = false;

let energia_laboratorio = false;
let telefone_desligado = false;
let saiuDaDiretoria = false;
let audioPortaTocou = false;

// ==============================================
// MAPA DO JOGO (TODAS AS SALAS)
// ==============================================
const rooms = {
  praca_hawkins: {
    som: "cidade.wav",
    itens: ["mapa"],
    descricao:
      "Você está na praça principal de Hawkins. A névoa cobre as ruas e os postes piscam como se a cidade estivesse perdendo energia.",
    detalhes:
      "Carros abandonados cercam a praça. Ao longe, placas comerciais balançam sozinhas e uma sirene distante parece nunca chegar perto.",
    comandos: {
      "andar para o norte": "rua_principal",
      "andar para o leste": "telefone_publico",
      "andar para o oeste": "mercado",
      "andar para o sul": "arcade",
      "andar para o sudeste": "cinema_abandonado",
    },
  },

  rua_principal: {
    som: "cidade.wav",
    itens: [],
    descricao: "Você chegou na rua principal de Hawkins.",
    detalhes:
      "Lojas destruídas, vitrines rachadas e semáforos apagados deixam a avenida com aparência de evacuação às pressas.",
    comandos: {
      "andar para o sul": "praca_hawkins",
      "andar para o norte": "floresta_trilha",
      "andar para o leste": "delegacia",
      "andar para o oeste": "zona_residencial",
      "andar para o nordeste": "hospital",
    },
  },

  telefone_publico: {
    som: "cidade.wav",
    itens: ["moeda"],
    descricao:
      "Um telefone público antigo toca sem parar no meio da rua vazia.",
    detalhes:
      "O telefone toca violentamente. A cada toque, a estática parece ficar mais alta, como se a ligação viesse de outro lugar.",
    comandos: {
      "andar para o oeste": "praca_hawkins",
    },
  },

  mercado: {
    som: "cidade.wav",
    itens: ["bateria", "lanterna quebrada"],
    descricao: "O mercado foi saqueado.",
    detalhes:
      "Prateleiras caídas bloqueiam parte da passagem. Um freezer desligado vibra mesmo sem energia.",
    comandos: {
      "andar para o leste": "praca_hawkins",
      "andar para o norte": "deposito_mercado",
    },
  },

  deposito_mercado: {
    som: "cidade.wav",
    itens: ["pilhas", "fita isolante"],
    descricao: "Você entrou no depósito do mercado.",
    detalhes:
      "Caixas abertas estão espalhadas pelo chão. Há marcas de arranhões na porta dos fundos.",
    comandos: {
      "andar para o sul": "mercado",
    },
  },

  arcade: {
    som: "cidade.wav",
    itens: ["ficha arcade", "fita cassete"],
    descricao: "Você entrou no arcade abandonado de Hawkins.",
    detalhes:
      "Máquinas antigas piscam sozinhas. Uma delas mostra uma pontuação impossível com o nome do jogador já escrito.",
    comandos: {
      "andar para o norte": "praca_hawkins",
      "andar para o leste": "sala_maquinas_arcade",
    },
  },

  sala_maquinas_arcade: {
    som: "cidade.wav",
    itens: ["codigo rabiscado"],
    descricao: "Você entrou na sala de máquinas do arcade.",
    detalhes:
      "Cabos descascados saem das máquinas. Um monitor quebrado repete a palavra 'RUN'.",
    comandos: {
      "andar para o oeste": "arcade",
    },
  },

  cinema_abandonado: {
    som: "cidade.wav",
    itens: ["rolo de filme"],
    descricao: "Você está no cinema abandonado de Hawkins.",
    detalhes:
      "A tela está rasgada, mas o projetor ainda tenta funcionar. Imagens queimadas aparecem por frações de segundo.",
    comandos: {
      "andar para o noroeste": "praca_hawkins",
      "andar para o norte": "sala_projecao",
    },
  },

  sala_projecao: {
    som: "cidade.wav",
    itens: ["chave pequena", "anotacao do projetor"],
    descricao: "Você entrou na sala de projeção.",
    detalhes:
      "O projetor está quente, como se tivesse sido usado há poucos minutos. Há cinzas no chão.",
    comandos: {
      "andar para o sul": "cinema_abandonado",
    },
  },

  zona_residencial: {
    som: "cidade.wav",
    itens: [],
    descricao: "Você chegou à zona residencial de Hawkins.",
    detalhes:
      "Casas silenciosas cercam a rua. Algumas TVs ainda estão ligadas, mostrando apenas estática.",
    comandos: {
      "andar para o leste": "rua_principal",
      "andar para o norte": "igreja",
      "andar para o oeste": "casa_abandonada",
      "andar para o sul": "posto_gasolina",
    },
  },

  igreja: {
    som: "cidade.wav",
    itens: ["vela apagada"],
    descricao: "Você entrou na igreja abandonada.",
    detalhes:
      "Bancos de madeira estão tortos e o vitral principal está quebrado. Há marcas de mãos no altar.",
    comandos: {
      "andar para o sul": "zona_residencial",
      "andar para o norte": "sacristia",
    },
  },

  sacristia: {
    som: "cidade.wav",
    itens: ["diario antigo"],
    descricao: "Você entrou na sacristia.",
    detalhes:
      "Roupas religiosas estão jogadas no chão. O diário fala sobre luzes vermelhas vindas da floresta.",
    comandos: {
      "andar para o sul": "igreja",
    },
  },

  casa_abandonada: {
    som: "casa.wav",
    itens: ["foto rasgada"],
    descricao: "Você entrou em uma casa abandonada da zona residencial.",
    detalhes:
      "A TV da sala está ligada em estática. No corredor, uma porta bate lentamente sem vento.",
    comandos: {
      "andar para o leste": "zona_residencial",
      "andar para o norte": "quarto_infantil",
      "andar para o sul": "porao_casa",
    },
  },

  quarto_infantil: {
    som: "casa.wav",
    itens: ["desenho infantil"],
    descricao: "Você entrou em um quarto infantil.",
    detalhes:
      "Desenhos cobrem as paredes. Um deles mostra o laboratório e uma criatura alta atrás das árvores.",
    comandos: {
      "andar para o sul": "casa_abandonada",
    },
  },

  porao_casa: {
    som: "casa.wav",
    itens: ["chave velha"],
    descricao: "Você desceu ao porão da casa.",
    detalhes:
      "O ar é pesado. Há marcas no chão, como se algo tivesse sido arrastado até a parede.",
    comandos: {
      "andar para o norte": "casa_abandonada",
    },
  },

  posto_gasolina: {
    som: "cidade.wav",
    itens: ["gasolina", "isqueiro"],
    descricao: "Você chegou ao posto de gasolina abandonado.",
    detalhes:
      "Bombas quebradas vazam lentamente. A loja de conveniência está com a porta entreaberta.",
    comandos: {
      "andar para o norte": "zona_residencial",
      "andar para o oeste": "borda_cidade",
    },
  },

  hospital: {
    som: "cidade.wav",
    itens: ["kit medico"],
    descricao: "Você entrou no Hospital Hawkins.",
    detalhes:
      "O corredor principal está escuro. Uma maca se moveu alguns centímetros quando você entrou.",
    comandos: {
      "andar para o sudoeste": "rua_principal",
      "andar para o norte": "ala_interditada",
    },
  },

  ala_interditada: {
    som: "cidade.wav",
    itens: ["sedativo", "cartao medico"],
    descricao: "Você entrou na ala interditada do hospital.",
    detalhes:
      "Plásticos cobrem as camas. Um monitor cardíaco apita mesmo sem paciente algum.",
    comandos: {
      "andar para o sul": "hospital",
    },
  },

  delegacia: {
    som: "cidade.wav",
    itens: ["chave enferrujada", "radar de mao"],
    descricao: "A delegacia está abandonada.",
    detalhes:
      "Papéis cobrem o chão enquanto um rádio chia sem parar. Algumas celas estão abertas.",
    comandos: {
      "andar para o oeste": "rua_principal",
      "andar para o norte": "sala_evidencias",
      "andar para o leste": "sala_interrogatorio",
    },
  },

  sala_interrogatorio: {
    som: "cidade.wav",
    itens: ["gravador antigo"],
    descricao: "Você entrou na sala de interrogatório.",
    detalhes:
      "A cadeira está caída. No espelho falso, há uma rachadura em formato de mão.",
    comandos: {
      "andar para o oeste": "delegacia",
    },
  },

  sala_evidencias: {
    som: "cidade.wav",
    itens: ["fusivel", "documentos do laboratorio"],
    descricao: "Você entrou na sala de evidências.",
    detalhes:
      "Armários metálicos batem lentamente. Caixas antigas citam desaparecimentos perto da floresta.",
    comandos: {
      "andar para o sul": "delegacia",
    },
  },

  borda_cidade: {
    som: "cidade.wav",
    itens: [],
    descricao: "Você chegou à borda da cidade.",
    detalhes:
      "A estrada termina perto da floresta. Placas avisam: ÁREA RESTRITA — NÃO PROSSIGA.",
    comandos: {
      "andar para o leste": "posto_gasolina",
      "andar para o norte": "floresta_trilha",
      "andar para o oeste": "estacao_eletrica",
      "andar para o sul": "esgoto_entrada",
    },
  },

  estacao_eletrica: {
    som: "cidade.wav",
    itens: ["cabo de energia", "disjuntor manual"],
    descricao: "Você está na estação elétrica de Hawkins.",
    detalhes:
      "Transformadores queimados estalam de tempos em tempos. Parte da cidade ainda parece depender daqui.",
    comandos: {
      "andar para o leste": "borda_cidade",
    },
  },

  esgoto_entrada: {
    som: "portal.wav",
    itens: ["barra de ferro"],
    descricao: "Você encontrou a entrada do esgoto.",
    detalhes: "A grade está torta. Um cheiro metálico sobe do túnel escuro.",
    comandos: {
      "andar para o norte": "borda_cidade",
      "andar para o sul": "tunel_esgoto",
    },
  },

  tunel_esgoto: {
    som: "portal.wav",
    itens: ["amostra estranha"],
    descricao: "Você entrou no túnel do esgoto.",
    detalhes:
      "A água escura reflete luzes que não existem. Há algo orgânico crescendo nas paredes.",
    comandos: {
      "andar para o norte": "esgoto_entrada",
      "andar para o sul": "subsolo",
    },
  },

  floresta_trilha: {
    som: "floresta.wav",
    itens: [],
    descricao: "Você entrou na trilha da floresta.",
    detalhes:
      "Algo se move entre as árvores escuras. As luzes da cidade parecem distantes demais agora.",
    comandos: {
      "andar para o sul": "rua_principal",
      "andar para o norte": "clareira",
      "andar para o leste": "cabana",
      "andar para o sudoeste": "borda_cidade",
      "andar para o oeste": "lago_floresta",
    },
  },

  lago_floresta: {
    som: "floresta.wav",
    itens: ["pingente enferrujado"],
    descricao: "Você chegou a um lago escondido na floresta.",
    detalhes:
      "A água está parada demais. Um reflexo atrás de você aparece por um segundo e desaparece.",
    comandos: {
      "andar para o leste": "floresta_trilha",
    },
  },

  clareira: {
    som: "floresta.wav",
    itens: ["pe de cabra"],
    descricao: "Uma clareira silenciosa surge no meio da floresta.",
    detalhes:
      "Existe sangue seco perto de uma árvore caída. O silêncio aqui parece artificial.",
    comandos: {
      "andar para o sul": "floresta_trilha",
    },
  },

  cabana: {
    som: "casa.wav",
    itens: ["cartao nivel 2"],
    descricao: "Você entrou em uma cabana velha.",
    detalhes:
      "A madeira range enquanto algo bate no andar de cima. Há marcas recentes de lama no chão.",
    comandos: {
      "andar para o oeste": "floresta_trilha",
      "andar para o norte": "laboratorio_entrada",
      "andar para o leste": "andar_superior_cabana",
    },
  },

  andar_superior_cabana: {
    som: "casa.wav",
    itens: ["carta amassada"],
    descricao: "Você subiu para o andar superior da cabana.",
    detalhes:
      "O quarto está destruído. Na parede, alguém escreveu: ELE OUVE PELO TERMINAL.",
    comandos: {
      "andar para o oeste": "cabana",
    },
  },

  laboratorio_entrada: {
    som: "laboratorio.wav",
    itens: [],
    descricao: "Você está na entrada do Laboratório Hawkins.",
    detalhes:
      "Portas metálicas bloqueiam o corredor principal. O leitor de cartão pisca em vermelho.",
    comandos: {
      "andar para o sul": "cabana",
      "andar para o norte": "recepcao_lab",
    },
  },

  recepcao_lab: {
    som: "laboratorio.wav",
    itens: ["cracha quebrado"],
    descricao: "A recepção do laboratório está destruída.",
    detalhes:
      "Monitores quebrados ainda piscam na escuridão. Um terminal antigo parece esperar um comando. No canto, um elevador antigo.",
    comandos: {
      "andar para o sul": "laboratorio_entrada",
      "andar para o leste": "sala_eletrica",
      "andar para o oeste": "sala_testes",
      "andar para o norte": "corredor_a",
      "usar elevador": "elevador_lab",
    },
  },

  sala_testes: {
    som: "laboratorio.wav",
    itens: ["relatorio de experimento", "chave do tecnico"],
    descricao: "Você entrou em uma sala de testes.",
    detalhes:
      "Cadeiras com correias estão viradas para uma parede de vidro. Há brinquedos infantis no chão. No canto, o corpo de um técnico está caído.",
    comandos: {
      "andar para o leste": "recepcao_lab",
    },
  },

  sala_eletrica: {
    som: "laboratorio.wav",
    itens: [],
    descricao: "Você entrou na sala elétrica.",
    detalhes:
      "Cabos queimados cobrem o chão. O painel principal está aberto, esperando um fusível.",
    comandos: {
      "andar para o oeste": "recepcao_lab",
    },
  },

  corredor_a: {
    som: "laboratorio.wav",
    itens: [],
    descricao: "Você está no Corredor A.",
    detalhes:
      "Luzes vermelhas iluminam o corredor vazio. Algo parece respirar nas sombras entre uma piscada e outra.",
    comandos: {
      "andar para o sul": "recepcao_lab",
      "andar para o leste": "porta_vermelha",
    },
  },

  sala_confinamento: {
    som: "laboratorio.wav",
    itens: ["frasco experimental"],
    descricao: "Você entrou na sala de confinamento.",
    detalhes:
      "O vidro blindado está trincado de dentro para fora. Há marcas de unhas na porta.",
    comandos: {
      "andar para o oeste": "corredor_a",
    },
  },

  porta_vermelha: {
    som: "laboratorio.wav",
    itens: ["bilhete"],
    descricao:
      "Você encontrou a porta vermelha que a mulher do telefone mencionou.",
    detalhes:
      "A porta é de metal enferrujado, pintada de vermelho sangue. Há uma placa: 'ACESSO RESTRITO - DIRETORIA'. Um bilhete está preso na maçaneta. A porta está TRANCADA.",
    comandos: {
      "andar para o oeste": "corredor_a",
    },
  },

  diretoria: {
    som: "laboratorio.wav",
    itens: ["documento da diretoria", "fita cassete", "anotacao rasgada"],
    descricao: "Você entrou na diretoria do laboratório Hawkins.",
    detalhes:
      "Uma sala ampla com vidro blindado. A mesa do diretor está completamente revirada. Cadeiras quebradas. Papéis espalhados pelo chão. No fundo, uma PEQUENA PORTA DE MADEIRA está sendo violentamente atacada por algo do outro lado! Os batidos ecoam pela sala...",
    comandos: {
      "andar para o oeste": "porta_vermelha",
    },
  },

  subsolo: {
    som: "portal.wav",
    itens: [],
    descricao: "Você chegou ao subsolo do laboratório.",
    detalhes:
      "Algo respira dentro das paredes. O concreto parece úmido e vivo. As luzes piscam perigosamente.",
    comandos: {
      "andar para o norte": "portal",
      "andar para o leste": "tunel_esgoto",
    },
  },

  portal: {
    som: "portal.wav",
    itens: ["fragmento dimensional"],
    descricao: "O portal dimensional está aberto.",
    detalhes:
      "A realidade parece quebrada aqui. O terminal distorce, como se o próprio sistema estivesse sendo observado.",
    comandos: {
      "andar para o sul": "subsolo",
    },
  },

  // ==============================================
  // ANDARES DO LABORATÓRIO
  // ==============================================
  laboratorio_andar1: {
    som: "laboratorio.wav",
    itens: ["crachá de visitante"],
    descricao: "Você está no primeiro andar do Laboratório Hawkins.",
    detalhes:
      "Corredores brancos se estendem à sua frente. Placas indicam 'ACESSO RESTRITO'. Um balcão de recepção abandonado.",
    comandos: {
      "usar elevador": "elevador_lab",
    },
  },

  laboratorio_andar2: {
    som: "laboratorio.wav",
    itens: ["documento confidencial", "foto de grupo"],
    descricao: "Você está no segundo andar do Laboratório Hawkins.",
    detalhes:
      "Salas de observação com vidros fumê. Equipamentos científicos ainda estão ligados. Há uma sala de reuniões no fundo.",
    comandos: {
      "usar elevador": "elevador_lab",
    },
  },

  laboratorio_andar3: {
    som: "laboratorio.wav",
    itens: ["chave mestra", "relatorio final"],
    descricao: "Você está no terceiro andar do Laboratório Hawkins.",
    detalhes:
      "Acesso restrito à diretoria. Documentos confidenciais estão espalhados. Uma sala grande com vidro blindado.",
    comandos: {
      "usar elevador": "elevador_lab",
    },
  },

  // ==============================================
  // ELEVADOR DO LABORATÓRIO
  // ==============================================
  elevador_lab: {
    som: "laboratorio.wav",
    itens: [],
    descricao: "Você está dentro do elevador do laboratório.",
    detalhes:
      "Painel com botões: 1, 2, 3, S (subsolo). Luzes piscam suavemente. As portas de metal são pesadas.",
    comandos: {
      "sair do elevador": "recepcao_lab",
      "ir para andar 1": "laboratorio_andar1",
      "ir para andar 2": "laboratorio_andar2",
      "ir para andar 3": "laboratorio_andar3",
      "ir para subsolo": "subsolo",
    },
  },

  // ==============================================
  // SALINHA DA DIRETORIA
  // ==============================================
};

// ==============================================
// MOSTRA INFORMAÇÕES NA TELA
// ==============================================
async function mostrar_status() {
  await print("\n==================================================");
  await print("LOCAL: " + current_room.toUpperCase());
  await print("==================================================");

  await print(rooms[current_room].descricao);

  let itens = rooms[current_room].itens;

  if (itens.length > 0) {
    await print("\nItens encontrados:");

    for (let item of itens) {
      await print("- " + item);
    }
  }

  await print("\nDireções disponíveis:");

  for (let comando in rooms[current_room].comandos) {
    let destino = rooms[current_room].comandos[comando];
    await print("- " + comando + " -> " + destino);
  }

  await print("\nOutros comandos:");

  await print("- olhar ao redor");
  await print("- pegar item");
  await print("- inventario");
  await print("- usar item");

  if (current_room === "telefone_publico") {
    await print("- atender telefone");
    await print("- desligar chamada");

    if (telefone_desligado) {
      await print("- voltar ao telefone");
    }
  }

  await print("- sair");
}

// ==============================================
// MOVIMENTO (andar entre salas) - VERSÃO SEM STATUS
// ==============================================
async function mover(direcao) {
  let comando = "andar para o " + direcao;

  if (comando in rooms[current_room].comandos) {
    // Verifica se precisa de cartão nível 2 para entrar no laboratório
    if (
      current_room === "laboratorio_entrada" &&
      direcao === "norte" &&
      !inventory.includes("cartao nivel 2")
    ) {
      await print("\nA porta exige um cartão de acesso nível 2.");
      return;
    }

    current_room = rooms[current_room].comandos[comando];

    atualizarPiscadas();
    atualizarPortalVisual();

    // Atualiza o radar se estiver ativo
    if (radarAtivo) {
      desenharRadar();
    }

    if (current_room === "telefone_publico") {
      tocarTelefone();
    } else {
      tocarSom(rooms[current_room].som);
    }

    // MOSTRA SÓ A DESCRIÇÃO DA SALA (sem status)
    await print("\n" + rooms[current_room].descricao);

    // ==========================================
    // EVENTO DA DIRETORIA (áudio assustador)
    // ==========================================
    if (current_room === "diretoria" && !audioPortaTocou) {
      audioPortaTocou = true;

      const portaAudio = new Audio();
      portaAudio.src = "sounds/porta_quebrando.wav";
      portaAudio.volume = 0.7;
      portaAudio.play().catch(() => {});

      await print(
        "\n💥 CRACK! VOCÊ OUVE ALGO BATENDO FORTE ATRÁS DE UMA PORTA! 💥",
      );
      await print("\nParece que tem algo preso em uma salinha nos fundos...");
      await print("\nA madeira range... os batidos ficam mais intensos...");
      await print(
        "\n📌 Uma pequena porta de madeira está trancada no fundo da sala.",
      );
      await print("\n⚠️ Talvez seja melhor pegar o que veio e SAIR RÁPIDO! ⚠️");
    }
  } else {
    await print("\nVocê não pode ir por esse caminho.");
  }
}
// ==============================================
// TELA DE INTRODUÇÃO (arte ASCII)
// ==============================================
async function iniciar_jogo() {
  screen.style.display = "flex";
  screen.style.justifyContent = "center";
  screen.style.alignItems = "center";
  screen.style.textAlign = "left";
  screen.style.whiteSpace = "pre";
  screen.style.paddingTop = "0";

  input.disabled = true;

  const intro = `
<div style="
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
width:100%;
transform:translateX(6px);
">

<pre style="margin:0; line-height:1.2; font-family:'Courier New', monospace; color:#00ff66; text-align:left;">
██╗  ██╗ █████╗ ██╗    ██╗██╗  ██╗██╗███╗   ██╗███████╗
██║  ██║██╔══██╗██║    ██║██║ ██╔╝██║████╗  ██║██╔════╝
███████║███████║██║ █╗ ██║█████╔╝ ██║██╔██╗ ██║███████╗
██╔══██║██╔══██║██║███╗██║██╔═██╗ ██║██║╚██╗██║╚════██║
██║  ██║██║  ██║╚███╔███╔╝██║  ██╗██║██║ ╚████║███████║
╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝
</pre>

<br>

<pre style="margin:0; line-height:1.2; font-family:'Courier New', monospace; color:#00ff66; text-align:left;">
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
</pre>

<br>

<div id="inicio-pisca" style="
text-align:center;
font-size:18px;
color:#00ff66;
font-family:'Courier New', monospace;
animation: piscar 2s infinite;
">
DIGITE 'INICIAR'...
</div>

</div>
`;

  screen.innerHTML = "";

  let i = 0;

  function digitarHTML() {
    if (i < intro.length) {
      screen.innerHTML = intro.substring(0, i + 1);
      i++;
      setTimeout(digitarHTML, 2);
    } else {
      input.disabled = false;
      input.focus();
    }
  }

  introIniciada = true;
  tocarInicio();

  digitarHTML();

  setInterval(() => {
    const texto = document.getElementById("inicio-pisca");

    if (texto) {
      texto.style.opacity = texto.style.opacity === "0.2" ? "1" : "0.2";
    }
  }, 1000);
}

// ==============================================
// INICIA O JOGO
// ==============================================
iniciar_jogo();

// ==============================================
// LOOP PRINCIPAL (processa TODOS os comandos)
// ==============================================
input.addEventListener("keydown", async function (e) {
  if (e.key !== "Enter") return;

  let cmd = input.value.trim().toLowerCase();

  input.value = "";
  input.disabled = true;

  // =========================
  // TELA INICIAL
  // =========================
  if (etapa_jogo === "inicio") {
    if (cmd !== "iniciar") {
      await print("\nDigite 'iniciar' para continuar.");

      input.disabled = false;
      input.focus();

      return;
    }

    etapa_jogo = "nome";

    // PARA O CARROSSEL E VOLTA AO ESTADO NORMAL
    const headerMarquee = document.querySelector(".header-marquee");
    if (headerMarquee) {
      headerMarquee.classList.add("stopped");
    }

    screen.style.display = "block";
    screen.style.textAlign = "left";
    screen.style.whiteSpace = "pre-wrap";
    screen.style.paddingTop = "15px";

    screen.innerText = "";

    await print("\nInicializando sistema de Hawkins...");
    await print("\nConexão estabelecida...");
    await print("\nAcesso autorizado.");
    await print("\nBem-vindo(a) a Hawkins...");
    await print("\nDigite seu nome para começar.");

    input.disabled = false;
    input.focus();

    return;
  }

  await print("\n> " + cmd);

  // =========================
  // NOME DO JOGADOR
  // =========================
  if (etapa_jogo === "nome") {
    player_name = cmd || "Jogador";

    inicioAudio.pause();
    inicioAudio.currentTime = 0;

    etapa_jogo = "jogo";

    tocarSom(rooms[current_room].som);

    await print("\nBem-vindo(a), " + player_name + "...");

    await print("\nA cidade de Hawkins não é mais segura.");

    await print("\nPessoas desapareceram durante a madrugada.");

    await print(
      "\nRumores dizem que o laboratório abriu algo que nunca deveria existir...",
    );

    await mostrar_status();

    input.disabled = false;
    input.focus();

    return;
  }

  // =========================
  // COMANDO SAIR
  // =========================
  if (cmd === "sair") {
    await print("\nEncerrando jogo...");

    audio.pause();
    telefoneAudio.pause();
    mensagemAudio.pause();
    inicioAudio.pause();

    input.disabled = true;

    return;
  }

  // =========================
  // COMANDO ANDAR PARA O...
  // =========================
  else if (cmd.startsWith("andar para o ")) {
    let direcao = cmd.replace("andar para o ", "");
    await mover(direcao);
  }

  // =========================
  // COMANDO OLHAR / OLHAR AO REDOR
  // =========================
  else if (cmd === "olhar" || cmd === "olhar ao redor") {
    await print("\n" + rooms[current_room].detalhes);

    await print("\nCaminhos disponíveis:");

    for (let comando in rooms[current_room].comandos) {
      let destino = rooms[current_room].comandos[comando];
      await print("- " + comando + " -> " + destino);
    }

    if (current_room === "telefone_publico") {
      await print("\nO telefone público está tocando sem parar.");
      await print("\nVocê pode:");
      await print("- atender telefone");
      await print("- desligar chamada");

      if (telefone_desligado) {
        await print("- voltar ao telefone");
      }
    } else if (current_room === "floresta_trilha") {
      await print("\nVocê escuta galhos quebrando atrás de você...");
    } else if (current_room === "delegacia") {
      await print("\nExiste um rádio velho emitindo estática.");
    } else if (current_room === "corredor_a") {
      await print(
        "\nAs luzes vermelhas piscam enquanto algo parece respirar nas sombras.",
      );
    } else if (current_room === "portal") {
      distorcerTela();
      await print("\nA realidade parece distorcida perto do portal.");
    }

    if (current_room === "diretoria" && !audioPortaTocou) {
      audioPortaTocou = true;

      // Toca o áudio da porta quebrando
      const portaAudio = new Audio();
      portaAudio.src = "sounds/porta_quebrando.wav";
      portaAudio.volume = 0.7;
      portaAudio.play().catch(() => {});

      await print(
        "\n💥 CRACK! VOCÊ OUVE ALGO BATENDO FORTE ATRÁS DE UMA PORTA! 💥",
      );
      await print("\nParece que tem algo preso em uma salinha nos fundos...");
      await print("\nA madeira range... os batidos ficam mais intensos...");
      await print(
        "\n📌 Uma pequena porta de madeira está trancada no fundo da sala.",
      );
    }

    // ==========================================
    // MOSTRA OS ITENS DA SALA AO OLHAR
    // ==========================================
    let itensSala = rooms[current_room].itens;
    if (itensSala.length > 0) {
      await print("\n📦 Itens visíveis:");
      for (let i = 0; i < itensSala.length; i++) {
        await print("- " + itensSala[i]);
      }
      await print(
        "\nUse 'pegar [numero]' ou 'pegar [nome]' para pegar um item.",
      );
    }
  }

  // =========================
  // COMANDO ATENDER TELEFONE
  // =========================
  else if (cmd === "atender telefone") {
    if (current_room === "telefone_publico") {
      telefone_desligado = false;

      await print("\nVocê atende o telefone...");
      await print("\nPor alguns segundos, só existe estática.");
      await print("\nEntão uma voz feminina desesperada começa a falar...");

      tocarMensagemTelefone();
    } else {
      await print("\nNão há telefone aqui.");
    }
  }

  // =========================
  // COMANDO DESLIGAR CHAMADA
  // =========================
  else if (cmd === "desligar chamada") {
    if (current_room === "telefone_publico") {
      pararTelefone();

      mensagemAudio.pause();
      mensagemAudio.currentTime = 0;

      telefone_desligado = true;

      await print("\nVocê desliga o telefone.");
      await print("\nO silêncio dura apenas alguns segundos...");
      await print(
        "\nEntão o telefone volta a tocar violentamente atrás de você.",
      );
      await print("\nNovo comando disponível:");
      await print("- voltar ao telefone");

      voltarSomAmbiente();
    } else {
      await print("\nNão há chamada para desligar.");
    }
  }

  // =========================
  // COMANDO VOLTAR AO TELEFONE
  // =========================
  else if (cmd === "voltar ao telefone") {
    if (current_room === "telefone_publico" && telefone_desligado) {
      telefone_desligado = false;

      await print("\nVocê se aproxima lentamente do telefone...");
      await print("\nO toque parece ainda mais alto agora.");

      tocarTelefone();
    } else {
      await print("\nNada aconteceu.");
    }
  }

  // ==========================================
  // COMANDO OLHAR ITENS (mostra itens da sala)
  // ==========================================
  else if (cmd === "olhar itens" || cmd === "itens aqui") {
    let itensSala = rooms[current_room].itens;

    if (itensSala.length > 0) {
      await print("\nItens encontrados nesta sala:");
      for (let i = 0; i < itensSala.length; i++) {
        await print(i + 1 + " - " + itensSala[i]);
      }
      await print(
        "\nUse 'pegar [numero]' ou 'pegar [nome]' para pegar um item.",
      );
    } else {
      await print("\nNão há itens aqui.");
    }
  }

  // ==========================================
  // COMANDO PEGAR ITEM (com número ou nome)
  // ==========================================
  else if (cmd.startsWith("pegar ")) {
    let alvo = cmd.replace("pegar ", "").trim();
    let itensSala = rooms[current_room].itens;

    if (itensSala.length === 0) {
      await print("\nNão há itens aqui para pegar.");
    } else {
      let itemPegar = null;
      let itemIndex = -1;

      // Verifica se é um número (ex: "pegar 1")
      if (!isNaN(alvo) && alvo > 0 && alvo <= itensSala.length) {
        itemIndex = parseInt(alvo) - 1;
        itemPegar = itensSala[itemIndex];
      }
      // Verifica se é o nome do item (ex: "pegar mapa")
      else {
        itemIndex = itensSala.findIndex((item) => item === alvo);
        if (itemIndex !== -1) {
          itemPegar = itensSala[itemIndex];
        }
      }

      if (!itemPegar) {
        await print("\nEsse item não está aqui.");
        await print("Use 'olhar itens' para ver o que tem na sala.");
      } else {
        // Remove o item da sala e adiciona no inventário
        itensSala.splice(itemIndex, 1);
        inventory.push(itemPegar);
        await print("\nVocê pegou: " + itemPegar);
      }
    }
  }

  // Fallback para "pegar item" sozinho (sem argumento)
  else if (cmd === "pegar item") {
    let itensSala = rooms[current_room].itens;

    if (itensSala.length === 0) {
      await print("\nNão há itens aqui.");
    } else if (itensSala.length === 1) {
      // Só um item, pega direto
      let item = itensSala.shift();
      inventory.push(item);
      await print("\nVocê pegou: " + item);
    } else {
      // Vários itens, mostra lista
      await print("\nItens encontrados nesta sala:");
      for (let i = 0; i < itensSala.length; i++) {
        await print(i + 1 + " - " + itensSala[i]);
      }
      await print(
        "\nUse 'pegar [numero]' ou 'pegar [nome]' para pegar um item.",
      );
    }
  }
  // ==========================================
  // COMANDO INVENTARIO (com números)
  // ==========================================
  else if (cmd === "inventario") {
    if (inventory.length > 0) {
      await print("\n==================================================");
      await print("INVENTÁRIO:");
      await print("==================================================");

      for (let i = 0; i < inventory.length; i++) {
        await print(i + 1 + " - " + inventory[i]);
      }

      await print("\nUse 'usar [numero]' para usar um item.");
      await print("Exemplo: 'usar 1'");
    } else {
      await print("\nSeu inventário está vazio.");
    }
  }

  // ==========================================
  // COMANDO USAR (com número ou nome)
  // ==========================================
  else if (cmd.startsWith("usar ")) {
    let alvo = cmd.replace("usar ", "").trim();
    let itemUsar = null;
    let itemIndex = -1;

    // Verifica se é um número (ex: "usar 1")
    if (!isNaN(alvo) && alvo > 0 && alvo <= inventory.length) {
      itemIndex = parseInt(alvo) - 1;
      itemUsar = inventory[itemIndex];
    }
    // Verifica se é o nome do item (ex: "usar radar")
    else {
      itemIndex = inventory.findIndex((item) => item === alvo);
      if (itemIndex !== -1) {
        itemUsar = inventory[itemIndex];
      }
    }

    if (!itemUsar) {
      await print("\nVocê não possui esse item.");
    } else {
      // PROCESSA O USO DO ITEM
      let usou = false;

      // === RADAR ===
      if (itemUsar === "radar de mao") {
        if (!radarDesbloqueado) {
          await print("\nO radar está bloqueado por senha.");
          await print("Use 'desbloquear radar 011' primeiro.");
        } else {
          await ativarRadar();
          usou = true;
        }
      }

      // === FUSÍVEL ===
      else if (itemUsar === "fusivel") {
        if (current_room === "sala_eletrica" && !energia_laboratorio) {
          energia_laboratorio = true;
          await print("\nVocê instala o fusível na central elétrica...");
          await print("\nAs luzes do laboratório voltam lentamente.");
          await print("\nPortas eletrônicas destravam em algum lugar.");
          inventory.splice(itemIndex, 1);
          usou = true;
        } else if (current_room !== "sala_eletrica") {
          await print(
            "\nVocê precisa estar na sala elétrica para usar o fusível.",
          );
        } else {
          await print("\nA energia já foi restaurada.");
        }
      }

      // === MOEDA ===
      else if (itemUsar === "moeda") {
        if (current_room === "telefone_publico") {
          await print("\nA moeda cai dentro do telefone.");
          await print(
            "\nMas a chamada já estava acontecendo antes de você chegar...",
          );
          usou = true;
        } else {
          await print("\nNão há onde usar a moeda aqui.");
        }
      }

      // === MAPA ===
      else if (itemUsar === "mapa") {
        await print("\nVocê olha para o mapa de Hawkins.");
        await print("\nAs principais localizações estão marcadas:");
        await print("- Praça central");
        await print("- Rua principal");
        await print("- Floresta");
        await print("- Laboratório Hawkins");
        usou = true;
      }

      // === BILHETE ===
      else if (itemUsar === "bilhete") {
        await print("\n📜 O BILHETE DIZ:");
        await print("\n═══════════════════════════════════════");
        await print("\n'Se você está lendo isso, já sabe a verdade.'");
        await print("\n''");
        await print("\n'A PORTA VERMELHA ESTÁ TRANCADA.'");
        await print("\n'A chave está comigo.'");
        await print("\n'Me encontre na sala de testes.'");
        await print("\n''");
        await print("\n'Não entre sozinho na diretoria.'");
        await print("\n'Ele está lá dentro.'");
        await print("\n''");
        await print("\n'A energia do subsolo mantém o portal.'");
        await print("\n'Restaure a energia antes que seja tarde.'");
        await print("\n''");
        await print("\n' - Técnico Dr. Owens'");
        await print("\n═══════════════════════════════════════");
        await print("\n💡 DICA: Procure pelo TÉCNICO na SALA DE TESTES.");
        usou = true;
      }

      // === DOCUMENTO DA DIRETORIA ===
      else if (itemUsar === "documento da diretoria") {
        await print("\n📄 DOCUMENTO CONFIDENCIAL - DIRETORIA");
        await print("\n═══════════════════════════════════════");
        await print("\n'PROJETO UPsIDE DOWN - RELATÓRIO FINAL'");
        await print("\n''");
        await print("\n'A fenda foi aberta em 6 de novembro.'");
        await print("\n'As leituras de radiação são anormais.'");
        await print("\n''");
        await print("\n'RELATO DO DIRETOR: Algo voltou.'");
        await print("\n'Não sei o que é. Não sei como descrever.'");
        await print("\n''");
        await print("\n'Recomendo o FECHAMENTO IMEDIATO do portal.'");
        await print("\n'O laboratório não é mais seguro.'");
        await print("\n''");
        await print("\n' - Dr. Brenner'");
        await print("\n═══════════════════════════════════════");
        await print(
          "\n👀 Atrás do vidro blindado, os batidos ficam mais fortes...",
        );
        usou = true;
      }

      // === ANOTAÇÃO RASGADA ===
      else if (itemUsar === "anotacao rasgada") {
        await print("\n📜 ANOTAÇÃO RASGADA:");
        await print("\n═══════════════════════════════════════");
        await print("\n'Ele conseguiu passar pelo vidro...'");
        await print("\n''");
        await print("\n'Os seguranças tentaram conter.'");
        await print("\n'Não adiantou nada.'");
        await print("\n''");
        await print("\n'Quem estiver lendo isso: FUJA.'");
        await print("\n'Não olhe para trás.'");
        await print("\n''");
        await print("\n' - (resto do papel está queimado)'");
        await print("\n═══════════════════════════════════════");
        usou = true;
      }

      // === BATALHÃO DE ITENS QUE AINDA NÃO TÊM USO ===
      else {
        await print("\nNada aconteceu.");
        await print(
          "\n(Dica: " + itemUsar + " não tem uma função específica ainda.)",
        );
      }
    }
  }

  // ==========================================
  // COMANDO STATUS / MAPA (mostra informações completas)
  // ==========================================
  else if (cmd === "status" || cmd === "mapa" || cmd === "info") {
    await mostrar_status();
  }

  // ==========================================
  // COMANDOS DO RADAR
  // ==========================================
  else if (cmd === "usar radar" || cmd === "ativar radar") {
    await ativarRadar();
  } else if (cmd === "desligar radar") {
    if (radarAtivo) {
      await desligarRadar();
    } else {
      await print("\nO radar já está desligado.");
    }
  } else if (cmd.startsWith("desbloquear radar ")) {
    let codigo = cmd.replace("desbloquear radar ", "");
    await desbloquearRadar(codigo);
  }

  // ==========================================
  // COMANDO ABRIR PORTA
  // ==========================================
  else if (cmd === "abrir porta") {
    if (current_room === "porta_vermelha") {
      if (inventory.includes("chave do tecnico")) {
        await print("\n🔑 VOCÊ USA A CHAVE DO TÉCNICO... 🔑");
        await print("\nA fechadura range, mas a porta se abre!");
        await print("\n═══════════════════════════════════════");
        await print("\n❌ A PORTA VERMELHA ESTÁ ABERTA! ❌");
        await print(
          "\nMas a mulher do telefone avisou para não entrar sozinho...",
        );
        await print("\nDentro da sala, você vê algo se movendo na escuridão.");
        await print("\n═══════════════════════════════════════");

        // Muda a sala para a nova área
        current_room = "diretoria";
        tocarSom(rooms[current_room].som);
        await print("\n" + rooms[current_room].descricao);
        if (radarAtivo) desenharRadar();
      } else {
        await print("\n🔒 A PORTA ESTÁ TRANCADA. 🔒");
        await print("\nO bilhete diz que a chave está com um técnico.");
        await print("\nProcure pelo técnico em algum lugar do laboratório.");
      }
    } else {
      await print("\nNão há nenhuma porta para abrir aqui.");
    }
  }

  // ==========================================
  // COMANDOS DO ELEVADOR
  // ==========================================
  else if (cmd === "usar elevador") {
    if (
      current_room === "recepcao_lab" ||
      current_room === "laboratorio_andar1" ||
      current_room === "laboratorio_andar2" ||
      current_room === "laboratorio_andar3" ||
      current_room === "subsolo"
    ) {
      current_room = "elevador_lab";
      tocarSom(rooms[current_room].som);
      await print("\n🔘 VOCÊ ENTROU NO ELEVADOR 🔘");
      await print("\nAs portas se fecham lentamente...");
      await print("\nPainel de controle:");
      await print("- ir para andar 1");
      await print("- ir para andar 2");
      await print("- ir para andar 3");
      await print("- ir para subsolo");
      await print("- sair do elevador");

      if (radarAtivo) desenharRadar();
    } else {
      await print("\nNão há elevador aqui.");
    }
  } else if (cmd === "sair do elevador") {
    if (current_room === "elevador_lab") {
      current_room = "recepcao_lab";
      tocarSom(rooms[current_room].som);
      await print("\nVocê sai do elevador.");
      await print("\n" + rooms[current_room].descricao);
      if (radarAtivo) desenharRadar();
    } else {
      await print("\nVocê não está em um elevador.");
    }
  } else if (cmd === "ir para andar 1" || cmd === "ir para o andar 1") {
    if (current_room === "elevador_lab") {
      current_room = "laboratorio_andar1";
      tocarSom(rooms[current_room].som);
      await print("\n🔘 INDO PARA O ANDAR 1... 🔘");
      await print("\nO elevador se move suavemente...");
      await print("\n" + rooms[current_room].descricao);
      if (radarAtivo) desenharRadar();
    } else {
      await print("\nVocê não está em um elevador.");
    }
  } else if (cmd === "ir para andar 2" || cmd === "ir para o andar 2") {
    if (current_room === "elevador_lab") {
      current_room = "laboratorio_andar2";
      tocarSom(rooms[current_room].som);
      await print("\n🔘 INDO PARA O ANDAR 2... 🔘");
      await print("\nO elevador se move suavemente...");
      await print("\n" + rooms[current_room].descricao);
      if (radarAtivo) desenharRadar();
    } else {
      await print("\nVocê não está em um elevador.");
    }
  } else if (cmd === "ir para andar 3" || cmd === "ir para o andar 3") {
    if (current_room === "elevador_lab") {
      current_room = "laboratorio_andar3";
      tocarSom(rooms[current_room].som);
      await print("\n🔘 INDO PARA O ANDAR 3... 🔘");
      await print("\nO elevador se move suavemente...");
      await print("\n" + rooms[current_room].descricao);
      if (radarAtivo) desenharRadar();
    } else {
      await print("\nVocê não está em um elevador.");
    }
  } else if (cmd === "ir para subsolo" || cmd === "ir para o subsolo") {
    if (current_room === "elevador_lab") {
      current_room = "subsolo";
      tocarSom(rooms[current_room].som);
      await print("\n🔘 INDO PARA O SUBSOLO... 🔘");
      await print("\nO elevador desce profundamente...");
      await print("\nAs luzes piscam enquanto você desce...");
      await print("\n" + rooms[current_room].descricao);
      if (radarAtivo) desenharRadar();
    } else {
      await print("\nVocê não está em um elevador.");
    }
  }

  // ==========================================
  // COMANDO VOLTAR PARA (atalho para andar)
  // ==========================================
  else if (cmd.startsWith("voltar para ")) {
    let destino = cmd.replace("voltar para ", "").trim();
    let encontrou = false;
    let direcaoEncontrada = "";

    // Procura em qual direção fica o destino
    for (let comando in rooms[current_room].comandos) {
      if (rooms[current_room].comandos[comando] === destino) {
        encontrou = true;
        direcaoEncontrada = comando.replace("andar para o ", "");
        break;
      }
    }

    if (encontrou) {
      await mover(direcaoEncontrada);
    } else {
      await print(
        "\nVocê não pode voltar para " + destino + " a partir daqui.",
      );
      await print("\nCaminhos disponíveis:");
      for (let comando in rooms[current_room].comandos) {
        let destinoSala = rooms[current_room].comandos[comando];
        await print("- " + comando + " -> " + destinoSala);
      }
    }
  }

  // ==========================================
  // COMANDO IR PARA (sinônimo de voltar para)
  // ==========================================
  else if (cmd.startsWith("ir para ")) {
    let destino = cmd.replace("ir para ", "").trim();
    let encontrou = false;
    let direcaoEncontrada = "";

    for (let comando in rooms[current_room].comandos) {
      if (rooms[current_room].comandos[comando] === destino) {
        encontrou = true;
        direcaoEncontrada = comando.replace("andar para o ", "");
        break;
      }
    }

    if (encontrou) {
      await mover(direcaoEncontrada);
    } else {
      await print("\nVocê não pode ir para " + destino + " a partir daqui.");
    }
  }

  // ==========================================
  // COMANDO TP DEBUG (teleporte para salas)
  // ==========================================
  else if (cmd === "tp subsolo") {
    current_room = "subsolo";
    tocarSom(rooms[current_room].som);
    atualizarPiscadas();
    atualizarPortalVisual();
    if (radarAtivo) desenharRadar();
    await print("\n[DEBUG] Teletransportado para o subsolo.");
    await print("\n" + rooms[current_room].descricao);
  } else if (cmd === "tp delegacia") {
    current_room = "delegacia";
    tocarSom(rooms[current_room].som);
    atualizarPiscadas();
    atualizarPortalVisual();
    if (radarAtivo) desenharRadar();
    await print("\n[DEBUG] Teletransportado para a delegacia.");
    await print("\n" + rooms[current_room].descricao);
  } else if (cmd === "tp radar") {
    // Vai para delegacia
    current_room = "delegacia";
    tocarSom(rooms[current_room].som);
    atualizarPiscadas();
    atualizarPortalVisual();

    // Adiciona o radar no inventário se não tiver
    if (!inventory.includes("radar de mao")) {
      inventory.push("radar de mao");
      await print("\n[DEBUG] Radar de mão adicionado ao inventário.");
    }

    // Desbloqueia o radar
    radarDesbloqueado = true;
    await print("\n[DEBUG] Radar desbloqueado (senha 011 já foi usada).");

    // Atualiza o radar se estiver ativo
    if (radarAtivo) {
      desenharRadar();
    }

    await print("\n[DEBUG] Teletransportado para a delegacia.");
    await print(
      "\nO radar está pronto para uso! Digite 'usar radar' para ativar.",
    );
    await print("\n" + rooms[current_room].descricao);
  }

  // ==========================================
  // COMANDO TP (teleporte para qualquer sala)
  // ==========================================
  else if (cmd.startsWith("tp ")) {
    let destino = cmd.replace("tp ", "").trim();

    if (rooms[destino]) {
      current_room = destino;
      tocarSom(rooms[current_room].som);
      atualizarPiscadas();
      atualizarPortalVisual();
      if (radarAtivo) desenharRadar();
      await print("\n[DEBUG] Teleportado para: " + destino);
      await print("\n" + rooms[current_room].descricao);
    } else {
      await print("\nSala não encontrada: " + destino);
    }
  }

  // =========================
  // COMANDO DESCONHECIDO
  // =========================
  else {
    await print("\nComando desconhecido.");
  }

  input.disabled = false;
  input.focus();
});

// ==============================================
// SISTEMA DE RADAR
// ==============================================

// Estado do radar
let radarDesbloqueado = false;
let radarAtivo = false;
let radarInterval = null;
let sweepAngle = 0;

// Pega o elemento do radar
const radarWindow = document.getElementById("radarWindow");
const radarCanvas = document.getElementById("radarCanvas");
const radarCtx = radarCanvas.getContext("2d");
const radarStatusSpan = document.getElementById("radarStatus");
const radarCoordsSpan = document.getElementById("radarCoords");

// ==============================================
// COORDENADAS DE CADA SALA NO RADAR (CORRIGIDAS)
// ==============================================
const radarCoordsMap = {
  // CENTRO (praça é o centro)
  praca_hawkins: { x: 175, y: 175, nome: "PRAÇA" },

  // NORTE (y menor)
  rua_principal: { x: 175, y: 130, nome: "RUA" },
  floresta_trilha: { x: 175, y: 80, nome: "FLORESTA" },
  clareira: { x: 175, y: 50, nome: "CLAREIRA" },
  lago_floresta: { x: 140, y: 50, nome: "LAGO" },
  cabana: { x: 210, y: 60, nome: "CABANA" },
  andar_superior_cabana: { x: 215, y: 55, nome: "CABANA SUP" },

  // SUL (y maior)
  arcade: { x: 150, y: 220, nome: "ARCADE" },
  sala_maquinas_arcade: { x: 140, y: 240, nome: "MAQUINAS" },
  cinema_abandonado: { x: 200, y: 230, nome: "CINEMA" },
  sala_projecao: { x: 210, y: 220, nome: "PROJEÇÃO" },

  // LESTE (x maior)
  telefone_publico: { x: 230, y: 175, nome: "TELEFONE" },
  delegacia: { x: 260, y: 160, nome: "DELEGACIA" },
  sala_interrogatorio: { x: 280, y: 155, nome: "INTERROG" },
  sala_evidencias: { x: 260, y: 140, nome: "EVIDÊNCIAS" },
  hospital: { x: 250, y: 110, nome: "HOSPITAL" },
  ala_interditada: { x: 255, y: 95, nome: "ALA" },

  // OESTE (x menor)
  mercado: { x: 120, y: 180, nome: "MERCADO" },
  deposito_mercado: { x: 100, y: 190, nome: "DEPÓSITO" },
  zona_residencial: { x: 80, y: 150, nome: "RESIDENCIAL" },
  igreja: { x: 60, y: 130, nome: "IGREJA" },
  sacristia: { x: 50, y: 120, nome: "SACRISTIA" },
  casa_abandonada: { x: 70, y: 170, nome: "CASA" },
  quarto_infantil: { x: 65, y: 160, nome: "QUARTO" },
  porao_casa: { x: 70, y: 185, nome: "PORÃO" },
  posto_gasolina: { x: 90, y: 100, nome: "POSTO" },

  // BORDA E ESGOTO
  borda_cidade: { x: 110, y: 70, nome: "BORDA" },
  estacao_eletrica: { x: 80, y: 60, nome: "ESTAÇÃO" },
  esgoto_entrada: { x: 150, y: 280, nome: "ESGOTO" },
  tunel_esgoto: { x: 160, y: 310, nome: "TÚNEL" },

  // LABORATÓRIO (nordeste)
  laboratorio_entrada: { x: 290, y: 80, nome: "LAB ENT" },
  recepcao_lab: { x: 295, y: 95, nome: "RECEPÇÃO" },
  sala_testes: { x: 280, y: 105, nome: "TESTES" },
  sala_eletrica: { x: 310, y: 105, nome: "ELÉTRICA" },
  corredor_a: { x: 300, y: 125, nome: "CORREDOR" },
  sala_confinamento: { x: 320, y: 125, nome: "CONFINA" },
  subsolo: { x: 300, y: 155, nome: "SUBSOLO" },
  portal: { x: 300, y: 185, nome: "PORTAL" },
};

// ==============================================
// FUNÇÃO QUE DESENHA O RADAR
// ==============================================
function desenharRadar() {
  if (!radarAtivo || !radarCanvas || !radarCtx) return;

  // Tamanho fixo do radar
  radarCanvas.width = 350;
  radarCanvas.height = 350;

  const ctx = radarCtx;
  const w = 350;
  const h = 350;
  const centerX = 175;
  const centerY = 175;
  const maxRaio = 140;

  // Fundo preto
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // Ruído leve
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < 0.01) {
      data[i] = data[i + 1] = data[i + 2] = Math.random() * 20;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Círculos concêntricos
  ctx.strokeStyle = "#00ff66";
  ctx.lineWidth = 1;
  for (let r = 35; r <= maxRaio; r += 35) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Eixos
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - maxRaio);
  ctx.lineTo(centerX, centerY + maxRaio);
  ctx.moveTo(centerX - maxRaio, centerY);
  ctx.lineTo(centerX + maxRaio, centerY);
  ctx.stroke();

  // Linhas diagonais
  ctx.beginPath();
  ctx.moveTo(centerX - maxRaio, centerY - maxRaio);
  ctx.lineTo(centerX + maxRaio, centerY + maxRaio);
  ctx.moveTo(centerX + maxRaio, centerY - maxRaio);
  ctx.lineTo(centerX - maxRaio, centerY + maxRaio);
  ctx.stroke();

  // Sweep girando
  const sweepRad = (sweepAngle * Math.PI) / 180;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, maxRaio, sweepRad - 0.3, sweepRad);
  ctx.fillStyle = "rgba(0, 255, 102, 0.06)";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  const endX = centerX + Math.cos(sweepRad) * maxRaio;
  const endY = centerY + Math.sin(sweepRad) * maxRaio;
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = "rgba(0, 255, 102, 0.5)";
  ctx.stroke();

  // === DESENHA TODAS AS CONSTRUÇÕES ===
  const currentPos = radarCoordsMap[current_room];

  if (currentPos) {
    // Calcula offset para centralizar o jogador
    const offsetX = centerX - currentPos.x;
    const offsetY = centerY - currentPos.y;

    // Desenha cada construção
    for (const [roomId, coords] of Object.entries(radarCoordsMap)) {
      let drawX = coords.x + offsetX;
      let drawY = coords.y + offsetY;

      // Só desenha se estiver dentro da tela
      if (drawX > -50 && drawX < w + 50 && drawY > -50 && drawY < h + 50) {
        let isDistorted = current_room === "portal";
        let size = isDistorted ? 10 : 6;

        // Desenha o quadrado da construção
        ctx.fillStyle = isDistorted ? "#ff4444" : "#00ff66";
        ctx.fillRect(drawX - size / 2, drawY - size / 2, size, size);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(drawX - size / 2, drawY - size / 2, size, size);

        // Desenha o nome da construção
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillStyle = isDistorted ? "#ff8888" : "#88ff88";
        ctx.shadowBlur = 2;
        ctx.shadowColor = "#00ff66";
        ctx.fillText(coords.nome, drawX + 8, drawY - 3);
        ctx.shadowBlur = 0;
      }
    }
  }

  // === PONTO VERMELHO DO JOGADOR ===
  const blipIntensity = 0.5 + Math.sin(Date.now() * 0.008) * 0.5;

  ctx.shadowBlur = 12;
  ctx.shadowColor = "#ff0000";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10 + blipIntensity * 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 0, 0, ${0.3 + blipIntensity * 0.2})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 50, 0, 0.9)`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.shadowBlur = 0;

  // === ATUALIZA RODAPÉ ===
  if (currentPos) {
    radarCoordsSpan.innerHTML = `${currentPos.nome}`;
    radarStatusSpan.innerHTML = "◉ ONLINE";
    radarStatusSpan.style.color = "#00ff66";
  } else {
    radarCoordsSpan.innerHTML = `---`;
    radarStatusSpan.innerHTML = "⚠ OFFLINE";
    radarStatusSpan.style.color = "#ff4444";
  }

  // === EFEITO PORTAL ===
  if (current_room === "portal") {
    radarWindow.classList.add("distorcendo");
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.2})`;
      ctx.fillRect(0, Math.random() * h, w, 2 + Math.random() * 3);
    }
  } else {
    radarWindow.classList.remove("distorcendo");
  }
}

// ==============================================
// ANIMAÇÃO DO RADAR
// ==============================================
function iniciarAnimacaoRadar() {
  if (radarInterval) clearInterval(radarInterval);

  radarInterval = setInterval(() => {
    if (radarAtivo) {
      sweepAngle = (sweepAngle + 4) % 360;
      desenharRadar();
    }
  }, 60);
}

function pararAnimacaoRadar() {
  if (radarInterval) {
    clearInterval(radarInterval);
    radarInterval = null;
  }
}

// ==============================================
// FUNÇÕES DE CONTROLE DO RADAR
// ==============================================
async function ativarRadar() {
  if (!radarDesbloqueado) {
    await print("\nO radar está protegido por senha.");
    await print("\nUse 'desbloquear radar [codigo]' para ativar.");
    return false;
  }

  if (!inventory.includes("radar de mao")) {
    await print("\nVocê não possui o radar de mão.");
    await print("\nProcure pelo equipamento perdido em Hawkins.");
    return false;
  }

  radarAtivo = true;
  radarWindow.classList.remove("hidden");
  iniciarAnimacaoRadar();
  await print("\n📡 RADAR ATIVADO 📡");
  await print("\nO scanner militar começa a girar...");
  desenharRadar();
  return true;
}

async function desligarRadar() {
  radarAtivo = false;
  radarWindow.classList.add("hidden");
  pararAnimacaoRadar();
  await print("\nRadar desligado.");
}

async function desbloquearRadar(codigo) {
  if (codigo === "011") {
    radarDesbloqueado = true;
    await print("\n🔓 SISTEMA DESBLOQUEADO! 🔓");
    await print("\nO radar militar está pronto para uso.");
    await print("\nUse 'usar radar' ou 'ativar radar' para ligar.");
    return true;
  } else {
    await print("\n❌ SENHA INCORRETA ❌");
    await print("\nO sistema recusou o acesso.");
    return false;
  }
}

// ==============================================
// EFEITOS AUTOMÁTICOS
// ==============================================
setInterval(() => {
  const chance = Math.random();

  if (chance < 0.08) {
    glitchTela();
  }
}, 3000);

setInterval(() => {
  if (current_room === "portal") {
    distorcerTela();
  }
}, 3000);

setInterval(() => {
  if (current_room === "portal") {
    audio.volume = 0.12;

    setTimeout(() => {
      audio.volume = 0.4;
    }, 900);
  }
}, 6000);
