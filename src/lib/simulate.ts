// Client-side image simulation. Color vision deficiency uses the
// Machado, Oliveira & Fernandes (2009) model at severity 1.0, applied in linear RGB.
export type VisualMode =
  | "original"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "grayscale"
  | "blur"
  | "contrast";

type M3 = [number, number, number, number, number, number, number, number, number];

export const MACHADO: Record<"protanopia" | "deuteranopia" | "tritanopia", M3> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
};

const toLinear = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const s = i / 255;
  toLinear[i] = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function toSrgb8(l: number) {
  const c = l <= 0 ? 0 : l >= 1 ? 1 : l;
  const s = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

export function applyMatrix(data: Uint8ClampedArray, m: M3) {
  for (let i = 0; i < data.length; i += 4) {
    const r = toLinear[data[i]], g = toLinear[data[i + 1]], b = toLinear[data[i + 2]];
    data[i] = toSrgb8(m[0] * r + m[1] * g + m[2] * b);
    data[i + 1] = toSrgb8(m[3] * r + m[4] * g + m[5] * b);
    data[i + 2] = toSrgb8(m[6] * r + m[7] * g + m[8] * b);
  }
}

export function applyGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const y = 0.2126 * toLinear[data[i]] + 0.7152 * toLinear[data[i + 1]] + 0.0722 * toLinear[data[i + 2]];
    const v = toSrgb8(y);
    data[i] = data[i + 1] = data[i + 2] = v;
  }
}

/** amount 0..1: 0 = unchanged, 1 = flat mid-gray */
export function applyContrastReduction(data: Uint8ClampedArray, amount: number) {
  const k = 1 - amount;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 128 + (data[i] - 128) * k;
    data[i + 1] = 128 + (data[i + 1] - 128) * k;
    data[i + 2] = 128 + (data[i + 2] - 128) * k;
  }
}

export function renderSimulation(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  mode: VisualMode,
  opts: { blur: number; contrast: number },
) {
  const w = img.naturalWidth, h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.filter = "none";
  if (mode === "blur") {
    // Scale blur with image width so the effect looks similar for any screenshot size.
    ctx.filter = `blur(${(opts.blur * w) / 1000}px)`;
  }
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";
  if (mode === "original" || mode === "blur") return;
  const id = ctx.getImageData(0, 0, w, h);
  if (mode === "grayscale") applyGrayscale(id.data);
  else if (mode === "contrast") applyContrastReduction(id.data, opts.contrast);
  else applyMatrix(id.data, MACHADO[mode]);
  ctx.putImageData(id, 0, 0);
}
