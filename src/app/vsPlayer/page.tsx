"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useShortcut } from "@/components/hooks/useShortcut";
import Board from "@/components/ui/Board/Board";
import GameLayout from "@/components/ui/Layout/GameLayout";
import GameTopBar, { GameStatusBar } from "@/components/ui/Game/GameTopBar";
import GameStatsPanel from "@/components/ui/Game/GameStatsPanel";
import GameActionBar from "@/components/ui/Game/GameActionBar";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import WinnerModal from "@/modals/WinnerModal";
import { isBoardDead } from "@/services/logic";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useSound } from "@/services/store";
import { useGlobalModal } from "@/services/globalModal";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
} from "@/services/types";

const Game = () => {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [player1Name, setPlayer1Name] = useState<string>("Player 1");
	const [player2Name, setPlayer2Name] = useState<string>("Player 2");
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [initialSetupDone, setInitialSetupDone] = useState<boolean>(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const startTimeRef = useRef<number>(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();

	const { sfxMute } = useSound();
	const router = useRouter();

	// Open names modal on mount
	useEffect(() => {
		openModal("names");
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Elapsed time tracker
	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [gameStarted]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	useShortcut(
		{
			escape: () => {
				if ((!initialSetupDone && !gameStarted) || activeModal === "winner")
					return;
				if (activeModal) return closeModal();
			},
			m: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},
			r: () => {
				if (!initialSetupDone || !hasMoveHappened || activeModal === "winner")
					return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			},
			n: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "names" ? closeModal() : openModal("names");
			},
			c: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "boardConfig"
					? closeModal()
					: openModal("boardConfig");
			},
			s: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "soundConfig"
					? closeModal()
					: openModal("soundConfig");
			},
			q: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "shortcut"
					? closeModal()
					: openModal("shortcut");
			},
		},
		false,
	);

	const makeMoveHandler = (boardIndex: number, cellIndex: number) => {
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		if (
			boards[boardIndex][cellIndex] !== "" ||
			isBoardDead(boards[boardIndex], boardSize)
		)
			return;

		const newBoards = boards.map((board, idx) =>
			idx === boardIndex
				? [...board.slice(0, cellIndex), "X", ...board.slice(cellIndex + 1)]
				: [...board],
		);
		playMoveSound(sfxMute);
		setBoards(newBoards);

		// Log the move
		setMoveLog((prev) => [
			...prev,
			{ player: currentPlayer, board: boardIndex, cell: cellIndex },
		]);

		if (newBoards.every((board) => isBoardDead(board, boardSize))) {
			const loser = currentPlayer;
			const winnerNum = loser === 1 ? 2 : 1;
			const winnerName = winnerNum === 1 ? player1Name : player2Name;
			setWinner(winnerName);
			openModal("winner");
			playWinSound(sfxMute);
			return;
		}

		setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
	};

	const resetGame = (num: BoardNumber, size: BoardSize) => {
		const initialBoards = Array(num)
			.fill(null)
			.map(() => Array(size * size).fill(""));
		setBoards(initialBoards);
		setCurrentPlayer(1);
		closeModal();
		setHasMoveHappened(false);
		setSelectedBoard(0);
		setMoveLog([]);
		startTimeRef.current = Date.now();
		setElapsed(0);
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size as BoardSize);
		closeModal();
		resetGame(num, size);
	};

	const p1MoveCount = moveLog.filter((m) => m.player === 1).length;
	const p2MoveCount = moveLog.filter((m) => m.player === 2).length;
	const aliveCount = boards.filter(
		(b) => !isBoardDead(b, boardSize),
	).length;

	return (
		<GameLayout>
			<GameTopBar
				player1={{
					name: player1Name,
					moveCount: p1MoveCount,
				}}
				player2={{
					name: player2Name,
					moveCount: p2MoveCount,
				}}
				currentPlayer={currentPlayer}
				boards={boards}
				boardSize={boardSize}
				gameOver={activeModal === "winner"}
				mode="vsPlayer"
			/>

			{/* 3-column content: left (board selector) | center (turn + board) | right (stats + log) */}
			<div className="flex-1 flex gap-4 px-4 min-h-0 overflow-hidden">
				{/* Left column: board selector (vertically centered) */}
				<div className="hidden lg:flex w-64 shrink-0 flex-col">
					{boards.length > 1 && (
						<div className="flex-1 flex flex-col items-end justify-center gap-2.5">
							{boards.map((board, i) => {
								const dead = isBoardDead(board, boardSize);
								const selected = i === selectedBoard;
								return (
									<button
										key={`tab-${i}`}
										type="button"
										onClick={() => setSelectedBoard(i)}
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
					)}
				</div>

				{/* Center column: turn info + board (both centered on same axis) */}
				<div className="flex-1 flex flex-col items-center min-h-0">
					<GameStatusBar
						currentPlayer={currentPlayer}
						moveCount={moveLog.length}
						gameOver={activeModal === "winner"}
						mode="vsPlayer"
						player1Name={player1Name}
						player2Name={player2Name}
					/>

					{boards.length > 0 && boards[selectedBoard] && (
						<div className="flex-1 flex items-center justify-center w-full p-4">
							<div className="max-w-[520px] w-full">
								<Board
									boardIndex={selectedBoard}
									boardState={boards[selectedBoard]}
									makeMove={makeMoveHandler}
									isDead={isBoardDead(boards[selectedBoard], boardSize)}
									boardSize={boardSize}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Right column: match stats + move log */}
				<GameStatsPanel
					stats={[
						{ label: "TOTAL MOVES", value: moveLog.length },
						{ label: "BOARDS ALIVE", value: aliveCount },
						{ label: "TIME", value: formatTime(elapsed) },
					]}
					moveLog={moveLog}
					boardSize={boardSize}
				/>
			</div>

			{/* Action bar */}
			<GameActionBar
				actions={[
					{
						label: "RESIGN",
						onClick: () => openModal("exitConfirmation"),
						variant: "danger",
					},
				]}
			/>

			{/* Modals */}
			<PlayerNamesModal
				visible={activeModal === "names"}
				onSubmit={(name1: string, name2: string) => {
					setPlayer1Name(name1 || "Player 1");
					setPlayer2Name(name2 || "Player 2");
					closeModal();
					resetGame(numberOfBoards, boardSize);
					setInitialSetupDone(true);
					setGameStarted(true);
				}}
				onClose={initialSetupDone ? closeModal : undefined}
				initialNames={[player1Name, player2Name]}
				key={player1Name + player2Name}
			/>
			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					closeModal();
					resetGame(numberOfBoards, boardSize);
				}}
				onMenu={() => {
					closeModal();
					router.push("/");
				}}
			/>
			<BoardConfigModal
				visible={activeModal === "boardConfig"}
				currentBoards={numberOfBoards}
				currentSize={boardSize}
				onConfirm={handleBoardConfigChange}
				onCancel={closeModal}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					resetGame(numberOfBoards, boardSize);
					closeModal();
				}}
				onCancel={closeModal}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={() => {
					router.push("/");
				}}
				onCancel={closeModal}
				confirmText="Yes, Exit"
			/>
		</GameLayout>
	);
};

export default Game;
