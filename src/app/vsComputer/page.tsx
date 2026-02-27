"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import Board from "@/components/ui/Board/Board";
import BoardContainer from "@/components/ui/Containers/Board/BoardContainer";
import BoardWrapper from "@/components/ui/Containers/Board/BoardWrapper";
import GameBoardArea from "@/components/ui/Containers/Games/GameBoardArea";
import PlayerStatusContainer from "@/components/ui/Containers/Games/PlayerStatusContainer";
import StatContainer from "@/components/ui/Containers/Games/StatContainer";
import GameLayout from "@/components/ui/Layout/GameLayout";
import LoadingOverlay from "@/components/ui/Overlays/LoadingOverlay";
import PlayerTurnTitle from "@/components/ui/Title/PlayerTurnTitle";
import StatLabel from "@/components/ui/Title/StatLabel";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import DifficultyModal from "@/modals/DifficultyModal";
import ProfileModal from "@/modals/ProfileModal";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import WinnerModal from "@/modals/WinnerModal";
import {
	createGame,
	getWallet,
	makeMove,
	quitGame,
	skipMove,
	undoMove,
} from "@/services/game-apis";
import { convertBoard, isBoardDead } from "@/services/logic";
import type {
	MakeMoveResponse,
	SkipMoveResponse,
	UndoMoveResponse,
} from "@/services/schema";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useCoins, useSound, useUser, useXP } from "@/services/store";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	DifficultyLevel,
	ErrorResponse,
	NewGameResponse,
} from "@/services/types";
import { useGlobalModal } from "@/store/useGlobalModal";

const Game = () => {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [isProcessingPayment, _setIsProcessingPayment] =
		useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const sessionIdRef = useRef<string>("");

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [isInitializing, setInitializing] = useState<boolean>(false);
	const hasInitializedRef = useRef(false);
	const [isResetting, setIsResetting] = useState<boolean>(false);
	const [isUndoing, setIsUndoing] = useState<boolean>(false);
	const [isSkipping, setIsSkipping] = useState<boolean>(false);
	const [isUpdatingConfig, setIsUpdatingConfig] = useState<boolean>(false);
	const [isUpdatingDifficulty, setIsUpdatingDifficulty] =
		useState<boolean>(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const Coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);
	const XP = useXP((state) => state.XP);
	const user = useUser((state) => state.user);
	const router = useRouter();
	const isBusy =
		isInitializing ||
		isProcessing ||
		isResetting ||
		isUndoing ||
		isSkipping ||
		isUpdatingConfig ||
		isUpdatingDifficulty;

	useShortcut(
		{
			escape: () => {
				if (activeModal === "winner") return;
				if (activeModal) return closeModal();
			},

			m: () => {
				if (activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},

			r: () => {
				if (activeModal === "winner" || !hasMoveHappened) return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			},

			c: () => {
				if (activeModal === "winner") return;
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			},

			s: () => {
				if (activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},

			d: () => {
				if (activeModal === "winner") return;
				activeModal === "difficulty" ? closeModal() : openModal("difficulty");
			},

			q: () => {
				if (activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
			p: () => {
				if (activeModal === "winner") return;
				activeModal === "profile" ? closeModal() : openModal("profile");
			},
		},
		false,
	);

	const initGame = async (
		num: BoardNumber,
		size: BoardSize,
		diff: DifficultyLevel,
	) => {
		try {
			setInitializing(true);
			if (user) {
				const data = await createGame(num, size, diff, await user.getIdToken());
				// handle API-level errors (ErrorResponse)
				if (!data || (data as ErrorResponse).success === false) {
					const err = (data as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to create game: ${err.error}`);
					return;
				}

				// At this point `data` is NewGameResponse
				const resp = data as NewGameResponse;
				let newBoards: BoardState[];
				try {
					newBoards = convertBoard(
						resp.boards,
						resp.numberOfBoards,
						resp.boardSize,
					);
				} catch (error) {
					toast.error(`Failed to initialize game boards: ${error}`);
					return;
				}

				if (newBoards.length === 0) {
					toast.error("Failed to initialize game boards");
					return;
				}

				setInitializing(false);
				sessionIdRef.current = resp.sessionId;
				setBoards(newBoards);
				setCurrentPlayer(1);
				setBoardSize(resp.boardSize);
				setNumberOfBoards(resp.numberOfBoards);
				setDifficulty(resp.difficulty);
				setGameHistory([newBoards]);
			} else {
				setInitializing(false);
				console.log("initGame: user not authenticated");
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			setInitializing(false);
			toast.error(`Error initializing game: ${error}`);
			router.push("/");
		}
	};

	const handleMove = async (boardIndex: number, cellIndex: number) => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		setIsProcessing(true);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		try {
			if (user) {
				const data = await makeMove(
					sessionIdRef.current,
					boardIndex,
					cellIndex,
					await user.getIdToken(),
				);
				if (!data || (data as ErrorResponse).success === false) {
					const err = (data as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to make move: ${err.error}`);
					return;
				}
				const resp = data as MakeMoveResponse;
				let newBoards: BoardState[];
				try {
					newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
				} catch (error) {
					toast.error(`Failed to initialize game boards: ${error}`);
					return;
				}

				if (newBoards.length === 0) {
					toast.error("Failed to initialize game boards");
					return;
				}
				setBoards(newBoards);
				setCurrentPlayer(1);
				setGameHistory((prev) => [...prev, newBoards]);
				if (resp.gameover) {
					const token = await user.getIdToken();
					const wallet = await getWallet(token);

					if (wallet.success) {
						setCoins(wallet.coins);
						setXP(wallet.xp);
					}
					if (resp.winner === true) {
						setWinner("You");
					} else {
						setWinner("Computer");
					}
					openModal("winner");
					playWinSound(sfxMute);
				} else {
					playMoveSound(sfxMute);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error making move ${error}`);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReset = async () => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		setIsResetting(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to reset game");
				return;
			}
			await initGame(numberOfBoards, boardSize, difficulty);
		} catch (error) {
			toast.error(`Error resetting game ${error}`);
		} finally {
			setIsResetting(false);
		}
	};

	const handleUndo = async () => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		if (Coins < 100) {
			toast.error("Not enough coins");
			return;
		}
		setIsUndoing(true);

		try {
			if (user) {
				const data = await undoMove(
					sessionIdRef.current,
					await user.getIdToken(),
				);
				if (!data || (data as ErrorResponse).success === false) {
					const err = (data as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to undo move: ${err.error}`);
					return;
				}
				const resp = data as UndoMoveResponse;
				let newBoards: BoardState[];
				try {
					newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
				} catch (error) {
					toast.error(`Failed to initialize game boards: ${error}`);
					return;
				}

				if (newBoards.length === 0) {
					toast.error("Failed to initialize game boards");
					return;
				}
				setBoards(newBoards);
				setCurrentPlayer(1);
				setGameHistory((prev) => [...prev, newBoards]);
				const token = await user.getIdToken();
				const wallet = await getWallet(token);

				if (wallet.success) {
					setCoins(wallet.coins);
					setXP(wallet.xp);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error undoing move: ${error}`);
		} finally {
			setIsUndoing(false);
		}
	};

	const handleSkip = async () => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		if (Coins < 200) {
			toast.error("Not enough coins");
			return;
		}
		setIsSkipping(true);

		try {
			if (user) {
				const data = await skipMove(
					sessionIdRef.current,
					await user.getIdToken(),
				);
				if (!data || (data as ErrorResponse).success === false) {
					const err = (data as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to skip move: ${err.error}`);
					return;
				}
				const resp = data as SkipMoveResponse;
				let newBoards: BoardState[];
				try {
					newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
				} catch (error) {
					toast.error(`Failed to initialize game boards: ${error}`);
					return;
				}

				if (newBoards.length === 0) {
					toast.error("Failed to initialize game boards");
					return;
				}
				setBoards(newBoards);
				setCurrentPlayer(1);
				setGameHistory((prev) => [...prev, newBoards]);
				const token = await user.getIdToken();
				const wallet = await getWallet(token);

				if (wallet.success) {
					setCoins(wallet.coins);
					setXP(wallet.xp);
				}
				if (resp.gameover) {
					if (resp.winner === true) {
						setWinner("You");
					} else {
						setWinner("Computer");
					}
					openModal("winner");
					playWinSound(sfxMute);
				} else {
					playMoveSound(sfxMute);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error skipping move: ${error}`);
		} finally {
			setIsSkipping(false);
		}
	};

	const handleBoardConfigChange = async (
		newNumberOfBoards: BoardNumber,
		newBoardSize: BoardSize,
	) => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		setIsUpdatingConfig(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to quit game");
				return;
			}
			await initGame(newNumberOfBoards, newBoardSize, difficulty);
		} catch (error) {
			toast.error(`Error updating config: ${error}`);
		} finally {
			setIsUpdatingConfig(false);
		}
	};

	const handleDifficultyChange = async (level: DifficultyLevel) => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		setIsUpdatingDifficulty(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to quit game");
				return;
			}
			await initGame(numberOfBoards, boardSize, level);
		} catch (error) {
			toast.error(`Error updating config: ${error}`);
		} finally {
			setIsUpdatingDifficulty(false);
		}
	};

	const authReady = useUser((s) => s.authReady);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <effect runs when authReady or user changes; hasInitializedRef prevents duplicate initialization>
	useEffect(() => {
		if (!authReady) return;
		if (!user) {
			toast.error("User not authenticated");
			router.push("/");
			return;
		}

		if (hasInitializedRef.current) return;

		let cancelled = false;

		const init = async () => {
			await initGame(numberOfBoards, boardSize, difficulty);
			if (cancelled) return;
			hasInitializedRef.current = true;
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, [authReady, user]);

	return (
		<GameLayout>
			<GameBoardArea>
				<PlayerStatusContainer>
					<StatContainer>
						<StatLabel text={`Coins: ${Coins}`} />
						<StatLabel text={`| XP: ${XP}`} />
					</StatContainer>
					<PlayerTurnTitle
						text={currentPlayer === 1 ? "Your Turn" : "Computer's Turn"}
					/>
				</PlayerStatusContainer>

				<BoardContainer>
					{boards.map((board, index) => (
						//FIXME:
						// biome-ignore lint/suspicious/noArrayIndexKey: <fix later>
						<BoardWrapper key={index}>
							<Board
								boardIndex={index}
								boardState={board}
								makeMove={handleMove}
								isDead={isBoardDead(board, boardSize)}
								boardSize={boardSize}
								disabled={isBusy || currentPlayer !== 1}
							/>
						</BoardWrapper>
					))}
				</BoardContainer>
			</GameBoardArea>

			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					closeModal();
					handleReset();
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
				onConfirm={(boards, size) => {
					handleBoardConfigChange(boards, size);
					closeModal();
				}}
				onCancel={() => closeModal()}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={() => closeModal()}
			/>
			<DifficultyModal
				visible={activeModal === "difficulty"}
				onSelect={(level: DifficultyLevel) => {
					handleDifficultyChange(level);
					closeModal();
				}}
				onClose={() => closeModal()}
			/>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={() => closeModal()}
			/>
			<ProfileModal
				visible={activeModal === "profile"}
				onClose={() => closeModal()}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					handleReset();
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
			<LoadingOverlay
				visible={isBusy}
				text={
					isProcessing
						? "Computer is thinking..."
						: isResetting
							? "Resetting game..."
							: isUndoing
								? "Undoing move..."
								: isSkipping
									? "Skipping move..."
									: isUpdatingConfig
										? "Updating game configuration..."
										: isUpdatingDifficulty
											? "Adjusting AI difficulty..."
											: isInitializing
												? "Setting up the game"
												: "Please wait..."
				}
			/>
		</GameLayout>
	);
};

export default Game;
