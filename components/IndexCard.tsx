import Link from "next/link"

type Item = {
  title: string
  href: string
}

type IndexCardProps = {
  colCount: number
  items: Item[]
}

export default function IndexCard({colCount, items}: IndexCardProps) {
  return (
    <div className={`grid grid-cols-${colCount} gap-x-10 text-5xl`}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>{item.title}</Link>
      ))}
    </div>
  )
}