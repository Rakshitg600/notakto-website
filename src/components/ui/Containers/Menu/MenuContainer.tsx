import { ReactNode } from "react";

interface MenuContainerProps {
    children: ReactNode;
}

export default function MenuContainer({ children }: MenuContainerProps) {
    return (
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md px-4 sm:px-6">
                {children}
            </div>

    );
}