import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function MenuButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                // Base styles
                "w-full min-h-[3.5rem] py-4 px-6",
                // Background and colors
                "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
                "text-white font-medium",
                // Typography - responsive text sizes
                "text-lg sm:text-xl lg:text-2xl",
                // Transitions and effects
                "transition-all duration-200 ease-in-out",
                "hover:scale-105 active:scale-95",
                // Border and shadows
                "rounded-lg shadow-lg hover:shadow-xl",
                // Focus states
                "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
