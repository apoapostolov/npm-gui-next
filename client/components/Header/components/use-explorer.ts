import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import type { ExplorerResponse } from '../../../../server/types/global.types';
import { useActiveProject } from '../../../hooks/use-active-project';
import { fetchJSON, getApiPath } from '../../../service/utils';
import { useSettings } from '../../../hooks/use-settings';
import { useClickOutsideRef } from '../../../ui/hooks/use-click-outside';
import { useToggle } from '../../../ui/hooks/use-toggle';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useExplorer = () => {
  const { isOpen, onToggleIsOpen, onClose } = useToggle();
  const [filter, setFilter] = useState('');
  const [currentPathEncoded, setCurrentPathEncoded] = useState<string>('');
  const { projectPath, setProjectPath } = useActiveProject();
  const {
    settings: { openGlobalOnInvalidStart },
  } = useSettings();

  const ref = useClickOutsideRef(onClose);

  const { data, isFetching } = useQuery({
    queryKey: ['explorer', currentPathEncoded],
    queryFn: () =>
      fetchJSON<ExplorerResponse>(
        getApiPath(
          currentPathEncoded
            ? `/api/explorer/${currentPathEncoded}`
            : '/api/explorer/',
        ),
      ),
    placeholderData: keepPreviousData,
    ...{
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  });

  const onClickProject = useCallback((projectName: string): void => {
    onClose();
    if (data) {
      if (projectName === 'package.json') {
        setProjectPath(window.btoa(data.path));
        return;
      }

      setProjectPath(window.btoa(`${data.path}/${projectName}`));
    }
  }, [data, onClose, setProjectPath]);

  useEffect(() => {
    if (!currentPathEncoded && data?.path) {
      setCurrentPathEncoded(window.btoa(data.path));
      if (
        projectPath === 'global' &&
        !openGlobalOnInvalidStart ||
        (projectPath === 'global' && data.ls.some((entry) => entry.isProject))
      ) {
        setProjectPath(window.btoa(data.path));
      } else if (projectPath === 'global') {
        setProjectPath('global');
      }
    }
  }, [
    currentPathEncoded,
    data,
    openGlobalOnInvalidStart,
    projectPath,
    setProjectPath,
  ]);

  return {
    ref,
    onToggleIsOpen,
    isOpen,
    path: data?.path,
    list: data?.ls,
    filter,
    setFilter,
    onClickProject,
    setCurrentPath: setCurrentPathEncoded,
    isFetching,
  };
};
