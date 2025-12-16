import { GoogleGenAI } from "@google/genai";
import { GenerationSettings, ModelType } from "../types";

export const generateImage = async (
  prompt: string,
  settings: GenerationSettings
): Promise<string[]> => {
  try {
    // Standard initialization using the environment API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const config: any = {
      imageConfig: {
        aspectRatio: settings.aspectRatio,
      },
    };

    const response = await ai.models.generateContent({
      model: ModelType.FLASH, // Strictly enforce Flash model
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
      throw new Error("No image data returned from the model.");
    }

    return images;

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    let msg = error.message || "Failed to generate image.";
    
    // Generic API error handling
    if (msg.includes("403") || msg.includes("404")) {
         msg = "API Service Unavailable. Please check your API Key and quota.";
    }
    
    throw new Error(msg);
  }
};