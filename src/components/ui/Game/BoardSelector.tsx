import { isBoardDead } from "@/services/logic";
import type { BoardSize, BoardState } from "@/services/types";

interface BoardSelectorProps {
	boards: BoardState[];
	boardSize: BoardSize;
	selectedBoard: number;
	onSelectBoard: (index: number) => void;
}

export default function BoardSelector({
	boards,
	boardSize,
	selectedBoard,
	onSelectBoard,
}: BoardSelectorProps) {
	if (boards.length <= 1) return null;

	return (
		<div className="flex-1 flex flex-col items-end justify-center gap-2.5">
			{boards.map((board, i) => {
				const dead = isBoardDead(board, boardSize);
				const selected = i === selectedBoard;
				return (
					<button
						// biome-ignore lint/suspicious/noArrayIndexKey: board index is the stable identity
						key={`tab-${i}`}
						type="button"
						onClick={() => onSelectBoard(i)}
						className={`relative font-pixel text-[10px] px-5 py-3 flex items-center justify-center border-2 cursor-pointer transition-all whitespace-nowrap ${
							selected
								? "bg-bg3 border-accent text-cream shadow-[2px_2px_0_var(--color-accent)]"
								: dead
									? "bg-bg2 border-border-pixel text-muted"
									: "bg-bg2 border-border-pixel text-cream-dim hover:text-cream hover:border-accent/50"
						}`}>
						BOARD {i + 1}
						<span
							className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border border-bg0 ${
								dead ? "bg-dead" : "bg-success"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}
