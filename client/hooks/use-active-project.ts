import { useState } from 'react';
import { useBetween } from 'use-between';

const STORAGE_KEY = 'active-project';

const normalizeStoredProjectPath = (projectPath: string | null): string => {
  if (!projectPath || projectPath === 'global') {
    return 'global';
  }

  try {
    const decoded = window.atob(projectPath);

    if (decoded) {
      return projectPath;
    }
  } catch {
    return window.btoa(projectPath);
  }

  return projectPath;
};

const getInitialProjectPath = (): string => {
  const projectPath = normalizeStoredProjectPath(
    window.localStorage.getItem(STORAGE_KEY),
  );

  window.localStorage.setItem(STORAGE_KEY, projectPath);

  return projectPath;
};

const useActiveProjectState = () => {
  const [projectPath, setProjectPathState] = useState(getInitialProjectPath);

  const setProjectPath = (nextProjectPath: string): void => {
    setProjectPathState(nextProjectPath);
    window.localStorage.setItem(STORAGE_KEY, nextProjectPath);
  };

  return { projectPath, setProjectPath };
};

export const useActiveProject = () => useBetween(useActiveProjectState);
