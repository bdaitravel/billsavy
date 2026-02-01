
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Image: string, mimeType: string) => {
  const ai = createAIInstance();
  
  // Forzamos mimeType compatibles con Gemini para evitar errores de red
  const supportedMimeType = mimeType === 'application/pdf' ? 'application/pdf' : 'image/jpeg';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: supportedMimeType,
            data: base64Image,
          },
        },
        {
          text: `Analiza este documento (PDF o imagen). Es una factura o contrato de hogar/vehículo en España.
          TU MISIÓN ES EXTRAER DATOS EXACTOS. No digas que no puedes leerlo, haz tu mejor esfuerzo buscando textos clave como 'Importe', 'Fecha', 'Vencimiento' o 'CUPS'.
          
          DATOS A EXTRAER:
          1. Empresa: (ej. Iberdrola, Mapfre, Pepephone...)
          2. Importe total: (solo el número)
          3. Fecha de factura: (DD/MM/AAAA)
          4. Categoría: Luz, Agua, Gas, Coche, Moto, Seguro, Teléfono, Comunidad, Suscripción.
          5. VENCIMIENTO: Calcula la fecha de renovación (si es seguro suele ser +1 año desde la fecha).
          6. VALORACIÓN PRECIO: Compara con la media en España.
          
          Responde ESTRICTAMENTE con este JSON:
          {
            "provider": "nombre",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "categoría",
            "priceRating": "PRECIO TOP | PRECIO NORMAL | AVISO BILLY",
            "billyAdvice": "un truco de ahorro corto",
            "action": "acción inmediata"
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
