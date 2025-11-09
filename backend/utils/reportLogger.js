const fs = require('fs');
const path = require('path');

const ANALYTICS_DIR = path.join(__dirname, '..', '..', 'reports', 'analytics');

const sanitizeCell = (value) => {
    if (value === null || value === undefined || value === '') {
        return 'N/A';
    }
    return String(value)
        .replace(/\|/g, '/')
        .replace(/\r?\n/g, ' ')
        .trim();
};

const formatRows = (entries) => {
    return entries
        .map((entry) => `| ${sanitizeCell(entry.date)} | ${sanitizeCell(entry.metric)} | ${sanitizeCell(entry.value)} | ${sanitizeCell(entry.change)} | ${sanitizeCell(entry.notes)} |`)
        .join('\n');
};

const appendRows = async (fileName, entries) => {
    const filePath = path.join(ANALYTICS_DIR, fileName);
    const content = `\n${formatRows(entries)}\n`;
    try {
        await fs.promises.appendFile(filePath, content, { encoding: 'utf8' });
    } catch (error) {
        console.error(`Failed to append analytics report to ${fileName}:`, error.message);
    }
};

async function logUserReport(entries) {
    await appendRows('USER_REPORT.md', entries);
}

async function logTrafficReport(entries) {
    await appendRows('TRAFFIC_REPORT.md', entries);
}

async function logAdReport(entries) {
    await appendRows('AD_REPORT.md', entries);
}

module.exports = {
    logUserReport,
    logTrafficReport,
    logAdReport
};
