import * as winston from 'winston';
import { format, transports } from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
    ),
    // defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.Console(),
        new transports.File({ filename: 'log/error.log', level: 'error' }),
        new transports.File({ filename: 'log/combined.log' })

    ],
    exitOnError: false
});

export default logger;
