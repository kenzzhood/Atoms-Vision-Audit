import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using 'gemini-3-flash-preview' for fast, intelligent multimodal analysis
const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeImage = async (base64Image: string, prompt: string, schema?: any) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("AI Vision Error", e);
    return null;
  }
};

export const generateScanLogs = async (orderId: string, itemDescription?: string) => {
  try {
    const context = itemDescription ? `Analyzing: ${itemDescription}.` : `Scanning ${orderId}.`;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${context} Generate 3 extremely technical, sci-fi log lines (max 5 words). Return ONLY JSON array of strings.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text || '[]') as string[];
  } catch (e) {
    return ['INITIALIZING SENSORS...', 'SYNCING PROTOCOL...', 'MINTING SEAL...'];
  }
};

export const verifyVoiceCommand = async (audioBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/webm; codecs=opus', data: audioBase64 } },
          { text: "Analyze audio. JSON: { transcript, verified (boolean if confirming pickup) }" }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING },
            verified: { type: Type.BOOLEAN }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { transcript: "...", verified: true };
  }
};

export const generateDynamicAd = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Create a fictional, high-end futuristic brand ad. JSON: { brand, headline, subsidy_text }.",
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                brand: { type: Type.STRING },
                headline: { type: Type.STRING },
                subsidy_text: { type: Type.STRING }
            }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { brand: "ORBIT BREW", headline: "The future is caffeinated.", subsidy_text: "Fee Waived" };
  }
};

export const askAnalyst = async (message: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: message,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        return { text: response.text, grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
    } catch (e) {
        return { text: "Network module offline.", grounding: [] };
    }
}