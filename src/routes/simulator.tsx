import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, FileText, ImageUp, Info, RotateCcw } from "lucide-react";
import demo from "@/assets/demo-site.jpg";
import { Button } from "@/components/ui/button";
import { SiteHeader, DISCLAIMER } from "@/components/SiteHeader";
import { CompareView, type CompareLayout } from "@/components/CompareView";
import { ContrastChecker } from "@/components/ContrastChecker";
import { renderSimulation, type VisualMode } from "@/lib/simulate";
import { INSIGHTS, MODE_ORDER } from "@/lib/insights";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Simulator — Through Their Eyes" },
      { name: "description", content: "Upload a website screenshot and compare it with color vision, clarity and contrast simulations." },
      { property: "og:title", content: "Accessibility Simulator — Through Their Eyes" },
      { property: "og:description", content: "See your website through different visual conditions, right in your browser." },
    ],
  }),
  component: Simulator,
});

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_DIM = 6000;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const LAYOUTS: { id: CompareLayout; label: string }[] = [
  { id: "slider", label: "Slider View" },
  { id: "side", label: "Side-by-Side View" },
  { id: "original", label: "Original Only" },
  { id: "simulated", label: "Simulated Only" },
];

type Measurement = { fg: string; bg: string; ratio: number };

function Simulator() {
  const [src, setSrc] = useState<string>(demo);
  const [name, setName] = useState("Fernhouse sample store (built-in demo)");
  const [mode, setMode] = useState<VisualMode>("deuteranopia");
  const [blur, setBlur] = useState(3);
  const [contrast, setContrast] = useState(0.5);
  const [layout, setLayout] = useState<CompareLayout>("slider");
  const [simSrc, setSimSrc] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgVersion, setImgVersion] = useState(0);

  // Load image whenever the source changes.
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > MAX_DIM || img.naturalHeight > MAX_DIM) {
        setError(`This image is ${img.naturalWidth}×${img.naturalHeight}px. Please use a screenshot under ${MAX_DIM}px on each side.`);
        return;
      }
      imgRef.current = img;
      setImgVersion((v) => v + 1);
    };
    img.onerror = () => setError("We couldn't read that image. Try a PNG, JPG or WebP screenshot.");
    img.src = src;
  }, [src]);

  // Re-render the simulation whenever mode or controls change.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    setProcessing(true);
    const t = setTimeout(() => {
      try {
        const canvas = canvasRef.current ?? document.createElement("canvas");
        canvasRef.current = canvas;
        renderSimulation(img, canvas, mode, { blur, contrast });
        setSimSrc(canvas.toDataURL("image/png"));
      } catch (e) {
        setError(e instanceof Error ? `Image processing failed: ${e.message}` : "Image processing failed.");
      } finally {
        setProcessing(false);
      }
    }, 30);
    return () => clearTimeout(t);
  }, [mode, blur, contrast, imgVersion]);

  const onFile = (file?: File) => {
    if (!file) return;
    setError(null);
    if (!ACCEPT.includes(file.type)) {
      setError("Unsupported file type. Please upload a PNG, JPG, WebP or GIF screenshot.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That file is larger than 15 MB. Please use a smaller screenshot.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
      setName(file.name);
    };
    reader.onerror = () => setError("We couldn't read that file.");
    reader.readAsDataURL(file);
  };

  const insight = INSIGHTS[mode];

  const downloadImage = () => {
    if (!simSrc) return;
    const a = document.createElement("a");
    a.href = simSrc;
    a.download = `through-their-eyes-${mode}.png`;
    a.click();
  };

  const downloadSummary = () => {
    const lines = [
      "THROUGH THEIR EYES — ACCESSIBILITY SUMMARY",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Screenshot: ${name}`,
      `Simulation mode: ${insight.label}${mode === "blur" ? ` (blur ${blur})` : mode === "contrast" ? ` (${Math.round(contrast * 100)}% reduction)` : ""}`,
      "",
      "About this mode:",
      insight.what,
      "",
      "General design considerations:",
      ...insight.fixes.map((f) => `- ${f}`),
      ...(insight.wcag.length ? ["", "Related WCAG criteria:", ...insight.wcag.map((w) => `- ${w}`)] : []),
      "",
      "Measured contrast results:",
      ...(measurements.length
        ? measurements.map((m) => `- ${m.fg.toUpperCase()} on ${m.bg.toUpperCase()}: ${(Math.floor(m.ratio * 100) / 100).toFixed(2)}:1`)
        : ["- None recorded. Use the contrast checker and add a measurement."]),
      "",
      "Note: This summary does not include automated detection of issues.",
      DISCLAIMER,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "accessibility-summary.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const nav = [
    ["upload", "Upload Website"],
    ["modes", "Accessibility Modes"],
    ["compare", "Compare Views"],
    ["insights", "Accessibility Insights"],
    ["contrast", "Contrast Checker"],
    ["summary", "Summary"],
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <nav aria-label="Simulator sections" className="mb-6 hidden lg:block">
            <ul className="space-y-0.5 text-sm">
              {nav.map(([id, l]) => (
                <li key={id}>
                  <a href={`#${id}`} className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">{l}</a>
                </li>
              ))}
              <li><Link to="/about" className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground">About the Project</Link></li>
            </ul>
          </nav>

          <section id="modes" aria-labelledby="modes-h" className="scroll-mt-24">
            <h2 id="modes-h" className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visual accessibility</h2>
            <div role="radiogroup" aria-labelledby="modes-h" className="mt-2 space-y-1">
              {MODE_ORDER.map((m) => {
                const active = m === mode;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setMode(m)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      active ? "border-primary bg-secondary" : "border-transparent hover:bg-muted"
                    }`}
                  >
                    <span className={`block text-sm font-medium ${active ? "text-secondary-foreground" : ""}`}>{INSIGHTS[m].label}</span>
                    <span className="block text-xs text-muted-foreground">{INSIGHTS[m].short}</span>
                  </button>
                );
              })}
            </div>
            {mode === "blur" && (
              <div className="mt-4 rounded-xl bg-muted p-3">
                <label htmlFor="blur" className="text-sm font-medium">Blur amount: {blur}</label>
                <input id="blur" type="range" min={0.5} max={10} step={0.5} value={blur} onChange={(e) => setBlur(+e.target.value)} className="mt-2 w-full accent-primary" />
              </div>
            )}
            {mode === "contrast" && (
              <div className="mt-4 rounded-xl bg-muted p-3">
                <label htmlFor="ctr" className="text-sm font-medium">Contrast reduction: {Math.round(contrast * 100)}%</label>
                <input id="ctr" type="range" min={0.1} max={0.9} step={0.05} value={contrast} onChange={(e) => setContrast(+e.target.value)} className="mt-2 w-full accent-primary" />
              </div>
            )}
          </section>
        </aside>

        <main className="min-w-0 space-y-10">
          <section id="upload" aria-labelledby="up-h" className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 id="up-h" className="font-display text-4xl md:text-5xl">Simulator</h1>
                <p className="mt-1 text-sm text-muted-foreground">Now viewing: <span className="font-medium text-foreground">{name}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="default" className="rounded-full">
                  <label className="cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-ring">
                    <ImageUp aria-hidden /> Upload screenshot
                    <input type="file" accept={ACCEPT.join(",")} className="sr-only" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
                  </label>
                </Button>
                {src !== demo && (
                  <Button variant="outline" className="rounded-full" onClick={() => { setSrc(demo); setName("Fernhouse sample store (built-in demo)"); setError(null); }}>
                    <RotateCcw aria-hidden /> Use sample
                  </Button>
                )}
              </div>
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
              className="mt-4 rounded-xl border border-dashed border-input px-4 py-3 text-sm text-muted-foreground"
            >
              Drop a screenshot here, or use the button. Images stay on your device—nothing is uploaded.
            </div>
            {error && <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          </section>

          <section id="compare" aria-labelledby="cmp-h" className="scroll-mt-24">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="cmp-h" className="text-lg font-semibold">Compare views <span className="text-muted-foreground font-normal">· {insight.label}</span>{processing && <span className="ml-2 text-sm text-muted-foreground" aria-live="polite">Processing…</span>}</h2>
              <div className="flex flex-wrap gap-1 rounded-full bg-muted p-1" role="group" aria-label="Comparison layout">
                {LAYOUTS.map((l) => (
                  <button key={l.id} type="button" aria-pressed={layout === l.id} onClick={() => setLayout(l.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${layout === l.id ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            {simSrc ? (
              <CompareView originalSrc={src} simulatedSrc={simSrc} layout={layout} label={insight.label} />
            ) : (
              <div className="aspect-[16/10] animate-pulse rounded-2xl bg-muted" />
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-start gap-2 text-xs text-muted-foreground max-w-2xl">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {DISCLAIMER}
              </p>
              <Button variant="outline" className="rounded-full" onClick={downloadImage} disabled={!simSrc}>
                <Download aria-hidden /> Download simulated image
              </Button>
            </div>
          </section>

          <section id="insights" aria-labelledby="ins-h" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Accessibility insights</p>
            <h2 id="ins-h" className="mt-1 font-display text-4xl">{insight.label}</h2>
            {insight.illustrative && (
              <p className="mt-2 inline-block rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">Illustrative demonstration—not a clinical simulation of any specific condition.</p>
            )}
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">What it involves</h3>
                <p className="mt-1 text-muted-foreground">{insight.what}</p>
                <h3 className="mt-5 font-semibold">Why designs cause difficulty</h3>
                <p className="mt-1 text-muted-foreground">{insight.why}</p>
                <h3 className="mt-5 font-semibold">Common mistakes</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">{insight.mistakes.map((m) => <li key={m}>{m}</li>)}</ul>
              </div>
              <div>
                <h3 className="font-semibold">How to improve</h3>
                <ul className="mt-2 space-y-2">
                  {insight.fixes.map((f) => (
                    <li key={f} className="rounded-xl bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">{f}</li>
                  ))}
                </ul>
                {insight.wcag.length > 0 && (
                  <>
                    <h3 className="mt-5 font-semibold">Related WCAG criteria</h3>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">{insight.wcag.map((w) => <li key={w}>{w}</li>)}</ul>
                  </>
                )}
              </div>
            </div>
          </section>

          <section id="contrast" aria-labelledby="ct-h" className="scroll-mt-24">
            <h2 id="ct-h" className="mb-4 text-lg font-semibold">Contrast checker</h2>
            <ContrastChecker onMeasure={(m) => setMeasurements((p) => [...p, m])} />
          </section>

          <section id="summary" aria-labelledby="sum-h" className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
            <h2 id="sum-h" className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-primary" aria-hidden /> Summary</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Screenshot</dt><dd className="font-medium">{name}</dd></div>
              <div><dt className="text-muted-foreground">Selected mode</dt><dd className="font-medium">{insight.label}</dd></div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Measured contrast results</dt>
                <dd>
                  {measurements.length ? (
                    <ul className="mt-1 space-y-1">
                      {measurements.map((m, i) => (
                        <li key={i} className="font-mono">{m.fg.toUpperCase()} on {m.bg.toUpperCase()} — {(Math.floor(m.ratio * 100) / 100).toFixed(2)}:1</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">None yet — use “Add this measurement to my summary” above.</span>
                  )}
                </dd>
              </div>
            </dl>
            <Button className="mt-6 rounded-full" onClick={downloadSummary}><Download aria-hidden /> Download Summary</Button>
          </section>
        </main>
      </div>
    </div>
  );
}
