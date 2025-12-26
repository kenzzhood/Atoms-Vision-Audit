import os
import json
import time
import asyncio
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

LATEST_AD_STRATEGY = None
LOG_FILE = "live_stream.jsonl"

def generate_ad_strategy(event_data):
    try:
        data = event_data
        if isinstance(data, str):
            data = json.loads(data)
            
        context = f"Event: {data.get('event')}, Value: {data.get('value', data.get('item'))}"
        
        prompt = f"""
        Act as an Autonomous Logistics Ad Agent.
        Context: {context}
        
        Task: Generate a short, witty Ad Tagline for a brand based on this context. 
        If it's a weather alert, offer comfort or utility. 
        If it's traffic, offer relief or entertainment.
        If it's an order, upsell or complement.
        
        Output JUST the tagline.
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating ad: {str(e)}"

async def watch_file():
    global LATEST_AD_STRATEGY
    print(f"Watching {LOG_FILE} for new events...")
    
    # helper to follow file
    file = open(LOG_FILE, 'r')
    file.seek(0, 2) # Go to the end
    
    while True:
        line = file.readline()
        if not line:
            await asyncio.sleep(1) # Sleep briefly
            continue
            
        try:
            print(f"Processing: {line.strip()}")
            data = json.loads(line)
            strategy = generate_ad_strategy(data)
            
            LATEST_AD_STRATEGY = {
                "ad_strategy": strategy,
                "raw_data": f"{data.get('event')} - {data.get('value', data.get('item'))}"
            }
            print(f"Updated Strategy: {LATEST_AD_STRATEGY}")
        except json.JSONDecodeError:
            pass

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(watch_file())

@app.get("/")
def get_latest_ad():
    if LATEST_AD_STRATEGY:
        return [LATEST_AD_STRATEGY] # Return as array to match Pathway's typical table output
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
