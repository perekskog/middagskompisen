import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateRecipeSuggestion(
  category: Category,
  favorites: string[],
  date: string,
  complexity: 'enkelt' | 'ambitiöst',
  excludedRecipes: string[] = [],
  requiredIngredient?: string
) {
  const model = "gemini-3-flash-preview";
  
  const d = new Date(date);
  
  // Combine favorites to avoid and already planned recipes
  const allExcluded = Array.from(new Set([...favorites, ...excludedRecipes]));

  const prompt = `Ge mig ett middagsförslag. 
  Kategorin är ${category === 'valfritt' ? 'valfri (vegetarisk, kött eller fisk)' : category}.
  ${requiredIngredient ? `Maträtten MÅSTE innehålla ingrediensen: ${requiredIngredient}.` : ''}
  
  KONTEXT: Idag är det ${d.toLocaleDateString('sv-SE', { weekday: 'long' })}. 
  Föreslå något som är ${complexity === 'ambitiöst' ? 'lite mer ambitiöst och festligt' : 'enkelt och snabblagat'}.
  
  VIKTIGT: 
  1. Välj en maträtt som finns på en känd svensk matwebbplats (t.ex. ICA, Arla, Tasteline, Köket.se, Coop).
  2. Undvik AI-genererade recept.
  3. DU FÅR ABSOLUT INTE föreslå någon av dessa rätter: ${allExcluded.join(', ')}.
  
  Svara i JSON-format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Namnet på maträtten" },
          description: { type: Type.STRING, description: "Kort beskrivning varför det passar" }
        },
        required: ["title"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text);
    
    // Always construct Google search URL
    const query = encodeURIComponent(result.title);
    const searchUrl = `https://www.google.com/search?q=${query}+recept`;

    return {
      title: result.title,
      url: searchUrl,
      description: result.description
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
}
