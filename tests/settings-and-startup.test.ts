/** @jest-environment jsdom */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

import {
  getSettingsFromStorage,
  syncSettingsStorage,
} from '../client/app/settings.storage';
import { Settings } from '../client/components/Header/components/Settings';
import { useExplorer } from '../client/components/Header/components/use-explorer';
import { useActiveProject } from '../client/hooks/use-active-project';
import * as settingsHookModule from '../client/hooks/use-settings';

const SETTINGS_KEY = 'npm-gui-next-settings';
const ACTIVE_PROJECT_KEY = 'active-project';

let root: ReturnType<typeof createRoot> | undefined;

const waitFor = async (assertion: () => void): Promise<void> => {
  for (let index = 0; index < 25; index += 1) {
    try {
      assertion();
      return;
    } catch {
      await act(async () => {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 10);
        });
      });
    }
  }

  assertion();
};

const clickByText = async (label: string): Promise<void> => {
  const element = [...document.querySelectorAll('button')].find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

  expect(element).toBeDefined();

  await act(async () => {
    element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

const clickByTitle = async (title: string): Promise<void> => {
  const element = document.querySelector(
    `button[title="${title}"]`,
  ) as HTMLButtonElement | null;

  expect(element).not.toBeNull();

  await act(async () => {
    element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

const renderNode = (node: React.ReactNode): void => {
  document.body.innerHTML = '';
  const container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);

  act(() => {
    root?.render(node);
  });
};

const ExplorerHarness = (): React.ReactElement => {
  useExplorer();
  const { projectPath } = useActiveProject();

  return React.createElement('div', null, projectPath);
};

describe('settings and startup behavior', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
    document.documentElement.dataset.theme = 'light';
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = undefined;
    document.body.innerHTML = '';
  });

  test('settings persist theme and invalid-start preference to localStorage', async () => {
    syncSettingsStorage({
      openGlobalOnInvalidStart: true,
      theme: 'dark',
    });

    expect(getSettingsFromStorage()).toEqual({
      openGlobalOnInvalidStart: true,
      theme: 'dark',
    });

    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        openGlobalOnInvalidStart: false,
        theme: 'system',
      }),
    );

    renderNode(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(Settings),
      ),
    );

    await clickByText('Settings');

    await clickByTitle('Dark mode');

    await waitFor(() => {
      const storedValue = window.localStorage.getItem(SETTINGS_KEY);

      expect(storedValue).not.toBeNull();
      expect(JSON.parse(storedValue ?? '{}').theme).toBe('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  test('startup stays on global when invalid-start fallback is enabled and the current directory is not a project', async () => {
    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        openGlobalOnInvalidStart: true,
        theme: 'system',
      }),
    );
    jest.spyOn(settingsHookModule, 'useSettings').mockReturnValue({
      setOpenGlobalOnInvalidStart: jest.fn(),
      setTheme: jest.fn(),
      settings: {
        openGlobalOnInvalidStart: true,
        theme: 'system',
      },
    });

    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({
        changed: false,
        ls: [
          {
            isDirectory: false,
            isProject: false,
            name: 'README.md',
          },
        ],
        path: '/tmp/not-a-node-project',
      }),
      ok: true,
    } as Response);
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      value: fetchMock,
      writable: true,
    });

    renderNode(
      React.createElement(
        QueryClientProvider,
        {
          client: new QueryClient({
            defaultOptions: { queries: { retry: false } },
          }),
        },
        React.createElement(ExplorerHarness),
      ),
    );

    await waitFor(() => {
      expect(document.body.textContent).toContain('global');
      expect(window.localStorage.getItem(ACTIVE_PROJECT_KEY)).toBe('global');
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});
