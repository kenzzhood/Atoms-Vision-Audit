# AdSure Agent 🚚📦

> **Synaptix Frontier AI Hackathon Entry - Track 1: Agentic AI**

**AdSure Agent** is an **Autonomous Logistics Agent** that transforms physical shipping labels into real-time, context-aware digital ad surfaces. By ingesting live environmental data (weather, traffic, location), it uses **Agentic AI** to dynamically rewrite marketing copy on the fly.

---

## 🚀 The Mission

Static shipping labels are a wasted opportunity. AdSure turns every package into a smart billboard that reacts to its environment.

*   **It's Raining?** → Label changes to: *"Stay dry! Get 50% off Hot Coffee."*
*   **Gridlock Traffic?** → Label changes to: *"Stuck in traffic? Listen to this Audiobook."*
*   **Late Night Delivery?** → Label changes to: *"Mid-night snack cravings? Order Pizza now."*

## 🏗️ Architecture

The system consists of two main components:

### 1. The "Brain" (Backend)
*   **Engine:** `Pathway` (Simulated via Python for Prototype)
*   **Intelligence:** `Google Gemini` (via Generative AI SDK)
*   **Data Ingestion:** Live Stream Simulator (`stream_simulator.py`) generating JSON events.
*   **API:** FastAPI / Python simple HTTP server to expose the latest "Ad Strategy".

### 2. The "Face" (Frontend)
*   **Framework:** React (Vite) + TypeScript
*   **UI Library:** Lucide Icons + Framer Motion
*   **Theme:** Cyberpunk / Holographic "Driver View"
*   **Key Feature:** "Digital Label" component that polls the Brain for real-time updates.

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   Google Gemini API Key

### 1. Backend Setup (The Brain)

Navigate to the backend directory:
```bash
cd backend_pathway
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in `backend_pathway/` and add your API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Frontend Setup (The Client)

Navigate to the project root:
```bash
# If you are in backend_pathway, go back up
cd ..
```

Install Node dependencies:
```bash
npm install
```

---

## ▶️ How to Run

You need to run three processes (best done in split terminals).

**Terminal 1: The Simulator (Generates Data)**
```bash
cd backend_pathway
python stream_simulator.py
```
*Action: This creates/appends to `live_stream.jsonl` every 5 seconds.*

**Terminal 2: The Agent (Reasoning Engine)**
```bash
cd backend_pathway
python agent.py
```
*Action: This watches the stream, calls Gemini, and hosts the API at `http://localhost:8000`.*

**Terminal 3: The Frontend (UI)**
```bash
npm run dev
```
*Action: Opens the web app at `http://localhost:5173`. Navigate to **Rider View** to see the magic.*

---

## 📂 Project Structure

```text
Atoms-Vision-Audit/
├── backend_pathway/       # Python Backend
│   ├── agent.py           # Main Agent Application (FastAPI + Gemini)
│   ├── stream_simulator.py# Generates mock live data (Weather, Traffic)
│   └── requirements.txt   # Python deps
├── src/
│   ├── components/        # React Components (DigitalLabel.tsx)
│   ├── views/             # Main Screens (Rider.tsx is the key view)
│   └── App.tsx            # Main Entry and Routing
└── README.md              # This file
```

---

## 🤖 API Reference

The Agent exposes a simple endpoint:

**GET** `http://localhost:8000/`

**Response:**
```json
[
  {
    "ad_strategy": "Rainy day? Warm up with a spicy Latte!",
    "raw_data": "weather_alert - Heavy Rain"
  }
]
```

---

## 🏆 Hackathon Notes
*   **Agentic Behavior**: The system doesn't just use `if/else`. It sends the *context* to the LLM, which creatively decides the best ad strategy.
*   **Real-time**: The Frontend polls for changes, simulating a "push" notification system for the driver.
