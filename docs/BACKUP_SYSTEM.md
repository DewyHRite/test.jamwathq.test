# Backup Management System

## Overview
The JamWatHQ project uses a streamlined backup management system that prevents clutter while maintaining rollback safety. This document explains the backup workflow, tools, and best practices.

---

## Core Principles

### 1. **Overwrite, Don't Accumulate**
- Each file has **ONE** backup at any time
- Creating a new backup overwrites the previous one
- Uses consistent naming: `filename.backup.ext`

### 2. **Automatic Cleanup**
- Periodically removes excess timestamped backups
- Keeps only the most recent backup per file
- No manual intervention needed

### 3. **Version History Integration**
- Single `VERSION_HISTORY.md` tracks all changes
- Each backup operation logs:
  - Timestamp
  - Files affected
  - Summary of changes
  - Rollback instructions

---

## Backup Manager Tool

### Location
`backup-manager.sh` (project root)

### Commands

#### Create Backup
```bash
bash backup-manager.sh create <file1> [file2] [file3] ...
```

**Behavior:**
- Checks if backup exists
- If exists: Overwrites with warning message
- If not: Creates new backup
- Uses naming convention: `filename.backup.ext`

**Example:**
```bash
# First time - creates new backup
bash backup-manager.sh create frontend/agencies.html
# Output: ✓ Creating new backup: frontend/agencies.backup.html

# Second time - overwrites existing
bash backup-manager.sh create frontend/agencies.html
# Output: ⚠ Backup exists, overwriting: frontend/agencies.backup.html
```

#### Cleanup Excess Backups
```bash
bash backup-manager.sh cleanup [directory]
```

**Behavior:**
- Scans directory for backup files
- Groups backups by base filename
- Keeps newest, deletes all others
- Reports number of files deleted

**Example:**
```bash
bash backup-manager.sh cleanup frontend
# Output:
# Found 4 backups for pattern: ./frontend/share-experience.backup*html
#   Keeping newest: ./frontend/share-experience.backup.2025-10-15-021654.html
#   Deleting old: ./frontend/share-experience.backup.2025-10-15-011943.html
#   Deleting old: ./frontend/share-experience.backup.2025-10-15-013537.html
#   Deleting old: ./frontend/share-experience.backup.2025-10-15-014925.html
# Total excess backups deleted: 4
```

#### List All Backups
```bash
bash backup-manager.sh list [directory]
```

**Output:**
- File path
- Size
- Last modified timestamp
- Total count

**Example:**
```bash
bash backup-manager.sh list
# Output:
# ./frontend/agencies.backup.html
#   Size: 920K | Modified: 2025-10-15 02:16:29
# Total backups: 7
```

#### Restore from Backup
```bash
bash backup-manager.sh restore <backup_file>
```

**Behavior:**
- Determines original filename
- Prompts for confirmation
- Overwrites current file with backup

**Example:**
```bash
bash backup-manager.sh restore frontend/agencies.backup.html
# Output:
# Restoring: frontend/agencies.html
# From backup: frontend/agencies.backup.html
# Are you sure? (y/N):
```

---

## Naming Conventions

### Standard Backup Format
```
<filename>.backup.<extension>
```

**Examples:**
- `agencies.html` → `agencies.backup.html`
- `agencies.js` → `agencies.backup.js`
- `VERSION_HISTORY.md` → `VERSION_HISTORY.backup.md`

### Legacy Format (Timestamped)
```
<filename>.backup.<timestamp>.<extension>
```

**Examples:**
- `agencies.backup.2025-10-15-021628.html`
- `share-experience.backup.2025-10-15-021654.html`

**Note:** Cleanup script removes these in favor of single backup per file.

---

## Workflow Integration

### Before Making Changes
```bash
# Create backup of file(s) you're about to modify
bash backup-manager.sh create frontend/agencies.html frontend/share-experience.html
```

### After Multiple Changes
```bash
# Clean up any excess backups
bash backup-manager.sh cleanup
```

### To Rollback
```bash
# List available backups
bash backup-manager.sh list

# Restore specific file
bash backup-manager.sh restore frontend/agencies.backup.html
```

---

## Automated Cleanup Script

### Legacy Cleanup Script
`cleanup-backups.sh` - Deletes backups older than 24 hours

**When to use:**
- After major development sessions
- Before commits
- Weekly maintenance

**Command:**
```bash
bash cleanup-backups.sh
```

**Behavior:**
- Searches `frontend/`, `backend/`, and root
- Deletes files older than 24 hours
- Reports deletion count

---

## Version History Integration

Every backup operation should be logged in `VERSION_HISTORY.md`:

### Entry Template
```markdown
## YYYY-MM-DD HH:MM:SS - Change Summary

### Summary
Brief description of what changed

### Files Changed
1. **path/to/file.ext**
   - What was changed
   - Why it was changed

### Backup Information
- Backup created: path/to/file.backup.ext
- Backup system: Overwrite mode (single backup per file)
- Timestamp: YYYY-MM-DD HH:MM:SS

### Rollback Steps
```bash
bash backup-manager.sh restore path/to/file.backup.ext
```

### Testing Required
- [ ] Test item 1
- [ ] Test item 2

---
```

---

## Best Practices

### ✅ DO

1. **Create backup before every file modification**
   ```bash
   bash backup-manager.sh create frontend/agencies.html
   # Make your changes
   # Test changes
   ```

2. **Run cleanup after development sessions**
   ```bash
   bash backup-manager.sh cleanup
   ```

3. **Document changes in VERSION_HISTORY.md**
   - Include rollback instructions
   - List all affected files

4. **Use consistent naming**
   - Standard format: `filename.backup.ext`
   - No custom suffixes or timestamps

5. **Test rollback before major changes**
   ```bash
   # Create backup
   bash backup-manager.sh create test.html
   # Make test change
   echo "test" >> test.html
   # Restore
   bash backup-manager.sh restore test.backup.html
   ```

### ❌ DON'T

1. **Don't create manual backups with custom names**
   - ❌ `agencies-old.html`
   - ❌ `agencies-v2.html`
   - ✅ Use backup manager instead

2. **Don't accumulate backups**
   - ❌ Keeping 5+ backups per file
   - ✅ Let system overwrite/cleanup

3. **Don't skip version history updates**
   - ❌ Making changes without logging
   - ✅ Always update VERSION_HISTORY.md

4. **Don't delete backups manually**
   - ❌ `rm *.backup.*`
   - ✅ Use `backup-manager.sh cleanup`

---

## Troubleshooting

### Problem: Backup file not found
**Symptom:** `Error: Backup file 'X' does not exist`

**Solution:**
```bash
# List all backups to find correct name
bash backup-manager.sh list

# Create backup if missing
bash backup-manager.sh create <original_file>
```

### Problem: Multiple backups for same file
**Symptom:** Too many `.backup.` files in directory

**Solution:**
```bash
# Run cleanup to consolidate
bash backup-manager.sh cleanup

# Verify only one backup per file remains
bash backup-manager.sh list
```

### Problem: Cannot determine original filename
**Symptom:** `Error: Cannot determine original filename from backup`

**Solution:**
Backup filename doesn't match pattern. Rename manually:
```bash
# Standard format
mv frontend/agencies-backup.html frontend/agencies.backup.html
```

### Problem: Backup overwrites too aggressively
**Symptom:** Need to preserve multiple backup versions

**Solution:**
For critical changes, use timestamped backups manually:
```bash
# Create manual timestamped backup
cp frontend/agencies.html "frontend/agencies.backup.$(date +%Y-%m-%d-%H%M%S).html"

# Then use standard backup manager
bash backup-manager.sh create frontend/agencies.html
```

---

## Maintenance Schedule

### Daily (During Active Development)
- Create backups before file modifications
- Test changes thoroughly

### Weekly
- Run cleanup script: `bash backup-manager.sh cleanup`
- Verify VERSION_HISTORY.md is up to date
- Review and clean old timestamped backups

### Monthly
- Audit backup count: `bash backup-manager.sh list`
- Review rollback procedures
- Archive old version history entries if needed

---

## Migration from Legacy System

If you have many timestamped backups from the old system:

### Step 1: List Current Backups
```bash
bash backup-manager.sh list
```

### Step 2: Run Cleanup
```bash
bash backup-manager.sh cleanup
```

### Step 3: Standardize Remaining Backups
```bash
# For each file with a backup, create standard backup
bash backup-manager.sh create frontend/agencies.html
bash backup-manager.sh create frontend/share-experience.html
```

### Step 4: Remove Old Timestamped Backups
```bash
# After confirming standard backups exist
bash cleanup-backups.sh
```

---

## Script Permissions

Ensure scripts are executable:
```bash
chmod +x backup-manager.sh
chmod +x cleanup-backups.sh
```

---

## Summary

| Action | Command | Result |
|--------|---------|--------|
| Create backup | `backup-manager.sh create <file>` | One `.backup.` file per original |
| Overwrite backup | `backup-manager.sh create <file>` | Replaces existing backup |
| Clean excess | `backup-manager.sh cleanup` | Removes all but newest per file |
| List backups | `backup-manager.sh list` | Shows all current backups |
| Restore file | `backup-manager.sh restore <backup>` | Overwrites original with backup |

**Key Principle:** One backup per file, always. Clean, simple, safe.
