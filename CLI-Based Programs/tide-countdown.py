import random
import time

days_left = random.randint(1, 30)

print("Ocean Oracle says...")
time.sleep(1)
print(f"The Final Tide comes in {days_left} days.")
if days_left < 5:
    print("Prepare your snorkels. It's close.")
elif days_left > 20:
    print("You have time to train with the dolphins.")