import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-bg0 text-center p-4">
			<h1 className="font-pixel text-primary text-lg pixel-text-shadow mb-4 uppercase">
				404
			</h1>
			<p className="text-sm font-pixel text-cream mb-6">
				PAGE NOT FOUND
			</p>
			<Link
				href="/"
				className="px-6 py-2 bg-primary text-cream font-pixel text-[9px] uppercase tracking-wider border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] hover:bg-primary-hover">
				Go back home
			</Link>
		</main>
	);
}
