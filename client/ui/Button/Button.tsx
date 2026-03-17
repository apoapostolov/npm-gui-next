import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import type { Props as IconPropsOriginal } from '../Icon/Icon';
import { Icon } from '../Icon/Icon';

export interface Props extends ComponentPropsWithoutRef<'button'> {
  variant: 'danger' | 'dark' | 'info' | 'primary' | 'success' | 'warning';
  icon?: React.ComponentProps<typeof Icon>['glyph'];
  navigate?: string;
  soft?: boolean;
  title: string;
  children: ReactNode;
}

const variantToColor = {
  danger: 'var(--color-danger)',
  dark: 'var(--color-chrome)',
  info: 'var(--color-info)',
  primary: 'var(--color-primary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
};

const ButtonStyled = styled.button<{
  $iconOnly: boolean;
  $soft: boolean;
  $variant: Props['variant'];
}>`
  border: 0;
  border-radius: ${({ $soft }) => ($soft ? '999px' : '2px')};
  color: var(--color-chrome-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  min-height: 28px;
  min-width: ${({ $iconOnly }) => ($iconOnly ? '28px' : 'unset')};
  width: ${({ $iconOnly }) => ($iconOnly ? '28px' : 'auto')};
  outline: none;
  padding: ${({ $iconOnly }) => ($iconOnly ? '0' : '0 10px')};
  transition: background-color 200ms;
  vertical-align: middle;
  margin-right: 5px;
  white-space: nowrap;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(80%);
  }

  background-color: ${({ $variant }) => variantToColor[$variant]};

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-disabled) !important;
  }
`;

interface IconProps extends IconPropsOriginal {
  $hasText: boolean;
}

const ButtonIcon = styled(Icon)<IconProps>`
  margin-right: ${({ $hasText }) => ($hasText ? undefined : '0')};
`;

export const Button: React.FC<Props> = ({
  icon,
  children,
  navigate,
  soft = false,
  ...props
}) => {
  const navigateTo = useNavigate();
  const hasText = children !== undefined && children !== null && children !== '';
  const iconOnly = icon !== undefined && !hasText;

  if (navigate) {
    props.onClick = (): void => {
      void navigateTo(navigate);
    };
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ButtonStyled
      $iconOnly={iconOnly}
      $soft={soft}
      $variant={props.variant}
      {...props}
    >
      {icon !== undefined && (
        <ButtonIcon $hasText={hasText} glyph={icon} />
      )}
      {children}
    </ButtonStyled>
  );
};
