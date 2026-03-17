/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable no-await-in-loop */
import type { BundleScore } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { parseJSON } from '../../../utils/parse-json';
import { requestGET } from '../../../utils/request-with-promise';
import { notEmpty } from '../../../utils/utils';
import { getChunks } from './utils';

const cache: Record<string, BundleScore> = {};

interface Parameters {
  dependenciesName: string;
}

interface NPMSPackageResponse {
  score?: {
    final?: number;
  };
}

const getDependenciesScoreValue = async (
  dependencyName: string,
): Promise<BundleScore | undefined> => {
  const bundleInfoCached = cache[dependencyName];

  if (bundleInfoCached) {
    return bundleInfoCached;
  }

  try {
    const response = await requestGET(
      'api.npms.io',
      `/v2/package/${dependencyName}`,
    );
    const parsed = parseJSON<NPMSPackageResponse>(response);
    const score = parsed?.score?.final;

    if (typeof score === 'number') {
      // eslint-disable-next-line require-atomic-updates
      cache[dependencyName] = {
        name: dependencyName,
        score: Math.round(score * 100),
      };
      return cache[dependencyName];
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return undefined;
  }
};

export const getDependenciesScore: ResponserFunction<
  unknown,
  Parameters,
  BundleScore[]
> = async ({ params: { dependenciesName } }) => {
  const chunks = getChunks(dependenciesName.split(','), 5);

  try {
    const allScore: BundleScore[] = [];

    for (const chunk of chunks) {
      const chunkScore = await Promise.all(
        chunk.map((dependencyName) =>
          getDependenciesScoreValue(dependencyName),
        ),
      );

      allScore.push(...chunkScore.filter(notEmpty));
    }

    return allScore;
  } catch {
    return [];
  }
};
