const fs = require('fs');
const path = require('path');

const SECURITY_REPORT_PATH = path.join(__dirname, '..', '..', 'reports', 'security', 'SECURITY_REPORT.md');

const sanitizeCell = (value) => {
    return String(value)
        .replace(/\|/g, '/')
        .replace(/\r?\n/g, ' ')
        .trim();
};

const generateIssueId = () => {
    return `EVT-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 15)}`;
};

async function logSecurityEvent({ description, severity = 'Info', status = 'Logged' }) {
    const issueId = generateIssueId();
    const timestamp = new Date().toISOString();
    const row = `| ${sanitizeCell(issueId)} | ${sanitizeCell(description)} | ${sanitizeCell(severity)} | ${sanitizeCell(timestamp)} | N/A | ${sanitizeCell(status)} |\n`;

    try {
        await fs.promises.appendFile(SECURITY_REPORT_PATH, row, { encoding: 'utf8' });
    } catch (error) {
        console.error('Failed to append security event to SECURITY_REPORT.md:', error.message);
    }
}

module.exports = {
    logSecurityEvent
};
