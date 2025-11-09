# Deployment Cost Estimate

| Category | Description | Estimated Cost | Notes |
|----------|-------------|----------------|-------|
| Infrastructure | Cloud hosting (two Node.js application instances with managed load balancing) | $1,080 / year | $90/month across primary and failover regions. |
| Infrastructure | Managed MongoDB Atlas cluster (M10 tier) | $720 / year | Includes daily snapshots with standard retention. |
| Infrastructure | CDN and asset storage (Cloudflare/AWS CloudFront + S3) | $300 / year | Assumes moderate traffic with compression and caching. |
| Infrastructure | TLS certificates & renewal automation | $0 / year | Let's Encrypt with automated renewal scripts. |
| Development | Full-stack engineering effort (feature & integration work) | $10,400 | 160 hrs @ $65/hr blended rate. |
| Development | QA and usability testing coverage | $3,900 | 60 hrs @ $65/hr for manual + exploratory passes. |
| Security & Compliance | Annual third-party penetration test | $4,000 | External OWASP ASVS-aligned engagement. |
| Security & Compliance | DAST/SAST tooling licenses | $1,500 | Combination of OWASP ZAP enterprise runner and Snyk. |
| Security & Compliance | Security monitoring & SIEM | $1,440 / year | Datadog/Wazuh log aggregation with alerting. |
| Operational | Maintenance & on-call coverage | $6,240 / year | 96 hrs @ $65/hr for monthly release windows. |
| Operational | Automated backups and archival storage | $360 / year | AWS Backup / Backblaze B2 with 30-day retention. |
| Contingency Buffer | 12% of subtotal to cover unexpected infra/security costs | $3,125 | Based on subtotal of $26,040. |
| Total Estimated Deployment Cost | Combined annualized deployment expenditure | $29,165 | Includes contingency buffer and security allocations. |
