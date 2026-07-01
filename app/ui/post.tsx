import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

export default function Post({
  content,
  className,
}: {
  className?: string;
  content: string;
}) {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </Markdown>
  );
}
