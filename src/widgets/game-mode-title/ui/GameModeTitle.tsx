interface GameModeTitleProps {
	title: string;
}

export default function GameModeTitle({ title }: GameModeTitleProps) {
	return (
		<div className=" text-sm text-stone-300 uppercase tracking-wider group-hover:text-stone-200 transition-colors">
			{title}
		</div>
	);
}
