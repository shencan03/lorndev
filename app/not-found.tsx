import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell grid gap-4 py-16">
      <h1 className="type-display text-[clamp(44px,7.5vw,92px)]">Not found</h1>
      <p className="text-muted-foreground">
        What you requested doesn&apos;t exist on my web site.
      </p>
      <Link
        href="/"
        className="underline decoration-mauve underline-offset-[3px]"
      >
        Return home
      </Link>
    </div>
  );
}
