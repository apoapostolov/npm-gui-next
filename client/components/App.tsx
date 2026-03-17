import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ContextStoreProvider } from '../app/ContextStore';
import { useSettings } from '../hooks/use-settings';
import { useActiveProject } from '../hooks/use-active-project';
import { fetchJSON, getApiPath } from '../service/utils';
import type { ExplorerResponse } from '../../server/types/global.types';
import { Header } from './Header/Header';
import { Project } from './Project/Project';

const StartupProjectSync: FC = () => {
  const { projectPath, setProjectPath } = useActiveProject();
  const {
    settings: { openGlobalOnInvalidStart },
  } = useSettings();
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (didSyncRef.current) {
      return;
    }

    didSyncRef.current = true;

    let isActive = true;

    const syncProject = async (): Promise<void> => {
      if (projectPath !== 'global') {
        return;
      }

      try {
        const data = await fetchJSON<ExplorerResponse>(getApiPath('/api/explorer/'));

        if (!isActive) {
          return;
        }

        if (data.ls.some((entry) => entry.isProject)) {
          setProjectPath(window.btoa(data.path));
          return;
        }

        if (!openGlobalOnInvalidStart) {
          setProjectPath(window.btoa(data.path));
        }
      } catch {
        // Keep current startup state when explorer probing fails.
      }
    };

    void syncProject();

    return () => {
      isActive = false;
    };
  }, [openGlobalOnInvalidStart, projectPath, setProjectPath]);

  return null;
};

export const App: FC = () => {
  return (
    <ContextStoreProvider>
      <StartupProjectSync />
      <Router>
        <Routes>
          <Route
            element={
              <>
                <Header />
                <Project />
              </>
            }
            path="*"
          />
        </Routes>
      </Router>
    </ContextStoreProvider>
  );
};
