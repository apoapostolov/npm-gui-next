import { ensureDir, mkdtemp, writeFile, writeJson } from 'fs-extra';
import os from 'os';
import path from 'path';

import {
  getMergedGlobalInstalledInfo,
} from '../server/actions/dependencies/get/get-global-dependencies';
import {
  assertGlobalPackageWritable,
  getCurrentNpmExecutableFromPath,
  findOwningNpmForGlobalPackage,
  getGlobalPackagesFromFilesystem,
} from '../server/utils/global-npm';

jest.mock('../server/actions/execute-command', () => ({
  executeCommandJSONWithFallback: jest.fn(),
  executeCommandSimple: jest.fn(),
}));

const {
  executeCommandJSONWithFallback,
  executeCommandSimple,
} = jest.requireMock('../server/actions/execute-command') as {
  executeCommandJSONWithFallback: jest.Mock;
  executeCommandSimple: jest.Mock;
};

describe('global dependency listing', () => {
  const originalPath = process.env['PATH'];

  afterEach(() => {
    process.env['PATH'] = originalPath;
    jest.clearAllMocks();
  });

  test('filesystem scan includes direct and scoped packages from npm root -g', async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-global-'));

    await ensureDir(path.join(tempRoot, 'plain-package'));
    await ensureDir(path.join(tempRoot, '@scope', 'scoped-package'));

    await writeJson(path.join(tempRoot, 'plain-package', 'package.json'), {
      name: 'plain-package',
      version: '1.2.3',
    });
    await writeJson(path.join(tempRoot, '@scope', 'scoped-package', 'package.json'), {
      name: '@scope/scoped-package',
      version: '4.5.6',
    });

    executeCommandSimple.mockResolvedValue(`${tempRoot}\n`);

    await expect(getGlobalPackagesFromFilesystem('npm')).resolves.toEqual({
      '@scope/scoped-package': { version: '4.5.6' },
      'plain-package': { version: '1.2.3' },
    });
  });

  test('merged global info aggregates packages across multiple npm executables', async () => {
    const firstBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const secondBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const firstRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-root-'));
    const secondRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-root-'));

    await writeFile(path.join(firstBin, 'npm'), '');
    await writeFile(path.join(secondBin, 'npm'), '');

    process.env['PATH'] = [firstBin, secondBin].join(path.delimiter);

    await ensureDir(path.join(firstRoot, 'listed-by-npm'));
    await ensureDir(path.join(secondRoot, 'missing-from-first-npm'));

    await writeJson(path.join(firstRoot, 'listed-by-npm', 'package.json'), {
      name: 'listed-by-npm',
      version: '1.0.0',
    });
    await writeJson(
      path.join(secondRoot, 'missing-from-first-npm', 'package.json'),
      {
        name: 'missing-from-first-npm',
        version: '2.0.0',
      },
    );

    executeCommandSimple.mockImplementation(async (_cwd: unknown, command: string) => {
      if (command.includes(`${path.join(firstBin, 'npm')} root -g`)) {
        return `${firstRoot}\n`;
      }
      if (command.includes(`${path.join(secondBin, 'npm')} root -g`)) {
        return `${secondRoot}\n`;
      }

      throw new Error(`unexpected command: ${command}`);
    });

    executeCommandJSONWithFallback.mockImplementation(
      async (_cwd: unknown, command: string) => {
        if (command.includes(`${path.join(firstBin, 'npm')} ls -g --depth=0 --json`)) {
          return {
            dependencies: {
              'listed-by-npm': { version: '1.0.0' },
            },
          };
        }
        if (command.includes(`${path.join(secondBin, 'npm')} ls -g --depth=0 --json`)) {
          return {
            dependencies: {},
          };
        }

        throw new Error(`unexpected command: ${command}`);
      },
    );

    await expect(getMergedGlobalInstalledInfo()).resolves.toEqual({
      'listed-by-npm': { version: '1.0.0' },
      'missing-from-first-npm': { version: '2.0.0' },
    });
  });

  test('owner lookup prefers the npm installation with the matching installed version', async () => {
    const firstBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const secondBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const firstRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-root-'));
    const secondRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-root-'));

    await writeFile(path.join(firstBin, 'npm'), '');
    await writeFile(path.join(secondBin, 'npm'), '');

    process.env['PATH'] = [firstBin, secondBin].join(path.delimiter);

    await ensureDir(path.join(firstRoot, '@kilocode', 'cli'));
    await ensureDir(path.join(secondRoot, '@kilocode', 'cli'));

    await writeJson(path.join(firstRoot, '@kilocode', 'cli', 'package.json'), {
      name: '@kilocode/cli',
      version: '7.0.48',
    });
    await writeJson(path.join(secondRoot, '@kilocode', 'cli', 'package.json'), {
      name: '@kilocode/cli',
      version: '7.0.47',
    });

    executeCommandSimple.mockImplementation(async (_cwd: unknown, command: string) => {
      if (command.includes(`${path.join(firstBin, 'npm')} root -g`)) {
        return `${firstRoot}\n`;
      }
      if (command.includes(`${path.join(secondBin, 'npm')} root -g`)) {
        return `${secondRoot}\n`;
      }

      throw new Error(`unexpected command: ${command}`);
    });

    executeCommandJSONWithFallback.mockImplementation(
      async (_cwd: unknown, command: string) => {
        if (command.includes(`${path.join(firstBin, 'npm')} ls -g --depth=0 --json`)) {
          return {
            dependencies: {
              '@kilocode/cli': { version: '7.0.48' },
            },
          };
        }
        if (command.includes(`${path.join(secondBin, 'npm')} ls -g --depth=0 --json`)) {
          return {
            dependencies: {
              '@kilocode/cli': { version: '7.0.47' },
            },
          };
        }

        throw new Error(`unexpected command: ${command}`);
      },
    );

    await expect(
      findOwningNpmForGlobalPackage('@kilocode/cli', '7.0.47'),
    ).resolves.toBe(path.join(secondBin, 'npm'));
  });

  test('writability preflight fails early for read-only global package directories', async () => {
    const npmBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const globalRoot = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-root-'));

    await writeFile(path.join(npmBin, 'npm'), '');
    await ensureDir(path.join(globalRoot, '@kilocode', 'cli'));

    process.env['PATH'] = npmBin;

    executeCommandSimple.mockImplementation(async (_cwd: unknown, command: string) => {
      if (command.includes(`${path.join(npmBin, 'npm')} root -g`)) {
        return `${globalRoot}\n`;
      }

      throw new Error(`unexpected command: ${command}`);
    });

    await import('fs/promises').then(async ({ chmod }) => {
      await chmod(path.join(globalRoot, '@kilocode'), 0o555);
      await chmod(path.join(globalRoot, '@kilocode', 'cli'), 0o555);
    });

    await expect(
      assertGlobalPackageWritable(path.join(npmBin, 'npm'), '@kilocode/cli'),
    ).rejects.toMatchObject({
      globalRoot,
      message: 'Global package update requires write access to the npm global directory',
      packageName: '@kilocode/cli',
    });
  });

  test('current npm executable resolves to the first npm on PATH', async () => {
    const firstBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));
    const secondBin = await mkdtemp(path.join(os.tmpdir(), 'npm-gui-bin-'));

    await writeFile(path.join(firstBin, 'npm'), '');
    await writeFile(path.join(secondBin, 'npm'), '');

    process.env['PATH'] = [firstBin, secondBin].join(path.delimiter);

    expect(getCurrentNpmExecutableFromPath()).toBe(path.join(firstBin, 'npm'));
  });
});
