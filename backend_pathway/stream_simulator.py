import json
import time
import random
import os

EVENTS = [
    {"event": "weather_alert", "value": "Heavy Rain"},
    {"event": "weather_alert", "value": "Sunny"},
    {"event": "weather_alert", "value": "Snow Storm"},
    {"event": "traffic", "value": "Gridlock"},
    {"event": "traffic", "value": "Clear"},
    {"event": "order", "item": "Spicy Pizza"},
    {"event": "order", "item": "Iced Coffee"},
    {"event": "order", "item": "Sushi Platter"}
]

LOG_FILE = "live_stream.jsonl"

def append_event(event):
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(event) + "\n")
    print(f"Appended: {event}")

def main():
    print(f"Starting simulator... writing to {LOG_FILE}")
    # Ensure file exists
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w") as f:
            pass

    try:
        while True:
            event = random.choice(EVENTS)
            append_event(event)
            time.sleep(5)
    except KeyboardInterrupt:
        print("\nStopping simulator.")

if __name__ == "__main__":
    main()
