import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function MenuButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "w-full bg-blue-600 py-3 sm:py-4 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl", // responsive styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
