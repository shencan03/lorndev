import type { MDXComponents } from "mdx/types";
import Figure from "@/app/ui/figure";

const components: MDXComponents = { Figure };

export function useMDXComponents(): MDXComponents {
  return components;
}
