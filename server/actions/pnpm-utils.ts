import { executeCommandSimple } from './execute-command';

const ansiRegex = (): RegExp => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|');

  return new RegExp(pattern, 'g');
};

export const executePnpmOutdated = async (
  outdatedInfo: any,
  projectPath: string,
  compatible = false,
): Promise<void> => {
  const parseRows = (value: string): void => {
    const rows = value.replace(ansiRegex(), '').split('\n');
    let name = '';

    for (const row of rows) {
      const rowResult = /=>\s*([\d.]+)/.exec(row);

      if (rowResult) {
        outdatedInfo[name] = {
          ...outdatedInfo[name],
          [compatible ? 'wanted' : 'latest']: rowResult[1],
        };
      } else {
        name = row.replace('(dev)', '').trim();
      }
    }
  };

  try {
    parseRows(
      await executeCommandSimple(
      projectPath,
      `pnpm outdated ${compatible ? '--compatible' : ''} --no-table`,
      ),
    );
  } catch (error: unknown) {
    if (typeof error === 'string') {
      parseRows(error);
    }
  }
};
