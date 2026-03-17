import type { Installed, Outdated } from '../../../types/commands.types';
import type {
  DependencyBase,
  DependencyInstalled,
} from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { getFromCache, putToCache } from '../../../utils/cache';
import { getLatestVersion } from '../../../utils/map-dependencies';
import {
  getGlobalPackagesFromFilesystem,
  getNpmExecutablesFromPath,
  withPreferredPath,
} from '../../../utils/global-npm';
import {
  executeCommandJSONWithFallback,
} from '../../execute-command';

const getGlobalInstalledVersion = (installed?: unknown): string | null => {
  if (
    !installed ||
    typeof installed !== 'object' ||
    !('version' in installed) ||
    typeof installed.version !== 'string'
  ) {
    return null;
  }

  return installed.version;
};

export const getMergedGlobalInstalledInfo = async (): Promise<
  Record<string, { version?: string }>
> => {
  const npmExecutables = getNpmExecutablesFromPath();
  const mergedInstalledInfo: Record<string, { version?: string }> = {};

  for (const npmCommand of npmExecutables) {
    const { dependencies: installedByNpm } =
      await executeCommandJSONWithFallback<Installed>(
        undefined,
        withPreferredPath(npmCommand, 'ls -g --depth=0 --json'),
      );
    const installedByFilesystem = await getGlobalPackagesFromFilesystem(
      npmCommand,
    );

    Object.assign(mergedInstalledInfo, installedByFilesystem, installedByNpm);
  }

  return mergedInstalledInfo;
};

const getGlobalNpmDependencies = async (): Promise<DependencyInstalled[]> => {
  const npmExecutables = getNpmExecutablesFromPath();
  const mergedDependencies: Record<string, DependencyInstalled> = {};

  for (const npmCommand of npmExecutables) {
    const { dependencies: installedByNpm } =
      await executeCommandJSONWithFallback<Installed>(
        undefined,
        withPreferredPath(npmCommand, 'ls -g --depth=0 --json'),
      );
    const installedInfo = {
      ...(await getGlobalPackagesFromFilesystem(npmCommand)),
      ...installedByNpm,
    };
    const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
      undefined,
      withPreferredPath(npmCommand, 'outdated -g --json'),
    );

    for (const name of Object.keys(installedInfo)) {
      const installed = getGlobalInstalledVersion(installedInfo[name]);

      mergedDependencies[name] = {
        manager: 'npm',
        name,
        type: 'global',
        installed,
        latest: getLatestVersion(installed, null, outdatedInfo[name]),
      };
    }
  }

  return Object.values(mergedDependencies);
};

const getGlobalNpmDependenciesSimple = async (): Promise<DependencyBase[]> => {
  const installedInfo = await getMergedGlobalInstalledInfo();
  if (!installedInfo) {
    return [];
  }

  return Object.keys(installedInfo).map((name) => ({
    manager: 'npm',
    name,
    type: 'global',
    installed: getGlobalInstalledVersion(installedInfo[name]),
  }));
};

export const getGlobalDependencies: ResponserFunction = async ({
  extraParams: { xCacheId },
}) => {
  const cache = getFromCache(`${xCacheId}global`);
  if (cache) {
    return cache;
  }

  const npmDependencies = await getGlobalNpmDependencies();
  putToCache(`${xCacheId}global`, npmDependencies);
  // TODO cache-id

  return npmDependencies;
};

export const getGlobalDependenciesSimple: ResponserFunction = async () => {
  const npmDependencies = await getGlobalNpmDependenciesSimple();

  return npmDependencies;
};
