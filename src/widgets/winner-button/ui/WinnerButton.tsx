import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function WinnerButton({
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={clsx(
				"bg-orange-700 text-stone-300 px-4 py-2 w-full text-[9px]  uppercase tracking-wider hover:bg-red-500 border-3 border-slate-600 shadow-[3px_3px_0_var(--color-zinc-950)] cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}
