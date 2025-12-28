# Technical Specifications: AdSure Agent

## System Overview

AdSure Agent is designed to decouple the physical shipping label from its static content. It introduces a "Digital Twin" layer where the content of the label is dynamically generated based on the package's real-time context.

## Data Pipeline

1.  **Event Source (Simulator)**:
    *   Generates `weather_alert`, `traffic_update`, and `order_status` events.
    *   Format: JSON Lines (`.jsonl`).
    *   Frequency: ~5 seconds.

2.  **Ingestion Layer (Agent)**:
    *   Reads the tail of the `live_stream.jsonl` file.
    *   In a production Pathway environment, this would use `pw.io.jsonlines.read(..., mode="streaming")`.
    *   Current prototype Implementation: Python `asyncio` file watcher.

3.  **reasoning Engine (LLM)**:
    *   **Model**: Google Gemini 1.5 Flash (optimized for speed/cost).
    *   **Prompt Architecture**:
        *   **Role**: Autonomous Logistics Ad Agent.
        *   **Input**: Stream event (e.g., "Heavy Rain").
        *   **Task**: Generate context-aware marketing copy (max 10 words).

4.  **Presentation Layer (Client)**:
    *   **Polling**: Client polls `/` endpoint every 2000ms.
    *   **State**: Updates local React state only on data change.
    *   **UI**: Cyberpunk aesthetic using Tailwind CSS/Zinc palette.

## Component Details

### `stream_simulator.py`
A lightweight script that mocks IoT sensor data. It writes to the file system to simulate a data lake or stream buffer.

### `agent.py`
The core orchestration service.
*   **FastAPI**: Provides the HTTP interface.
*   **Background Task**: Runs the file watcher loop.
*   **Error Handling**: Catches JSON decode errors from the stream and LLM API failures.

### Frontend (`App.tsx` & Views)
*   **Role-Based Access Control (RBAC)**: Simulated via a "Landing Portal".
*   **Rider View**: The primary demo interface. Designed to look like a ruggedized scanner tablet.
*   **DigitalLabel Component**: The specific UI element that renders the ad.

## Future Roadmap (Hackathon Phase 2)
*   [ ] Replace polling with WebSockets for true real-time push.
*   [ ] Integrate actual Pathway logic for complex windowing (e.g., "If rain persists for > 10 mins").
*   [ ] Add "Driver Feedback" loop (Driver confirms ad relevance).
