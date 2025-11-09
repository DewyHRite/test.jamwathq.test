# Protocol State Directory

**Domain Zero Protocol v6.2.1**
**Created**: 2025-11-06

---

## Purpose

This directory contains the **canonical state files** for Domain Zero Protocol (DZP). All agents (Yuuji, Megumi, Nobara, Gojo) read and write to these files for session continuity and protocol enforcement.

---

## File Structure

```
.protocol-state/
├── README.md                  # This file
├── project-state.json         # CANONICAL project state (v6.2.1)
├── dev-notes.md              # Implementation log (Yuuji)
├── security-review.md        # Security findings (Megumi)
└── trigger-19.md             # Intelligence reports (Gojo) [PRIVATE]
```

---

## Canonical State File

**📍 CANONICAL LOCATION**: `.protocol-state/project-state.json`

This is the **single source of truth** for Domain Zero Protocol v6.2.1.

### Other project-state.json Files

The codebase contains older versions of project-state.json:

| Location | Version | Status | Purpose |
|----------|---------|--------|---------|
| `.protocol-state/project-state.json` | **v6.2.1** | **CANONICAL** | Domain Zero active state |
| `docs/project-state.json` | v6.0 | DEPRECATED | Pre-DZP v6.2.1 state |
| `project-state.json` (root) | v4.5 | DEPRECATED | Legacy state |
| `backup/*/project-state.json` | Various | ARCHIVED | Historical backups |

**⚠️ IMPORTANT**: Only `.protocol-state/project-state.json` should be modified by agents. Other files are kept for historical reference only.

---

## File Descriptions

### project-state.json (CANONICAL)
**Purpose**: Complete project state and configuration
**Updated By**: All agents (Yuuji, Megumi, Nobara, Gojo)
**Schema Version**: v6.2.1

Contains:
- Protocol version
- Project metadata
- Tier usage statistics
- Custom triggers
- Mission status
- Passive monitoring config
- CLAUDE.md protection status
- Current state indicators
- Open security issues

### dev-notes.md
**Purpose**: Development session log
**Updated By**: Yuuji (Implementation), Gojo (Mission Control)
**Format**: Markdown with timestamped entries

Contains:
- Session logs with timestamps
- Actions taken
- Files modified
- Backup locations
- Status tags (@user-review, @security-review, @approved)
- Next steps

### security-review.md
**Purpose**: Security audit findings and remediation tracking
**Updated By**: Megumi (Security Analyst)
**Format**: Markdown with SEC-ID tracking

Contains:
- Security findings with severity levels
- OWASP Top 10 coverage
- Remediation recommendations
- Security scores
- Verification status

### trigger-19.md
**Purpose**: Intelligence reports and passive observations
**Updated By**: Gojo (Mission Control)
**Privacy**: GITIGNORED, local only
**Retention**: 14 days (auto-cleanup)

Contains:
- Executive intelligence briefs
- Agent performance analysis
- Strategic recommendations
- Protocol compliance metrics
- Brutally honest assessments

---

## Access Control

| File | Yuuji | Megumi | Nobara | Gojo | User |
|------|-------|--------|--------|------|------|
| project-state.json | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W | ✅ R/W |
| dev-notes.md | ✅ R/W | ✅ R | ✅ R | ✅ R/W | ✅ R/W |
| security-review.md | ✅ R | ✅ R/W | ✅ R | ✅ R/W | ✅ R/W |
| trigger-19.md | ❌ N/A | ❌ N/A | ❌ N/A | ✅ R/W | ✅ R/W |

**Note**: Yuuji and Megumi are **unaware** of trigger-19.md existence. Only Gojo and User access this file.

---

## Privacy & Gitignore

**trigger-19.md is automatically gitignored** to protect privacy:

```bash
# .gitignore
.protocol-state/trigger-19.md
```

This ensures intelligence reports stay private to your local machine.

---

## Data Retention

- **project-state.json**: Permanent (version controlled)
- **dev-notes.md**: Permanent (version controlled)
- **security-review.md**: Permanent (version controlled)
- **trigger-19.md**: 14 days auto-cleanup (gitignored)

---

## Session Workflow

### Starting a Session
1. Agent reads `project-state.json` for current state
2. Agent reads `dev-notes.md` for recent changes
3. Megumi also reads `security-review.md` for open issues
4. Agent displays current state indicator
5. Agent awaits user instructions

### During a Session
1. Agent performs work
2. Updates relevant files in real-time
3. Tags work appropriately (@user-review, @security-review)
4. Creates backups before modifications

### Ending a Session
1. Agent updates `dev-notes.md` with summary
2. Agent updates `project-state.json` with new state
3. Agent commits changes (if applicable)
4. Agent creates handoff notes for next session

---

## Backup Protocol

Before **ANY** code changes, agents must:
1. Create timestamped backup: `backup/[feature]-YYYYMMDD/`
2. Copy all affected files to backup directory
3. Create `BACKUP_MANIFEST.md`
4. Document backup location in `dev-notes.md`

This is **MANDATORY** for all Yuuji and Megumi sessions.

---

## Quick Commands

```bash
# View canonical state
cat .protocol-state/project-state.json

# View recent development activity
tail -50 .protocol-state/dev-notes.md

# View open security issues
grep "Status: OPEN" .protocol-state/security-review.md

# Invoke intelligence report
# In chat: "Read GOJO.md - Trigger 19"
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.2.1 | 2025-11-06 | Domain Zero v6.2.1 initialization, canonical state structure created |

---

**Domain Zero Protocol Active**
**"Infinite Collaboration, Zero Defects"**
