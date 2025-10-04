import { useRouter } from "next/navigation";
import { WinnerModalProps } from "@/services/types";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import { Confetti } from "@/components/ui/confetti";
import { Button } from "@/components/ui/button";

const WinnerModal = ({ visible, winner, onPlayAgain }: WinnerModalProps) => {
  if (!visible) return null;
  const router = useRouter();
  const exitToMenu = () => {
    router.push('/');
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      {/* Confetti effect overlays the modal */}
      <Confetti
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', width: '100vw', height: '100vh' }}
        options={{
          particleCount: 400,
          spread: 120,
          startVelocity: 60,
          scalar: 2.2 // makes confetti pieces larger
        }}
      />
      <div className="bg-black text-center rounded-xl p-6 w-[80%] max-w-md shadow-2xl relative z-10">
        <h1 className="text-5xl text-red-600 mb-3">Game Over!</h1>

        <p className="text-2xl text-red-500 mb-2">
          {winner === 'You' ? 'You won!' : `${winner} wins`}
        </p>
        <div className="mb-6 text-4xl font-extrabold" style={{ color: '#39FF14', textShadow: '0 0 0 #39FF14, 0 0 16px #39FF14' }}>
          🎉 Congratulations!
        </div>

  <div className="flex justify-between gap-4 w-full">
          <WinnerButton onClick={onPlayAgain}>
            Play Again
          </WinnerButton>
          <WinnerButton onClick={exitToMenu}>
            Main Menu
          </WinnerButton>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;