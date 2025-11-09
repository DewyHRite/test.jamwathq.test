# Backup & Rollback Protocol - Quick Reference

**Protocol Version**: 2.0
**Enforced**: 2025-11-04
**Canonical Source**: `domain_zero/CLAUDE.md` Section 4

---

## 🔴 CRITICAL RULE

**ALL Yuuji implementations MUST create a local backup BEFORE making any code changes.**

**Megumi NEVER needs backup** because Megumi NEVER modifies code. Megumi's role is 100% READ-ONLY auditing and documentation. Only Yuuji implements fixes.

No exceptions. No shortcuts. Yuuji: backup first, code second.

---

## Quick Backup Checklist (YUUJI ONLY)

Before Yuuji touches ANY code:

```
☐ 1. Identify files that will be modified
☐ 2. Create timestamped backup directory
☐ 3. Copy affected files to backup directory
☐ 4. Verify backup integrity
☐ 5. Document backup location in session notes
☐ 6. ONLY THEN proceed with changes
```

---

## Backup Command Template

```bash
# Create backup directory
mkdir -p backup/[feature-name]-$(date +%Y%m%d)

# Copy files (example)
cp frontend/index.html backup/[feature-name]-20251104/
cp frontend/scripts/auth.js backup/[feature-name]-20251104/
cp frontend/styles/modal.css backup/[feature-name]-20251104/

# Create manifest
cat > backup/[feature-name]-20251104/BACKUP_MANIFEST.md << 'EOF'
# Backup Manifest

**Created**: 2025-11-04 16:00
**Session**: [Yuuji/Megumi] - [Task description]
**Branch**: [branch-name]
**Purpose**: [Why this backup was created]

## Files Backed Up

- `frontend/index.html` - Main page structure
- `frontend/scripts/auth.js` - Authentication logic
- `frontend/styles/modal.css` - Modal styling

## Restore Instructions

To restore:
\`\`\`bash
cp backup/[feature-name]-20251104/* [original-locations]/
\`\`\`
EOF
```

---

## Backup Naming Convention

```
backup/[feature-or-fix-description]-[YYYYMMDD]/
```

**Examples**:
- `backup/modal-standardization-20251104/`
- `backup/xss-security-fixes-20251104/`
- `backup/agency-ranking-update-20251104/`
- `backup/auth-flow-refactor-20251104/`

---

## When to Rollback

Immediate rollback required if:

- ❌ Critical bugs introduced
- ❌ Security vulnerabilities created
- ❌ Site functionality breaks
- ❌ Data loss or corruption occurs
- ❌ User experience severely degraded
- ❌ Tests fail after implementation
- ❌ Performance severely degrades
- ❌ Authentication breaks

---

## Rollback Quick Command

```bash
# Option 1: File-level rollback (preferred)
cp backup/[feature-name]-20251104/[file] [original-path]

# Option 2: Git-level rollback
git revert [commit-hash]

# Option 3: Full directory rollback
cp -r backup/[feature-name]-20251104/* [original-location]/
```

---

## Rollback Verification

After rollback, ALWAYS verify:

```
☐ Test core functionality
☐ Run test suite
☐ Verify no regressions
☐ Check error logs
☐ Confirm user-facing features work
☐ Test authentication flow
☐ Verify database connections
```

---

## Rollback Documentation

Create `docs/ROLLBACK_[YYYY-MM-DD]_[HH-MM].md`:

```markdown
# Rollback Report

**Date**: 2025-11-04 16:30
**Session**: Yuuji
**Feature Rolled Back**: Modal standardization v3
**Backup Used**: `backup/modal-standardization-20251104/`

## Reason for Rollback

[What went wrong]

## Issues Encountered

1. [Issue 1]
2. [Issue 2]

## Rollback Actions Taken

1. [Action 1]
2. [Action 2]

## System State After Rollback

**Status**: Stable
**Functionality**: Restored
**Data Integrity**: Verified

## Lessons Learned

[What to avoid next time]

## Next Steps

1. [Corrective action 1]
2. [Corrective action 2]
```

---

## Backup Retention Policy

- **Active Development**: Keep last 30 days
- **Pre-Production**: Keep last 60 days
- **Critical Features**: Archive permanently
- **Security Fixes**: Archive permanently

---

## Automated Cleanup

```bash
# Windows (PowerShell)
Get-ChildItem backup\ -Directory | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item -Recurse -Force

# Linux/Mac
find backup/ -type d -mtime +30 -exec rm -rf {} \;

# Or use provided script
./cleanup-backups.sh --days 30 --dry-run
```

---

## Integration with Yuuji/Megumi

### Yuuji (Implementation) Checklist

**BEFORE** starting implementation:

```
☐ Read project-state.json
☐ Read dev-notes.md
☐ Understand task requirements
☐ CREATE LOCAL BACKUP ⚠️ MANDATORY
☐ Check for related tests
☐ Plan implementation approach
```

### Megumi (Security) Checklist

**BEFORE** starting review:

```
☐ Read project-state.json
☐ Understand scope of review
☐ Identify security-critical areas
☐ Review recent changes
☐ Prepare audit documentation
```

**CRITICAL**: Megumi NEVER creates backups because Megumi NEVER modifies code. Megumi's role is 100% READ-ONLY auditing and documentation. All code fixes are implemented by Yuuji in a separate session.

---

## Emergency Rollback

If critical production issue:

1. **STOP** all deployments immediately
2. **IDENTIFY** the last known good backup
3. **EXECUTE** rollback procedure
4. **VERIFY** system stability
5. **NOTIFY** stakeholders
6. **DOCUMENT** incident
7. **PLAN** corrective action

---

## Testing Your Backup/Rollback Process

**Periodic Drills** (monthly recommended):

```bash
# 1. Create test backup
mkdir backup/test-drill-$(date +%Y%m%d)
cp test-file.js backup/test-drill-$(date +%Y%m%d)/

# 2. Make intentional breaking change
echo "// BREAK" >> test-file.js

# 3. Execute rollback
cp backup/test-drill-$(date +%Y%m%d)/test-file.js .

# 4. Verify restoration
diff test-file.js backup/test-drill-$(date +%Y%m%d)/test-file.js

# 5. Document drill results in docs/BACKUP_DRILL_[date].md
```

---

## Common Mistakes to Avoid

1. ❌ **Skipping backup** "because it's a small change"
   - ✅ **Always backup** - even one-line changes can break things

2. ❌ **Creating backup after changes**
   - ✅ **Backup BEFORE** - that's the whole point

3. ❌ **Not documenting what was backed up**
   - ✅ **Always create BACKUP_MANIFEST.md**

4. ❌ **Deleting backups too quickly**
   - ✅ **Follow retention policy** - keep 30+ days

5. ❌ **Not testing rollback procedure**
   - ✅ **Run periodic drills** - verify it works

6. ❌ **Backing up compiled/generated files**
   - ✅ **Backup source only** - not node_modules, dist, etc.

---

## Files to Always Backup

### High Priority (Always backup)
- `frontend/index.html`
- `frontend/scripts/*.js`
- `frontend/styles/*.css`
- `backend/routes/*.js`
- `backend/models/*.js`
- `backend/middleware/*.js`
- `backend/server.js`
- `docs/project-state.json`
- `docs/dev-notes.md`

### Medium Priority (Backup if modifying)
- Configuration files (.env templates, config/*.js)
- Documentation files
- Test files

### Low Priority (Usually don't backup)
- `node_modules/`
- Generated files (build output)
- Cache files
- Log files

---

## Backup Storage Location

**Primary**: `backup/` directory in project root

**Structure**:
```
backup/
├── feature-1-20251101/
│   ├── BACKUP_MANIFEST.md
│   ├── file1.js
│   └── file2.html
├── feature-2-20251102/
│   ├── BACKUP_MANIFEST.md
│   └── file3.css
└── VERSION_HISTORY.log
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2025-11-04 | Mandatory backup protocol enforced |
| 1.0 | 2025-10-01 | Initial backup guidelines |

---

## Additional Resources

- **Full Protocol**: See `domain_zero/CLAUDE.md` for complete protocol
- **Backup System**: See `docs/BACKUP_SYSTEM.md` for automated backup tools
- **Project State**: Check `docs/project-state.json` for current state
- **Dev Notes**: Check `docs/dev-notes.md` for recent changes

---

**Remember**: A minute spent on backup saves hours of recovery time.

**Motto**: "Backup first, code second, rollback ready."

---

*This is a quick reference. For complete protocol, see `domain_zero/CLAUDE.md` Section 4.*
