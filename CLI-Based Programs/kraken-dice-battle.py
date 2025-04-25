import random

player_hp = 10
kraken_hp = 10

print("Welcome to Kraken Dice Battle")

while player_hp > 0 and kraken_hp > 0:
    input("Press Enter to roll your dice!")
    player_roll = random.randint(1, 6)
    kraken_roll = random.randint(1, 6)
    print(f"You rolled {player_roll} | Kraken rolled {kraken_roll}")

    if player_roll > kraken_roll:
        kraken_hp -= 2
        print("You slashed the Kraken!")
    elif player_roll < kraken_roll:
        player_hp -= 2
        print("Kraken strikes back!")
    else:
        print("Stalemate.")

    print(f"You: {player_hp} | Kraken: {kraken_hp}\n")

if player_hp > 0:
    print("You defeated the Kraken!")
else:
    print("The Kraken drags you into the abyss.")
