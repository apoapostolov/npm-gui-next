import type { ResponserFunction } from '../../../types/new-server.types';
import { spliceFromCache } from '../../../utils/cache';
import {
  getCurrentNpmExecutableFromPath,
  findOwningNpmForGlobalPackage,
  withPreferredPath,
} from '../../../utils/global-npm';
import { executeCommand } from '../../execute-command';

const deleteGlobalNpmDependency = async (
  dependencyName: string,
  globalNpmStrategy?: string,
): Promise<void> => {
  const npmCommand =
    globalNpmStrategy === 'owner'
      ? await findOwningNpmForGlobalPackage(dependencyName)
      : getCurrentNpmExecutableFromPath();

  await executeCommand(
    undefined,
    withPreferredPath(npmCommand, `uninstall ${dependencyName} -g`),
  );
};

interface Parameters {
  dependencyName: string;
}

export const deleteGlobalDependency: ResponserFunction<
  unknown,
  Parameters
> = async ({
  params: { dependencyName },
  extraParams: { globalNpmStrategy, xCacheId },
}) => {
  await deleteGlobalNpmDependency(dependencyName, globalNpmStrategy);

  spliceFromCache(`${xCacheId}global`, dependencyName);

  return {};
};
