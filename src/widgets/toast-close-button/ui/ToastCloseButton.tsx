interface ToastCloseButtonProps {
	closeToast?: () => void;
}

export default function ToastCloseButton({
	closeToast,
}: ToastCloseButtonProps) {
	return (
		<button
			type="button"
			onClick={closeToast}
			className="absolute top-1 flex items-center justify-center right-1 h-[25px] w-[25px] text-stone-300  text-[8px] border border-slate-700 hover:text-stone-200"
			aria-label="close">
			X
		</button>
	);
}
