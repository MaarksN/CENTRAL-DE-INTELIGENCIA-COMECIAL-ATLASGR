# ADR 002: AI Gateway Standardization

## Context
Various parts of the application interact with different LLMs directly.

## Problem
Hardcoded AI provider integrations make it difficult to manage costs, enforce security, apply global timeouts, and switch models.

## Alternatives
- Continue direct SDK integrations.
- Build a custom internal proxy.
- Use LiteLLM as an AI Gateway.

## Choice
Standardize on **LiteLLM as the AI Gateway**.

## Consequences
- Centralized model routing and fallbacks.
- Unified tracking of token usage and costs.
- Requires all AI requests to pass through the gateway.
