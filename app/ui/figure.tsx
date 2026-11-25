import Image from "next/image";
import styles from "@/app/blog/post.module.css";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: React.ReactNode;
};

// A post image that breaks out of the text column to the full shell width.
// Available in every MDX file as <Figure /> (see mdx-components.tsx).
export default function Figure({ src, alt, width, height, caption }: Props) {
  return (
    <figure className={styles.figure}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(width >= 72rem) 67rem, 100vw"
        unoptimized={src.endsWith(".svg")}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
