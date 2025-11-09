# Advertising Report (Generated 2025-10-12T22:41:48.8451992Z UTC)

| Date | Metric | Value | Change | Notes |
|------|--------|-------|--------|-------|
| 2025-10-12T22:41:48.8451992Z | Impressions (7 days) | Data pending | N/A (baseline) | Awaiting ingestion from native-ads tracking. |
| 2025-10-12T22:41:48.8451992Z | Clicks (7 days) | Data pending | N/A (baseline) | Requires click event logging. |
| 2025-10-12T22:41:48.8451992Z | Click-through rate (CTR) | Data pending | N/A (baseline) | Calculated once impressions/clicks collected. |
| 2025-10-12T22:41:48.8451992Z | Estimated ad revenue | Data pending | N/A (baseline) | Use cost-per-click × clicks. |

**Recommendations:**
- Expose `/api/reports/ads` to deliver sanitized ad engagement metrics to authorized admins.
- Implement lazy-loaded analytics worker to record impressions/clicks with deduplication.
- Set up weekly alert if CTR drops >20% week-over-week for proactive optimization.
