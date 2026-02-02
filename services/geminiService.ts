
import { GoogleGenAI, Type } from "@google/genai";

const createAIInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBillImage = async (base64Data: string, mimeType: string) => {
  const ai = createAIInstance();
  
  // Lista de tipos soportados por Gemini
  const supportedTypes = [
    'image/png', 
    'image/jpeg', 
    'image/webp', 
    'image/heic', 
    'image/heif', 
    'application/pdf'
  ];

  // Si el tipo no está en la lista, intentamos tratarlo como imagen/jpeg por defecto
  const finalMimeType = supportedTypes.includes(mimeType) ? mimeType : 'image/jpeg';
  
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
          text: `Eres Billy, el auditor experto en el mercado español. 
          Analiza este documento (factura, póliza de seguro, contrato o recibo).
          
          OBJETIVOS:
          1. Identifica al Proveedor (ej. Endesa, Linea Directa, Netflix).
          2. Extrae el Importe total con IVA.
          3. Encuentra la Fecha de emisión del cargo.
          4. CRITICAL: Busca la FECHA DE FIN DE CONTRATO o RENOVACIÓN. Si es un seguro, suele ser anual. Si es luz, suele ser mensual. Indica la fecha exacta.
          5. Categoría exacta entre: Luz, Agua, Gas, Seguros, Coche, Moto, Teléfono, Suscripción, Hipoteca.
          6. Análisis de Mercado: ¿Es caro? ¿Hay una oferta mejor ahora mismo?

          Responde EXCLUSIVAMENTE este JSON:
          {
            "provider": "nombre",
            "amount": 0.0,
            "date": "DD/MM/AAAA",
            "renewalDate": "DD/MM/AAAA",
            "category": "Categoría",
            "priceRating": "PRECIO TOP | PRECIO NORMAL | AVISO BILLY",
            "billyAdvice": "Un consejo de 10 palabras sobre cómo ahorrar en esto",
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
