import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { useClickOutsideRef } from '../hooks/use-click-outside';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Invisible = styled.div`
  pointer-events: none;
  visibility: hidden;
`;

const Trigger = styled.div<{ $isOpen: boolean }>`
  position: relative;
  z-index: ${({ $isOpen }) => ($isOpen ? 3 : 'auto')};
`;

const Content = styled.div<{ $isOpen: boolean }>`
  background: transparent;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
  padding: 7.5px;
  top: -7.5px;
  left: -7.5px;
  position: absolute;
  z-index: 1;
  transition: max-width 300ms, max-height 300ms;
  border: ${({ $isOpen }) =>
    $isOpen ? '1px solid var(--color-border)' : '0'};
  border-radius: ${({ $isOpen }) => ($isOpen ? '2px' : '0')};
  background: ${({ $isOpen }) =>
    $isOpen ? 'var(--color-surface)' : 'transparent'};
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  max-width: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? '0 0 10px 0 rgba(0, 0, 0, 0.5)' : 'none'};
`;

interface Props {
  children: [
    (onToggleOpen: (forceState?: boolean) => void) => ReactNode,
    (onToggleOpen: (forceState?: boolean) => void) => ReactNode,
  ];
}

export const Dropdown: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggleOpen = useCallback((forceState?: boolean) => {
    setIsOpen((previousIsOpen) =>
      forceState !== undefined ? forceState : !previousIsOpen,
    );
  }, []);

  const ref = useClickOutsideRef(onClose);

  return (
    <Wrapper ref={ref}>
      <Trigger $isOpen={isOpen}>{children[0](onToggleOpen)}</Trigger>
      <Content $isOpen={isOpen}>
        <Invisible>{children[0](onToggleOpen)}</Invisible>
        {children[1](onToggleOpen)}
      </Content>
    </Wrapper>
  );
};
