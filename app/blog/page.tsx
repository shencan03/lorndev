import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { allPosts, formatDate } from "@/app/lib/posts";
import styles from "@/app/blog/blog.module.css";

const description = "Dev write-ups and thoughts on things I care about";

export const metadata: Metadata = {
  title: "blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: {
    siteName: "lorndev",
    type: "website",
    locale: "en_US",
    url: "/blog",
    title: "blog · lorndev",
    description,
  },
};

export default async function Blog() {
  const posts = await allPosts();

  return (
    <div className={cn("shell", styles.index)}>
      <h1 className="sr-only">Blog</h1>
      <ol className={styles.list}>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={styles.entry}>
              <span className={cn("type-display", styles.title)}>
                {post.title}
              </span>
              <span className={styles.date}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.draft && <span className={styles.draft}>draft</span>}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
