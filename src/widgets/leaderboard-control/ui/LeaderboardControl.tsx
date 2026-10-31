export function LeaderboardControls({ onClose }: { onClose?: () => void }) {
	return (
		<div className="flex items-center justify-center">
			<button
				type="button"
				className="bg-orange-700 hover:bg-red-500 text-stone-300 py-2 text-[9px]  uppercase tracking-wider flex-1 border-3 border-slate-600 shadow-[3px_3px_0_var(--color-zinc-950)] cursor-pointer"
				onClick={onClose}>
				Return
			</button>
		</div>
	);
}
