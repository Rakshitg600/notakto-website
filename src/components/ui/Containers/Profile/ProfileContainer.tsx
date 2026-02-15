import type { ProfileContainerProps } from "@/services/types";

export default function ProfileContainer({ children }: ProfileContainerProps) {
	return (
		<div className="bg-panel pixel-border p-6 w-[80%] max-w-md">{children}</div>
	);
}
