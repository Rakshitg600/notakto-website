'use client';
import { useEffect, useRef, useState } from 'react';
import { BoardConfigModalProps, BoardNumber, BoardSize } from '../services/types';
import { BoardConfigButton } from '@/components/ui/Buttons/BoardConfigButton';
import { BoardActionButton } from '@/components/ui/Buttons/BoardActionButton';
import BoardConfigContainer from '@/components/ui/Containers/BoardConfig/BoardConfigContainer';
import BoardConfigTitle from '@/components/ui/Title/BoardConfigTitle';
import BoardConfigOptions from '@/components/ui/Containers/BoardConfig/BoardConfigOptions';
import BoardConfigAction from '@/components/ui/Containers/BoardConfig/BoardConfigAction';
import ModalOverlay from '@/components/ui/Overlays/ModalOverlay';
const BoardConfigModal = ({
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
<ModalOverlay>
      <BoardConfigContainer>
        <BoardConfigTitle text='Number of Boards' />
        <BoardConfigOptions>
          {[1, 2, 3, 4, 5].map(num => (
            <BoardConfigButton
              key={num}
              label={num}
              isActive={selectedBoards === num}
              onClick={() => setSelectedBoards(num)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigTitle text='Board Size' />

        <BoardConfigOptions>
          {[2, 3, 4, 5].map(size => (
            <BoardConfigButton
              key={size}
              label={`${size}x${size}`}
              isActive={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigAction>

          <BoardActionButton onClick={onCancel}>
            Cancel
          </BoardActionButton>

          <BoardActionButton onClick={() => onConfirm(selectedBoards, selectedSize)}>
            Apply
          </BoardActionButton>

        </BoardConfigAction>
      </BoardConfigContainer>
    </ModalOverlay>
  );
}
