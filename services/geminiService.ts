
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
            text: `Eres el motor OCR de BillSavy OS. 
            Analiza esta factura y extrae:
            1. Proveedor (Nombre exacto).
            2. Importe total con IVA.
            3. Fecha de emisión.
            4. Categoría financiera.
            5. Fecha de fin de permanencia o renovación (CRÍTICO).
            6. Análisis de anomalías: ¿Es más alta que la media? ¿Hay cargos extraños?`,
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
            summary: { type: Type.STRING },
            anomalyDetected: { type: Type.BOOLEAN }
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
    const prompt = `Eres el "Unicorn CFO Agent" de BillSavy. 
    Analiza esta cartera de gastos domésticos en España: ${JSON.stringify(expenses)}. 
    Tu objetivo es maximizar el flujo de caja del usuario.
    
    Busca:
    1. Oportunidades de "Insurance Arbitrage": ¿Qué seguros son caros hoy?
    2. Cambios de comercializadora eléctrica (Mercado libre vs Regulado).
    3. Suscripciones "zombie" (olvidadas).
    
    Devuelve un plan de ataque agresivo.`;

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
              action: { type: Type.STRING },
              isAutomatedSwitchAvailable: { type: Type.BOOLEAN }
            },
            required: ["category", "currentCost", "potentialCost", "reasoning", "action"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  });
};

// Added getConsumerRights to fix missing export error in ConsumerRights component.
export const getConsumerRights = async () => {
  return handleAIRequest(async () => {
    const ai = createAIInstance();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Genera una lista de 4 derechos del consumidor clave en España relacionados con suministros (luz, gas, internet) y seguros. Incluye la referencia legal simplificada.",
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
            },
            required: ["title", "description", "lawReference"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  });
};
