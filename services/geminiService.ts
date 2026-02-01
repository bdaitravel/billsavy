
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
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
          text: `Eres Billy, el asistente inteligente para el ahorro en casa y vehículos en España.
          Tu trabajo es leer este documento y decirme cuándo hay que renovarlo y si el precio es bueno.
          
          OBJETIVOS:
          1. Extraer: Empresa, Importe y Fecha.
          2. Categoría: Hogar (Luz, Agua, Gas, Comunidad), Vehículo (Coche, Moto, Seguro), Otros (Suscripciones, Teléfono).
          3. PRÓXIMA CITA: Si es un seguro, calcula 1 año desde la fecha para el recordatorio de renovación.
          4. ¿PAGO MUCHO?: Compara con los precios actuales en España.
             - "PRECIO TOP": Si es muy barato.
             - "PRECIO NORMAL": Si está en la media.
             - "AVISO BILLY": Si crees que el usuario puede ahorrar >15€/mes cambiándose.
          
          Responde SOLO este JSON:
          {
            "provider": "nombre empresa",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "categoría",
            "priceRating": "PRECIO TOP | PRECIO NORMAL | AVISO BILLY",
            "billyAdvice": "un consejo corto sobre este gasto",
            "action": "qué hacer para ahorrar o recordar"
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
