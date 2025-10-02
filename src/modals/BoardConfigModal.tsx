'use client';
import { useRef, useState } from 'react';
import { BoardConfigModalProps, BoardNumber, BoardSize } from '@/services/types';
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
  onConfirm,
}: BoardConfigModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // ✅ Default fallback without extra type guards
  const [selectedBoards, setSelectedBoards] = useState<BoardNumber>(currentBoards ?? 1);
  const [selectedSize, setSelectedSize] = useState<BoardSize>(currentSize ?? 2);

  if (!visible) return null;

  return (
    <ModalOverlay>
      <BoardConfigContainer>
        <BoardConfigTitle text="Number of Boards" />
        <BoardConfigOptions>
          {[1, 2, 3, 4, 5].map(num => (
            <BoardConfigButton
              key={num}
              label={num}
              isActive={selectedBoards === num}
              onClick={() => setSelectedBoards(num as BoardNumber)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigTitle text="Board Size" />
        <BoardConfigOptions>
          {[2, 3, 4, 5].map(size => (
            <BoardConfigButton
              key={size}
              label={`${size}x${size}`}
              isActive={selectedSize === size}
              onClick={() => setSelectedSize(size as BoardSize)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigAction>
          <BoardActionButton onClick={onCancel}>Cancel</BoardActionButton>
          <BoardActionButton onClick={() => onConfirm(selectedBoards, selectedSize)}>
            Apply
          </BoardActionButton>
        </BoardConfigAction>
      </BoardConfigContainer>
    </ModalOverlay>
  );
};

export default BoardConfigModal;
