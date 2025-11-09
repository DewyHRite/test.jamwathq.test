# Backup Manifest - Protocol Update v2.1 to v6.0

**Created**: 2025-11-05
**Session**: Domain Zero Protocol Update
**Branch**: backup/tos-modal-standardization-20251103
**Purpose**: Backup before upgrading Domain Zero Protocol from v2.1 to v6.0

## Files Backed Up

- `domain_zero/CLAUDE.md` - Current protocol v2.1 (GOJO PATCH 1.0 Applied)
- `CLAUDE.md` (root) - Index file pointing to domain_zero
- `docs/project-state.json` - Current project state tracking
- `docs/dev-notes.md` - Development notes template

## Restore Instructions

To restore these files if needed:

```bash
# Restore protocol files
cp "backup/protocol-v2.1-to-v6.0-20251105/CLAUDE.md" "domain_zero/CLAUDE.md"
cp "backup/protocol-v2.1-to-v6.0-20251105/CLAUDE.md.root" "CLAUDE.md"
cp "backup/protocol-v2.1-to-v6.0-20251105/project-state.json" "docs/project-state.json"
cp "backup/protocol-v2.1-to-v6.0-20251105/dev-notes.md" "docs/dev-notes.md"
```

## Changes After Backup

Upgrading to Domain Zero v6.0 which includes:

1. **Adaptive Three-Tier Workflow System**
   - Tier 1 (Rapid): 10-15 min, no tests/security
   - Tier 2 (Standard): 30-45 min, test-first + security [DEFAULT]
   - Tier 3 (Critical): 60-90 min, enhanced testing + multi-model review

2. **New Protocol Files**
   - `domain_zero/protocol/YUUJI.md` - Implementation specialist protocol
   - `domain_zero/protocol/MEGUMI.md` - Security analyst protocol
   - `domain_zero/protocol/GOJO.md` - Mission control protocol
   - `domain_zero/protocol/TIER-SELECTION-GUIDE.md` - Tier selection reference

3. **Updated Core Protocol**
   - `domain_zero/CLAUDE.md` upgraded to v6.0
   - Maintains CLAUDE.md Protection Protocol from v2.1
   - Maintains mandatory backup & rollback procedures from v2.1
   - Maintains Trigger 19 system from v2.1

4. **Project State Updates**
   - Added tier tracking system
   - Added feature tier usage metrics
   - Enhanced monitoring configuration

## Rollback Tested

- [ ] Rollback tested successfully
- [ ] Rollback date: _____
- [ ] Rollback verified by: _____

## Notes

This backup preserves the GOJO PATCH 1.0 enhancements including the CLAUDE.md Protection Protocol with 3-tier authorization system. The v6.0 update maintains these protections while adding the adaptive tier workflow system.
