# PROMPT FOR ANTIGRAVITY (Mac Session)

**You are an expert Autonomous AI Agent Developer.**

## Project Context
We are building **"AdSure Agent"** for the **Synaptix Frontier AI Hackathon (Track 1: Agentic AI)**.
**Goal:** An Autonomous Logistics Agent that changes physical shipping labels in real-time based on live data streams (Weather, Traffic, Orders).

**Repository:** `https://github.com/kenzzhood/Atoms-Vision-Audit.git`
**Tech Stack:**
- **Backend:** Python + Pathway (Stream Processing) + Google Gemini (LLM).
- **Frontend:** React (Vite) + Framer Motion + Lucide Icons (Cyberpunk UI).

## Current Status (Handed off from Windows)
The project has been initialized and refactored.
1.  **Backend (`backend_pathway/`)**:
    - `stream_simulator.py`: Generates JSONL events (Rain, Traffic, etc.).
    - `agent_pathway.py`: **The Real Pathway Implementation** (for Linux/Mac/WSL).
    - `agent.py`: A Windows-fallback using FastAPI.
    - `requirements_pathway.txt`: Dependencies for Pathway environment.
2.  **Frontend**:
    - `views/Rider.tsx`: Refactored into the "AdSure Driver View" with simulated AR scanning.
    - `components/DigitalLabel.tsx`: A component that polls `http://localhost:8000/`.
    - **API Key**: `GEMINI_API_KEY` is set in `.env`.

## Immediate Task: Verify & Run on Linux/VM
I am now on a **Linux (VM/WSL)** environment. I need you to help me run the **Real Pathway Architecture**.

**Instructions for you:**
1.  **Environment Setup**:
    - Verify we are in `backend_pathway`.
    - Install dependencies: `pip install -r requirements_pathway.txt`
    - Check that `.env` contains the `GEMINI_API_KEY`.
2.  **Run the Pipeline**:
    - Start `stream_simulator.py` in the background.
    - Start `agent_pathway.py` (This starts the Pathway engine).
3.  **Run the Frontend**:
    - Navigate to root, run `npm run dev`.
4.  **Verification**:
    - Confirm that when the Simulator writes "Heavy Rain", the Frontend `DigitalLabel` updates to "Cozy Coffee" (or similar) without page refresh.

## Future Improvements (If time permits)
- **Real AR**: Enhance the CSS overlay in `Rider.tsx` to actually use camera depth (if possible via WebXR) or just better visuals.
- **Latency Optimization**: Ensure Pathway's streaming latency is negligible.
- **History**: Display a history of changed labels in the UI.

**Action:** Please guide me through Step 1 (Setup) and get the `agent_mac.py` running!
