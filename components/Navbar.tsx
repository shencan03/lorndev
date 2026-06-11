import NavLinks from "@/components/NavLinks"

export default function Navbar() {
	return (
		<div className="flex justify-center mx-auto my-4">
			<div className="text-2xl bg-[#282829] rounded-xl px-20 gap-20 py-3 fixed">
				<NavLinks />
			</div>
		</div>
	)
}