export function createLogger(name = 'log') {
  if (process.env.NODE_ENV !== 'development') {
    const noop = () => {};
    return { log: noop, warn: noop, error: noop };
  }

  return {
    log: (...args) => {
      const log = [`[log:${name}]`, ...args];
      console.log(...log);
    },
    warn: (...args) => {
      const log = [`[warn:${name}]`, ...args];
      console.log(...log);
    },
    error: (...args) => {
      const log = [`[error:${name}]`, ...args];
      console.log(...log);
    }
  };
}
