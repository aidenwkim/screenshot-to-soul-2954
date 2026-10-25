import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-medium">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Eye className="h-4 w-4" aria-hidden />
          </span>
          Through Their Eyes
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          {[
            { to: "/simulator", label: "Simulator" },
            { to: "/contrast", label: "Contrast checker" },
            { to: "/about", label: "About" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "rounded-full px-3 py-2 bg-secondary text-secondary-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export const DISCLAIMER =
  "These simulations and interactive demonstrations illustrate selected accessibility barriers. They cannot reproduce every individual's experience of disability and are not substitutes for accessibility testing with disabled users or a comprehensive accessibility audit.";
