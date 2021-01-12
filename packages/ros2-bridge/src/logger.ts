import * as winston from 'winston';

interface CustomLogger extends winston.Logger {
  child: (metadata: { label?: string }) => CustomLogger;
}
export type Logger = CustomLogger;

export const logger: CustomLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'isoDateTime' }),
    winston.format.printf(({ level, message, label, timestamp, ...rest }) => {
      const tag = label ? ` [${label}]` : '';
      const meta = Object.keys(rest).length === 0 ? '' : ` ${JSON.stringify(rest)}`;
      return `${timestamp}${tag} ${level}: ${message}${meta}`;
    }),
    winston.format.colorize({
      all: true,
    }),
  ),
  transports: new winston.transports.Console(),
});

export default logger;
