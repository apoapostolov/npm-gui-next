import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { getDependenciesScore } from '../service/dependencies.service';

export const useBundleScore = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const dependenciesToQuery = useMemo(() => {
    return dependencies?.map((dep) => dep.name);
  }, [dependencies]);

  const query = useQuery({
    queryKey: ['get-dependencies-score', dependenciesToQuery],
    queryFn: async () => getDependenciesScore(dependenciesToQuery),
    ...{
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  });

  const dependenciesWithScore = useMemo(() => {
    return dependencies?.map((dep) => {
      const depScore = query?.data?.find((score) => score.name === dep.name);

      if (!depScore) {
        return dep;
      }

      return {
        ...dep,
        score: depScore.score,
      };
    });
  }, [dependencies, query?.data]);

  return dependenciesWithScore;
};
