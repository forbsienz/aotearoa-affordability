export const SITE_NAME = "Aotearoa Affordability";
export const SITE_TAGLINE = "Wages and living costs, where you live";
export const SITE_DESCRIPTION =
  "Open-data briefs for New Zealand places: rent vs workplace earnings, inflation context, house prices, and commute patterns — with honest geography labels.";

export const SITE_SHELL_CLASS = "site-shell mx-auto w-full min-w-0 max-w-6xl";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
