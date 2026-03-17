import { useProjectsStore } from '../../app/ContextStore';
import { useActiveProject } from '../../hooks/use-active-project';
import { useProjectPath } from '../../hooks/use-project-path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useHeader = () => {
  const projectPathEncoded = useProjectPath();
  const { setProjectPath } = useActiveProject();

  const { projects, dispatch } = useProjectsStore();
  const lastLocalProject = [...projects]
    .reverse()
    .find(({ path }) => path !== 'global')?.path;

  const handleRemoveProject = (projectPathToRemove: string): void => {
    if (projectPathToRemove === projectPathEncoded) {
      setProjectPath(lastLocalProject || 'global');
    }
    dispatch({ action: 'removeProject', projectPath: projectPathToRemove });
  };

  const navigateToProject = (projectPathToNavigate: string): void => {
    setProjectPath(projectPathToNavigate);
  };

  return {
    globalButtonLabel: projectPathEncoded === 'global' ? 'Local' : 'Global',
    globalButtonProject:
      projectPathEncoded === 'global' && lastLocalProject
        ? lastLocalProject
        : 'global',
    hasLocalProject: lastLocalProject !== undefined,
    projectPathEncoded,
    handleRemoveProject,
    navigateToProject,
    projects,
  };
};
