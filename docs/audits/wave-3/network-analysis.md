# Network Analysis - Onda 3

## Current Network Bottlenecks
1. **Frontend Asset Delivery:**
   - The Vite build output contains chunks upwards of 1MB (`OnboardingTour`) and 400KB (`xlsx`). Without a CDN or strict HTTP/2 multiplexing, these chunks will severely block the time-to-interactive (TTI) for clients.
   - Gzip is enabled via Express `compression` middleware, bringing the 1MB chunk down to ~244KB. However, relying on Node.js to Gzip on the fly uses CPU.
   - **Improvement:** Offload asset delivery and compression to a CDN (e.g., Cloudflare, AWS CloudFront) or Nginx reverse proxy. Serve pre-compressed `.gz` or `.br` (Brotli) files during the build phase.

2. **API Payload Size:**
   - Giant JSON payloads from reporting or dashboard queries can bloat network requests. Ensure endpoints implement pagination (limit/offset or cursor-based) natively.
   - Example: The dashboard fetches activities. Ensure the `/api/activities` endpoint strictly limits payload size and does not return unnecessary relation fields unless requested.