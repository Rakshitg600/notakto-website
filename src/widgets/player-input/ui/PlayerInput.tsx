import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function PlayerInput({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={clsx(
				"w-full p-3 text-stone-300 text-[9px]  border-2 border-slate-700 bg-zinc-950 outline-none focus:border-slate-600",
				className,
			)}
			{...props}
		/>
	);
}
