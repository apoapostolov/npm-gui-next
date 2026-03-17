import { spawn } from '../utils/simple-cross-spawn';
import { ZERO } from '../utils/utils';

const tryParseJSON = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
};

const extractJSONPayload = <T>(value: string): T | undefined => {
  const lines = value
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line);

  for (let startIndex = 0; startIndex < lines.length; startIndex += 1) {
    const startsLikeJSON =
      lines[startIndex]?.startsWith('{') || lines[startIndex]?.startsWith('[');

    if (!startsLikeJSON) {
      continue;
    }

    for (let endIndex = lines.length; endIndex > startIndex; endIndex -= 1) {
      const candidate = lines.slice(startIndex, endIndex).join('\n');
      const parsed = tryParseJSON<T>(candidate);

      if (parsed !== undefined) {
        return parsed;
      }
    }
  }

  return undefined;
};

const parseJSONLines = <T>(value: string): T[] => {
  return value
    .trim()
    .split('\n')
    .filter((line) => line)
    .map((line) => tryParseJSON<T>(line))
    .filter((line): line is T => line !== undefined);
};

export const executeCommand = (
  cwd: string | undefined,
  wholeCommand: string,
): Promise<{ stdout: string; stderr: string }> => {
  console.log(`Command: ${wholeCommand}, started`);
  return new Promise((resolve, reject) => {
    // spawn process
    const commandArguments = wholeCommand.split(' ').filter(Boolean);
    const command = commandArguments.shift();

    if (!command) {
      reject(new Error('command not passed'));
    } else {
      const spawned = spawn(command, commandArguments, {
        cwd,
        detached: false,
      });

      // wait for stdout, stderr
      let stdout = '';
      spawned.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      let stderr = '';
      spawned.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      // wait for finish and resolve
      spawned.on('close', (exitStatus: number) => {
        if (exitStatus === ZERO) {
          resolve({
            stdout,
            stderr,
          });
        } else {
          reject(stdout + stderr);
        }
      });

      // if error
      spawned.on('error', () => {
        reject(stderr);
      });
    }
  });
};

export const executeCommandSimple = async (
  cwd: string | undefined,
  wholeCommand: string,
): Promise<string> => {
  const { stdout } = await executeCommand(cwd, wholeCommand);
  return stdout;
};

// eslint-disable-next-line func-style
export async function executeCommandJSONWithFallback<T>(
  cwd: string | undefined,
  wholeCommand: string,
): Promise<T> {
  try {
    const { stdout } = await executeCommand(cwd, wholeCommand);
    if (!process.env['NODE_TEST']) {
      console.log('OK:', wholeCommand);
    }
    const parsed = stdout ? extractJSONPayload<T>(stdout) : undefined;

    if (parsed !== undefined) {
      return parsed;
    }
  } catch (error: unknown) {
    if (!process.env['NODE_TEST']) {
      console.log('ERROR:', wholeCommand, '\n', error);
    }

    if (typeof error === 'string') {
      const parsed = extractJSONPayload<T>(error);

      if (parsed !== undefined) {
        return parsed;
      }
    }
  }

  return {} as T;
}

// eslint-disable-next-line func-style, max-statements
export async function executeCommandJSONWithFallbackYarn<T>(
  cwd: string | undefined,
  wholeCommand: string,
): Promise<T | undefined> {
  try {
    const { stdout, stderr } = await executeCommand(cwd, wholeCommand);
    if (!process.env['NODE_TEST']) {
      console.log('OK:', wholeCommand);
    }
    const JSONs = parseJSONLines<Record<string, unknown>>(stdout + stderr);
    const table = JSONs.find((x) => 'type' in x && x['type'] === 'table') as
      | T
      | undefined;
    if (table) {
      return table;
    }

    const anyError = JSONs.find((x) => 'type' in x && x['type'] === 'error') as
      | T
      | undefined;
    if (anyError) {
      return anyError;
    }
  } catch (error: unknown) {
    if (!process.env['NODE_TEST']) {
      console.log('ERROR:', wholeCommand, '\n', error);
    }

    if (typeof error === 'string') {
      const JSONS = parseJSONLines<Record<string, unknown>>(error);
      const table = JSONS.find((x) => 'type' in x && x['type'] === 'table') as
        | T
        | undefined;
      if (table) {
        return table;
      }

      const anyError = JSONS.find((x) => 'type' in x && x['type'] === 'error') as
        | T
        | undefined;
      if (anyError) {
        return anyError;
      }
    }

    return undefined;
  }

  return undefined;
}
