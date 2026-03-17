export const getApiBase = (): string => {
  const { hostname, port, protocol } = window.location;

  if (
    ['localhost', '127.0.0.1'].includes(hostname) &&
    port !== '' &&
    port !== '3002'
  ) {
    return `${protocol}//${hostname}:3002`;
  }

  return '';
};

export const getApiPath = (path: string): string => `${getApiBase()}${path}`;

export const getBasePathFor = (projectPath: string): string => {
  if (projectPath !== 'global') {
    return getApiPath(`/api/project/${projectPath}/dependencies`);
  }

  return getApiPath('/api/global/dependencies');
};

export const fetchJSON = async <T>(
  ...parameters: Parameters<typeof fetch>
): Promise<T> => {
  const response = await fetch(...parameters);

  if (!response.ok) {
    const responseText = await response.text();
    let parsedBody: unknown = responseText;

    try {
      parsedBody = responseText ? JSON.parse(responseText) : undefined;
    } catch {
      parsedBody = responseText;
    }

    const message =
      parsedBody &&
      typeof parsedBody === 'object' &&
      'message' in parsedBody &&
      typeof parsedBody.message === 'string'
        ? parsedBody.message
        : `Request failed with status ${response.status}`;

    const details =
      parsedBody &&
      typeof parsedBody === 'object' &&
      'details' in parsedBody &&
      typeof parsedBody.details === 'string'
        ? parsedBody.details
        : responseText;

    const debugError = new Error(message);

    Object.assign(debugError, {
      cause: parsedBody,
      details,
      responseBody: parsedBody,
      status: response.status,
      statusText: response.statusText,
      url: typeof parameters[0] === 'string' ? parameters[0] : parameters[0].toString(),
    });

    throw debugError;
  }

  return response.json();
};
