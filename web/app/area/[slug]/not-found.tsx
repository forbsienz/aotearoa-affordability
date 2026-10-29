import Link from "next/link";

export default function AreaNotFound() {
  return (
    <div className="card space-y-3 p-6">
      <h1 className="text-2xl">Place not found</h1>
      <p className="text-[var(--text-muted)]">
        That district brief is not in the current dataset. Try the home picker.
      </p>
      <Link href="/" className="inline-flex min-h-11 items-center text-[var(--accent)] underline">
        Back home
      </Link>
    </div>
  );
}
