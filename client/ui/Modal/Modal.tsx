import type { ReactNode } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 5;
`;

const ModalBody = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  min-width: 400px;
  max-width: 80vw;
  min-height: 120px;
  width: min(560px, calc(100vw - 32px));
  max-height: 80vh;
  overflow-y: auto;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
`;

interface Props {
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <Backdrop onClick={onClose} role="button">
      <ModalBody
        aria-modal="true"
        onClick={(event): void => {
          event.stopPropagation();
        }}
        role="dialog"
      >
        {children}
      </ModalBody>
    </Backdrop>
  );
};
