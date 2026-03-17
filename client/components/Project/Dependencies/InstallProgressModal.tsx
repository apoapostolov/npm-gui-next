import styled from 'styled-components';

import type { ProgressStep } from '../../../hooks/use-install-all-latest.types';
import { Button } from '../../../ui/Button/Button';
import { Modal } from '../../../ui/Modal/Modal';

const ProgressLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProgressTrack = styled.div`
  background: var(--color-border);
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  background: var(--color-success);
  height: 100%;
  transition: width 150ms ease-out;
  width: ${({ width }): string => `${width}%`};
`;

const ProgressText = styled.div`
  color: var(--color-muted);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
`;

const ProgressSummary = styled.small`
  color: var(--color-text);
  font-size: 12px;
`;

const ProgressHeartbeat = styled.small`
  color: var(--color-muted);
  font-size: 11px;
  white-space: nowrap;
`;

const ProgressSteps = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressStepRow = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  font-size: 12px;
  border-top: 1px solid var(--color-border);

  &:first-child {
    border-top: 0;
  }
`;

const ProgressStatus = styled.strong<{ $status: 'FAILURE' | 'PENDING' | 'RUNNING' | 'SUCCESS' }>`
  color: ${({ $status }) => {
    if ($status === 'SUCCESS') {
      return 'var(--color-success)';
    }

    if ($status === 'RUNNING') {
      return 'var(--color-info)';
    }

    if ($status === 'FAILURE') {
      return 'var(--color-danger)';
    }

    return 'var(--color-muted)';
  }};
  font-size: 11px;
`;

const ProgressName = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProgressVersions = styled.small`
  color: var(--color-muted);
  white-space: nowrap;
`;

const ProgressError = styled.small`
  color: var(--color-danger);
  display: block;
  font-size: 11px;
  margin-top: 2px;
  white-space: normal;
`;

const TroubleshootingBanner = styled.div`
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-warning);
  border-radius: 6px;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
`;

const TroubleshootingTitle = styled.strong`
  font-size: 12px;
`;

const TroubleshootingText = styled.small`
  color: var(--color-muted);
  line-height: 1.45;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

interface Props {
  actionLabel: string;
  closeProgress: () => void;
  current: number;
  currentName: string;
  elapsedSeconds: number;
  isRunning: boolean;
  progressPercent: number;
  steps: ProgressStep[];
  total: number;
  visible: boolean;
}

export const InstallProgressModal: React.FC<Props> = ({
  actionLabel,
  closeProgress,
  current,
  currentName,
  elapsedSeconds,
  isRunning,
  progressPercent,
  steps,
  total,
  visible,
}) => {
  const failedSteps = steps.filter((step) => step.status === 'FAILURE');
  const hasMountedPathFailure = failedSteps.some((step) =>
    /EPERM|operation not permitted|\/mnt\//i.test(step.error ?? ''),
  );

  return visible ? (
    <Modal
      onClose={(): void => {
        if (!isRunning) {
          closeProgress();
        }
      }}
    >
      <ProgressLayout>
        <ModalTitle>{actionLabel}</ModalTitle>
        <ProgressTrack>
          <ProgressFill width={progressPercent} />
        </ProgressTrack>
        <ProgressText>
          <ProgressSummary>
            {total > 0
              ? `Updating ${current}/${total}${
                  currentName ? `: ${currentName}` : ''
                }`
              : 'No displayed packages need updates'}
          </ProgressSummary>
          <ProgressHeartbeat>
            {total > 0 ? `Elapsed ${elapsedSeconds}s` : 'Elapsed 0s'}
          </ProgressHeartbeat>
        </ProgressText>
        {failedSteps.length > 0 && (
          <TroubleshootingBanner>
            <TroubleshootingTitle>Troubleshooting</TroubleshootingTitle>
            <TroubleshootingText>
              Failed rows include server output. Review the error below before
              retrying.
            </TroubleshootingText>
            {hasMountedPathFailure && (
              <TroubleshootingText>
                This looks like the known WSL `/mnt/...` npm install failure.
                Move the repo into the Linux filesystem or run it from native
                Windows to avoid `EPERM` bin-link and `chmod` errors.
              </TroubleshootingText>
            )}
          </TroubleshootingBanner>
        )}
        <ProgressSteps>
          {steps.map((step) => (
            <ProgressStepRow key={`${step.name}-${step.to ?? 'latest'}`}>
              <ProgressStatus $status={step.status}>
                {step.status.toLowerCase()}
              </ProgressStatus>
              <ProgressName>
                {step.name}
                {step.error && <ProgressError>{step.error}</ProgressError>}
              </ProgressName>
              <ProgressVersions>
                {step.from ?? '?'} {' -> '} {step.to ?? '?'}
              </ProgressVersions>
            </ProgressStepRow>
          ))}
          {steps.length === 0 && (
            <ProgressStepRow>
              <ProgressStatus $status="PENDING">idle</ProgressStatus>
              <ProgressName>
                Only packages visible in the current table filters are included.
              </ProgressName>
              <ProgressVersions />
            </ProgressStepRow>
          )}
        </ProgressSteps>
        <ModalActions>
          <Button
            disabled={isRunning}
            onClick={closeProgress}
            title={isRunning ? 'Bulk update is still running' : 'Close progress dialog'}
            variant="dark"
          >
            Close
          </Button>
        </ModalActions>
      </ProgressLayout>
    </Modal>
  ) : null;
};
