import winston from 'winston';
import { level, levels } from '../config/logging';

const formatter = (opt) => {
  const message = `[${Date.now().toISOString()}] [PID:${process.pid}] [${opt.level.toUpperCase()}] ${opt.message || ''}`;
  const meta = (opt.meta && Object.keys(opt.meta).length) ? `\n  ${JSON.stringify(opt.meta)}` : '';
  return message + meta;
};

const transports = [
  new (winston.transports.Console)({ level, formatter, timestamp: true })
];

const client = new (winston.Logger)({ levels, transports });

client.logErr = (e) => {
  if (e) client.error(e.message || 'error', e.stack || e);
};

export default client;
