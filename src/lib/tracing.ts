import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export const sdk = new NodeSDK({
    traceExporter: new (require('@opentelemetry/sdk-trace-base').ConsoleSpanExporter)(), // For now we log to console, later can point to Jaeger
    instrumentations: [getNodeAutoInstrumentations()],
});

// Start SDK before any other modules load
export function initTracing() {
    sdk.start();
    console.log('OpenTelemetry initialized');
    
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
}
