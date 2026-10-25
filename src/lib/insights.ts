import type { VisualMode } from "./simulate";

export type Insight = {
  label: string;
  short: string;
  what: string;
  why: string;
  mistakes: string[];
  fixes: string[];
  wcag: string[];
  illustrative?: boolean;
};

const cvdCommon = {
  mistakes: [
    "Status shown only by color (red = error, green = success)",
    "Charts with color-only legends",
    "Links distinguished from text by color alone",
  ],
  fixes: [
    "Pair status colors with icons and text labels",
    "Label chart series directly, or add patterns",
    "Underline links in body text",
    "Maintain appropriate contrast between elements",
  ],
  wcag: ["1.4.1 Use of Color (A)", "1.4.3 Contrast Minimum (AA)", "1.4.11 Non-text Contrast (AA)"],
};

export const INSIGHTS: Record<VisualMode, Insight> = {
  original: {
    label: "Original",
    short: "Your screenshot, unchanged",
    what: "The screenshot exactly as you uploaded it. Use it as a baseline for comparison.",
    why: "Designers usually review work through their own eyes and devices, which can hide barriers others encounter.",
    mistakes: ["Testing only on one high-quality display", "Assuming everyone perceives color the same way"],
    fixes: ["Compare against each simulation", "Test with real users, including disabled people"],
    wcag: [],
  },
  protanopia: {
    label: "Protanopia",
    short: "Absent long-wavelength (red) cones",
    what: "Approximates vision with absent or nonfunctional long-wavelength cones. Reds appear darker and are easily confused with greens and browns.",
    why: "Red/green status pairs, sale badges, and red error text may lose their meaning or look dim.",
    ...cvdCommon,
  },
  deuteranopia: {
    label: "Deuteranopia",
    short: "Absent medium-wavelength (green) cones",
    what: "Approximates vision with absent or nonfunctional medium-wavelength cones. Reds, greens and oranges converge into similar yellow-brown tones.",
    why: "\"In stock\" and \"Sold out\" pills, and red/green chart bars, can look nearly identical.",
    ...cvdCommon,
  },
  tritanopia: {
    label: "Tritanopia",
    short: "Absent short-wavelength (blue) cones",
    what: "Approximates vision with absent or nonfunctional short-wavelength cones. Blues and greens, and yellows and pinks, become hard to tell apart.",
    why: "Blue links, teal accents and yellow warnings may blend into surrounding colors.",
    ...cvdCommon,
  },
  grayscale: {
    label: "Grayscale",
    short: "Color information removed",
    what: "Removes all hue so only lightness remains. A quick test of whether information depends on color alone.",
    why: "If two states look identical here, people who can't distinguish their colors also can't tell them apart.",
    ...cvdCommon,
  },
  blur: {
    label: "Reduced clarity",
    short: "Adjustable blur",
    what: "Blurs the screenshot to show how reduced visual clarity affects recognition of text and controls.",
    why: "Small, thin or low-contrast text and tiny icons become unreadable first.",
    mistakes: ["Small body text", "Important information embedded only in images", "Thin, light-gray type"],
    fixes: ["Use readable font sizes (16px+ body)", "Provide sufficient contrast", "Support text resizing up to 200%", "Keep key information as real text"],
    wcag: ["1.4.4 Resize Text (AA)", "1.4.5 Images of Text (AA)", "1.4.3 Contrast Minimum (AA)"],
    illustrative: true,
  },
  contrast: {
    label: "Reduced contrast",
    short: "Adjustable contrast reduction",
    what: "Flattens the difference between light and dark to show how subtle distinctions can disappear—for example on a glaring screen.",
    why: "Light-gray text, faint borders and subtle input outlines are the first to vanish.",
    mistakes: ["Placeholder-gray body text", "Input fields defined only by a faint border", "Disabled-looking primary buttons"],
    fixes: ["Meet 4.5:1 for body text", "Give controls a 3:1 boundary contrast", "Use the contrast checker on your palette"],
    wcag: ["1.4.3 Contrast Minimum (AA)", "1.4.11 Non-text Contrast (AA)"],
    illustrative: true,
  },
};

export const MODE_ORDER: VisualMode[] = ["original", "protanopia", "deuteranopia", "tritanopia", "grayscale", "blur", "contrast"];
