
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let finalMimeType = mimeType;
  if (mimeType.includes('pdf')) finalMimeType = 'application/pdf';
  else if (mimeType.includes('image')) finalMimeType = mimeType;
  else finalMimeType = 'image/jpeg';

  console.log(`[Billy AI] Analizando: ${finalMimeType}`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: finalMimeType,
              data: base64Data,
            },
          },
          {
            text: `Eres Billy, un experto en auditoría de facturas españolas. 
            Tu misión es extraer datos de este documento (PDF o Imagen). 
            Busca: Proveedor (empresa), Importe Total (con decimales), Fecha de factura, Categoría y Fecha de renovación.
            
            Categorías: Luz, Agua, Gas, Seguros, Coche, Moto, Suscripción, Otros.
            
            Evalúa el precio: si es caro pon "AVISO BILLY", si es bueno "PRECIO TOP".
            Escribe un consejo corto (billyAdvice) sobre cómo ahorrar en este gasto concreto.
            
            Responde exclusivamente en JSON.`,
          },
        ],
      }],
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
          required: ["provider", "amount", "category"]
        }
      }
    });

    if (!response || !response.text) throw new Error("No hay respuesta de la IA");

    const cleanJson = response.text.trim();
    console.log("[Billy AI] Resultado:", cleanJson);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("[Billy AI] Error:", error);
    throw new Error("No he podido leer bien ese archivo. Prueba a subir uno más legible.");
  }
};
