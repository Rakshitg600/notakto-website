import type { CellValueDisplayProps } from "@/services/types";

export default function CellValueDisplay({ value }: CellValueDisplayProps) {
	if (!value) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<span className="text-x text-xl font-pixel leading-none drop-shadow-[0_0_4px_rgba(196,60,60,0.6)]">
				{value}
			</span>
		</div>
	);
}
