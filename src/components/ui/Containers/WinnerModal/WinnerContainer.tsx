import type { WinnerContainerProps } from "@/services/types";

export default function WinnerContainer({ children }: WinnerContainerProps) {
	return (
		<section className="bg-panel pixel-border text-center p-6 w-[80%] max-w-md">
			{children}
		</section>
	);
}
