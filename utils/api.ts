export const fetchAdStrategy = async (): Promise<{ ad_strategy: string, raw_data: any } | null> => {
    try {
        // Fetch the latest line from the JSONL served by Pathway 
        // Note: In a real scenario, we'd use a proper REST API or WebSocket.
        // For this hackathon, we are polling the latest processed entry from the HTTP endpoint.
        // Since Pathway exposes the table, we might need to filter or just get the latest.
        // However, the agent.py exposes `pw.io.http.write_request_handler`.
        // Let's assume the endpoint returns the full dataset or we can query it.
        // For simplicity in this simulated environment, we might want to just read the last line of the output CSV/Json 
        // but since we can't easily read server files from client, we will try to hit the endpoint.
        
        // Actually, Pathway's http.write_request_handler by default exposes the table as JSON.
        // We will fetch it and take the last element.
        
        const response = await fetch('http://localhost:8000/');
        if (!response.ok) return null;
        
        const data = await response.json();
        // data is likely an array of objects
        if (Array.isArray(data) && data.length > 0) {
            return data[data.length - 1];
        }
        return null;
    } catch (e) {
        console.error("Ad Strategy Fetch Error", e);
        return null;
    }
};
