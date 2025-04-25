import random

words = ["coral", "plankton", "kraken", "jellyfish", "kelp", "seahorse"]
word = random.choice(words)
guessed = ["_" for _ in word]
lives = 6

print("Welcome to Ocean Hangman")

while lives > 0 and "_" in guessed:
    print("\nWord:", " ".join(guessed))
    guess = input("Guess a letter: ").lower()

    if guess in word:
        for i, letter in enumerate(word):
            if letter == guess:
                guessed[i] = guess
        print("Correct!")
    else:
        lives -= 1
        print(f"Wrong! Coral stress level rising... {lives} lives left")

if "_" not in guessed:
    print("You saved the reef! Word was:", word)
else:
    print("Coral bleaching complete. Word was:", word)
