import time
import pygame
from colorama import init, Fore
import random

# =========================
# INICIALIZAÇÃO
# =========================
init(autoreset=True)

try:
    pygame.mixer.init()
    audio_ativo = True
except:
    print("Áudio indisponível neste ambiente.")
    audio_ativo = False

# =========================
# ESTADO DO JOGO
# =========================
player_name = "Jogador"
inventory = []
current_room = "centro_hawkins"
lanterna_on = False
lanterna_bateria = 100
entidade_sombra = False

# =========================
# INPUT SEGURO
# =========================

def safe_input(texto, padrao=""):
    try:
        return input(texto)
    except:
        return padrao

# =========================
# SONS
# =========================

def tocar_som(nome):
    if audio_ativo:
        try:
            pygame.mixer.music.load(f"sounds/{nome}")
            pygame.mixer.music.play(-1)
        except:
            pass

# =========================
# MAPA
# =========================

rooms = {

    "centro_hawkins": {
        "som": "cidade.wav",
        "itens": ["lanterna"],
        "descricao": "Você está no centro de Hawkins. A névoa cobre as ruas e as luzes piscam sem motivo.",
        "detalhes": "A cidade parece viva demais quando não deveria.",
        "comandos": {
            "andar para o norte": "floresta",
            "andar para o oeste": "delegacia",
            "andar para o sul": "laboratorio_externo",
        },
    },

    "floresta": {
        "som": "floresta.wav",
        "itens": ["galho"],
        "descricao": "Você entrou na floresta de Hawkins.",
        "detalhes": "Algo se move entre as árvores escuras.",
        "comandos": {
            "andar para o sul": "centro_hawkins",
            "andar para o leste": "casa_abandonada",
        },
    },

    "delegacia": {
        "som": "cidade.wav",
        "itens": ["chave"],
        "descricao": "A delegacia está abandonada.",
        "detalhes": "Papéis espalhados cobrem o chão.",
        "comandos": {
            "andar para o leste": "centro_hawkins",
        },
    },

    "casa_abandonada": {
        "som": "casa.wav",
        "itens": ["vela"],
        "descricao": "Você entrou em uma casa abandonada.",
        "detalhes": "A madeira range sozinha.",
        "comandos": {
            "andar para o oeste": "floresta",
        },
    },

    "laboratorio_externo": {
        "som": "cidade.wav",
        "itens": ["cartao"],
        "descricao": "Você chegou na entrada do Laboratório Hawkins.",
        "detalhes": "Uma enorme porta metálica bloqueia a passagem.",
        "comandos": {
            "andar para o norte": "centro_hawkins",
            "entrar no laboratorio": "laboratorio",
        },
    },

    "laboratorio": {
        "som": "laboratorio.wav",
        "descricao": "O laboratório está destruído e silencioso.",
        "detalhes": "Monitores quebrados iluminam corredores escuros.",
        "comandos": {
            "andar para o sul": "subsolo",
            "andar para o norte": "laboratorio_externo",
        },
    },

    "subsolo": {
        "som": "portal.wav",
        "descricao": "Você chegou ao subsolo do laboratório.",
        "detalhes": "Algo respira dentro das paredes.",
        "comandos": {
            "andar para o norte": "portal",
        },
    },

    "portal": {
        "som": "portal.wav",
        "descricao": "Um portal dimensional está aberto.",
        "detalhes": "A realidade parece quebrada aqui.",
        "comandos": {
            "andar para o oeste": "subsolo",
        },
    }
}

# =========================
# FUNÇÕES
# =========================

def limpar_tela():
    print("\n" * 2)


def atualizar_sombra():
    global entidade_sombra

    if current_room in ["subsolo", "floresta"] and lanterna_bateria < 30:
        entidade_sombra = True
    else:
        entidade_sombra = False


def mostrar_status():

    atualizar_sombra()

    print(Fore.GREEN + "\n" + "=" * 50)
    print(Fore.GREEN + f"LOCAL: {current_room.upper()}")
    print(Fore.GREEN + f"LANTERNA: {lanterna_bateria}%")
    print(Fore.GREEN + "=" * 50)

    print(Fore.GREEN + rooms[current_room]["descricao"])

    if entidade_sombra:
        print(Fore.RED + "Você sente que algo te observa no escuro...")

    itens = rooms[current_room].get("itens", [])

    if itens:
        print(Fore.YELLOW + f"Itens: {', '.join(itens)}")

    print(Fore.CYAN + "\nComandos disponíveis:")
    print(Fore.CYAN + "- olhar ao redor")
    print(Fore.CYAN + "- andar para o norte/sul/leste/oeste")
    print(Fore.CYAN + "- pegar item")
    print(Fore.CYAN + "- inventario")
    print(Fore.CYAN + "- lanterna")

    if "entrar no laboratorio" in rooms[current_room]["comandos"]:
        print(Fore.CYAN + "- entrar no laboratorio")

    print(Fore.CYAN + "- sair")

# =========================
# MOVIMENTO
# =========================

def mover(direcao):
    global current_room
    global lanterna_bateria

    comando = f"andar para o {direcao}"

    if comando in rooms[current_room]["comandos"]:

        current_room = rooms[current_room]["comandos"][comando]

        tocar_som(rooms[current_room]["som"])

        if lanterna_on:
            lanterna_bateria -= 1

            if lanterna_bateria <= 0:
                lanterna_bateria = 0
                print(Fore.RED + "Sua lanterna apagou...")

    else:
        print(Fore.RED + "Você não pode ir por esse caminho.")

# =========================
# INÍCIO DO JOGO
# =========================

limpar_tela()

print(Fore.GREEN + "=" * 50)
print(Fore.GREEN + "      STRANGER THINGS RPG")
print(Fore.GREEN + "=" * 50)

player_name = safe_input(Fore.CYAN + "\nDigite seu nome: ", "Jogador")

if player_name.strip() == "":
    player_name = "Jogador"

print(Fore.GREEN + f"\nBem-vindo(a), {player_name}...")
time.sleep(1)

print(Fore.GREEN + "A cidade de Hawkins não é mais segura.")
print(Fore.GREEN + "Pessoas desapareceram durante a madrugada.")
print(Fore.GREEN + "Rumores dizem que o laboratório abriu algo que nunca deveria existir...")
time.sleep(2)

tocar_som(rooms[current_room]["som"])

# =========================
# LOOP PRINCIPAL
# =========================

while True:

    mostrar_status()

    cmd = safe_input(Fore.CYAN + "\n> ", "sair")
    cmd = cmd.lower().strip()

    # =========================
    # SAIR
    # =========================

    if cmd == "sair":
        print(Fore.RED + "\nEncerrando jogo...")
        break

    # =========================
    # LANTERNA
    # =========================

    elif cmd == "lanterna":

        lanterna_on = not lanterna_on

        if lanterna_on:
            print(Fore.YELLOW + "Lanterna ligada.")
        else:
            print(Fore.YELLOW + "Lanterna desligada.")

    # =========================
    # OLHAR
    # =========================

    elif cmd in ["olhar", "olhar ao redor"]:

        print(Fore.GREEN + "\n" + rooms[current_room]["detalhes"])

        print(Fore.CYAN + "\nCaminhos disponíveis:")

        for comando, destino in rooms[current_room]["comandos"].items():
            print(Fore.YELLOW + f"- {comando} -> {destino}")

        if current_room == "floresta":
            print(Fore.RED + "Você escuta galhos quebrando atrás de você...")

        elif current_room == "delegacia":
            print(Fore.YELLOW + "Existe um rádio velho emitindo estática.")

        elif current_room == "laboratorio":
            print(Fore.RED + "As luzes piscam enquanto algo parece respirar nas sombras.")

    # =========================
    # MOVIMENTO
    # =========================

    elif cmd.startswith("andar para o "):

        direcao = cmd.replace("andar para o ", "")

        if direcao in ["norte", "sul", "leste", "oeste"]:
            mover(direcao)
        else:
            print(Fore.RED + "Direção inválida.")

    # =========================
    # ENTRAR NO LABORATÓRIO
    # =========================

    elif cmd == "entrar no laboratorio":

        if cmd in rooms[current_room]["comandos"]:

            current_room = rooms[current_room]["comandos"][cmd]

            print(Fore.RED + "\nA porta metálica se abre lentamente...")
            print(Fore.RED + "Um cheiro estranho toma conta do corredor.")

            tocar_som(rooms[current_room]["som"])

        else:
            print(Fore.RED + "Não existe laboratório aqui.")

    # =========================
    # PEGAR ITEM
    # =========================

    elif cmd == "pegar item":

        itens = rooms[current_room].get("itens", [])

        if itens:

            item = itens.pop()
            inventory.append(item)

            print(Fore.YELLOW + f"Você pegou: {item}")

        else:
            print(Fore.RED + "Não há itens aqui.")

    # =========================
    # INVENTÁRIO
    # =========================

    elif cmd == "inventario":

        if inventory:
            print(Fore.YELLOW + f"Inventário: {', '.join(inventory)}")
        else:
            print(Fore.RED + "Seu inventário está vazio.")

    # =========================
    # EVENTO SOMBRA
    # =========================

    elif entidade_sombra and random.random() < 0.2:

        print(Fore.RED + "\nAlgo te atacou no escuro...")
        print(Fore.RED + "Você corre desesperadamente.")

    # =========================
    # COMANDO DESCONHECIDO
    # =========================

    else:
        print(Fore.RED + "Comando desconhecido.")