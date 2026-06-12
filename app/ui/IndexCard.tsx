import Link from "next/link"

type Item = {
  title: string
  href: string
}

type IndexCardProps = {
  items: Item[]
}

export default function IndexCard({items}: IndexCardProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 text-5xl`}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>{item.title}</Link>
      ))}
    </div>
  )
}