import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter(), // Uses OTEL_EXPORTER_OTLP_ENDPOINT from env
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
