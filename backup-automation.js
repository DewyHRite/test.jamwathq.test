/**
 * JamWatHQ Backup Automation System
 * Automatically backs up critical files and deletes backups older than 1 day
 *
 * Usage: node backup-automation.js
 */

const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, 'backups');
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Files to backup before making changes
const CRITICAL_FILES = [
    'backend/routes/auth.js',
    'backend/routes/reviews.js',
    'backend/routes/agencyReviews.js',
    'frontend/scripts/auth-client.js',
    'frontend/scripts/tos-modal.js',
    'frontend/scripts/share-experience-page.js',
    'frontend/scripts/agencies.js',
    'frontend/share-experience.html',
    'frontend/agencies.html'
];

/**
 * Ensures the backup directory exists
 */
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
    }
}

/**
 * Creates a timestamped backup of a file
 * @param {string} filePath - Path to file to backup
 */
function backupFile(filePath) {
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        return false;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = path.basename(filePath);
    const backupFileName = `${fileName}.backup.${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    try {
        fs.copyFileSync(fullPath, backupPath);
        console.log(`✅ Backed up: ${filePath} → ${backupFileName}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to backup ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Deletes backup files older than 1 day
 */
function cleanOldBackups() {
    if (!fs.existsSync(BACKUP_DIR)) {
        return;
    }

    const now = Date.now();
    const files = fs.readdirSync(BACKUP_DIR);
    let deletedCount = 0;

    files.forEach(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > ONE_DAY_MS) {
            try {
                fs.unlinkSync(filePath);
                console.log(`🗑️  Deleted old backup: ${file} (${Math.floor(fileAge / ONE_DAY_MS)} days old)`);
                deletedCount++;
            } catch (error) {
                console.error(`❌ Failed to delete ${file}:`, error.message);
            }
        }
    });

    if (deletedCount === 0) {
        console.log('ℹ️  No old backups to delete.');
    } else {
        console.log(`✅ Deleted ${deletedCount} old backup(s).`);
    }
}

/**
 * Creates a version history log entry
 * @param {string[]} changedFiles - Array of file paths that were changed
 * @param {string} summary - Summary of changes
 */
function logVersionHistory(changedFiles, summary) {
    const logPath = path.join(BACKUP_DIR, 'VERSION_HISTORY.log');
    const timestamp = new Date().toISOString();

    const entry = `
================================================================================
Date: ${timestamp}
Summary: ${summary}
Files Changed:
${changedFiles.map(f => `  - ${f}`).join('\n')}

Rollback Steps:
  1. Identify the backup timestamp closest to this change
  2. Copy the .backup files from backups/ to their original locations
  3. Restart the backend server: npm run dev
  4. Clear browser cache and reload frontend

================================================================================
`;

    fs.appendFileSync(logPath, entry);
    console.log(`✅ Version history logged to: ${logPath}`);
}

/**
 * Main backup function
 */
function performBackup() {
    console.log('\n🔄 Starting backup process...\n');

    ensureBackupDir();

    let backedUpFiles = [];
    CRITICAL_FILES.forEach(file => {
        if (backupFile(file)) {
            backedUpFiles.push(file);
        }
    });

    console.log(`\n✅ Backed up ${backedUpFiles.length} file(s).`);

    console.log('\n🧹 Cleaning old backups...\n');
    cleanOldBackups();

    // Log version history
    logVersionHistory(
        backedUpFiles,
        'Pre-implementation backup: Login flow, modal enforcement, review submission fixes'
    );

    console.log('\n✅ Backup process complete!\n');
}

// Run if called directly
if (require.main === module) {
    performBackup();
}

module.exports = {
    performBackup,
    backupFile,
    cleanOldBackups,
    logVersionHistory
};
