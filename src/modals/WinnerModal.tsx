import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import WinnerAction from "@/components/ui/Containers/WinnerModal/WinnerAction";
import WinnerContainer from "@/components/ui/Containers/WinnerModal/WinnerContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import WinnerMessage from "@/components/ui/Title/WinnerMessage";
import WinnerTitle from "@/components/ui/Title/WinnerTitle";
import type { WinnerModalProps } from "@/services/types";

const WinnerModal = ({
	visible,
	winner,
	onPlayAgain,
	onMenu,
}: WinnerModalProps) => {
	if (!visible) return null;
	return (
		<ModalOverlay>
			<WinnerContainer>
				<WinnerTitle text="Game Over!" />
				<WinnerMessage
					text={winner === "You" ? "You won!" : `${winner} wins`}
				/>
				<WinnerAction>
					<WinnerButton onClick={onPlayAgain}>Play Again</WinnerButton>
					<WinnerButton onClick={onMenu}>Main Menu</WinnerButton>
				</WinnerAction>
			</WinnerContainer>
		</ModalOverlay>
	);
};

export default WinnerModal;
