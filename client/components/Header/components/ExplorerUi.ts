import styled, { css } from 'styled-components';

import type { CSSType } from '../../../Styled';

export const Wrapper = styled.div`
  position: relative;
  z-index: 5;
`;

interface ExplorerListProps {
  $isOpen: boolean;
}

export const ExplorerList = styled.ul`
  position: absolute;
  background: var(--color-chrome);
  right: 0;
  top: 100%;
  z-index: 1;
  max-height: 0;
  max-width: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  transition: max-width 300ms, max-height 300ms;
  width: 250px;
  list-style: none;

  ${({ $isOpen }: ExplorerListProps): CSSType =>
    $isOpen &&
    css`
      border: 1px solid var(--color-border);
      border-color: var(--color-border);
      max-height: 80vh;
      max-width: 250px;
      overflow-y: scroll;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    `}
`;

interface ExplorerButtonProps {
  $isDirectory: boolean;
  $isProject?: boolean;
}

export const ExplorerButton = styled.button<ExplorerButtonProps>`
  color: var(--color-chrome-text);
  background: none;
  font-size: 12px;
  font-weight: 500;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  text-align: left;
  padding: 4px 8px;
  min-height: 26px;

  &:hover {
    background: var(--color-hover-strong);
  }

  ${({ $isDirectory }: ExplorerButtonProps): CSSType =>
    $isDirectory &&
    css`
      max-height: 80vh;
      max-width: 100%;
    `}

  ${({ $isProject }: ExplorerButtonProps): CSSType =>
    $isProject === true &&
    css`
      color: var(--color-project-marker);

      :hover {
        color: var(--color-project-marker-hover);
      }
    `}

  &:disabled {
    color: var(--color-muted);
    background: none;
    text-decoration: none;
    cursor: not-allowed;
  }
`;

export const ExplorerFile = styled.span`
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  min-height: 26px;
  white-space: nowrap;
`;

export const ExplorerCurrentLocation = styled.span`
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 500;
  padding: 0 3px;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  direction: rtl;
  display: block;
`;

export const ExplorerSearch = styled.input`
  display: block;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  margin: 3px 3px 0 3px;
  width: calc(100% - 6px);
  color: var(--color-text);
  padding: 0 8px;
  border-radius: 2px;
  height: 28px;
`;
