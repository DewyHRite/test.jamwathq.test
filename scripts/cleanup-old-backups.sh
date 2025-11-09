#!/bin/bash
# Auto-delete backups older than 1 day
# Run this script periodically (e.g., via cron job or Task Scheduler)
#
# Usage: ./scripts/cleanup-old-backups.sh
# Or add to crontab: 0 0 * * * /path/to/cleanup-old-backups.sh

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"

echo "================================================"
echo "JamWatHQ - Backup Cleanup Script"
echo "================================================"
echo "Date: $(date)"
echo "Backup Directory: $BACKUP_DIR"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

# Count existing backups
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -maxdepth 1 -type d ! -path "$BACKUP_DIR" | wc -l)
echo "📦 Total backups found: $TOTAL_BACKUPS"

if [ "$TOTAL_BACKUPS" -eq 0 ]; then
    echo "✅ No backups to clean up"
    exit 0
fi

# Find and delete backups older than 1 day
echo ""
echo "🔍 Searching for backups older than 1 day..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -maxdepth 1 -type d -mtime +1 ! -path "$BACKUP_DIR")

if [ -z "$OLD_BACKUPS" ]; then
    echo "✅ No old backups found (all backups are less than 1 day old)"
    exit 0
fi

# Count old backups
OLD_COUNT=$(echo "$OLD_BACKUPS" | wc -l)
echo "🗑️  Found $OLD_COUNT old backup(s) to delete:"
echo ""

# Display backups to be deleted
echo "$OLD_BACKUPS" | while read -r backup; do
    BACKUP_NAME=$(basename "$backup")
    BACKUP_AGE=$(find "$backup" -maxdepth 0 -mtime +1 -printf "%Td days\n")
    BACKUP_SIZE=$(du -sh "$backup" | cut -f1)
    echo "  - $BACKUP_NAME (Age: $BACKUP_AGE, Size: $BACKUP_SIZE)"
done

echo ""
echo "🗑️  Deleting old backups..."

# Delete old backups
DELETED_COUNT=0
echo "$OLD_BACKUPS" | while read -r backup; do
    if [ -d "$backup" ]; then
        rm -rf "$backup"
        if [ $? -eq 0 ]; then
            BACKUP_NAME=$(basename "$backup")
            echo "  ✅ Deleted: $BACKUP_NAME"
            ((DELETED_COUNT++))
        else
            BACKUP_NAME=$(basename "$backup")
            echo "  ❌ Failed to delete: $BACKUP_NAME"
        fi
    fi
done

echo ""
echo "================================================"
echo "✅ Cleanup completed"
echo "📦 Backups deleted: $OLD_COUNT"
echo "📦 Backups remaining: $((TOTAL_BACKUPS - OLD_COUNT))"
echo "================================================"

# Optional: Log to file
LOG_FILE="$PROJECT_ROOT/logs/backup-cleanup.log"
mkdir -p "$(dirname "$LOG_FILE")"
echo "[$(date)] Deleted $OLD_COUNT old backup(s)" >> "$LOG_FILE"

exit 0
