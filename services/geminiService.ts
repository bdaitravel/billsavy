
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
    // Normalizamos el mimeType para evitar errores 400 en modelos que no soportan ciertos tipos
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
            text: `Actúa como un Abogado Experto en Derecho del Consumo y Perito Judicial Financiero en España.
            Analiza el documento adjunto (puede ser una factura de luz, contrato de seguro, extracto de hipoteca o recibo de comunidad).
            
            TU MISIÓN:
            1. Identifica al Proveedor, Importe Total y Fecha.
            2. Determina la Categoría (Luz, Agua, Gas, Seguros, Hipoteca, Telefonía, Comunidad, Suscripciones, Impuestos).
            3. AUDITORÍA LEGAL:
               - Si es HIPOTECA: Busca intereses superiores al Euribor+2% o cláusulas de gastos abusivas.
               - Si es SEGURO: Evalúa si la prima ha subido >10% sin previo aviso o si es cara para el mercado actual.
               - Si es SUMINISTRO (Luz/Gas): Busca precios kWh > 0.16€ o servicios de mantenimiento inútiles.
            4. VEREDICTO: Clasifica como 'ABUSIVO', 'JUSTO' u 'OPTIMIZADO'.
            5. DETALLE TÉCNICO: Explica con base legal o de mercado por qué das ese veredicto.
            6. PLAN DE ACCIÓN: Pasos concretos para reclamar o ahorrar dinero inmediatamente.

            Devuelve el resultado en este esquema JSON:
            {
              "provider": "nombre empresa",
              "amount": 0.0,
              "date": "DD/MM/AAAA",
              "category": "categoría",
              "auditStatus": "ABUSIVO | JUSTO | OPTIMIZADO",
              "auditDetail": "explicación detallada",
              "actionPlan": "pasos a seguir",
              "summary": "resumen breve"
            }`,
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
            auditStatus: { type: Type.STRING },
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
