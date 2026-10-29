const SAFE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isSafeSlug(slug: string): boolean {
  return slug.length > 0 && slug.length < 120 && SAFE.test(slug);
}
