const screen = document.getElementById("screen");
const input = document.getElementById("cmd");

// =========================
// ÁUDIO
// =========================
const audio = new Audio();
audio.loop = true;
audio.volume = 0.4;

const telefoneAudio = new Audio();
telefoneAudio.loop = true;
telefoneAudio.volume = 0.6;

const mensagemAudio = new Audio();
mensagemAudio.loop = false;
mensagemAudio.volume = 0.8;

// =========================
// TERMINAL EFFECT
// =========================
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

// =========================
// SOM
// =========================
function tocarSom(nome) {
    telefoneAudio.pause();
    telefoneAudio.currentTime = 0;

    mensagemAudio.pause();
    mensagemAudio.currentTime = 0;

    audio.pause();
    audio.src = "sounds/" + nome;
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(() => {});
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

    mensagemAudio.onended = function() {
        voltarSomAmbiente();
    };
}

// =========================
// ESTADO
// =========================
let player_name = "";
let inventory = [];
let current_room = "praca_hawkins";

let esperando_nome = true;
let energia_laboratorio = false;
let telefone_desligado = false;

// =========================
// MAPA
// =========================
const rooms = {

    praca_hawkins: {
        som: "cidade.wav",
        itens: ["mapa"],

        descricao:
        "Você está na praça principal de Hawkins. A névoa cobre as ruas.",

        detalhes:
        "As luzes piscam enquanto o vento sopra entre os carros abandonados.",

        comandos: {
            "andar para o norte": "rua_principal",
            "andar para o leste": "telefone_publico",
            "andar para o oeste": "mercado"
        }
    },

    rua_principal: {
        som: "cidade.wav",
        itens: [],

        descricao:
        "Você chegou na rua principal de Hawkins.",

        detalhes:
        "Lojas destruídas cercam a avenida silenciosa.",

        comandos: {
            "andar para o sul": "praca_hawkins",
            "andar para o norte": "floresta_trilha",
            "andar para o leste": "delegacia"
        }
    },

    telefone_publico: {
        som: "cidade.wav",
        itens: ["moeda"],

        descricao:
        "Um telefone público antigo toca sem parar no meio da rua vazia.",

        detalhes:
        "O telefone toca violentamente. A cada toque, a estática parece ficar mais alta.",

        comandos: {
            "andar para o oeste": "praca_hawkins"
        }
    },

    mercado: {
        som: "cidade.wav",
        itens: ["bateria"],

        descricao:
        "O mercado foi saqueado.",

        detalhes:
        "Prateleiras caídas bloqueiam parte da passagem.",

        comandos: {
            "andar para o leste": "praca_hawkins"
        }
    },

    delegacia: {
        som: "cidade.wav",
        itens: ["chave enferrujada"],

        descricao:
        "A delegacia está abandonada.",

        detalhes:
        "Papéis cobrem o chão enquanto um rádio chia sem parar.",

        comandos: {
            "andar para o oeste": "rua_principal",
            "andar para o norte": "sala_evidencias"
        }
    },

    sala_evidencias: {
        som: "cidade.wav",
        itens: ["fusivel"],

        descricao:
        "Você entrou na sala de evidências.",

        detalhes:
        "Armários metálicos batem lentamente.",

        comandos: {
            "andar para o sul": "delegacia"
        }
    },

    floresta_trilha: {
        som: "floresta.wav",
        itens: [],

        descricao:
        "Você entrou na trilha da floresta.",

        detalhes:
        "Algo se move entre as árvores escuras.",

        comandos: {
            "andar para o sul": "rua_principal",
            "andar para o norte": "clareira",
            "andar para o leste": "cabana"
        }
    },

    clareira: {
        som: "floresta.wav",
        itens: ["pe de cabra"],

        descricao:
        "Uma clareira silenciosa surge no meio da floresta.",

        detalhes:
        "Existe sangue seco perto de uma árvore caída.",

        comandos: {
            "andar para o sul": "floresta_trilha"
        }
    },

    cabana: {
        som: "casa.wav",
        itens: ["cartao nivel 2"],

        descricao:
        "Você entrou em uma cabana velha.",

        detalhes:
        "A madeira range enquanto algo bate no andar de cima.",

        comandos: {
            "andar para o oeste": "floresta_trilha",
            "andar para o norte": "laboratorio_entrada"
        }
    },

    laboratorio_entrada: {
        som: "laboratorio.wav",
        itens: [],

        descricao:
        "Você está na entrada do Laboratório Hawkins.",

        detalhes:
        "Portas metálicas bloqueiam o corredor principal.",

        comandos: {
            "andar para o sul": "cabana",
            "andar para o norte": "recepcao_lab"
        }
    },

    recepcao_lab: {
        som: "laboratorio.wav",
        itens: [],

        descricao:
        "A recepção do laboratório está destruída.",

        detalhes:
        "Monitores quebrados ainda piscam na escuridão.",

        comandos: {
            "andar para o sul": "laboratorio_entrada",
            "andar para o leste": "sala_eletrica",
            "andar para o norte": "corredor_a"
        }
    },

    sala_eletrica: {
        som: "laboratorio.wav",
        itens: [],

        descricao:
        "Você entrou na sala elétrica.",

        detalhes:
        "Cabos queimados cobrem o chão.",

        comandos: {
            "andar para o oeste": "recepcao_lab"
        }
    },

    corredor_a: {
        som: "laboratorio.wav",
        itens: [],

        descricao:
        "Você está no Corredor A.",

        detalhes:
        "Luzes vermelhas iluminam o corredor vazio.",

        comandos: {
            "andar para o sul": "recepcao_lab",
            "andar para o norte": "subsolo"
        }
    },

    subsolo: {
        som: "portal.wav",
        itens: [],

        descricao:
        "Você chegou ao subsolo do laboratório.",

        detalhes:
        "Algo respira dentro das paredes.",

        comandos: {
            "andar para o sul": "corredor_a",
            "andar para o norte": "portal"
        }
    },

    portal: {
        som: "portal.wav",
        itens: [],

        descricao:
        "O portal dimensional está aberto.",

        detalhes:
        "A realidade parece quebrada aqui.",

        comandos: {
            "andar para o sul": "subsolo"
        }
    }
};

// =========================
// STATUS
// =========================
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

// =========================
// MOVIMENTO
// =========================
async function mover(direcao) {
    let comando = "andar para o " + direcao;

    if (comando in rooms[current_room].comandos) {
        if (
            current_room === "laboratorio_entrada" &&
            direcao === "norte" &&
            !inventory.includes("cartao nivel 2")
        ) {
            await print("\nA porta exige um cartão de acesso nível 2.");
            return;
        }

        current_room = rooms[current_room].comandos[comando];

        if (current_room === "telefone_publico") {
            tocarTelefone();
        } else {
            tocarSom(rooms[current_room].som);
        }

    } else {
        await print("\nVocê não pode ir por esse caminho.");
    }
}

// =========================
// INTRO
// =========================
async function iniciar_jogo() {
    input.disabled = true;

    await print("==================================================");
    await print("          STRANGER THINGS RPG");
    await print("==================================================");

    await print("\nBem-vindo(a) a Hawkins...");
    await print("\nDigite seu nome para começar.");

    input.disabled = false;
    input.focus();
}

iniciar_jogo();

// =========================
// LOOP
// =========================
input.addEventListener("keydown", async function(e) {
    if (e.key !== "Enter") return;

    let cmd = input.value.trim().toLowerCase();

    input.value = "";
    input.disabled = true;

    // =========================
    // NOME
    // =========================
    if (esperando_nome) {
        player_name = cmd || "Jogador";

        esperando_nome = false;

        tocarSom(rooms[current_room].som);

        await print("\nBem-vindo(a), " + player_name + "...");

        await print("\nA cidade de Hawkins não é mais segura.");

        await print("\nPessoas desapareceram durante a madrugada.");

        await print("\nRumores dizem que o laboratório abriu algo que nunca deveria existir...");

        await mostrar_status();

        input.disabled = false;
        input.focus();

        return;
    }

    await print("\n> " + cmd);

    // =========================
    // SAIR
    // =========================
    if (cmd === "sair") {
        await print("\nEncerrando jogo...");

        audio.pause();
        telefoneAudio.pause();
        mensagemAudio.pause();

        input.disabled = true;

        return;
    }

    // =========================
    // MOVIMENTO
    // =========================
    else if (cmd.startsWith("andar para o ")) {
        let direcao = cmd.replace("andar para o ", "");
        await mover(direcao);
    }

    // =========================
    // OLHAR
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
        }

        else if (current_room === "floresta_trilha") {
            await print("\nVocê escuta galhos quebrando atrás de você...");
        }

        else if (current_room === "delegacia") {
            await print("\nExiste um rádio velho emitindo estática.");
        }

        else if (current_room === "corredor_a") {
            await print("\nAs luzes vermelhas piscam enquanto algo parece respirar nas sombras.");
        }

        else if (current_room === "portal") {
            await print("\nA realidade parece distorcida perto do portal.");
        }
    }

    // =========================
    // ATENDER TELEFONE
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
    // DESLIGAR CHAMADA
    // =========================
    else if (cmd === "desligar chamada") {
        if (current_room === "telefone_publico") {
            pararTelefone();

            mensagemAudio.pause();
            mensagemAudio.currentTime = 0;

            telefone_desligado = true;

            await print("\nVocê desliga o telefone.");

            await print("\nO silêncio dura apenas alguns segundos...");

            await print("\nEntão o telefone volta a tocar violentamente atrás de você.");

            await print("\nNovo comando disponível:");

            await print("- voltar ao telefone");

            voltarSomAmbiente();

        } else {
            await print("\nNão há chamada para desligar.");
        }
    }

    // =========================
    // VOLTAR AO TELEFONE
    // =========================
    else if (cmd === "voltar ao telefone") {
        if (
            current_room === "telefone_publico" &&
            telefone_desligado
        ) {
            telefone_desligado = false;

            await print("\nVocê se aproxima lentamente do telefone...");

            await print("\nO toque parece ainda mais alto agora.");

            tocarTelefone();

        } else {
            await print("\nNada aconteceu.");
        }
    }

    // =========================
    // PEGAR ITEM
    // =========================
    else if (cmd === "pegar item") {
        let itens = rooms[current_room].itens;

        if (itens.length > 0) {
            let item = itens.shift();

            inventory.push(item);

            await print("\nVocê pegou: " + item);

        } else {
            await print("\nNão há itens aqui.");
        }
    }

    // =========================
    // INVENTÁRIO
    // =========================
    else if (cmd === "inventario") {
        if (inventory.length > 0) {
            await print("\nInventário:");

            for (let item of inventory) {
                await print("- " + item);
            }

        } else {
            await print("\nSeu inventário está vazio.");
        }
    }

    // =========================
    // USAR ITEM
    // =========================
    else if (cmd === "usar item") {
        if (
            current_room === "sala_eletrica" &&
            inventory.includes("fusivel") &&
            !energia_laboratorio
        ) {
            energia_laboratorio = true;

            await print("\nVocê instala o fusível na central elétrica...");

            await print("\nAs luzes do laboratório voltam lentamente.");

            await print("\nPortas eletrônicas destravam em algum lugar.");

        }

        else if (
            current_room === "telefone_publico" &&
            inventory.includes("moeda")
        ) {
            await print("\nA moeda cai dentro do telefone.");

            await print("\nMas a chamada já estava acontecendo antes de você chegar...");
        }

        else {
            await print("\nNada aconteceu.");
        }
    }

    // =========================
    // DESCONHECIDO
    // =========================
    else {
        await print("\nComando desconhecido.");
    }

    await mostrar_status();

    input.disabled = false;
    input.focus();
});