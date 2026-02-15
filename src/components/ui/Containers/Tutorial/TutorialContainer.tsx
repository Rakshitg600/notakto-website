import type { TutorialContainerProps } from "@/services/types";

export default function TutorialContainer({
	children,
}: TutorialContainerProps) {
	return (
		<div className="bg-panel pixel-border p-6 w-[80%] max-w-md">{children}</div>
	);
}
