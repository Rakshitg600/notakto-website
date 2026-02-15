import type { ReactNode } from "react";

interface GameCenterColumnProps {
	children: ReactNode;
}

export default function GameCenterColumn({ children }: GameCenterColumnProps) {
	return (
		<div className="flex-1 flex flex-col items-center min-h-0">{children}</div>
	);
}
