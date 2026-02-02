
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  // Inicialización directa con la API KEY del entorno
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Normalización estricta de MimeType
  let finalMimeType = mimeType;
  if (mimeType.includes('pdf')) finalMimeType = 'application/pdf';
  else if (mimeType.includes('image')) finalMimeType = mimeType;
  else finalMimeType = 'image/jpeg';

  console.log(`[Billy AI] Iniciando análisis. Tipo: ${finalMimeType}, Tamaño base64: ${base64Data.length} chars`);

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
            text: `AUDITORÍA DE GASTOS. Extrae los datos de este documento. 
            Si no estás seguro de algún campo, inventa una estimación lógica basada en el contexto del documento.
            Campos necesarios: proveedor, importe (amount), fecha (date), categoría (category), fecha de renovación (renewalDate).
            
            Formatos de categoría permitidos: Luz, Agua, Gas, Seguros, Coche, Moto, Suscripción, Otros.
            
            Responde ÚNICAMENTE un JSON válido.`,
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
            priceRating: { type: Type.STRING, description: "PRECIO TOP, PRECIO NORMAL o AVISO BILLY" },
            billyAdvice: { type: Type.STRING },
            action: { type: Type.STRING }
          },
          required: ["provider", "amount", "category"]
        }
      }
    });

    if (!response || !response.text) {
      throw new Error("La IA respondió vacío");
    }

    const cleanJson = response.text.trim();
    console.log("[Billy AI] Respuesta recibida:", cleanJson);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("[Billy AI] Error crítico en el servicio:", error);
    throw error;
  }
};
