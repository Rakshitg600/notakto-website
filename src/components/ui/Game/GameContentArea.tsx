import type { ReactNode } from "react";

interface GameContentAreaProps {
	children: ReactNode;
}

export default function GameContentArea({ children }: GameContentAreaProps) {
	return (
		<div className="flex-1 flex gap-4 px-4 min-h-0 overflow-hidden">
			{children}
		</div>
	);
}
