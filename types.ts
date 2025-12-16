export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16',
}

export interface GenerationSettings {
  model: ModelType;
  aspectRatio: AspectRatio;
  numberOfImages: number;
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  settings: GenerationSettings;
  createdAt: number;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
}