import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';

export const sdk = new NodeSDK({
    traceExporter: new ConsoleSpanExporter(), // For now we log to console, later can point to Jaeger
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
