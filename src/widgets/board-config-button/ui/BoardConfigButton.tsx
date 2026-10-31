import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BoardConfigButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	label: string | number;
	isActive: boolean;
}
export const BoardConfigButton = ({
	label,
	isActive,
	onClick,
}: BoardConfigButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"min-w-15 px-4 py-2 text-stone-300 text-[9px]  uppercase tracking-wider border-3 shadow-[3px_3px_0_var(--color-zinc-950)] cursor-pointer",
				isActive
					? "bg-orange-700 border-orange-700"
					: "bg-slate-800 border-slate-700 hover:bg-slate-800",
			)}>
			{label}
		</button>
	);
};
