import { DUCK_INTRO_GRID } from '@/src/components/ui/duckIntro/duckIntroSettings';

export type DuckPixel = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  index: number;
};

let cachedPixels: DuckPixel[] | null = null;
let loadPromise: Promise<DuckPixel[]> | null = null;

function samplePixelsFromImageData(imageData: ImageData): DuckPixel[] {
  const { data, width } = imageData;
  const pixels: DuckPixel[] = [];

  for (let y = 0; y < DUCK_INTRO_GRID; y += 1) {
    for (let x = 0; x < DUCK_INTRO_GRID; x += 1) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a < 8) {
        continue;
      }

      pixels.push({
        x,
        y,
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a,
        index: pixels.length,
      });
    }
  }

  return pixels;
}

export async function loadDuckPixels(): Promise<DuckPixel[]> {
  if (cachedPixels) {
    return cachedPixels;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const response = await fetch('/logo.svg');
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load duck logo'));
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = DUCK_INTRO_GRID;
      canvas.height = DUCK_INTRO_GRID;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Canvas unavailable');
      }

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, DUCK_INTRO_GRID, DUCK_INTRO_GRID);
      ctx.drawImage(image, 0, 0, DUCK_INTRO_GRID, DUCK_INTRO_GRID);

      cachedPixels = samplePixelsFromImageData(
        ctx.getImageData(0, 0, DUCK_INTRO_GRID, DUCK_INTRO_GRID),
      );
      return cachedPixels;
    } finally {
      URL.revokeObjectURL(url);
    }
  })();

  try {
    return await loadPromise;
  } catch (error) {
    loadPromise = null;
    throw error;
  }
}
