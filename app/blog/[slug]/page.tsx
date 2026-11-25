import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SHOW_DRAFTS,
  allPosts,
  formatDate,
  loadPost,
  postSlugs,
} from "@/app/lib/posts";
import styles from "@/app/blog/post.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// Drafts are left out of production builds, so their URLs 404 there.
export async function generateStaticParams() {
  return (await allPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadPost(slug);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${slug}` },
    // A page's openGraph replaces the layout's wholesale, so restate the base.
    openGraph: {
      siteName: "lorndev",
      type: "article",
      locale: "en_US",
      url: `/blog/${slug}`,
      title: `${meta.title} · lorndev`,
      description: meta.description,
      publishedTime: meta.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  if (!postSlugs().includes(slug)) notFound();
  const { meta, Content } = await loadPost(slug);
  if (meta.draft && !SHOW_DRAFTS) notFound();

  return (
    <article className={cn("shell", styles.post)}>
      <header className={styles.head}>
        <h1 className={cn("type-display", styles.title)}>{meta.title}</h1>
        <p className={styles.date}>
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          {meta.draft && <span className={styles.draft}>draft</span>}
        </p>
      </header>
      <div className={styles.prose}>
        <Content />
      </div>
    </article>
  );
}
