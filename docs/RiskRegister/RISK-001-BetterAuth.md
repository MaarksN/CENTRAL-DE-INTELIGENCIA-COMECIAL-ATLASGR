# RISK-001: Critical Vulnerabilities in better-auth

## Description
The `better-auth` library (up to `1.6.23`) contains known critical vulnerabilities (e.g., OAuth refresh-token replay, XSS in auth-server origin via javascript redirect).
The available fix requires upgrading to a Release Candidate (`1.7.0-rc.x`), which introduces peer dependency conflicts (`@types/react`).

## Impact
Critical. If exploited, could lead to account takeover, token replay, or XSS depending on the enabled plugins (OAuth, SCIM).

## Likelihood
Medium to High (depending on specific plugins actively used).

## Mitigation / Strategy
**Accept Risk (Temporarily)**
As per ADR-001, we accept this risk to maintain production stability. We will not use `--legacy-peer-deps` or RC versions.

## Action Plan
- Monitor for the official, stable `1.7.0` release of `better-auth`.
- Update immediately upon stable release.
- Ensure strict usage of `requireTenant` and `requirePermission` to minimize horizontal escalation in the meantime.
