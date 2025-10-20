import type { ButtonHTMLAttributes } from "react";

export function SoundMuteButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={
				"bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 w-17 text-lg"
			}
		/>
	);
}
