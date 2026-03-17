import type { Installed, Outdated } from '../../../types/commands.types';
import type { DependencyInstalled } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { updateInCache } from '../../../utils/cache';
import {
  getInstalledVersion,
  getLatestVersion,
} from '../../../utils/map-dependencies';
import {
  assertGlobalPackageWritable,
  getCurrentNpmExecutableFromPath,
  findOwningNpmForGlobalPackage,
  withPreferredPath,
} from '../../../utils/global-npm';
import {
  executeCommand,
  executeCommandJSONWithFallback,
} from '../../execute-command';

const addGlobalNpmDependency = async ({
  globalNpmStrategy,
  installedVersion,
  name,
  version,
}: {
  globalNpmStrategy?: string;
  installedVersion?: string | null;
  name: string;
  version: string;
}): Promise<DependencyInstalled> => {
  const npmCommand =
    globalNpmStrategy === 'owner'
      ? await findOwningNpmForGlobalPackage(name, installedVersion)
      : getCurrentNpmExecutableFromPath();
  await assertGlobalPackageWritable(npmCommand, name);

  // add
  await executeCommand(
    undefined,
    withPreferredPath(npmCommand, `install ${name}@${version || ''} -g`),
  );

  // get package info
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      withPreferredPath(npmCommand, `ls ${name} --depth=0 -g --json`),
    );

  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    undefined,
    withPreferredPath(npmCommand, `outdated ${name} -g --json`),
  );

  const installed = getInstalledVersion(
    installedInfo ? installedInfo[name] : undefined,
  );

  return {
    manager: 'npm',
    name,
    type: 'global',
    installed,
    latest: getLatestVersion(installed, null, outdatedInfo[name]),
  };
};

// eslint-disable-next-line @typescript-eslint/no-type-alias
type RequestBody = [{ installedVersion?: string | null; name: string; version: string }];

export const addGlobalDependencies: ResponserFunction<RequestBody> = async ({
  body,
  extraParams: { globalNpmStrategy, xCacheId },
}) => {
  const dependency = await addGlobalNpmDependency({
    ...body[0],
    globalNpmStrategy,
  });
  updateInCache(`${xCacheId}global`, dependency);

  return {};
};
