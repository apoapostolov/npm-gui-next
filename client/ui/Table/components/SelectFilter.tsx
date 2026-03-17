/* eslint-disable styled-components-a11y/no-onchange */
/* eslint-disable @typescript-eslint/ban-types */
import styled from 'styled-components';

import { Icon } from '../../Icon/Icon';
import type { FilterProps } from './shared';
import { preventEvent } from './shared';

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Select = styled.select`
  appearance: none;
  display: inline-block;
  height: 24px;
  line-height: normal;
  vertical-align: middle;
  padding: 0 24px 0 6px;
  border-radius: 6px;
  box-sizing: border-box;
  text-align-last: left;
`;

const SelectIcon = styled(Icon)`
  color: var(--color-text);
  pointer-events: none;
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

export const SelectFilter = <T extends string>({
  selectedValue,
  onFilterChange,
}: FilterProps<T>): JSX.Element => (
  <Wrapper>
    <Select
      onChange={(event): void => {
        onFilterChange(event.target.value as T);
      }}
      onClick={preventEvent}
      value={selectedValue}
    >
      <option value="">any</option>
      <option value="dev">dev</option>
      <option value="prod">prod</option>
    </Select>
    <SelectIcon glyph="caret-bottom" />
  </Wrapper>
);
