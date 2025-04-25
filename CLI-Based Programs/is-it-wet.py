import random

weird_responses = [
    "WET.",
    "Dry as the Sahara.",
    "Dripping.",
    "Depends... is it emotionally available?",
    "That’s a puddle in disguise.",
    "Moist? Ew. But yes.",
    "Ocean-certified.",
    "Water-resistant, but not emotionally.",
]

while True:
    item = input("Enter an object to check if it's wet (or type 'exit'): ").lower()
    if item == "exit":
        break
    response = random.choice(weird_responses)
    print(f"{item.capitalize()} → {response}\n")
