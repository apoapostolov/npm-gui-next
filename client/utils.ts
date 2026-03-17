export const ZERO = 0;

export const getNormalizedRequiredVersion = (
  required?: string | null,
): string | undefined => {
  if (required === null || required === undefined) {
    return undefined;
  }

  const normalized = /\d.+/u.exec(required);

  return normalized ? normalized[ZERO] : undefined;
};

export const normalizeRepositoryLink = (link: string): string | undefined =>
  link
    .replace('git+', '')
    .replace('git://', 'https://')
    .replace('ssh://', 'https://')
    .replace('.git', '')
    .replace('git@', '')
    .replace(/#.+/, '');

export const getChangelogLink = ({
  homepage,
  name,
  repository,
}: {
  homepage?: string;
  name: string;
  repository?: string;
}): string => {
  if (repository) {
    const normalizedRepository = normalizeRepositoryLink(repository);

    if (normalizedRepository?.includes('github.com/')) {
      return `${normalizedRepository}/releases`;
    }

    if (normalizedRepository?.includes('gitlab.com/')) {
      return `${normalizedRepository}/-/releases`;
    }

    if (normalizedRepository) {
      return normalizedRepository;
    }
  }

  if (homepage) {
    return homepage;
  }

  return `https://libraries.io/npm/${encodeURIComponent(name)}`;
};
