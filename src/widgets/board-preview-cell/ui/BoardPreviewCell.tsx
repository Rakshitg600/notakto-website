import clsx from "clsx";

interface BoardPreviewCellProps {
	cell: string;
	owner?: 1 | 2;
	isLast: boolean;
}

export default function BoardPreviewCell({
	cell,
	owner,
	isLast,
}: BoardPreviewCellProps) {
	return (
		<div
			className={clsx(
				"relative flex items-center justify-center aspect-square",
				cell === "X" ? "bg-gray-800" : "bg-zinc-900",
				isLast
					? owner === 2
						? "border-2 border-yellow-400"
						: "border-2 border-red-500"
					: "border border-slate-800",
			)}>
			{cell && (
				<span
					className={clsx(
						"text-xs  leading-none",
						owner === 2
							? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
							: "text-orange-700 drop-shadow-[0_0_4px_rgba(196,60,60,0.6)]",
					)}>
					{cell}
				</span>
			)}
		</div>
	);
}
