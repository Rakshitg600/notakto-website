import clsx from "clsx";
import type { CellButtonProps } from "@/services/types";

export default function CellButton({
	children,
	onClick,
	disabled,
}: CellButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				"relative border border-bg3 flex items-center justify-center aspect-square",
				disabled ? "bg-dead" : "bg-board-bg hover:bg-bg1 cursor-pointer",
			)}>
			{children}
		</button>
	);
}
