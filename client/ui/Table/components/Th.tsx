import type { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { Icon } from '../../Icon/Icon';
import { SelectFilter } from './SelectFilter';
import { TextFilter } from './TextFilter';

interface WrapperProps {
  onClick?: unknown;
}

const Wrapper = styled.th<WrapperProps>`
  vertical-align: middle;

  ${({ onClick }: WrapperProps) =>
    onClick
      ? css`
          cursor: pointer;
          user-select: none;
        `
      : ''}
`;

const HeaderRow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const HeaderContent = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const FilterSlot = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SortableIcon = styled(Icon)`
  color: var(--color-muted);
`;

export interface Props {
  children?: ReactNode;

  sortActive?: boolean;
  sortReversed?: boolean;
  onSortChange?: () => void;

  filterable?: string[] | true;
  filterValue?: string;
  onFilterChange?: (newFilterValue: string) => void;
}

export const Th: FC<Props> = ({
  children,
  filterable,
  sortActive,
  sortReversed,
  onSortChange,
  filterValue = '',
  onFilterChange,
}) => (
  <Wrapper onClick={onSortChange}>
    <HeaderRow>
      <HeaderContent>
        {sortActive && (
          <SortableIcon
            glyph={sortReversed === true ? 'caret-bottom' : 'caret-top'}
          />
        )}
        {children}
      </HeaderContent>
      {onFilterChange && (
        <FilterSlot>
          {!Array.isArray(filterable) && (
            <TextFilter
              onFilterChange={onFilterChange}
              selectedValue={filterValue}
            />
          )}

          {Array.isArray(filterable) && (
            <SelectFilter
              onFilterChange={onFilterChange}
              selectedValue={filterValue}
            />
          )}
        </FilterSlot>
      )}
    </HeaderRow>
  </Wrapper>
);
