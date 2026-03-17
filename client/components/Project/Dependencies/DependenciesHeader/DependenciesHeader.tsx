/* eslint-disable styled-components-a11y/no-onchange */
import { useMemo } from 'react';
import styled from 'styled-components';

import type { Manager } from '../../../../../server/types/dependency.types';
import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../app/ContextStore';
import { useAvailableManagers } from '../../../../hooks/use-available-managers';
import { useInstallAllLatest } from '../../../../hooks/use-install-all-latest';
import { useMutateReinstall } from '../../../../hooks/use-mutate-reinstall';
import { useProjectPath } from '../../../../hooks/use-project-path';
import { getNormalizedRequiredVersion } from '../../../../utils';
import { Button } from '../../../../ui/Button/Button';
import { InstallProgressModal } from '../InstallProgressModal';
import { Search } from './Search/Search';

const getDecodedPath = (projectPath: string): string => {
  if (projectPath === 'global') {
    return 'global';
  }

  try {
    return window.atob(projectPath);
  } catch {
    return projectPath;
  }
};

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: auto;
`;

const ControlsLabel = styled.small`
  color: var(--color-muted);
  line-height: 1;
`;

const WarningBanner = styled.div`
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-warning);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 12px;
  line-height: 1.45;
  margin-top: 8px;
  padding: 8px 10px;
`;

interface Props {
  displayedDependencies?: DependencyInstalledExtras[];
  isGlobal?: boolean;
}

const Select = styled.select`
  appearance: none;
  border: 0;
  border-radius: 6px;
  color: var(--color-chrome-text);
  display: inline-block;
  line-height: 28px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 500;
  min-height: 28px;
  outline: none;
  padding: 0 28px 0 10px;
  -webkit-transition: background-color 200ms;
  transition: background-color 200ms;
  vertical-align: middle;
  white-space: nowrap;
  background-color: var(--color-danger);
  background-image:
    linear-gradient(45deg, transparent 50%, var(--color-chrome-text) 50%),
    linear-gradient(135deg, var(--color-chrome-text) 50%, transparent 50%);
  background-position:
    calc(100% - 14px) calc(50% - 2px),
    calc(100% - 9px) calc(50% - 2px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;

  option {
    background: var(--color-danger-soft);
    color: var(--color-danger-soft-text);
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-disabled) !important;
  }
`;

export const DependenciesHeader: React.FC<Props> = ({
  displayedDependencies,
  isGlobal,
}) => {
  const projectPath = useProjectPath();
  const { dispatch, project } = useProjectStore(projectPath);
  const availableManagers = useAvailableManagers();
  const reinstallMutation = useMutateReinstall(projectPath);
  const {
    closeProgress,
    heartbeatTick,
    installAllLatest,
    isRunning,
    progress,
    progressPercent,
  } = useInstallAllLatest(projectPath);

  const displayedUpdatableDependencies = useMemo(() => {
    return (
      displayedDependencies?.filter((dependency) => {
        return (
          dependency.latest &&
          dependency.type !== 'extraneous' &&
          dependency.latest !== dependency.installed &&
          dependency.latest !== getNormalizedRequiredVersion(dependency.required)
        );
      }) ?? []
    );
  }, [displayedDependencies]);

  const shouldShowMountedPathWarning = useMemo(() => {
    if (projectPath === 'global') {
      return false;
    }

    return getDecodedPath(projectPath).startsWith('/mnt/');
  }, [projectPath]);

  const elapsedSeconds = useMemo(() => {
    if (!progress.startedAt) {
      return 0;
    }

    return Math.max(0, Math.floor((Date.now() - progress.startedAt) / 1000));
  }, [heartbeatTick, progress.startedAt]);

  return (
    <header>
      <HeaderRow>
        <Search />

        <RightSection>
          <>
            <ControlsLabel>Install:</ControlsLabel>
            <Button
              disabled={
                project?.isBusy ||
                isRunning ||
                displayedUpdatableDependencies.length === 0
              }
              icon="cloud-download"
              onClick={(): void => {
                for (const dependency of displayedUpdatableDependencies) {
                  dispatch({
                    action: 'mutateProjectDependency',
                    projectPath,
                    name: dependency.name,
                    required: dependency.latest,
                    type: dependency.type,
                    delete: null,
                  });
                }

                installAllLatest(
                  displayedUpdatableDependencies,
                  isGlobal === true
                    ? 'Install all global packages with updates'
                    : 'Install all packages with updates',
                );
              }}
              title="Install all displayed packages that currently have updates"
              variant="primary"
            >
              Install All Latest
            </Button>
          </>
          {isGlobal !== true && (
            <Select
              disabled={project?.isBusy}
              onChange={(event): void =>
                reinstallMutation.mutate(event.target.value as Manager)
              }
              style={{ display: 'inline-block' }}
              title="Remove and re-install all packages"
              value=""
            >
              <option disabled value="">
                Reinstall
              </option>

              <option disabled={availableManagers?.npm === false} value="npm">
                npm
              </option>

              <option disabled={availableManagers?.bun === false} value="bun">
                bun
              </option>

              <option disabled={availableManagers?.yarn === false} value="yarn">
                yarn
              </option>

              <option disabled={availableManagers?.pnpm === false} value="pnpm">
                pnpm
              </option>
            </Select>
          )}
        </RightSection>
      </HeaderRow>

      {shouldShowMountedPathWarning && (
        <WarningBanner>
          This project is running from a mounted WSL path under `/mnt/...`.
          npm installs and updates can fail here with `EPERM` bin-link or
          `chmod` errors. Use native Windows or move the repository into the
          Linux filesystem for reliable package mutation testing.
        </WarningBanner>
      )}

      <InstallProgressModal
        actionLabel={progress.actionLabel}
        closeProgress={closeProgress}
        current={progress.current}
        currentName={progress.currentName}
        elapsedSeconds={elapsedSeconds}
        isRunning={isRunning}
        progressPercent={progressPercent}
        steps={progress.steps}
        total={progress.total}
        visible={progress.visible}
      />
    </header>
  );
};
