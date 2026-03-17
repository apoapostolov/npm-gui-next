import { useIsMutating, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

// import { useProjectsJobs } from '../app/ContextStore';
import { getProjectDependenciesFast } from '../service/dependencies.service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useFastDependencies = (
  projectPath: string,
  onSuccess?: () => void,
) => {
  // const { startJob, successJob } = useProjectsJobs(projectPath);

  const isProjectMutating =
    useIsMutating({ mutationKey: [projectPath] }) > 0;

  const query = useQuery({
    queryKey: [projectPath, 'get-project-dependencies', 'fast'],
    queryFn: async () => {
      // const id = startJob('Get project dependencies fast');

      const dependencies = await getProjectDependenciesFast(projectPath);

      // successJob(id);

      return dependencies;
    },
    ...{
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !isProjectMutating,
      retry: false,
    },
  });

  useEffect(() => {
    if (query.data && onSuccess) {
      onSuccess();
    }
  }, [onSuccess, query.data]);

  return { dependencies: query.data, ...query };
};
