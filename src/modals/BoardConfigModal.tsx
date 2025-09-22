'use client'
import { useState } from 'react';
import { BoardConfigModalProps } from '../services/types';
// Standardise components
import { BoardConfigButton } from '@/components/ui/Buttons/BoardConfigButton';
import { BoardActionButton } from '@/components/ui/Buttons/BoardActionButton';

const BoardConfigModal = ({
  visible,
  currentBoards,
  currentSize,
  onConfirm,
  onCancel
}: BoardConfigModalProps) => {
  const [selectedBoards, setSelectedBoards] = useState<any>(currentBoards);
  const [selectedSize, setSelectedSize] = useState<any>(currentSize);

  if (!visible) return null;

  return (
     <dialog open aria-labelledby="board-config-title" className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
     <section className="bg-black p-6 w-[90%] max-w-xl text-center space-y-6">
     <h1 id="board-config-title" className="sr-only">Board configuration</h1>
        
        <header>
          <h2 className="text-red-600 text-[35px]">Number of Boards</h2>
        </header>
        
        <div role="group" aria-label="Select number of boards">

          <ul className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>
                <BoardConfigButton
                  label={num}
                  isActive={selectedBoards === num}
                  onClick={() => setSelectedBoards(num)}
                />
              </li>
            ))}
          </ul>
        </div>

   <div>
  <h2 className="text-red-600 text-[35px]">Board Size</h2>

  <div role="group" aria-label="Select board size">
    <ul className="flex flex-wrap gap-2 justify-center">
      {[1, 2, 3, 4, 5].map(num => (
        <li key={num}>
          <BoardConfigButton
            label={num}
            isActive={selectedBoards === num}
            onClick={() => setSelectedBoards(num)}
          />
        </li>
      ))}
    </ul>
  </div>
</div>


        <footer className="flex gap-4 pt-2 justify-center">
          <BoardActionButton onClick={onCancel}>
            Cancel
          </BoardActionButton>

          <BoardActionButton onClick={() => onConfirm(selectedBoards, selectedSize)}>
            Apply
          </BoardActionButton>
        </footer>
      </section>
    </dialog>
  );
};

export default BoardConfigModal;
