from pathlib import Path

from openpyxl import Workbook

ROWS = [
    ("Infrastructure", "Cloud hosting (2 Node.js instances)", "12 months", "$1,080", "DigitalOcean / AWS Lightsail", "Assumes two small instances with auto-restart"),
    ("Infrastructure", "Managed MongoDB cluster", "12 months", "$720", "MongoDB Atlas", "M10 tier with backup retention"),
    ("Infrastructure", "CDN & asset storage", "12 months", "$300", "Cloudflare / AWS CloudFront", "Includes asset replication and transfer"),
    ("Infrastructure", "TLS certificate", "1 year", "$0", "Let's Encrypt", "Automated renewal via certbot"),
    ("Development", "Full-stack engineering", "160 hours", "$10,400", "Internal team / contractor", "$65/hr blended rate for feature development"),
    ("Development", "QA & usability testing", "60 hours", "$3,900", "QA specialists", "$65/hr for manual and exploratory testing"),
    ("Security & Compliance", "Annual penetration test", "1 engagement", "$4,000", "Third-party security firm", "OWASP ASVS-aligned external test"),
    ("Security & Compliance", "DAST/SAST tooling", "12 months", "$1,500", "OWASP ZAP Enterprise / Snyk", "Combination of automated scanning licenses"),
    ("Security & Compliance", "Security monitoring & SIEM", "12 months", "$1,440", "Datadog / Wazuh", "Log aggregation with alerting rules"),
    ("Operational", "Maintenance & on-call coverage", "96 hours", "$6,240", "Internal team", "$65/hr for monthly service windows"),
    ("Operational", "Automated backups & storage", "12 months", "$360", "AWS Backup / Backblaze B2", "Daily snapshots with 30-day retention"),
    ("Contingency", "Risk buffer (12% subtotal)", "1 allocation", "$3,125", "N/A", "Covers unexpected infra/security expenses"),
]

HEADERS = (
    "Category",
    "Item",
    "Quantity / Units",
    "Estimated Cost (USD)",
    "Vendor / Service Provider",
    "Notes or Assumptions",
)

OUTPUT_PATH = Path(__file__).with_name("DEPLOYMENT_COST_BREAKDOWN.xlsx")


def main() -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "Deployment Cost Breakdown"
    ws.append(HEADERS)
    for row in ROWS:
        ws.append(row)
    for column_cells in ws.columns:
        max_length = max(len(str(cell.value)) if cell.value else 0 for cell in column_cells)
        adjusted_width = max_length + 2
        column_letter = column_cells[0].column_letter
        ws.column_dimensions[column_letter].width = adjusted_width
    wb.save(OUTPUT_PATH)


if __name__ == "__main__":
    main()
