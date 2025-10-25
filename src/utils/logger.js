import winston from 'winston';
import chalk from 'chalk';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export const log = {
  info: (message) => logger.info(message),
  warn: (message) => logger.warn(chalk.yellow(message)),
  error: (message) => logger.error(chalk.red(message)),
  debug: (message) => logger.debug(chalk.blue(message)),
};
