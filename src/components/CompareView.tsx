import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export type CompareLayout = "slider" | "side" | "original" | "simulated";

export function CompareView({
  originalSrc,
  simulatedSrc,
  layout,
  label,
}: {
  originalSrc: string;
  simulatedSrc: string;
  layout: CompareLayout;
  label: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const frame = "overflow-hidden rounded-2xl border border-border bg-muted";

  if (layout === "original" || layout === "simulated") {
    return (
      <figure className={frame}>
        <img src={layout === "original" ? originalSrc : simulatedSrc} alt={layout === "original" ? "Original screenshot" : `Screenshot simulated as ${label}`} className="block w-full" />
      </figure>
    );
  }

  if (layout === "side") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {[
          [originalSrc, "Original"],
          [simulatedSrc, label],
        ].map(([src, cap]) => (
          <figure key={cap} className={frame}>
            <img src={src} alt={`${cap} screenshot`} className="block w-full" />
            <figcaption className="border-t border-border bg-card px-3 py-2 text-sm text-muted-foreground">{cap}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  const onDown = (e: PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };

  return (
    <div
      ref={ref}
      className={`relative touch-none select-none ${frame}`}
      onPointerDown={onDown}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img src={simulatedSrc} alt={`Screenshot simulated as ${label}`} className="block w-full" draggable={false} />
      <img
        src={originalSrc}
        alt="Original screenshot"
        draggable={false}
        className="absolute inset-0 block h-full w-full"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium shadow-soft">Original</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-soft">{label}</span>
      <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary" style={{ left: `${pos}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Comparison divider position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% original shown`}
          onKeyDown={onKey}
          className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-primary bg-card text-primary shadow-lift"
        >
          <span aria-hidden className="text-sm font-semibold">⇆</span>
        </div>
      </div>
    </div>
  );
}
