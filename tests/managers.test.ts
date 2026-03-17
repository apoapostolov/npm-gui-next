import api from 'supertest';

import { app } from '../server';
import { executeCommandSimple } from '../server/actions/execute-command';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe(`Package Managers`, () => {
  test('should return available package managers', async () => {
    const response = await api(app.server).get('/api/available-managers/');
    expect(response.status).toBe(HTTP_STATUS_OK);

    const check = async (command: string): Promise<boolean> => {
      try {
        await executeCommandSimple(undefined, `${command} --version`);
        return true;
      } catch {
        return false;
      }
    };

    expect(response.body).toEqual({
      bun: await check('bun'),
      npm: await check('npm'),
      pnpm: await check('pnpm'),
      yarn: await check('yarn'),
    });
  });
});
