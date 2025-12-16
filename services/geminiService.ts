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
        // We await the dialog. Even if the user cancels or it returns false, 
        // strict adherence to the "race condition" rule suggests we proceed 
        // hoping the env var is set or will be set. 
        try {
            await aiStudio.openSelectKey();
        } catch (e) {
            console.warn("Key selection dialog issue:", e);
            // Proceed anyway to attempt generation with current env
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
    
    let msg = error.message || "Failed to generate image.";
    
    // Handle specific error for key not found or permission issues
    if (msg.includes("Requested entity was not found") || msg.includes("403") || msg.includes("404")) {
        // If we are in the special environment, try to prompt for key again if likely a key issue
        if (settings.model === ModelType.PRO && window.aistudio) {
             msg = "API Key authorization failed. Please ensure you selected a valid paid project and try again.";
             // We don't force open here to avoid loops, let the user click generate again which triggers getClient -> openSelectKey if needed
             // But if hasSelectedApiKey is true but invalid, we might need to force it.
             // For now, relies on user retrying.
        }
    }
    
    throw new Error(msg);
  }
};