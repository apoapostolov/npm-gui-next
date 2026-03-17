import type { ReactNode } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { Install } from './Install';

const Wrapper = styled.div`
  background: var(--color-hover);
  height: 24px;
  font-weight: bold;
`;

export const InstallCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return (
    <Wrapper>
      <Install dependency={dependency} />
    </Wrapper>
  );
};
