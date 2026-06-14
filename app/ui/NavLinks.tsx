"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { SquareChevronRight, SquareChevronDown } from 'lucide-react'

const NavbarItems = [
  {href: "/", label: "home"},
  {href: "/curation", label: "curation"}
]

export default function Navlinks() {
  const isActive = usePathname()
  const [open, setOpen]= useState(false)

  function handleClick() {
    setOpen(!open)
  }

  return (
    <>
      <button onClick={handleClick} className="sm:hidden">{open ? <SquareChevronDown/> : <SquareChevronRight/>}</button>
      {NavbarItems.map(({href, label}) => {
        const activePath = href === isActive

        return (
          <Link onClick={handleClick} key={href} href={href} className={`hover:bg-[#353536] hover:rounded-xl px-6 py-1 ${activePath? 'bg-[#353536] rounded-xl' : ''} ${open ? `flex` : 'hidden'} sm:flex `}>{label}</Link>
        )
      })}
    </>
  )
}