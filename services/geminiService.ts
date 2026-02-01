
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
          text: `Eres Billy, el asistente personal inteligente para la gestión de gastos de hogar, coche y moto en España.
          Tu objetivo es extraer información clave para que el usuario no se olvide de sus renovaciones y sepa si está pagando de más.
          
          TAREAS:
          1. Identifica: Proveedor, Importe, Fecha del documento.
          2. Determina Categoría: (Hogar, Coche, Moto, Luz, Agua, Gas, Telefonía, Comunidad, Seguros, Suscripciones).
          3. Calcula/Estima la PRÓXIMA RENOVACIÓN: Si es un seguro o contrato anual, suma 1 año a la fecha.
          4. ANÁLISIS DE PRECIO: Compara con los precios medios en España. 
             - Si el precio es bueno: "OPTIMIZADO"
             - Si es normal: "JUSTO"
             - Si detectas algo raro o muy caro (>20% media): "AVISO BILLY" (indica por qué).
          
          Responde EXCLUSIVAMENTE en JSON:
          {
            "provider": "nombre",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "categoría",
            "status": "OPTIMIZADO | JUSTO | AVISO BILLY",
            "billyTip": "consejo breve sobre el precio o renovación",
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
          status: { type: Type.STRING },
          billyTip: { type: Type.STRING },
          action: { type: Type.STRING }
        },
        required: ["provider", "amount", "date", "renewalDate", "category", "status", "billyTip", "action"]
      }
    }
  });
  
  return JSON.parse(response.text);
};
