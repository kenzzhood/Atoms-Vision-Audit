import pathway as pw
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

@pw.udf
def generate_ad_strategy(event_data: str) -> str:
    try:
        data = json.loads(event_data)
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

def run():
    # Input Stream
    # We read line by line from the jsonl file
    # In a real Mac/Linux env, this works natively
    
    # Re-reading as raw string to handle different schemas easily in UDF
    raw_stream = pw.io.fs.read(
        "live_stream.jsonl",
        format="raw",
        mode="streaming",
        with_metadata=False
    )

    # Process
    processed = raw_stream.select(
        ad_strategy=generate_ad_strategy(pw.this.data),
        raw_data=pw.this.data
    )

    # Output to a CSV for simple verification (or standard output)
    pw.io.csv.write(processed, "ad_decisions.csv")
    
    # Also expose via HTTP for the Frontend
    pw.io.http.write_request_handler(
        processed, 
        host="0.0.0.0", 
        port=8000
    )

    pw.run()

if __name__ == "__main__":
    run()
