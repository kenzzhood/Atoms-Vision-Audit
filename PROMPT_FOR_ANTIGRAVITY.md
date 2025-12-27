# PROMPT FOR ANTIGRAVITY (Linux Session)

**You are an expert Autonomous AI Agent Developer.**

## Project Context
We are building **"AdSure Agent"** for the **Synaptix Frontier AI Hackathon (Track 1: Agentic AI)**.
**Goal:** An Autonomous Logistics Agent that changes physical shipping labels in real-time based on live data streams (Weather, Traffic, Orders).

**Repository:** `https://github.com/kenzzhood/Atoms-Vision-Audit.git`
**Tech Stack:**
- **Backend:** Python + Pathway (Stream Processing) + Google Gemini (LLM).
- **Frontend:** React (Vite) + Framer Motion + Lucide Icons (Cyberpunk UI).

## Current Status
The project is fully initialized. Use the **Real Pathway Architecture** since we are on Linux.
1.  **Backend (`backend_pathway/`)**:
    - `stream_simulator.py`: Generates JSONL events.
    - `agent_pathway.py`: **The Main Brain** (Pathway Engine). Reads stream $\to$ LLM $\to$ API.
    - `requirements_pathway.txt`: Dependencies for Linux (includes `pathway`).
2.  **Frontend (`src/`, `components/`, `views/`)**:
    - `views/Rider.tsx`: The "Driver View" with simulated AR scanning.
    - `components/DigitalLabel.tsx`: Connects to backend and updates label dynamically.

## Your Mission: Setup & Run
I have just cloned this repo into my Linux VM. I need you to orchestrate the setup.

**Step-by-Step Instructions:**
1.  **Install Backend Dependencies**:
    - `cd backend_pathway`
    - `pip install -r requirements_pathway.txt` (Ensure `pathway` is installed).
2.  **Configure Credentials**:
    - Ask me for the `GEMINI_API_KEY` if it's missing in `.env`.
3.  **Run the Backend Pipeline**:
    - Start the Simulator: `python stream_simulator.py` (Background)
    - Start the Agent: `python agent_pathway.py` (This starts the webserver on port 8000).
4.  **Run the Frontend**:
    - `cd ..` (Root)
    - `npm install`
    - `npm run dev`

**Verification Goal:**
- When `stream_simulator.py` outputs "Heavy Rain", the Frontend UI should automatically show a "Coffee Ad".

**Next Steps (Development):**
- **Optimize Latency**: Tweak Pathway windowing if needed.
- **Enhance UI**: Add a "History Log" of past ad decisions.
- **Real AR**: Improve the camera overlay visuals.

**ACTION:** Please start by checking if `backend_pathway/requirements_pathway.txt` allows `pathway` to install correctly on this system.
