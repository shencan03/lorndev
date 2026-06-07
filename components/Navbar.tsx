import NavLinks from "@/components/NavLinks"

export default function Navbar() {
	return (
		<div className="flex justify-between text-2xl bg-[#282829] rounded-xl mx-auto px-20 gap-20 py-3 my-4">
			<NavLinks />
		</div>
	)
}