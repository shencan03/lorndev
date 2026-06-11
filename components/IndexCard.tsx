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
    <div className={`grid grid-cols-${colCount} gap-x-80 text-5xl gap-y-60 mt-20 bg-[#404041] px-4 rounded-2xl py-4`}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>{item.title}</Link>
      ))}
    </div>
  )
}