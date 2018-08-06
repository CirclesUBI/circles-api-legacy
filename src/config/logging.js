const level = process.env.LOG_LEVEL || 'debug';

const levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
  emerg: 0
};

export { level, levels };
