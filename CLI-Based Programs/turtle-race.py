import random
import time

t1 = 0
t2 = 0
finish = 20

print("Welcome to Turtle Race! First to the seaweed wins\n")
time.sleep(1)

while t1 < finish and t2 < finish:
    t1 += random.randint(1, 3)
    t2 += random.randint(1, 3)
    print("Turtle 1:", "XXX" * t1)
    print("Turtle 2:", ">>>" * t2)
    print("-" * 30)
    time.sleep(0.5)

if t1 >= finish and t2 >= finish:
    print("It's a tie!")
elif t1 >= finish:
    print("Turtle 1 wins!")
else:
    print("Turtle 2 wins!")