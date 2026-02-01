
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleAIRequest = async (requestFn: () => Promise<any>) => {
  try {
    return await requestFn();
  } catch (error: any) {
    console.error("Error en Gemini API:", error);
    throw error;
  }
};

export const analyzeBillImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
  return handleAIRequest(async () => {
    const ai = createAIInstance();
    const finalMimeType = mimeType.includes('pdf') ? 'application/pdf' : 'image/jpeg';
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: finalMimeType,
              data: base64Image,
            },
          },
          {
            text: `Eres el Auditor Senior de Consumo y Abogado Financiero de BillSavy. 
            Tu misión es auditar este documento (Factura, Póliza de Seguro o Extracto Hipotecario).
            
            GUÍA DE AUDITORÍA:
            1. HIPOTECAS: Busca intereses > Euribor+2%, gastos de notaría/registro cargados al cliente, o seguros vinculados ilegales.
            2. SEGUROS (Coche/Hogar): Evalúa si la prima ha subido injustificadamente o si el precio es >30% superior a la media de mercado actual.
            3. ENERGÍA: Busca precios kWh > 0.15€ en valle o cargos por servicios de mantenimiento ocultos.
            
            RESULTADO REQUERIDO:
            - Identifica al Proveedor, Importe y Fecha.
            - Categoría exacta (Hipotecas, Seguros, Luz, etc.).
            - Veredicto: ABUSIVO (ilegal o fuera de mercado), JUSTO (precio normal), OPTIMIZADO (excelente precio).
            - Explicación Técnica: Detalles de por qué es abusivo citando conceptos legales o de mercado.
            - Plan de Acción: Pasos exactos para ahorrar.

            Responde ÚNICAMENTE en JSON puro.`,
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
            auditStatus: { type: Type.STRING, description: "MUST BE: ABUSIVO, OPTIMIZADO, JUSTO" },
            auditDetail: { type: Type.STRING },
            actionPlan: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["provider", "amount", "date", "category", "auditStatus", "auditDetail", "actionPlan"]
        }
      }
    });
    return JSON.parse(response.text);
  });
};
