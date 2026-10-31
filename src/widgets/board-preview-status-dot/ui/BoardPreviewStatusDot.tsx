import clsx from "clsx";

interface BoardPreviewStatusDotProps {
	dead: boolean;
}

export default function BoardPreviewStatusDot({
	dead,
}: BoardPreviewStatusDotProps) {
	return (
		<span
			className={clsx(
				"w-2.5 h-2.5 rounded-full border border-zinc-950",
				dead ? "bg-gray-800" : "bg-lime-700",
			)}
		/>
	);
}
