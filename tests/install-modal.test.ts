/** @jest-environment jsdom */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

import { DependenciesHeader } from '../client/components/Project/Dependencies/DependenciesHeader/DependenciesHeader';
import { InstallHeader } from '../client/components/Project/Dependencies/InstallHeader';
import type { DependencyInstalledExtras } from '../server/types/dependency.types';

const PROJECT_PATH = 'project-encoded';

const mockInstallDependencies = jest.fn();
const mockInstallGlobalDependencies = jest.fn();
const mockMutateReinstall = jest.fn();
const mockDispatch = jest.fn();
const mockProject = {
  dependenciesMutate: {},
  isBusy: false,
  path: PROJECT_PATH,
};

jest.mock('../client/hooks/use-project-path', () => ({
  useProjectPath: () => PROJECT_PATH,
}));

jest.mock('../client/hooks/use-available-managers', () => ({
  useAvailableManagers: () => ({ npm: true, pnpm: true, yarn: true }),
}));

jest.mock('../client/hooks/use-mutate-reinstall', () => ({
  useMutateReinstall: () => ({ mutate: mockMutateReinstall }),
}));

jest.mock('../client/app/ContextStore', () => ({
  useProjectStore: () => ({
    project: mockProject,
    dispatch: mockDispatch,
  }),
}));

const mockUseFullDependencies = jest.fn();

jest.mock('../client/hooks/use-full-dependencies', () => ({
  useFullDependencies: () => mockUseFullDependencies(),
}));

jest.mock('../client/service/dependencies.service', () => ({
  installDependencies: (...parameters: unknown[]) =>
    mockInstallDependencies(...parameters),
  installGlobalDependencies: (...parameters: unknown[]) =>
    mockInstallGlobalDependencies(...parameters),
}));

const depA: DependencyInstalledExtras = {
  installed: '1.0.0',
  latest: '2.0.0',
  manager: 'npm',
  name: 'npm-gui-tests',
  required: '^1.0.0',
  type: 'prod',
  wanted: '1.0.0',
};

const depB: DependencyInstalledExtras = {
  installed: '1.0.1',
  latest: '2.0.1',
  manager: 'npm',
  name: 'npm-gui-tests-2',
  required: '^1.0.1',
  type: 'prod',
  wanted: '1.0.1',
};

const globalDepA: DependencyInstalledExtras = {
  installed: '7.0.47',
  latest: '7.0.48',
  manager: 'npm',
  name: '@kilocode/cli',
  required: undefined,
  type: 'global',
  wanted: null,
};

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

const renderUi = (
  displayedDependencies: DependencyInstalledExtras[],
): QueryClient => {
  const container = document.createElement('div');
  document.body.innerHTML = '';
  document.body.append(container);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  root = createRoot(container);

  act(() => {
    root?.render(
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(
            React.Fragment,
            null,
            React.createElement(InstallHeader),
            React.createElement(DependenciesHeader, {
              displayedDependencies,
              isGlobal: false,
            }),
          ),
        ),
      ),
    );
  });

  return queryClient;
};

const clickButton = async (label: string): Promise<void> => {
  const button = [...document.querySelectorAll('button')].find(
    (element) => element.textContent?.trim() === label,
  ) as HTMLButtonElement | undefined;

  expect(button).toBeDefined();

  await act(async () => {
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

describe('install modal integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProject.dependenciesMutate = {};
    mockProject.path = PROJECT_PATH;
    mockUseFullDependencies.mockReturnValue({ dependencies: [depA] });
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    root = undefined;
    document.body.innerHTML = '';
  });

  test('Install Selected opens the shared modal and updates an npm package', async () => {
    mockProject.dependenciesMutate = {
      'npm-gui-tests': {
        delete: null,
        required: '2.0.0',
        type: 'prod',
      },
    };
    mockUseFullDependencies.mockReturnValue({ dependencies: [depA] });
    mockInstallDependencies.mockResolvedValue(undefined);

    renderUi([depA]);

    await clickButton('Install Selected');

    await waitFor(() => {
      expect(document.body.textContent).toContain(
        'Install selected package changes',
      );
      expect(document.body.textContent).toContain('Updating 2/2: npm-gui-tests');
      expect(document.body.textContent).not.toContain('Heartbeat');
    });

    await waitFor(() => {
      expect(mockInstallDependencies).toHaveBeenCalledWith(PROJECT_PATH, 'prod', [
        {
          name: 'npm-gui-tests',
          version: '2.0.0',
        },
      ]);
      expect(mockDispatch).toHaveBeenCalledWith({
        action: 'mutateProjectDependencyCancel',
        name: 'npm-gui-tests',
        projectPath: PROJECT_PATH,
      });
      expect(document.body.textContent).toContain('2/2');
      expect(document.body.textContent).toContain('success');
    });
  });

  test('failed package stays in the modal and the queue continues to the next package', async () => {
    mockProject.dependenciesMutate = {
      'npm-gui-tests': {
        delete: null,
        required: '2.0.0',
        type: 'prod',
      },
      'npm-gui-tests-2': {
        delete: null,
        required: '2.0.1',
        type: 'prod',
      },
    };
    mockUseFullDependencies.mockReturnValue({ dependencies: [depA, depB] });
    mockInstallDependencies
      .mockRejectedValueOnce(new Error('npm failed'))
      .mockResolvedValueOnce(undefined);

    renderUi([depA, depB]);

    await clickButton('Install Selected');

    await waitFor(() => {
      expect(mockInstallDependencies).toHaveBeenCalledTimes(2);
      expect(document.body.textContent).toContain('Updating 4/4: npm-gui-tests-2');
      expect(document.body.textContent).toContain('npm failed');
      expect(document.body.textContent).toContain('failure');
      expect(document.body.textContent).toContain('success');
    });
  });

  test('All updates refreshes asynchronously and closing the modal does not trigger a second refresh', async () => {
    const queryClient = renderUi([
      depA,
      {
        ...depB,
        latest: depB.installed,
      },
    ]);
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    mockInstallDependencies.mockResolvedValue(undefined);

    await clickButton('Install All Latest');

    await waitFor(() => {
      expect(document.body.textContent).toContain(
        'Install all packages with updates',
      );
      expect(mockInstallDependencies).toHaveBeenCalledTimes(1);
      expect(mockInstallDependencies).toHaveBeenCalledWith(PROJECT_PATH, 'prod', [
        {
          name: 'npm-gui-tests',
          version: '2.0.0',
        },
      ]);
      expect(document.body.textContent).toContain('Updating 2/2: npm-gui-tests');
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });

    const invalidationsBeforeClose = invalidateQueriesSpy.mock.calls.length;

    await clickButton('Close');

    expect(invalidateQueriesSpy.mock.calls.length).toBe(invalidationsBeforeClose);
  });

  test('Install All Latest in global mode stages packages and triggers the global install flow', async () => {
    mockProject.path = 'global';
    mockInstallGlobalDependencies.mockResolvedValue(undefined);

    renderUi([globalDepA]);

    act(() => {
      root?.render(
        React.createElement(
          QueryClientProvider,
          {
            client: new QueryClient({
              defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
              },
            }),
          },
          React.createElement(
            MemoryRouter,
            null,
            React.createElement(DependenciesHeader, {
              displayedDependencies: [globalDepA],
              isGlobal: true,
            }),
          ),
        ),
      );
    });

    await clickButton('Install All Latest');

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        action: 'mutateProjectDependency',
        delete: null,
        name: '@kilocode/cli',
        projectPath: PROJECT_PATH,
        required: '7.0.48',
        type: 'global',
      });
      expect(document.body.textContent).toContain(
        'Install all global packages with updates',
      );
      expect(mockInstallGlobalDependencies).toHaveBeenCalledWith([
        {
          installedVersion: '7.0.47',
          name: '@kilocode/cli',
          version: '7.0.48',
        },
      ]);
    });
  });
});
