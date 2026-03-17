import { useActiveProject } from './use-active-project';

export const useProjectPath = (): string => {
  const { projectPath } = useActiveProject();

  return projectPath;
};
