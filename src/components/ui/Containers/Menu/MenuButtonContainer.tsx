import { MenuButtonContainerProps } from '@/services/types';
import clsx from 'clsx';

export default function MenuButtonContainer({ children, className }: MenuButtonContainerProps) {
    return (
        <div className={clsx(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full",
            "sm:gap-6 lg:gap-8",
            "items-stretch justify-items-stretch",
            className
        )}>
            {children}
        </div>
    );
}