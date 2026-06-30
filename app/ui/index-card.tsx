import Link from "next/link";
import { IndexCardProps } from "@/app/lib/definitions";

export default function IndexCard({ items }: IndexCardProps) {
  return (
    <>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.title}
        </Link>
      ))}
    </>
  );
}
