import type { ReactNode } from 'react';
import styled from 'styled-components';

import { Icon } from '../../../../ui/Icon/Icon';

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const RangeIcon = styled(Icon)`
  color: var(--color-muted);
  font-size: 0.85em;
`;

export const RequiredCell = (
  _: unknown,
  required: unknown,
): ReactNode => {
  if (typeof required !== 'string' || required.length === 0) {
    return required as ReactNode;
  }

  if (required.startsWith('^')) {
    return (
      <Wrapper>
        <RangeIcon glyph="caret-top" />
        <span>{required.slice(1)}</span>
      </Wrapper>
    );
  }

  return required;
};
