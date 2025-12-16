import { AspectRatio, ModelType } from './types';

export const DEFAULT_SETTINGS = {
  model: ModelType.FLASH,
  aspectRatio: AspectRatio.SQUARE,
  numberOfImages: 1,
};

export const ASPECT_RATIOS = [
  { value: AspectRatio.SQUARE, label: 'Square (1:1)', icon: 'Square' },
  { value: AspectRatio.WIDE, label: 'Wide (16:9)', icon: 'RectangleHorizontal' },
  { value: AspectRatio.TALL, label: 'Tall (9:16)', icon: 'RectangleVertical' },
  { value: AspectRatio.LANDSCAPE, label: 'Landscape (4:3)', icon: 'Monitor' },
  { value: AspectRatio.PORTRAIT, label: 'Portrait (3:4)', icon: 'Smartphone' },
];