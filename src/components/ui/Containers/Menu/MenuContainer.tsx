import { MenuContainerProps } from '@/services/types';

export default function MenuContainer({ children }: MenuContainerProps) {
    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl px-4 mx-auto">
            <div className="w-full max-w-2xl lg:max-w-4xl">
                {children}
            </div>
        </div>
    );
}