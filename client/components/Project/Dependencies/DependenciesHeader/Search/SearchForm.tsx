import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { SearchResponse } from '../../../../../../server/types/global.types';
import { Button } from '../../../../../ui/Button/Button';
import { Link } from '../../../../../ui/Button/Link';
import { Loader } from '../../../../../ui/Loader';

const Form = styled.form`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  & > input:disabled,
  & > select:disabled {
    background: var(--color-surface-alt);
    color: var(--color-text);
    opacity: 1;
    cursor: not-allowed;
  }
`;

const SourceSelect = styled.select`
  appearance: none;
  display: inline-block;
  width: 5em;
  background: var(--color-surface-alt);
  color: var(--color-text);
  height: 28px;
  line-height: 28px;
  padding: 0 24px 0 8px;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--color-text) 50%),
    linear-gradient(135deg, var(--color-text) 50%, transparent 50%);
  background-position:
    calc(100% - 14px) calc(50% - 2px),
    calc(100% - 9px) calc(50% - 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  vertical-align: middle;

  option {
    background: var(--color-surface);
    color: var(--color-text);
  }

  &:disabled {
    padding-right: 8px;
    background-image: none;
  }
`;

const SearchInput = styled.input`
  width: 11em;
  height: 28px;
  line-height: 28px;
  vertical-align: middle;
`;

export interface Props {
  onSubmit: (query: string) => void;
  searchResults: SearchResponse;
}

export const SearchForm: FC<Props> = ({ onSubmit, searchResults }) => {
  const [query, setQuery] = useState('');

  return (
    <Form
      onSubmit={(event): void => {
        event.preventDefault();
        onSubmit(query);
      }}
    >
      <SourceSelect disabled>
        <option value="npm">npm</option>
      </SourceSelect>
      <SearchInput
        disabled={searchResults === undefined}
        onChange={(event): void => {
          setQuery(event.currentTarget.value);
        }}
        placeholder="find a new package"
        type="text"
        value={query}
      />
      <Button
        disabled={searchResults === undefined}
        title="Do search please"
        type="submit"
        variant="success"
      >
        {searchResults === undefined ? <Loader /> : 'search'}
      </Button>
      <Link
        href="https://npms.io/"
        style={{ fontWeight: 'normal' }}
        target="_blank"
        title="Visit npms.io website"
      >
        source: npms.io
      </Link>
    </Form>
  );
};
