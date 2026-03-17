export type Theme = 'dark' | 'light' | 'system';

export interface Settings {
  theme: Theme;
  openGlobalOnInvalidStart: boolean;
  useCurrentNpmForGlobalMutations: boolean;
}

const SETTINGS_KEY = 'npm-gui-next-settings';

export const defaultSettings: Settings = {
  theme: 'system',
  openGlobalOnInvalidStart: false,
  useCurrentNpmForGlobalMutations: true,
};

export const getSettingsFromStorage = (): Settings => {
  const rawValue = window.localStorage.getItem(SETTINGS_KEY);

  if (!rawValue) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(rawValue) as Partial<Settings>),
    };
  } catch {
    return defaultSettings;
  }
};

export const syncSettingsStorage = (settings: Settings): void => {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
