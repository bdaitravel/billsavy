
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Image: string, mimeType: string) => {
  const ai = createAIInstance();
  
  // Normalización estricta de MimeType para Gemini
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
          text: `Analiza esta factura o contrato de España. 
          BUSCA LOS DATOS REALES: Importe total, Fecha de factura y Fecha de Vencimiento/Renovación.
          Si es un seguro de coche, moto o hogar, calcula la renovación sumando 1 año a la fecha de efecto.
          Si es una factura de luz (Iberdrola, Endesa, etc), identifica el importe exacto.

          Responde EXCLUSIVAMENTE este JSON:
          {
            "provider": "nombre empresa",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "Luz | Agua | Gas | Coche | Moto | Seguro | Teléfono | Suscripción",
            "priceRating": "PRECIO TOP | PRECIO NORMAL | AVISO BILLY",
            "billyAdvice": "un truco de ahorro corto",
            "action": "acción recomendada"
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
          renewalDate: { type: Type.STRING },
          category: { type: Type.STRING },
          priceRating: { type: Type.STRING },
          billyAdvice: { type: Type.STRING },
          action: { type: Type.STRING }
        },
        required: ["provider", "amount", "date", "renewalDate", "category", "priceRating", "billyAdvice", "action"]
      }
    }
  });
  
  return JSON.parse(response.text);
};
