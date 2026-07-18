import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // Em produção, logs devem ser gerados estruturados em JSON para OpenTelemetry/Loki/Elastic
    // Em dev, formatamos para ficar legível no terminal.
    transport: isProduction
        ? undefined
        : {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        },
    base: {
        env: process.env.NODE_ENV,
        service: 'prospector-atlas-api',
    }
});
