import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';

import type { Installed } from '../types/commands.types';
import { parseJSON } from './parse-json';
import {
  executeCommandJSONWithFallback,
  executeCommandSimple,
} from '../actions/execute-command';

interface GlobalPackageJson {
  name?: string;
  version?: string;
}

export const getNpmExecutablesFromPath = (): string[] => {
  const entries = (process.env['PATH'] ?? '')
    .split(path.delimiter)
    .filter((entry) => entry);
  const npmExecutables = entries
    .map((entry) => path.join(entry, 'npm'))
    .filter((entry) => existsSync(entry));

  return [...new Set(npmExecutables)];
};

export const getCurrentNpmExecutableFromPath = (): string => {
  return getNpmExecutablesFromPath()[0] ?? 'npm';
};

export const withPreferredPath = (
  npmCommand: string,
  subcommand: string,
): string => {
  const npmDirectory = path.dirname(npmCommand);
  const existingPath = process.env['PATH'] ?? '';

  return `env PATH=${npmDirectory}:${existingPath} ${npmCommand} ${subcommand}`;
};

const isWritableByCurrentUser = (targetPath: string): boolean => {
  const targetStats = statSync(targetPath);
  const targetMode = targetStats.mode;

  if (typeof process.getuid !== 'function') {
    return true;
  }

  if (targetStats.uid === process.getuid()) {
    return Boolean(targetMode & 0o200);
  }

  if (
    typeof process.getgid === 'function' &&
    targetStats.gid === process.getgid()
  ) {
    return Boolean(targetMode & 0o020);
  }

  return Boolean(targetMode & 0o002);
};

const listScopedOrDirectPackages = (
  globalRoot: string,
  entryName: string,
): string[] => {
  const entryPath = path.join(globalRoot, entryName);

  if (!existsSync(entryPath)) {
    return [];
  }

  if (!entryName.startsWith('@')) {
    return [entryName];
  }

  return readdirSync(entryPath).map((childName) => `${entryName}/${childName}`);
};

export const getGlobalPackagesFromFilesystem = async (
  npmCommand: string,
): Promise<Record<string, { version?: string }>> => {
  const globalRoot = (
    await executeCommandSimple(undefined, withPreferredPath(npmCommand, 'root -g'))
  ).trim();

  if (!existsSync(globalRoot)) {
    return {};
  }

  return readdirSync(globalRoot)
    .flatMap((entryName) => listScopedOrDirectPackages(globalRoot, entryName))
    .reduce<Record<string, { version?: string }>>((result, packageName) => {
      const packageJsonPath = path.join(globalRoot, packageName, 'package.json');

      if (!existsSync(packageJsonPath)) {
        return result;
      }

      const packageJson = parseJSON<GlobalPackageJson>(
        readFileSync(packageJsonPath, 'utf8'),
      );

      if (!packageJson?.name) {
        return result;
      }

      result[packageJson.name] = {
        version: packageJson.version,
      };

      return result;
    }, {});
};

export const assertGlobalPackageWritable = async (
  npmCommand: string,
  packageName: string,
): Promise<void> => {
  const globalRoot = (
    await executeCommandSimple(undefined, withPreferredPath(npmCommand, 'root -g'))
  ).trim();
  const packagePath = path.join(globalRoot, packageName);
  const packageParentPath = path.dirname(packagePath);
  const firstBlockedPath = [packagePath, packageParentPath, globalRoot]
    .filter((targetPath) => existsSync(targetPath))
    .find((targetPath) => !isWritableByCurrentUser(targetPath));

  if (firstBlockedPath) {
    throw {
      blockedPath: firstBlockedPath,
      details: `Package ${packageName} is installed under ${globalRoot}, which is not writable by the current user. Update it as root/Administrator or move global npm installs to a user-writable prefix.`,
      globalRoot,
      message: 'Global package update requires write access to the npm global directory',
      packageName,
    };
  }
};

export const getInstalledGlobalPackagesForNpm = async (
  npmCommand: string,
): Promise<Record<string, unknown>> => {
  const { dependencies: installedByNpm } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      withPreferredPath(npmCommand, 'ls -g --depth=0 --json'),
    );

  return {
    ...(await getGlobalPackagesFromFilesystem(npmCommand)),
    ...installedByNpm,
  };
};

export const findOwningNpmForGlobalPackage = async (
  packageName: string,
  installedVersion?: string | null,
): Promise<string> => {
  const npmExecutables = getNpmExecutablesFromPath();
  const matchingNpmCommands: string[] = [];

  for (const npmCommand of npmExecutables) {
    const installedPackages = await getInstalledGlobalPackagesForNpm(npmCommand);

    if (packageName in installedPackages) {
      const installedPackage = installedPackages[packageName];
      const installedPackageVersion =
        installedPackage &&
        typeof installedPackage === 'object' &&
        'version' in installedPackage &&
        typeof installedPackage.version === 'string'
          ? installedPackage.version
          : undefined;

      if (
        typeof installedVersion === 'string' &&
        installedVersion.length > 0 &&
        installedPackageVersion === installedVersion
      ) {
        return npmCommand;
      }

      matchingNpmCommands.push(npmCommand);
    }
  }

  const firstMatchingNpmCommand = matchingNpmCommands[0];

  if (typeof firstMatchingNpmCommand === 'string') {
    return firstMatchingNpmCommand;
  }

  return npmExecutables[0] ?? 'npm';
};
