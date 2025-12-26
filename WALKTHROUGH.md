# Walkthrough - AdSure Agent Implementation

I have successfully implemented the "AdSure Agent" for Track 1 of the Synaptix Frontier AI Hackathon.

## Architecture
- **Backend**: Python + Pathway + Gemini
- **Frontend**: React (Vite) + Lucide + Framer Motion
- **Communication**: Polling (via simple HTTP served by Pathway)

## Changes Made

### 1. Backend (`backend_pathway/`)
- Created `agent.py`: The Main Brain.
    - reads `live_stream.jsonl` using `pw.io.jsonlines`.
    - Uses `pw.udf` and `google.generativeai` to generate ad strategies.
    - Exposes results via HTTP at `http://localhost:8000/`.
- Created `stream_simulator.py`: Generates random weather/traffic events every 5 seconds.
- Created `requirements.txt`: Dependencies.

### 2. Frontend (`src/`)
- **DigitalLabel Component**: (`components/DigitalLabel.tsx`)
    - Polls the backend every 2s.
    - Displays dynamic ads with "Holographic/Cyberpunk" UI.
- **Rider View Update**: (`views/Rider.tsx`)
    - Integrated `DigitalLabel`.
    - Added "AR Overlay" simulation for package scanning.
    - Renamed headers to "AdSure Agent".
- **API Utility**: (`utils/api.ts`) for fetching data.

## How to Run

You will need TWO terminal windows.

### Terminal 1: Backend
```powershell
cd "e:\Projects\IITM Hackathon -- Symmetric\Atoms-Vision-Audit\backend_pathway"
# Ensure your .env has GEMINI_API_KEY
python stream_simulator.py
# (OPEN A NEW SPLIT TERMINAL)
python agent.py
```

### Terminal 2: Frontend
```powershell
cd "e:\Projects\IITM Hackathon -- Symmetric\Atoms-Vision-Audit"
npm run dev
```

## Verification
- **Build Success**: The React app builds without errors (`npm run build` passed).
- **Backend Logic**: `agent.py` is configured to read the generated stream and call Gemini.

> [!IMPORTANT]
> Ensure you have set `GEMINI_API_KEY` in your environment or created a `.env` file in the `backend_pathway` folder before running `agent.py`.
