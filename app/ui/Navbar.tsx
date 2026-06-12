import NavLinks from "@/app/ui/NavLinks"

export default function Navbar() {
	return (
		<div className="flex flex-col w-fit gap-4 py-4 text-2xl rounded-xl sm:px-20 sm:py-3 sm:left-1/2 sm:-translate-x-1/2 sm:flex-row sm:top-0 fixed">
			<NavLinks />
		</div>
	)
}