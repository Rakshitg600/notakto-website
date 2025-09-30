'use client';
import { useEffect, useRef, useState } from 'react';
import { BoardConfigModalProps, BoardNumber, BoardSize } from '../services/types';
import { BoardConfigButton } from '@/components/ui/Buttons/BoardConfigButton';
import { BoardActionButton } from '@/components/ui/Buttons/BoardActionButton';

const boardSizes: BoardSize[] = [2, 3, 4, 5];
const boardCounts: BoardNumber[] = [1, 2, 3, 4, 5];

// Type guards
function isBoardNumber(n: number): n is BoardNumber {
  return (boardCounts as ReadonlyArray<number>).includes(n);
}
function isBoardSize(n: number): n is BoardSize {
  return (boardSizes as ReadonlyArray<number>).includes(n);
}

export default function BoardConfigModal({
  visible,
  currentBoards,
  currentSize,
  onCancel,
  onConfirm
}: BoardConfigModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [selectedBoards, setSelectedBoards] = useState<BoardNumber>(
    isBoardNumber(currentBoards) ? currentBoards : (1 as BoardNumber)
  );

  const initialSize: BoardSize = isBoardSize(currentSize)
    ? currentSize
    : (2 as BoardSize);
  const [selectedSize, setSelectedSize] = useState<BoardSize>(initialSize);

  if (!visible) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="board-config-title"
      className="z-50 rounded-lg shadow-xl p-0"
    >
      <section className="bg-black p-6 w-[90%] max-w-xl text-center space-y-6">
        <h1 id="board-config-title" className="sr-only">
          Board configuration
        </h1>

        <header>
          <h2 className="text-red-600 text-[35px]">Number of Boards</h2>
        </header>
        <div role="group" aria-label="Select number of boards">
          <ul className="flex flex-wrap gap-2 justify-center">
            {boardCounts.map(num => (
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
              {boardSizes.map(size => (
                <li key={size}>
                  <BoardConfigButton
                    label={`${size}x${size}`}
                    isActive={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="flex gap-4 pt-2 justify-center">
          <BoardActionButton onClick={onCancel}>Cancel</BoardActionButton>

          <BoardActionButton
            onClick={() => onConfirm(selectedBoards, selectedSize)}
          >
            Apply
          </BoardActionButton>
        </footer>
      </section>
    </dialog>
  );
}
