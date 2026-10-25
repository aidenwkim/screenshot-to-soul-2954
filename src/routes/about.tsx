import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, DISCLAIMER } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Through Their Eyes" },
      { name: "description", content: "How Through Their Eyes simulates color vision and other barriers, and its limitations." },
      { property: "og:title", content: "About Through Their Eyes" },
      { property: "og:description", content: "Methods, limitations and the mission behind the simulator." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="font-display text-5xl">About the project</h1>
        <div className="mt-8 space-y-8 text-lg leading-relaxed">
          <p>Through Their Eyes helps designers, developers and site owners understand how accessibility barriers affect people—and how to remove them.</p>
          <section>
            <h2 className="text-xl font-semibold">How the simulations work</h2>
            <p className="mt-2 text-muted-foreground">
              Color vision simulations use the model by Machado, Oliveira & Fernandes (2009) at full severity, applied to each pixel in linear RGB. Grayscale uses Rec. 709 luminance. Reduced clarity and reduced contrast are illustrative filters, not clinical reproductions.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Your privacy</h2>
            <p className="mt-2 text-muted-foreground">Screenshots are processed entirely in your browser. Nothing is uploaded or stored.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Limitations</h2>
            <p className="mt-2 text-muted-foreground">{DISCLAIMER}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
