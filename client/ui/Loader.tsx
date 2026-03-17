import type { FC } from 'react';
import styled from 'styled-components';

import { Icon } from './Icon/Icon';

const LoaderStyled = styled.span`
  animation: spin 1s linear infinite;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  color: currentColor;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  i {
    margin-bottom: 0;
  }
`;

export const Loader: FC = () => (
  <LoaderStyled>
    <Icon glyph="reload" />
  </LoaderStyled>
);
