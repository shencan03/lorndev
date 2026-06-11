import NavLinks from "@/components/NavLinks"

export default function Navbar() {
	return (
		<div className="text-2xl bg-[#282829] rounded-xl sm:px-20 sm:gap-20 sm:py-3 sm:fixed sm:left-1/2 flex flex-col sm:-translate-x-1/2 sm:flex-row sm:top-4">
			<NavLinks />
		</div>
	)
}