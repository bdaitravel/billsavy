
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  const ai = createAIInstance();
  
  // Forzamos el tipo de contenido para asegurar compatibilidad con Gemini
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
          text: `Eres Billy, el asistente experto en ahorro para hogares y vehículos en España.
          Analiza este documento (PDF o imagen). Es una factura real o un contrato.
          No digas que no puedes leerlo; extrae toda la información posible buscando palabras clave.

          DATOS OBLIGATORIOS A EXTRAER:
          1. Empresa: Nombre del proveedor (ej. Iberdrola, Endesa, Mapfre, Pepephone).
          2. Importe: El total de la factura (solo el número).
          3. Fecha: Fecha de emisión (DD/MM/AAAA).
          4. Categoría: Luz, Agua, Gas, Coche, Moto, Seguro, Teléfono, Suscripción.
          5. Renovación: Si es seguro, fecha + 1 año. Si es suministro, fecha + 1 mes.
          6. Rating: 'PRECIO TOP' (buen precio), 'PRECIO NORMAL', 'AVISO BILLY' (caro).

          Responde EXCLUSIVAMENTE este JSON:
          {
            "provider": "nombre empresa",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "categoría",
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
