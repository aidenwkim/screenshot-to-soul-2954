import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ContrastChecker } from "@/components/ContrastChecker";

export const Route = createFileRoute("/contrast")({
  head: () => ({
    meta: [
      { title: "WCAG Contrast Checker — Through Their Eyes" },
      { name: "description", content: "Check text and background colors against WCAG AA and AAA contrast thresholds." },
      { property: "og:title", content: "WCAG Contrast Checker — Through Their Eyes" },
      { property: "og:description", content: "Accurate WCAG contrast ratios with live preview." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="font-display text-5xl">Contrast checker</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pick a text color and a background color to see whether they meet WCAG contrast requirements.
        </p>
        <div className="mt-10"><ContrastChecker /></div>
      </main>
    </div>
  ),
});
