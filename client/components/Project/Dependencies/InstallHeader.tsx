/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FC } from 'react';
import { useMemo } from 'react';

import { useProjectStore } from '../../../app/ContextStore';
import { useFullDependencies } from '../../../hooks/use-full-dependencies';
import { useInstallAllLatest } from '../../../hooks/use-install-all-latest';
import { useProjectPath } from '../../../hooks/use-project-path';
import { Button } from '../../../ui/Button/Button';
import { useTableFilter } from '../../../ui/Table/use-table-filter';
import { InstallProgressModal } from './InstallProgressModal';

export const InstallHeader: FC = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);
  const { dependencies } = useFullDependencies(projectPath);
  const { tableDataFiltered } = useTableFilter(dependencies);
  const {
    closeProgress,
    heartbeatTick,
    installAllLatest,
    isRunning,
    progress,
    progressPercent,
  } = useInstallAllLatest(projectPath);

  const selectedDependencies = useMemo(() => {
    return (tableDataFiltered ?? [])
      .filter((dependency) => {
        const selectedRequired = project?.dependenciesMutate?.[dependency.name]?.required;

        return typeof selectedRequired === 'string';
      })
      .map((dependency) => {
        const selectedRequired = project?.dependenciesMutate?.[dependency.name]?.required;

        return {
          ...dependency,
          latest:
            typeof selectedRequired === 'string'
              ? selectedRequired
              : dependency.latest,
        };
      });
  }, [project?.dependenciesMutate, tableDataFiltered]);

  const elapsedSeconds = useMemo(() => {
    if (!progress.startedAt) {
      return 0;
    }

    return Math.max(0, Math.floor((Date.now() - progress.startedAt) / 1000));
  }, [heartbeatTick, progress.startedAt]);

  return (
    <>
      <Button
        disabled={selectedDependencies.length === 0 || project?.isBusy || isRunning}
        icon="cloud-download"
        onClick={(): void =>
          installAllLatest(
            selectedDependencies,
            'Install selected package changes',
          )
        }
        title="Install the selected displayed package versions"
        variant="primary"
      >
        Install Selected
      </Button>
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
    </>
  );
};
