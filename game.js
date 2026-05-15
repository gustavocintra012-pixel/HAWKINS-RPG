const screen = document.getElementById("screen");
const input = document.getElementById("cmd");

function print(text) {
    screen.innerText += text + "\n";
    screen.scrollTop = screen.scrollHeight;
}

// =========================
// ESTADO DO JOGO
// =========================
let player_name = "";
let inventory = [];
let current_room = "centro_hawkins";
let player_position = [5, 5];
let map_size = 10;

let lanterna_on = false;
let lanterna_bateria = 100;
let entidade_sombra = false;

// =========================
// MAPA (IGUAL AO PYTHON)
// =========================
const rooms = {
    centro_hawkins: {
        som: "cidade.wav",
        itens: ["lanterna"],
        descricao: "Você está no centro de Hawkins. A névoa cobre as ruas e as luzes dos postes piscam sem motivo.",
        detalhes: "A cidade parece viva demais quando não deveria.",
        comandos: {
            "andar para o norte": "floresta",
            "andar para o oeste": "delegacia",
            "andar para o sul": "laboratorio_externo"
        }
    },

    floresta: {
        som: "floresta.wav",
        itens: ["galho"],
        descricao: "Floresta de Hawkins.",
        detalhes: "Algo se move entre as árvores.",
        comandos: {
            "andar para o sul": "centro_hawkins",
            "andar para o leste": "casa_abandonada"
        }
    },

    delegacia: {
        som: "cidade.wav",
        itens: ["chave"],
        descricao: "Delegacia abandonada.",
        detalhes: "Papéis espalhados e silêncio pesado.",
        comandos: {
            "andar para o leste": "centro_hawkins"
        }
    },

    casa_abandonada: {
        som: "casa.wav",
        itens: ["vela"],
        descricao: "Casa abandonada.",
        detalhes: "A madeira range sozinha.",
        comandos: {
            "andar para o oeste": "floresta"
        }
    },

    laboratorio_externo: {
        som: "cidade.wav",
        descricao: "Entrada do laboratório.",
        detalhes: "Luzes vermelhas piscam.",
        comandos: {
            "andar para o norte": "centro_hawkins"
        }
    },

    subsolo: {
        som: "portal.wav",
        descricao: "Subsolo vivo.",
        detalhes: "Algo respira nas paredes.",
        comandos: {
            "andar para o norte": "portal"
        }
    },

    portal: {
        som: "portal.wav",
        descricao: "Portal aberto.",
        detalhes: "Realidade instável.",
        comandos: {
            "andar para o oeste": "subsolo"
        }
    }
};

// =========================
// FUNÇÕES
// =========================
function limpar_tela() {
    screen.innerText = "";
}

function digitar(txt) {
    print(txt);
}

// =========================
// SOMBRA (IGUAL PYTHON)
// =========================
function atualizar_sombra() {
    if (
        (current_room === "subsolo" || current_room === "floresta") &&
        lanterna_bateria < 30
    ) {
        entidade_sombra = true;
    } else {
        entidade_sombra = false;
    }
}

// =========================
// STATUS
// =========================
function mostrar_status() {
    atualizar_sombra();

    print("\n==================================");
    print("LOCAL: " + current_room.toUpperCase());
    print("LANTERNA: " + lanterna_bateria + "%");
    print("==================================");

    let desc = rooms[current_room].descricao;

    if (current_room === "laboratorio" && Math.random() < 0.3) {
        desc += " As luzes piscam violentamente.";
    }

    print(desc);

    if (entidade_sombra) {
        print("Você sente que algo te observa no escuro...");
    }

    let itens = rooms[current_room].itens || [];
    if (itens.length > 0) {
        print("Itens: " + itens.join(", "));
    }
}

// =========================
// MOVIMENTO
// =========================
function mover(direcao) {
    if (lanterna_on) {
        lanterna_bateria--;
    }

    if (lanterna_bateria <= 0) {
        print("Sua lanterna apagou...");
    }

    if (direcao === "norte") player_position[1]--;
    if (direcao === "sul") player_position[1]++;
    if (direcao === "leste") player_position[0]++;
    if (direcao === "oeste") player_position[0]--;
}

// =========================
// LOOP DE COMANDOS (igual Python demo)
// =========================
input.addEventListener("keydown", function(e) {
    if (e.key !== "Enter") return;

    let cmd = input.value.toLowerCase().trim();
    input.value = "";

    print("> " + cmd);

    if (cmd === "sair") {
        print("JOGO ENCERRADO");
        return;
    }

    if (cmd === "lanterna") {
        lanterna_on = !lanterna_on;
        print(lanterna_on ? "Lanterna ON" : "Lanterna OFF");
    }

    else if (cmd === "olhar ao redor") {
        print(rooms[current_room].detalhes);
    }

    else if (cmd.startsWith("andar")) {
        let dir = cmd.replace("andar para o ", "");
        mover(dir);
    }

    else if (cmd === "pegar item") {
        let itens = rooms[current_room].itens || [];
        if (itens.length > 0) {
            inventory.push(itens.pop());
        }
    }

    else if (entidade_sombra && Math.random() < 0.2) {
        print("Algo te atacou no escuro...");
    }

    mostrar_status();
});