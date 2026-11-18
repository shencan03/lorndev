import Link from "next/link";

// The wordmark, followed by the block cursor from the OG images.
export default function Logo() {
  return (
    <Link
      href="/"
      className="type-display inline-flex items-center text-[22px] tracking-[-0.02em] after:ml-[3px] after:h-[0.78em] after:w-[0.42em] after:bg-mauve after:content-['']"
    >
      lorndev
    </Link>
  );
}
