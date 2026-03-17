import type { Outdated } from '../types/commands.types';

const stripAnsi = (value: string): string =>
  value.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');

const normalizeDependencyName = (value: string): string =>
  value.replace(/\s+\((dev|optional|peer)\)$/i, '').trim();

const extractNameVersion = (
  packageSpec: string,
): { name: string; version: string } | null => {
  const normalized = packageSpec.trim();
  const separator = normalized.lastIndexOf('@');

  if (separator <= 0 || separator === normalized.length - 1) {
    return null;
  }

  return {
    name: normalized.slice(0, separator),
    version: normalized.slice(separator + 1),
  };
};

export const parseBunPmList = (
  stdout: string,
): Record<string, { version: string }> => {
  const installed: Record<string, { version: string }> = {};

  for (const line of stripAnsi(stdout).split('\n')) {
    const trimmed = line.trimEnd();

    if (!/^[├└]──\s+/.test(trimmed)) {
      continue;
    }

    const packageSpec = trimmed.replace(/^[├└]──\s+/, '').trim();
    const parsed = extractNameVersion(packageSpec);

    if (parsed) {
      installed[parsed.name] = {
        version: parsed.version,
      };
    }
  }

  return installed;
};

const isDividerRow = (cells: string[]): boolean =>
  cells.every((cell) => /^:?-{2,}:?$/.test(cell));

export const parseBunOutdated = (stdout: string): Outdated => {
  const outdated: Outdated = {};

  for (const line of stripAnsi(stdout).split('\n')) {
    const trimmed = line.trim();

    if (!trimmed || !trimmed.startsWith('|')) {
      continue;
    }

    const cells = trimmed
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    const firstCell = cells[0];

    if (
      cells.length < 4 ||
      firstCell === undefined ||
      /^package$/i.test(firstCell) ||
      isDividerRow(cells)
    ) {
      continue;
    }

    const [name, current, update, latest] = cells;

    if (
      name === undefined ||
      current === undefined ||
      update === undefined ||
      latest === undefined
    ) {
      continue;
    }

    outdated[normalizeDependencyName(name)] = {
      current,
      wanted: update,
      latest,
    };
  }

  return outdated;
};
