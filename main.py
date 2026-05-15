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
player_name = ""
inventory = []
current_room = "centro_hawkins"
player_position = [5, 5]
map_size = 10
lanterna_on = False
lanterna_bateria = 100
entidade_sombra = False

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
        "descricao": "Você está no centro de Hawkins. A névoa cobre as ruas e as luzes dos postes piscam sem motivo.",
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
        "descricao": "Floresta de Hawkins.",
        "detalhes": "Algo se move entre as árvores.",
        "comandos": {
            "andar para o sul": "centro_hawkins",
            "andar para o leste": "casa_abandonada",
        },
    },

    "delegacia": {
        "som": "cidade.wav",
        "itens": ["chave"],
        "descricao": "Delegacia abandonada.",
        "detalhes": "Papéis espalhados e silêncio pesado.",
        "comandos": {
            "andar para o leste": "centro_hawkins",
        },
    },

    "casa_abandonada": {
        "som": "casa.wav",
        "itens": ["vela"],
        "descricao": "Casa abandonada.",
        "detalhes": "A madeira range sozinha.",
        "comandos": {
            "andar para o oeste": "floresta",
        },
    },

    "laboratorio_externo": {
        "som": "cidade.wav",
        "descricao": "Entrada do laboratório.",
        "detalhes": "Luzes vermelhas piscam.",
        "comandos": {
            "andar para o norte": "centro_hawkins",
        },
    },

    "subsolo": {
        "som": "portal.wav",
        "descricao": "Subsolo vivo.",
        "detalhes": "Algo respira nas paredes.",
        "comandos": {
            "andar para o norte": "portal",
        },
    },

    "portal": {
        "som": "portal.wav",
        "descricao": "Portal aberto.",
        "detalhes": "Realidade instável.",
        "comandos": {
            "andar para o oeste": "subsolo",
        },
    }
}

# =========================
# FUNÇÕES
# =========================

def limpar_tela():
    print("\n" * 3)


def digitar(txt):
    print(Fore.GREEN + txt)


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

    desc = rooms[current_room]["descricao"]

    if current_room == "laboratorio" and random.random() < 0.3:
        desc += " As luzes piscam violentamente."

    print(Fore.GREEN + desc)

    if entidade_sombra:
        print(Fore.RED + "Você sente que algo te observa no escuro...")

    itens = rooms[current_room].get("itens", [])
    if itens:
        print(Fore.YELLOW + f"Itens: {', '.join(itens)}")

    print(Fore.GREEN + "\nCOMANDOS: olhar ao redor, andar, entrar, lanterna, pegar item")

# =========================
# MOVIMENTO
# =========================

def mover(direcao):
    global player_position, lanterna_bateria

    if lanterna_on:
        lanterna_bateria -= 1

    if lanterna_bateria <= 0:
        print(Fore.RED + "Sua lanterna apagou...")

    if direcao == "norte": player_position[1] -= 1
    if direcao == "sul": player_position[1] += 1
    if direcao == "leste": player_position[0] += 1
    if direcao == "oeste": player_position[0] -= 1

# =========================
# LOOP (SANDBOX)
# =========================

comandos_demo = [
    "olhar ao redor",
    "andar para o norte",
    "lanterna",
    "olhar ao redor",
    "pegar item",
    "andar para o leste",
    "olhar ao redor",
    "sair"
]

for cmd in comandos_demo:

    mostrar_status()

    print(Fore.CYAN + f"> {cmd}")

    if cmd == "sair":
        break

    if cmd == "lanterna":
        lanterna_on = not lanterna_on
        print("Lanterna ON" if lanterna_on else "Lanterna OFF")

    elif cmd in ["olhar", "olhar ao redor"]:
        print(rooms[current_room]["detalhes"])

    elif cmd.startswith("andar"):
        direcao = cmd.replace("andar para o ", "")
        if direcao in ["norte", "sul", "leste", "oeste"]:
            mover(direcao)

    elif cmd == "pegar item":
        itens = rooms[current_room].get("itens", [])
        if itens:
            inventory.append(itens.pop())

    elif entidade_sombra and random.random() < 0.2:
        print(Fore.RED + "Algo te atacou no escuro...")

    else:
        print("...")