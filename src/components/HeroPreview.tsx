import { useEffect, useRef, useState } from "react";
import demo from "@/assets/demo-site.jpg";
import { renderSimulation, type VisualMode } from "@/lib/simulate";

const CYCLE: { mode: VisualMode; label: string }[] = [
  { mode: "original", label: "Original" },
  { mode: "deuteranopia", label: "Deuteranopia" },
  { mode: "protanopia", label: "Protanopia" },
  { mode: "tritanopia", label: "Tritanopia" },
  { mode: "blur", label: "Reduced clarity" },
];

export function HeroPreview() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      CYCLE.forEach((c, idx) => {
        const cv = canvases.current[idx];
        if (cv) renderSimulation(img, cv, c.mode, { blur: 3, contrast: 0 });
      });
      setReady(true);
    };
    img.src = demo;
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % CYCLE.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-3xl border border-border bg-card p-3 shadow-lift">
      <div className="relative aspect-[1600/1008] overflow-hidden rounded-2xl bg-muted">
        {CYCLE.map((c, idx) => (
          <canvas
            key={c.mode}
            ref={(el) => {
              canvases.current[idx] = el;
            }}
            aria-hidden
            className="absolute inset-0 h-full w-full transition-opacity duration-700"
            style={{ opacity: ready && idx === i ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Preview condition">
        {CYCLE.map((c, idx) => (
          <button
            key={c.mode}
            type="button"
            onClick={() => setI(idx)}
            aria-pressed={idx === i}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              idx === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
