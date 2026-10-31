import type { ButtonHTMLAttributes } from "react";

export function ShortcutButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-orange-700 hover:bg-red-500 text-stone-300 px-8 py-2 text-[9px]  uppercase tracking-wider w-full mt-4 border-3 border-slate-600 shadow-[3px_3px_0_var(--color-zinc-950)] cursor-pointer"
		/>
	);
}
