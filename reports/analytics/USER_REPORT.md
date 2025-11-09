# User Report (Generated 2025-10-12T22:41:48.8451992Z UTC)

| Date | Metric | Value | Change | Notes |
|------|--------|-------|--------|-------|
| 2025-10-12T22:41:48.8451992Z | Total registered users | Data pending | N/A (baseline) | Awaiting integration with MongoDB user aggregation. |
| 2025-10-12T22:41:48.8451992Z | New signups (last 7 days) | Data pending | N/A (baseline) | Requires analytics endpoint `/api/reports/users`. |
| 2025-10-12T22:41:48.8451992Z | Active sessions (24h) | Data pending | N/A (baseline) | Session store metrics not yet exposed. |
| 2025-10-12T22:41:48.8451992Z | 30-day retention rate | Data pending | N/A (baseline) | Needs rolling cohort calculations. |

**Recommendations:**
- Build `/api/reports/users` endpoint to aggregate user counts and session activity securely for admin-only dashboards.
- Store computed metrics in a restricted analytics collection to enable week-over-week comparisons.
- Enforce RBAC on report endpoints and log access events to `SECURITY_REPORT.md`.
