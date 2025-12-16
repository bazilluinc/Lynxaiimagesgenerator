export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview',
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16',
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}

export interface GenerationSettings {
  model: ModelType;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
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
