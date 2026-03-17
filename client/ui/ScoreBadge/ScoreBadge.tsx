import styled from 'styled-components';

import type { CSSType } from '../../Styled';

export const ScoreBadge = styled.a<{ score?: number }>`
  color: var(--color-chrome-text);
  text-decoration: none;
  font-weight: 100;
  padding: 3px 5px;
  border-radius: 2px;

  ${({ score }): CSSType =>
    score && score >= 85 && 'background: var(--color-badge-good);'}
  ${({ score }): CSSType =>
    score && score < 85 && 'background: var(--color-badge-medium);'}
  ${({ score }): CSSType =>
    score && score < 70 && 'background: var(--color-badge-bad);'}
`;
