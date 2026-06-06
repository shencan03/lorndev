import Link from "next/link"

export default function Navbar() {
	return (
		<div className="flex justify-between text-2xl bg-[#282829] rounded-xl mx-auto px-20 gap-20 py-3 my-4">
			<Link href="/" className="hover:bg-[#353536] hover:rounded-xl px-2 py-1">home</Link>
			<Link href="/blog" className="hover:bg-[#353536] hover:rounded-xl px-2 py-1">blog</Link>
			<Link href="/thoughts" className="hover:bg-[#353536] hover:rounded-xl px-2 py-1">thoughts</Link>
		</div>
	)
}