import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, ModelType } from "../types";

// Helper to validate and get key
const getClient = async (isPro: boolean) => {
  // Pro models often require specific billing projects/keys in some environments
  if (isPro && window.aistudio) {
    // Cast to any to bypass potential type mismatches with the environment's AIStudio definition
    const aiStudio = window.aistudio as any;
    const hasKey = await aiStudio.hasSelectedApiKey();
    if (!hasKey) {
        try {
            const success = await aiStudio.openSelectKey();
            if (!success) throw new Error("API Key selection failed or cancelled.");
        } catch (e) {
            console.error("Key selection error", e);
            throw new Error("You must select a paid API key to use Lynx Pro.");
        }
    }
  }
  
  // Always create a new instance to pick up any potentially updated key from the environment
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateImage = async (
  prompt: string,
  settings: GenerationSettings
): Promise<string[]> => {
  try {
    const isPro = settings.model === ModelType.PRO;
    const ai = await getClient(isPro);

    const config: any = {
      imageConfig: {
        aspectRatio: settings.aspectRatio,
      },
    };

    // Pro model supports explicit size configuration
    if (isPro) {
      config.imageConfig.imageSize = settings.imageSize;
    }

    // Pro model supports google_search tool for grounding, but we'll keep it simple for now unless requested.
    // However, if we wanted to add grounding, we'd add tools: [{google_search: {}}] here.

    const response = await ai.models.generateContent({
      model: settings.model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: config,
    });

    const images: string[] = [];

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          images.push(`data:${mimeType};base64,${base64Data}`);
        }
      }
    }

    if (images.length === 0) {
      throw new Error("No image data returned from the model. It might have been blocked or failed to generate.");
    }

    return images;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Handle specific error for key not found if possible, but generic is fine
    let msg = error.message || "Failed to generate image.";
    if (msg.includes("Requested entity was not found")) {
        msg = "API Key error. Please try selecting your key again.";
    }
    throw new Error(msg);
  }
};