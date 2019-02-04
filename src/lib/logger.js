const winston = require('winston');
const level = require('../config/logging').level;
const levels = require('../config/logging').levels;

const formatter = (opt) => {
  const message = `[${Date.now().toISOString()}] [PID:${process.pid}] [${opt.level.toUpperCase()}] ${opt.message || ''}`;
  const meta = (opt.meta && Object.keys(opt.meta).length) ? `\n  ${JSON.stringify(opt.meta)}` : '';
  return message + meta;
};

const transports = [
  new (winston.transports.Console)({ level, formatter, timestamp: true })
];

const logger = winston.createLogger({ levels, transports });

module.exports = logger;
