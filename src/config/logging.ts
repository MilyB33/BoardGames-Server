const getTimestamp = (): string => new Date().toISOString();

const info = (namespace: string, message: string, object?: any) => {
  if (object)
    console.log(
      `[${getTimestamp()}] [INFO] [${namespace}] ${message}`,
      object
    );
  else
    console.log(
      `[${getTimestamp()}] [INFO] [${namespace}] ${message}`
    );
};

const warn = (namespace: string, message: string, object?: any) => {
  if (object)
    console.log(
      `[${getTimestamp()}] [WARN] [${namespace}] ${message}`,
      object
    );
  else
    console.log(
      `[${getTimestamp()}] [WARN] [${namespace}] ${message}`
    );
};

const error = (namespace: string, message: string, object?: any) => {
  if (object)
    console.log(
      `[${getTimestamp()}] [ERROR] [${namespace}] ${message}`,
      object
    );
  else
    console.log(
      `[${getTimestamp()}] [ERROR] [${namespace}] ${message}`
    );
};

const debug = (namespace: string, message: string, object?: any) => {
  if (object)
    console.log(
      `[${getTimestamp()}] [DEBUG] [${namespace}] ${message}`,
      object
    );
  else
    console.log(
      `[${getTimestamp()}] [DEBUG] [${namespace}] ${message}`
    );
};

export default {
  info,
  warn,
  error,
  debug,
};
