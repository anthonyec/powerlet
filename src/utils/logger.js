export function createLogger(name = 'log') {
  return {
    log: (...args) => console.log(`[log:${name}]`, ...args),
    error: (...args) => console.log(`[error:${name}]`, ...args),
    warn: (...args) => console.log(`[warn:${name}]`, ...args)
  };
}
