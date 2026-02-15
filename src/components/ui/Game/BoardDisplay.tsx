import type { ReactNode } from "react";

interface BoardDisplayProps {
	children: ReactNode;
	visible: boolean;
}

export default function BoardDisplay({ children, visible }: BoardDisplayProps) {
	if (!visible) return null;

	return (
		<div className="flex-1 flex items-center justify-center w-full p-4">
			<div className="max-w-[520px] w-full">{children}</div>
		</div>
	);
}
