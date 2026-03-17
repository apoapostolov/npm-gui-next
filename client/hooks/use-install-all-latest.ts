import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { useProjectStore } from '../app/ContextStore';
import { installDependencies, installGlobalDependencies } from '../service/dependencies.service';
import { getNormalizedRequiredVersion } from '../utils';

interface Progress {
  actionLabel: string;
  current: number;
  currentName: string;
  projectPath: string | null;
  startedAt: number | null;
  steps: ProgressStep[];
  total: number;
  visible: boolean;
}

interface ProgressStep {
  error?: string;
  from: string | null;
  name: string;
  startedAt: number | null;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE';
  to: string | null;
}

const initialProgress: Progress = {
  actionLabel: 'Install package updates',
  current: 0,
  currentName: '',
  projectPath: null,
  startedAt: null,
  steps: [],
  total: 0,
  visible: false,
};

export const useInstallAllLatest = (projectPath: string) => {
  const queryClient = useQueryClient();
  const { dispatch } = useProjectStore(projectPath);
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [heartbeatTick, setHeartbeatTick] = useState(0);
  const refreshProjectDependencies = (targetProjectPath: string) => {
    void Promise.all([
      queryClient.invalidateQueries({
        queryKey: [targetProjectPath, 'get-project-dependencies'],
      }),
      queryClient.invalidateQueries({ queryKey: [targetProjectPath] }),
    ]);
  };

  const mutation = useMutation({
    mutationKey: ['install-all-latest'],
    mutationFn: async ({
      actionLabel,
      dependencies,
      projectPath,
    }: {
      actionLabel: string;
      dependencies: DependencyInstalledExtras[];
      projectPath: string;
    }) => {
      const candidates = dependencies.filter((dependency) => {
        return (
          dependency.latest &&
          dependency.type !== 'extraneous' &&
          dependency.latest !== dependency.installed &&
          dependency.latest !== getNormalizedRequiredVersion(dependency.required)
        );
      });

      const startedAt = Date.now();
      const heartbeatInterval = window.setInterval(() => {
        setHeartbeatTick((value) => value + 1);
      }, 2000);
      const steps = candidates.map((dependency) => ({
        error: undefined,
        from: dependency.installed ?? null,
        name: dependency.name,
        startedAt: null,
        status: 'PENDING' as const,
        to: dependency.latest ?? null,
      }));

      setProgress({
        actionLabel,
        current: 0,
        currentName: '',
        projectPath,
        startedAt,
        steps,
        total: candidates.length * 2,
        visible: true,
      });

      try {
        for (const [index, dependency] of candidates.entries()) {
          const latestVersion = dependency.latest;

          if (typeof latestVersion !== 'string') {
            continue;
          }

          const stepStartedAt = Date.now();

          setProgress((previousProgress) => ({
            ...previousProgress,
            actionLabel,
            current: index * 2 + 1,
            currentName: dependency.name,
            projectPath,
            startedAt,
            steps: previousProgress.steps.map((step, stepIndex) => {
              if (stepIndex === index) {
                return {
                  ...step,
                  startedAt: stepStartedAt,
                  status: 'RUNNING',
                };
              }

              return step;
            }),
            total: candidates.length * 2,
            visible: true,
          }));

          try {
            if (projectPath === 'global' || dependency.type === 'global') {
              await installGlobalDependencies([
                {
                  installedVersion: dependency.installed ?? null,
                  name: dependency.name,
                  version: latestVersion,
                },
              ]);
            } else {
              await installDependencies(projectPath, dependency.type, [
                {
                  name: dependency.name,
                  version: latestVersion,
                },
              ]);
            }
          } catch (error) {
            setProgress((previousProgress) => ({
              ...previousProgress,
              current: (index + 1) * 2,
              steps: previousProgress.steps.map((step, stepIndex) => {
                if (stepIndex === index) {
                  const errorMessage =
                    error &&
                    typeof error === 'object' &&
                    'details' in error &&
                    typeof error.details === 'string'
                      ? error.details
                      : error instanceof Error
                        ? error.message
                        : 'Install failed';

                  return {
                    ...step,
                    error: errorMessage,
                    status: 'FAILURE',
                  };
                }

                return step;
              }),
            }));
            continue;
          }

          setProgress((previousProgress) => ({
            ...previousProgress,
            current: (index + 1) * 2,
            steps: previousProgress.steps.map((step, stepIndex) => {
              if (stepIndex === index) {
                return {
                  ...step,
                  status: 'SUCCESS',
                };
              }

              return step;
            }),
          }));

          dispatch({
            action: 'mutateProjectDependencyCancel',
            name: dependency.name,
            projectPath,
          });
        }

        refreshProjectDependencies(projectPath);
      } finally {
        window.clearInterval(heartbeatInterval);
      }
    },
    onError: () => {
      setProgress((previousProgress) => ({
        ...previousProgress,
        projectPath: previousProgress.projectPath,
        visible: true,
      }));
    },
    onSuccess: () => {
      setProgress((previousProgress) => ({
        ...previousProgress,
        current: previousProgress.total,
        visible: true,
      }));
    },
  });

  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return {
    closeProgress: () => {
      setProgress((previousProgress) => ({ ...previousProgress, visible: false }));
    },
    installAllLatest: (
      dependencies: DependencyInstalledExtras[] | undefined,
      nextActionLabel = 'Install package updates',
    ) => {
      mutation.mutate({
        actionLabel: nextActionLabel,
        dependencies: dependencies ?? [],
        projectPath,
      });
    },
    isRunning: mutation.isPending,
    heartbeatTick,
    progress,
    progressPercent,
  };
};
