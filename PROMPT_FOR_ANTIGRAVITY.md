# MASTER PROMPT: AdSure Agent (Linux/Pathway Edition)

**You are a Senior Full-Stack Architect and Lead Developer.**

## THE MISSION
We are entering the **Synaptix Frontier AI Hackathon (Track 1: Agentic AI)**.
**The Goal:** Build an "Autonomous Logistics Agent" that changes physical shipping labels in real-time based on live data (e.g., "It's raining" $\to$ "Print Coffee Ad").
**The Core Tech:** The backend MUST use the **Pathway engine** to process live data streams.

## YOUR CONTEXT
- **Repository:** `https://github.com/kenzzhood/Atoms-Vision-Audit.git`
- **Existing Code:** A **React (Vite)** Application (Driver View) and a **Python** Backend.
- **Status:** Backend uses **Gemini** (via `google.generativeai`) and **Pathway**.

## YOUR OBJECTIVES (Linux Environment)

### Phase 1: The 'Brain' (Backend)
**Location:** `backend_pathway/`
The backend is already implemented (`agent_pathway.py`), but needs to be **RUN** in this Linux/VM environment.
- **Files:**
    - `stream_simulator.py`: The "World" (Generates Rain/Traffic events).
    - `agent_pathway.py`: The **Real Pathway Engine**.
- **Action:**
    1. `pip install -r requirements_pathway.txt`
    2. Ensure `GEMINI_API_KEY` is in `.env`.
    3. Run `python stream_simulator.py` (Background).
    4. Run `python agent_pathway.py` (Main).

### Phase 2: The 'Face' (Frontend)
**Location:** `src/` (Root)
The UI has been refactored for a **Cyberpunk/Dark Mode** aesthetic.
- **Features**:
    - **Driver View**: AR-style overlay box for package scanning.
    - **Digital Label**: A component that polls `http://localhost:8000/`.
    - **The 'Wow' Feature**: Real-time sync. When backend detects "Rain", the Label changes Instantly.
- **Action:**
    1. `npm install`
    2. `npm run dev`

## EXECUTION ORDER
1.  **Initialize Backend**: Get the Stream $\to$ Pathway $\to$ Gemini pipeline working first.
2.  **Launch Frontend**: interactions.

**CRITICAL:** Verify that `agent_pathway.py` is running successfully. It is the heart of the "Agentic" track.

*Time to win this hackathon.*
