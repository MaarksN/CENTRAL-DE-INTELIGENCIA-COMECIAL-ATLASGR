# Technical Roadmap

## Overview
This roadmap outlines the prioritized architectural and operational goals following the Wave 2 audit to ensure platform reliability.

## Phase 1: Environment Stabilization (Immediate)
- Fix the test environment so pure unit tests run entirely detached from `.env` restrictions.
- Correct the asynchronous timeout inside `whatsappMessage.service.test.ts`.
- Ensure BullMQ and Redis are properly mocked out during Vitest execution.

## Phase 2: Infrastructure Resilience (Mid-term)
- Resolve Docker Compose filesystem layer issues to allow `npm run test:integration` and `npm run test:e2e` to run correctly on local machines.
- Standardize Error classes for integrations (e.g. `BirthVoiceNotConfiguredError`) extending core CQRS exceptions.
- Convert arbitrary `String` types in Prisma (like `status`) into strict Enums.

## Phase 3: Observability & Production Readiness (Long-term)
- Integrate OpenTelemetry traces directly into Pino logs.
- Map global fallback systems for when the Primary LiteLLM gateway encounters unrecoverable timeouts.
- Establish strict SLA/SLO dashboards in Grafana parsing Prometheus `/metrics` endpoints.