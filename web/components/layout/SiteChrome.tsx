import Link from "next/link";
import { SITE_NAME, SITE_SHELL_CLASS, SITE_TAGLINE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header
      className="border-b border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-text)]"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className={`${SITE_SHELL_CLASS} flex min-h-14 items-center justify-between gap-3 py-3`}>
        <Link href="/" className="min-w-0">
          <span className="block font-[family-name:var(--font-display)] text-lg leading-tight sm:text-xl">
            {SITE_NAME}
          </span>
          <span className="block truncate text-xs text-[var(--header-text-muted)]">
            {SITE_TAGLINE}
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm">
          <Link
            href="/compare"
            className="inline-flex min-h-11 items-center rounded-lg px-3 hover:bg-[color-mix(in_srgb,var(--kowhai)_22%,transparent)] hover:text-[var(--kowhai)]"
          >
            Compare
          </Link>
          <Link
            href="/methodology"
            className="inline-flex min-h-11 items-center rounded-lg px-3 hover:bg-[color-mix(in_srgb,var(--kowhai)_22%,transparent)] hover:text-[var(--kowhai)]"
          >
            Method
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-[var(--border)] bg-[var(--bg-card)] py-8 text-sm text-[var(--text-muted)]">
      <div className={`${SITE_SHELL_CLASS} space-y-3`}>
        <p>
          <strong className="text-[var(--text-primary)]">{SITE_NAME}</strong> uses open data from
          Stats NZ, MBIE, HUD, and RBNZ. It is an independent explainer — not affiliated with any
          government agency.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/methodology"
            className="text-[var(--tasman)] underline-offset-2 hover:text-[var(--pounamu)] hover:underline"
          >
            Methodology
          </Link>
          <Link
            href="/glossary"
            className="text-[var(--tasman)] underline-offset-2 hover:text-[var(--pounamu)] hover:underline"
          >
            Glossary
          </Link>
        </div>
      </div>
    </footer>
  );
}
