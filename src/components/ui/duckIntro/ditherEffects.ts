import type {
  DuckIntroColorModeId,
  DuckIntroEffectId,
} from '@/src/components/ui/duckIntro/duckIntroSettings';
import type { DuckPixel } from '@/src/components/ui/duckIntro/duckPixels';

export type RenderPixel = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
};

export type DitherFrameInput = {
  pixels: DuckPixel[];
  progress: number;
  seed: number;
  timeMs: number;
  colorModeId: DuckIntroColorModeId;
};

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const;

const SCRAMBLE_PALETTE = [
  [39, 229, 239],
  [176, 242, 247],
  [255, 192, 0],
  [32, 31, 32],
  [250, 250, 250],
  [24, 24, 27],
] as const;

const BRAND_CYAN = [39, 229, 239] as const;
const ACCENT_GOLD = [255, 192, 0] as const;

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

function hash1(n: number, seed: number) {
  return hash2(n, seed * 17, seed);
}

function pickPalette(t: number): readonly [number, number, number] {
  const i = Math.floor(t * SCRAMBLE_PALETTE.length) % SCRAMBLE_PALETTE.length;
  return SCRAMBLE_PALETTE[i];
}

function luma(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function easeIn(t: number) {
  return t * t;
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

function mixRgb(
  from: { r: number; g: number; b: number },
  to: readonly [number, number, number],
  t: number,
): [number, number, number] {
  const mix = clamp01(t);
  return [
    clampByte(from.r * (1 - mix) + to[0] * mix),
    clampByte(from.g * (1 - mix) + to[1] * mix),
    clampByte(from.b * (1 - mix) + to[2] * mix),
  ];
}

function applyColorMode(
  pixel: DuckPixel,
  amount: number,
  colorModeId: DuckIntroColorModeId,
  seed: number,
  timeMs: number,
): RenderPixel {
  const base = { x: pixel.x, y: pixel.y, r: pixel.r, g: pixel.g, b: pixel.b, a: pixel.a };
  const t = clamp01(amount);
  if (t <= 0.001 || colorModeId === 'preserve') {
    return base;
  }

  switch (colorModeId) {
    case 'monochrome': {
      const gray = luma(pixel.r, pixel.g, pixel.b);
      const [r, g, b] = mixRgb(pixel, [gray, gray, gray], t);
      return { ...base, r, g, b };
    }
    case 'desaturate': {
      const gray = luma(pixel.r, pixel.g, pixel.b);
      // Keep a hint of hue longer than hard mono
      const [r, g, b] = mixRgb(pixel, [gray, gray, gray], t * 0.85);
      return { ...base, r, g, b };
    }
    case 'brightness-up': {
      const lift = 1 + t * 1.35;
      return {
        ...base,
        r: clampByte(pixel.r * lift + t * 40),
        g: clampByte(pixel.g * lift + t * 40),
        b: clampByte(pixel.b * lift + t * 40),
      };
    }
    case 'brightness-down': {
      const dim = 1 - t * 0.92;
      return {
        ...base,
        r: clampByte(pixel.r * dim),
        g: clampByte(pixel.g * dim),
        b: clampByte(pixel.b * dim),
      };
    }
    case 'brand-soft': {
      const [r, g, b] = mixRgb(pixel, BRAND_CYAN, t * 0.65);
      return { ...base, r, g, b };
    }
    case 'accent-soft': {
      const [r, g, b] = mixRgb(pixel, ACCENT_GOLD, t * 0.65);
      return { ...base, r, g, b };
    }
    case 'palette-scramble': {
      const flicker = hash2(pixel.x, pixel.y, seed + Math.floor(timeMs / 40));
      const [pr, pg, pb] = pickPalette(flicker);
      const [r, g, b] = mixRgb(pixel, [pr, pg, pb], t * 0.95);
      return { ...base, r, g, b };
    }
    default:
      return base;
  }
}

function withEdgeColor(
  pixel: DuckPixel,
  amount: number,
  input: DitherFrameInput,
): RenderPixel {
  return applyColorMode(pixel, amount, input.colorModeId, input.seed, input.timeMs);
}

function randomDissolve(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed } = input;
  const p = easeIn(clamp01(progress));
  const out: RenderPixel[] = [];

  for (const pixel of pixels) {
    const deathAt = hash2(pixel.x, pixel.y, seed) * 0.92;
    const alphaMul = aliveThreshold(p, deathAt, 0.1);
    if (alphaMul <= 0.01) {
      continue;
    }

    const edgeAmt = clamp01((p - deathAt + 0.18) / 0.18);
    const rendered = withEdgeColor(pixel, edgeAmt * 0.95, input);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}

function bayerFade(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed } = input;
  const p = clamp01(progress);
  const out: RenderPixel[] = [];

  for (const pixel of pixels) {
    const bayer = (BAYER_4[pixel.y % 4][pixel.x % 4] + 0.5) / 16;
    const jitter = (hash2(pixel.x, pixel.y, seed) - 0.5) * 0.08;
    const deathAt = clamp01(bayer + jitter);
    const alphaMul = aliveThreshold(p, deathAt * 0.95, 0.06);
    if (alphaMul <= 0.01) {
      continue;
    }

    const nearEdge = clamp01((p - deathAt + 0.15) / 0.15);
    const rendered = withEdgeColor(pixel, nearEdge * 0.7, input);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}

function chromaticScramble(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed, timeMs } = input;
  const p = clamp01(progress);
  const scrambleWindow = clamp01(p / 0.35);
  const dissolve = clamp01((p - 0.25) / 0.75);
  const out: RenderPixel[] = [];

  for (const pixel of pixels) {
    const deathAt = hash2(pixel.y, pixel.x, seed + 3) * 0.9;
    const alphaMul = aliveThreshold(dissolve, deathAt, 0.12);
    if (alphaMul <= 0.01) {
      continue;
    }

    const wave = hash2(pixel.x, pixel.y, seed + Math.floor(timeMs / 28));
    const edgeAmt = scrambleWindow * (0.55 + wave * 0.45);
    const rendered = withEdgeColor(pixel, edgeAmt, input);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}

function noiseErosion(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed, timeMs } = input;
  const p = easeIn(clamp01(progress));
  const out: RenderPixel[] = [];

  for (const pixel of pixels) {
    const n1 = hash2(pixel.x, pixel.y, seed);
    const n2 = hash2(pixel.x + 3, pixel.y + 7, seed + 11);
    const deathAt = n1 * 0.55 + n2 * 0.4;
    const alphaMul = aliveThreshold(p, deathAt, 0.14);
    if (alphaMul <= 0.01) {
      continue;
    }

    const jitter = hash2(pixel.x, pixel.y, seed + Math.floor(timeMs / 50));
    const edgeAmt = clamp01(p * 0.85 + jitter * 0.2);
    const rendered = withEdgeColor(pixel, edgeAmt, input);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}

/** Bottom → top: lower rows dissolve first, wipe travels upward */
function scanWipe(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed } = input;
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
    const rendered = withEdgeColor(pixel, band * 0.9, input);
    out.push({ ...rendered, a: Math.round(pixel.a * alphaMul) });
  }

  return out;
}

function blockGlitch(input: DitherFrameInput): RenderPixel[] {
  const { pixels, progress, seed, timeMs } = input;
  const p = easeIn(clamp01(progress));
  const out: RenderPixel[] = [];

  for (const pixel of pixels) {
    const bx = Math.floor(pixel.x / 2);
    const by = Math.floor(pixel.y / 2);
    const deathAt = hash2(bx, by, seed) * 0.9;
    const alphaMul = aliveThreshold(p, deathAt, 0.08);
    if (alphaMul <= 0.01) {
      continue;
    }

    const blockFlicker = hash2(bx, by, seed + Math.floor(timeMs / 55));
    const edgeAmt = clamp01((p - deathAt + 0.25) / 0.25) * (0.6 + blockFlicker * 0.4);
    const shift = Math.floor(blockFlicker * 3) - 1;
    const rendered = withEdgeColor(pixel, edgeAmt, input);

    out.push({
      ...rendered,
      x: Math.min(15, Math.max(0, pixel.x + (edgeAmt > 0.4 ? shift : 0))),
      a: Math.round(pixel.a * alphaMul),
    });
  }

  return out;
}

const EFFECT_FNS: Record<DuckIntroEffectId, (input: DitherFrameInput) => RenderPixel[]> = {
  'random-dissolve': randomDissolve,
  'bayer-fade': bayerFade,
  'chromatic-scramble': chromaticScramble,
  'noise-erosion': noiseErosion,
  'scan-wipe': scanWipe,
  'block-glitch': blockGlitch,
};

export function sampleDuckIntroSeed(playIndex = 0): number {
  return Math.floor(hash1(playIndex + 1, 42) * 1_000_000_000);
}

export function renderDuckIntroFrame(
  effectId: DuckIntroEffectId,
  input: DitherFrameInput,
): RenderPixel[] {
  return EFFECT_FNS[effectId](input);
}
