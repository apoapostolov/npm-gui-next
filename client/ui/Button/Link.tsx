/* eslint-disable react/jsx-props-no-spreading */
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Icon } from '../Icon/Icon';

interface Props extends ComponentPropsWithoutRef<'a'> {
  variant?: 'danger';
  icon?: React.ComponentProps<typeof Icon>['glyph'];
  title: string;
  children: ReactNode;
}

const StyledLink = styled.a<{ $variant?: Props['variant'] }>`
  text-decoration: none;
  font-weight: bold;
  font-size: 0.8em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 1.6em;
  min-height: 1.6em;
  text-align: center;

  ${({ $variant }) =>
    $variant === 'danger'
      ? css`
          border-radius: 2px;
          color: #fff;
          padding: 0.2em 0.4em;
          background: #ef5c0e;
        `
      : css`
          color: var(--color-link-muted);
          background: transparent;
        `}
`;

export const Link: FC<Props> = ({ children, icon, ...props }) => {
  const { variant, ...restProps } = props;

  return (
    <StyledLink $variant={variant} {...restProps}>
      {icon && <Icon glyph={icon} />}
      {children}
    </StyledLink>
  );
};
