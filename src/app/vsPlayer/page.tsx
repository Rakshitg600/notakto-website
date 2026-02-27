"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShortcut } from "@/components/hooks/useShortcut";
import Board from "@/components/ui/Board/Board";
import BoardContainer from "@/components/ui/Containers/Board/BoardContainer";
import BoardWrapper from "@/components/ui/Containers/Board/BoardWrapper";
import GameBoardArea from "@/components/ui/Containers/Games/GameBoardArea";
import PlayerStatusContainer from "@/components/ui/Containers/Games/PlayerStatusContainer";
import GameLayout from "@/components/ui/Layout/GameLayout";
import PlayerTurnTitle from "@/components/ui/Title/PlayerTurnTitle";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import WinnerModal from "@/modals/WinnerModal";
import { isBoardDead } from "@/services/logic";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useSound } from "@/services/store";
import type { BoardNumber, BoardSize, BoardState } from "@/services/types";
import { useGlobalModal } from "@/store/useGlobalModal";

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

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const router = useRouter();

	// Open names modal on mount for initial setup
	useEffect(() => {
		if (!initialSetupDone) {
			openModal("names");
		}
	}, [initialSetupDone, openModal]);

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
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			},
			s: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},
			q: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
		},
		false,
	);

	const makeMove = (boardIndex: number, cellIndex: number) => {
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
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size as BoardSize);
		closeModal();
		resetGame(num, size);
	};

	return (
		<GameLayout>
			<GameBoardArea>
				<PlayerStatusContainer>
					<PlayerTurnTitle
						text={
							currentPlayer === 1
								? `${player1Name}'s turn`
								: `${player2Name}'s turn`
						}
					/>
				</PlayerStatusContainer>

				<BoardContainer>
					{boards.map((board, index) => {
						const boardKey = `${board.join("-")}-${index}`; //TODO: use better key
						return (
							<BoardWrapper key={boardKey}>
								<Board
									boardIndex={index}
									boardState={board}
									makeMove={makeMove}
									isDead={isBoardDead(board, boardSize)}
									boardSize={boardSize}
									disabled={false}
								/>
							</BoardWrapper>
						);
					})}
				</BoardContainer>
			</GameBoardArea>

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
				onCancel={() => closeModal()}
			/>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={() => closeModal()}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={() => closeModal()}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					resetGame(numberOfBoards, boardSize);
					closeModal();
				}}
				onCancel={() => closeModal()}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={() => {
					router.push("/");
				}}
				onCancel={() => closeModal()}
				confirmText="Yes, Exit"
			/>
		</GameLayout>
	);
};

export default Game;
