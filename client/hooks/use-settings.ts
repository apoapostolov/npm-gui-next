import { useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';

import type { Settings, Theme } from '../app/settings.storage';
import {
  getSettingsFromStorage,
  syncSettingsStorage,
} from '../app/settings.storage';

const getResolvedTheme = (theme: Theme): 'dark' | 'light' => {
  if (
    theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return theme === 'dark' ? 'dark' : 'light';
};

const useSettingsState = () => {
  const [settings, setSettings] = useState<Settings>(getSettingsFromStorage);

  useEffect(() => {
    syncSettingsStorage(settings);

    const applyTheme = (): void => {
      document.documentElement.dataset.theme = getResolvedTheme(settings.theme);
    };

    applyTheme();

    if (settings.theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (): void => applyTheme();

    mediaQuery.addEventListener('change', onChange);

    return () => {
      mediaQuery.removeEventListener('change', onChange);
    };
  }, [settings]);

  return { settings, setSettings };
};

export const useSettings = () => {
  const { settings, setSettings } = useBetween(useSettingsState);

  return useMemo(
    () => ({
      settings,
      setTheme: (theme: Theme): void => {
        setSettings((previousSettings) => ({
          ...previousSettings,
          theme,
        }));
      },
      setOpenGlobalOnInvalidStart: (openGlobalOnInvalidStart: boolean): void => {
        setSettings((previousSettings) => ({
          ...previousSettings,
          openGlobalOnInvalidStart,
        }));
      },
      setUseCurrentNpmForGlobalMutations: (
        useCurrentNpmForGlobalMutations: boolean,
      ): void => {
        setSettings((previousSettings) => ({
          ...previousSettings,
          useCurrentNpmForGlobalMutations,
        }));
      },
    }),
    [settings, setSettings],
  );
};
