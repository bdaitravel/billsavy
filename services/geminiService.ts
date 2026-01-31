
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
            text: `Eres el motor de auditoría avanzada de BillSavy OS. 
            Analiza este documento (puede ser una factura o un contrato). 
            Extrae con precisión quirúrgica:
            1. Proveedor y CIF si aparece.
            2. Importe total o cuota mensual estimada.
            3. Categoría (Luz, Seguros, Coche, etc.).
            4. ALERTAS DE CONTRATO: ¿Hay permanencia? ¿El precio es superior a la media de mercado actual en España? ¿Hay servicios extra como "mantenimiento" que suelen ser innecesarios?
            5. Fecha de vencimiento o renovación.
            
            Devuelve un resumen ejecutivo para el usuario.`,
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
    const prompt = `Analiza estos gastos: ${JSON.stringify(expenses)}. 
    Genera un plan de ahorro agresivo. Compara con las mejores tarifas actuales de PVPC, mercado libre y seguros low-cost en España.`;

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
      contents: "Lista 4 derechos de defensa del consumidor en España ante eléctricas y aseguradoras.",
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
