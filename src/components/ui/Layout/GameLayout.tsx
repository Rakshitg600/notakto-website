import type { GameLayoutProps } from "@/services/types";

export default function GameLayout({ children }: GameLayoutProps) {
	return (
		<div className="flex flex-col h-screen bg-bg0 relative overflow-hidden">
			{children}
		</div>
	);
}
