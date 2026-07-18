import type { DuckPixel } from '@/src/components/ui/duckIntro/duckPixels';

type RenderPixel = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
};

type DitherFrameInput = {
  pixels: DuckPixel[];
  progress: number;
  seed: number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function clampByte(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function hash2(x: number, y: number, seed: number) {
  let n = (x * 374761393 + y * 668265263 + seed * 1274126177) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967295;
}

function aliveThreshold(progress: number, threshold: number, soft = 0.12) {
  const p = clamp01(progress);
  if (p < threshold) {
    return 1;
  }
  if (p >= threshold + soft) {
    return 0;
  }
  return 1 - (p - threshold) / soft;
}

/** Brighten pixels near the dissolve edge */
function brightenOut(pixel: DuckPixel, amount: number): RenderPixel {
  const t = clamp01(amount);
  if (t <= 0.001) {
    return { x: pixel.x, y: pixel.y, r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a };
  }

  const lift = 1 + t * 1.35;
  return {
    x: pixel.x,
    y: pixel.y,
    r: clampByte(pixel.r * lift + t * 40),
    g: clampByte(pixel.g * lift + t * 40),
    b: clampByte(pixel.b * lift + t * 40),
    a: pixel.a,
  };
}

/** Bottom → top wipe with per-pixel dither jitter */
export function renderDuckIntroFrame({
  pixels,
  progress,
  seed,
}: DitherFrameInput): RenderPixel[] {
  const p = clamp01(progress);
  const out: RenderPixel[] = [];
  const front = p * 1.15;

  for (const pixel of pixels) {
    const rowFromBottom = (15 - pixel.y) / 15;
    const dither = hash2(pixel.x, pixel.y, seed) * 0.22;
    const deathAt = clamp01(rowFromBottom * 0.85 + dither);
    const alphaMul = aliveThreshold(front, deathAt, 0.1);
    if (alphaMul <= 0.01) {
      continue;
    }

    const band = clamp01(1 - Math.abs(front - deathAt) * 4);
    const rendered = brightenOut(pixel, band * 0.9);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}
