
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleAIRequest = async (requestFn: () => Promise<any>) => {
  try {
    return await requestFn();
  } catch (error: any) {
    console.error("Error en Gemini API:", error);
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota")) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    throw error;
  }
};

export const analyzeBillImage = async (base64Image: string) => {
  return handleAIRequest(async () => {
    const ai = createAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Analiza esta factura del mercado español. Extrae el proveedor, importe total, fecha y categoría (Electricidad, Agua, Gas, Internet, Móvil, Seguros, IBI / Impuestos, Mantenimiento, Suscripciones, Finanzas, Otros). Detecta fechas de renovación.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            provider: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            category: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["provider", "amount", "date", "category"]
        }
      }
    });
    return JSON.parse(response.text);
  });
};

export const getFinancialAdvice = async (expenses: any[], assets: any[]) => {
  return handleAIRequest(async () => {
    const ai = createAIInstance();
    const prompt = `Actúa como experto en ahorro doméstico en España. Analiza estos gastos: ${JSON.stringify(expenses)}. 
    Dime cómo ahorrar en Luz, Seguros o Internet basándote en las ofertas actuales en España. Sé específico con nombres de compañías si es posible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              currentCost: { type: Type.NUMBER },
              potentialCost: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ["category", "currentCost", "potentialCost", "reasoning", "action"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  });
};

export const getConsumerRights = async () => {
  return handleAIRequest(async () => {
    const ai = createAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Genera una lista de 4 derechos fundamentales y obligaciones de las compañías de servicios (luz, agua, seguros) hacia el cliente en España. Incluye referencia a la ley.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              lawReference: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  });
};
