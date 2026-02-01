
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  const ai = createAIInstance();
  
  const finalMimeType = mimeType.includes('pdf') ? 'application/pdf' : 'image/jpeg';
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: finalMimeType,
            data: base64Data,
          },
        },
        {
          text: `Eres Billy, el asistente experto en auditoría de gastos. 
          Analiza este documento (factura, seguro o contrato). 
          Busca específicamente:
          1. Proveedor (ej. Iberdrola, Mapfre).
          2. Importe total.
          3. Fecha de emisión.
          4. FECHA DE VENCIMIENTO O RENOVACIÓN (Si no aparece, calcula +1 año para seguros o +1 mes para luz).
          5. Categoría.
          6. ¿Es un precio justo o abusivo comparado con el mercado español actual?

          Responde EXCLUSIVAMENTE este JSON:
          {
            "provider": "nombre",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "Luz|Agua|Gas|Seguro|Coche|Moto|Teléfono|Suscripción",
            "priceRating": "PRECIO TOP | PRECIO NORMAL | AVISO BILLY",
            "billyAdvice": "truco corto de ahorro",
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
