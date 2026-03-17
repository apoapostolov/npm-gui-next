/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ComponentProps, FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { Job } from '../../../app/store.reducer';
import { Button } from '../../../ui/Button/Button';
import { Icon } from '../../../ui/Icon/Icon';
import { Modal } from '../../../ui/Modal/Modal';

const JobChip = styled.div<{ $variant: ComponentProps<typeof Button>['variant'] }>`
  background: ${({ $variant }) => {
    if ($variant === 'success') {
      return 'var(--color-success)';
    }

    if ($variant === 'info') {
      return 'var(--color-info)';
    }

    return 'var(--color-primary)';
  }};
  border-radius: 6px;
  color: var(--color-chrome-text);
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  height: 28px;
  max-height: 28px;
  overflow: hidden;
`;

const JobButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  height: 28px;
  line-height: 1;
  padding: 0;
  width: 28px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface Props {
  description: string;
  status: Job['status'];
  onRemove: () => void;
}

const getVariantForStatus = (
  status: Job['status'],
): ComponentProps<typeof Button>['variant'] => {
  if (status === 'SUCCESS') {
    return 'success';
  }

  if (status === 'WORKING') {
    return 'info';
  }

  return 'primary';
};

export const JobItem: FC<Props> = ({ description, status, onRemove }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <JobChip $variant={getVariantForStatus(status)}>
        <JobButton
          onClick={(): void => {
            setDetailsOpen(true);
          }}
          title="Show details"
          type="button"
        >
          {description} {status}
        </JobButton>
        <RemoveButton
          disabled={status === 'WORKING'}
          onClick={onRemove}
          title="Remove"
          type="button"
        >
          <Icon glyph="x" />
        </RemoveButton>
      </JobChip>

      {detailsOpen && (
        <Modal
          onClose={(): void => {
            setDetailsOpen(false);
          }}
        >
          {/* <pre>{JSON.stringify(stdout, null, INDENT)}</pre> */}
        </Modal>
      )}
    </>
  );
};
