import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 px-6 py-12 text-center">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground transition">
            Privacy Policy
          </Link>
          <span className="text-foreground/20" aria-hidden>·</span>
          <Link to="/terms" className="hover:text-foreground transition">
            Terms of Service
          </Link>
        </div>
        <div className="hairline mx-auto mb-6 w-24" />
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Soul Sounds · made to be felt
        </p>
      </div>
    </footer>
  );
}
