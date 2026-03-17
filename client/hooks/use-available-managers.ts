import { useQuery } from '@tanstack/react-query';

import type { AvailableManagerResponse } from '../../server/types/global.types';
import { fetchJSON, getApiPath } from '../service/utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useAvailableManagers = () => {
  const { data } = useQuery({
    queryKey: ['available-managers'],
    queryFn: () =>
      fetchJSON<AvailableManagerResponse>(getApiPath('/api/available-managers')),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return data;
};
