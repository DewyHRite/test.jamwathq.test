#!/bin/bash
#
# Automated Backup Cleanup Script
# Deletes backup files older than 1 day (24 hours)
# Run this script daily via cron or Task Scheduler
#
# Usage: bash cleanup-backups.sh
#

# Navigate to project root
cd "$(dirname "$0")"

echo "====================================="
echo "Backup Cleanup Script"
echo "====================================="
echo "Started at: $(date)"
echo ""

# Counter for deleted files
DELETED_COUNT=0

# Find and delete backup files older than 1 day in frontend directory
echo "Searching for backups older than 24 hours in frontend/..."
if [ -d "frontend" ]; then
    # Find .backup.*.html files older than 1 day
    while IFS= read -r -d '' file; do
        echo "Deleting: $file"
        rm "$file"
        ((DELETED_COUNT++))
    done < <(find frontend -name "*.backup.*.html" -type f -mtime +1 -print0 2>/dev/null)
fi

# Find and delete backup files older than 1 day in backend directory
echo "Searching for backups older than 24 hours in backend/..."
if [ -d "backend" ]; then
    # Find .backup.*.js files older than 1 day
    while IFS= read -r -d '' file; do
        echo "Deleting: $file"
        rm "$file"
        ((DELETED_COUNT++))
    done < <(find backend -name "*.backup.*.js" -type f -mtime +1 -print0 2>/dev/null)
fi

# Find and delete backup files older than 1 day in root directory
echo "Searching for backups older than 24 hours in root..."
while IFS= read -r -d '' file; do
    echo "Deleting: $file"
    rm "$file"
    ((DELETED_COUNT++))
done < <(find . -maxdepth 1 -name "*.backup.*" -type f -mtime +1 -print0 2>/dev/null)

echo ""
echo "====================================="
echo "Cleanup Summary"
echo "====================================="
echo "Total files deleted: $DELETED_COUNT"
echo "Completed at: $(date)"
echo ""

# Log to version history if any files were deleted
if [ $DELETED_COUNT -gt 0 ]; then
    echo "## $(date '+%Y-%m-%d %H:%M:%S') - Automatic Backup Cleanup" >> VERSION_HISTORY.md
    echo "" >> VERSION_HISTORY.md
    echo "Deleted $DELETED_COUNT backup file(s) older than 24 hours." >> VERSION_HISTORY.md
    echo "" >> VERSION_HISTORY.md
    echo "---" >> VERSION_HISTORY.md
    echo "" >> VERSION_HISTORY.md
fi

exit 0
