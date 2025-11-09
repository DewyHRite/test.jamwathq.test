# Backup System Documentation

## Overview
The JamWatHQ project includes an automated backup and cleanup system to maintain version history while conserving disk space.

## Backup Naming Convention
All backups follow this pattern:
```
<original-filename>.backup.<timestamp>.<extension>
```

**Examples:**
- `share-experience.backup.2025-10-15-011943.html`
- `server.backup.2025-10-15-143022.js`

## Automatic Cleanup

### Cleanup Scripts
Two cleanup scripts are provided for different operating systems:

1. **cleanup-backups.sh** (Linux/macOS/Git Bash)
2. **cleanup-backups.bat** (Windows)

### Cleanup Policy
- Backups are automatically deleted after **24 hours**
- Cleanup must be run manually or scheduled
- Deletion is logged to `VERSION_HISTORY.md`

### Running Cleanup Manually

**On Linux/macOS/Git Bash:**
```bash
bash cleanup-backups.sh
```

**On Windows:**
```cmd
cleanup-backups.bat
```

Or double-click the `.bat` file in File Explorer.

## Scheduling Automatic Cleanup

### Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Name: "JamWatHQ Backup Cleanup"
4. Trigger: Daily at 3:00 AM
5. Action: Start a program
6. Program: `C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Main\Code\cleanup-backups.bat`
7. Finish

### Linux/macOS (cron)
Add to crontab (`crontab -e`):
```bash
0 3 * * * cd /path/to/JamWatHQ/Main/Code && bash cleanup-backups.sh >> cleanup.log 2>&1
```
This runs daily at 3:00 AM and logs output to `cleanup.log`.

## Manual Backup Creation

### Create a Backup Before Making Changes
```bash
# For HTML files
cd frontend
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
cp share-experience.html share-experience.backup.$TIMESTAMP.html

# For JavaScript files
cd backend
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
cp server.js server.backup.$TIMESTAMP.js
```

### Restore from Backup
```bash
# List available backups
ls -lt *.backup.*.html

# Restore specific backup
cp share-experience.backup.2025-10-15-011943.html share-experience.html
```

## Version History

All changes are logged in `VERSION_HISTORY.md` with:
- Timestamp
- Summary of changes
- Files modified
- Rollback instructions
- Backup file reference

## Best Practices

1. **Always create a backup before major changes**
2. **Document changes in VERSION_HISTORY.md**
3. **Test rollback procedure** after important updates
4. **Run cleanup weekly** if not automated
5. **Keep VERSION_HISTORY.md up to date**

## Storage Considerations

- Each backup is typically 100-500 KB (HTML files)
- Backend files are smaller (10-50 KB)
- 24-hour retention keeps storage minimal
- Manual backups should be moved to long-term storage if needed

## Troubleshooting

### Cleanup Script Doesn't Find Files
- Check file naming matches pattern: `*.backup.*`
- Verify files are actually older than 24 hours
- On Windows, ensure you're running as Administrator if files are protected

### Can't Execute .sh Script
```bash
chmod +x cleanup-backups.sh
```

### Want to Keep Specific Backup
Rename the file to exclude "backup" from the name:
```bash
mv share-experience.backup.2025-10-15-011943.html share-experience.archive.2025-10-15.html
```

## Related Files
- `VERSION_HISTORY.md` - Detailed change log
- `cleanup-backups.sh` - Linux/macOS cleanup script
- `cleanup-backups.bat` - Windows cleanup script
- `frontend/*.backup.*.html` - HTML backups
- `backend/*.backup.*.js` - JavaScript backups
