"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

const NavbarItems = [
  {href: "/", label: "home"},
  {href: "/blog", label: "blog"},
  {href: "/thoughts", label: "thoughts"},
  {href: "/curation", label: "curation"}
]

export default function Navlinks() {
  const isActive = usePathname()

  return (
    <>
      {NavbarItems.map(({href, label}) => {
        const activePath = href === isActive

        return (
          <Link key={href} href={href} className={`hover:bg-[#353536] hover:rounded-xl px-6 py-1 ${activePath? 'bg-[#353536] rounded-xl' : ''}`}>{label}</Link>
        )
      })}
    </>
  )
}