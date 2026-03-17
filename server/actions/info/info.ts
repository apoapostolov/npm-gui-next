import { readFileSync } from 'fs';

import type { ResponserFunction } from '../../types/new-server.types';

export const info: ResponserFunction<unknown, { id: string }> = async ({
  params: { id: _id },
}) => {
  return readFileSync(`${process.cwd()}/INFO`, 'utf-8');
};
