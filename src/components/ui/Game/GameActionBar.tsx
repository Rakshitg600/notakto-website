"use client";

interface ActionButton {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "default" | "danger";
}

interface GameActionBarProps {
	actions: ActionButton[];
}

export default function GameActionBar({ actions }: GameActionBarProps) {
	return (
		<div className="flex justify-center gap-4 px-4 py-3.5 border-t-2 border-border-pixel bg-bg1 shrink-0">
			{actions.map((action) => {
				const colorClasses =
					action.variant === "danger"
						? "bg-primary hover:bg-primary-hover border-border-light"
						: action.variant === "primary"
							? "bg-accent hover:bg-accent-dim border-border-light"
							: "bg-bg3 hover:bg-bg2 border-border-pixel";

				return (
					<button
						key={action.label}
						type="button"
						onClick={action.onClick}
						disabled={action.disabled}
						className={`font-pixel text-[10px] uppercase tracking-wider px-6 py-2.5 border-3 shadow-[3px_3px_0_var(--color-bg0)] transition-all duration-100 cursor-pointer ${colorClasses} ${
							action.disabled
								? "!bg-dead !border-dead-border !text-muted !cursor-not-allowed !shadow-none"
								: "text-cream"
						}`}>
						{action.label}
					</button>
				);
			})}
		</div>
	);
}
