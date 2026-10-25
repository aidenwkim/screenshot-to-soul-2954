import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Brain, Eye, Hand, ScanEye, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroPreview } from "@/components/HeroPreview";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Through Their Eyes — Experience the barriers. Design for everyone." },
      { name: "description", content: "Upload a screenshot of your website and see how color vision differences and other barriers change the experience." },
      { property: "og:title", content: "Through Their Eyes — Accessibility Simulator" },
      { property: "og:description", content: "Experience the barriers. Design for everyone." },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Upload, title: "Upload", text: "Add a screenshot of your website or try our example." },
  { icon: ScanEye, title: "Experience", text: "Select an accessibility condition and compare views." },
  { icon: Sparkles, title: "Improve", text: "Understand the barriers and learn how to remove them." },
];

const cats = [
  { icon: Eye, title: "Visual", text: "Color, contrast and clarity decide whether people can perceive what's on screen at all." },
  { icon: Hand, title: "Motor", text: "Keyboard access and generous targets let people operate an interface without precise pointing." },
  { icon: BookOpen, title: "Reading", text: "Clear headings, plain language and comfortable spacing help everyone take in information." },
  { icon: Brain, title: "Cognitive", text: "Predictable layouts and fewer distractions make decisions easier and less tiring." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              Experience the barriers. Design for everyone.
            </p>
            <h1 className="font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
              Your website works for you. <em className="text-primary">Does it work for everyone?</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Explore how different accessibility barriers affect digital experiences—and discover how to design a more inclusive web.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl">
                <Link to="/simulator">
                  Experience Your Website <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href="#why">Explore Accessibility</a>
              </Button>
            </div>
          </div>
          <HeroPreview />
        </section>

        <section aria-labelledby="how" className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 id="how" className="font-display text-4xl md:text-5xl">How it works</h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <s.icon className="h-6 w-6 text-primary" aria-hidden />
                    <span className="font-display text-3xl text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="why" aria-labelledby="why-h" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
          <h2 id="why-h" className="font-display text-4xl md:text-5xl">Why it matters</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Accessibility isn't just about compliance. It shapes how people read, navigate, understand and interact with everything you build.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {cats.map((c) => (
              <article key={c.title} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{c.title} accessibility</h3>
                <p className="mt-1 text-muted-foreground">{c.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
            <h2 className="font-display text-4xl md:text-6xl">Good design includes everyone.</h2>
            <Button asChild size="xl" variant="secondary" className="mt-8">
              <Link to="/simulator">Start Exploring <ArrowRight aria-hidden /></Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
