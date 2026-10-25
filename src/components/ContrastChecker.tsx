import { useId, useState } from "react";
import { Check, X } from "lucide-react";
import { contrastRatio, parseHex, wcagResults } from "@/lib/contrast";

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const [text, setText] = useState(value);
  const valid = parseHex(text) !== null;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={value}
          onChange={(e) => {
            setText(e.target.value);
            onChange(e.target.value);
          }}
          className="h-11 w-14 cursor-pointer rounded-lg border border-input bg-card p-1"
        />
        <input
          id={id}
          value={text}
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : `${id}-err`}
          onChange={(e) => {
            setText(e.target.value);
            const rgb = parseHex(e.target.value);
            if (rgb) onChange("#" + rgb.map((n) => n.toString(16).padStart(2, "0")).join(""));
          }}
          className="h-11 w-full rounded-lg border border-input bg-card px-3 font-mono text-sm uppercase"
        />
      </div>
      {!valid && <p id={`${id}-err`} className="mt-1 text-sm text-destructive">Enter a 3- or 6-digit HEX color, like #1E2430.</p>}
    </div>
  );
}

export function ContrastChecker({ onMeasure }: { onMeasure?: (m: { fg: string; bg: string; ratio: number }) => void }) {
  const [fg, setFg] = useState("#1e2430");
  const [bg, setBg] = useState("#fafaf8");
  const ratio = contrastRatio(parseHex(fg)!, parseHex(bg)!);
  const r = wcagResults(ratio);
  const rows = [
    ["AA · normal text", "4.5:1", r.aaNormal],
    ["AA · large text", "3:1", r.aaLarge],
    ["AAA · normal text", "7:1", r.aaaNormal],
    ["AAA · large text", "4.5:1", r.aaaLarge],
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <ColorField label="Foreground (text)" value={fg} onChange={setFg} />
        <ColorField label="Background" value={bg} onChange={setBg} />
        <div className="rounded-xl border border-border p-6" style={{ color: fg, backgroundColor: bg }}>
          <p className="text-2xl font-semibold">Large text preview (24px)</p>
          <p className="mt-2 text-base">Normal body text preview. The quick brown fox jumps over the lazy dog.</p>
        </div>
        {onMeasure && (
          <button
            type="button"
            onClick={() => onMeasure({ fg, bg, ratio })}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Add this measurement to my summary
          </button>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="text-sm text-muted-foreground">Contrast ratio</p>
        <p className="font-display text-7xl" aria-live="polite">{(Math.floor(ratio * 100) / 100).toFixed(2)}:1</p>
        <ul className="mt-6 divide-y divide-border">
          {rows.map(([label, need, pass]) => (
            <li key={label} className="flex items-center justify-between py-3">
              <span>
                {label} <span className="text-sm text-muted-foreground">needs {need}</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${
                  pass ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive"
                }`}
              >
                {pass ? <Check className="h-4 w-4" aria-hidden /> : <X className="h-4 w-4" aria-hidden />}
                {pass ? "Pass" : "Fail"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Calculated with the WCAG 2.x relative luminance formula. Large text means 24px regular or 18.66px bold and up.
        </p>
      </div>
    </div>
  );
}
