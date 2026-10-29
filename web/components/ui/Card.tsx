import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  title,
  eyebrow,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className={`card p-4 sm:p-5 ${className}`}>
      {eyebrow ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      {title ? <h2 className="mb-3 text-xl text-[var(--text-primary)]">{title}</h2> : null}
      {children}
    </section>
  );
}
