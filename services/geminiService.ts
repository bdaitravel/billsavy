
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Función central para analizar documentos con Billy AI.
 * Crea la instancia de la IA justo antes de la llamada para asegurar el uso de la clave más reciente.
 */
export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  // Comprobación de API Key antes de proceder
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Normalización de MimeType para el modelo
  let finalMimeType = mimeType;
  if (mimeType.toLowerCase().includes('pdf')) finalMimeType = 'application/pdf';
  else if (mimeType.toLowerCase().includes('png')) finalMimeType = 'image/png';
  else finalMimeType = 'image/jpeg';

  console.log(`[Billy AI] Procesando documento de tipo: ${finalMimeType}`);

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
            text: `Eres Billy, el auditor experto en facturas. 
            Extrae estos datos:
            1. Proveedor (Nombre de la empresa).
            2. Importe total (Número con decimales).
            3. Fecha factura.
            4. Categoría (Luz, Agua, Gas, Seguros, Coche, Moto, Suscripción, Otros).
            5. Fecha renovación o vencimiento (Estimada si no figura).
            
            Analiza si el precio es abusivo o bueno.
            Escribe un consejo (billyAdvice) audaz y ahorrador.
            Responde ÚNICAMENTE en JSON.`,
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
            priceRating: { type: Type.STRING, description: "AVISO BILLY o PRECIO TOP" },
            billyAdvice: { type: Type.STRING }
          },
          required: ["provider", "amount", "category"]
        }
      }
    });

    if (!response || !response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return JSON.parse(response.text.trim());
  } catch (error: any) {
    console.error("[Billy AI] Error durante el análisis:", error);
    
    // Si es un error de entidad no encontrada (clave inválida o proyecto sin cuota)
    if (error.message?.includes("entity was not found") || error.message?.includes("API key")) {
      throw new Error("API_KEY_INVALID");
    }
    
    throw error;
  }
};
