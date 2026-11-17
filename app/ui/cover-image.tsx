"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Matches the card widths (w-24 sm:w-36) so the browser fetches a ~300px
// image instead of assuming the poster spans the full viewport.
const CARD_SIZES = "(min-width: 640px) 144px, 96px";

// Cover art for carousel cards: loads eagerly (carousels outrun lazy loading on
// fast scrolls) and fades in over the card's muted placeholder once decoded.
export default function CoverImage({ alt, className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      fill
      sizes={CARD_SIZES}
      loading="eager"
      {...props}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`object-cover not-prose motion-safe:transition-opacity motion-safe:duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className ?? ""}`}
    />
  );
}
