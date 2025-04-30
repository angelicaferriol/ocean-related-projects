import random

bubbles = ["O"] * 20

print("Bubble Wrap Simulator 🫧")
while "O" in bubbles:
    input("Press Enter to pop...")
    i = random.choice([i for i, b in enumerate(bubbles) if b == "O"])
    bubbles[i] = "X"
    print(" ".join(bubbles))

print("All bubbles popped. You win nothing, but feel better.")
