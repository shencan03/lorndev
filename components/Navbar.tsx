import Link from "next/link"

export default function Navbar() {
	return (
		<div className="flex justify-between">
			<Link href="/">home</Link>
			<Link href="/blog">blog</Link>
			<Link href="/thoughts">thoughts</Link>
		</div>
	)
}