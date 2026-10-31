import type { ButtonHTMLAttributes } from "react";

export function BoardActionButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="flex-1 py-2 bg-orange-700 text-stone-300 text-[9px]  uppercase tracking-wider hover:bg-red-500 border-3 border-slate-600 shadow-[3px_3px_0_var(--color-zinc-950)] cursor-pointer"
			{...props}
		/>
	);
}
