// WCAG 2.x contrast ratio using the relative luminance formula.
export function parseHex(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance([r, g, b]: [number, number, number]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: [number, number, number], b: [number, number, number]) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const THRESHOLDS = {
  aaNormal: 4.5,
  aaLarge: 3,
  aaaNormal: 7,
  aaaLarge: 4.5,
} as const;

export function wcagResults(ratio: number) {
  // Compare on the ratio rounded down to 2 decimals so 4.499 never passes 4.5.
  const r = Math.floor(ratio * 100) / 100;
  return {
    aaNormal: r >= THRESHOLDS.aaNormal,
    aaLarge: r >= THRESHOLDS.aaLarge,
    aaaNormal: r >= THRESHOLDS.aaaNormal,
    aaaLarge: r >= THRESHOLDS.aaaLarge,
  };
}
