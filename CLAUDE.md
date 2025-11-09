# DOMAIN ZERO: THE INFINITE PROTOCOL (Index)

This Domain Zero index points to the live, canonical protocol document used by the project.

- **Canonical protocol**: [domain_zero/protocol/CLAUDE.md](domain_zero/protocol/CLAUDE.md)
- **Purpose**: Single source of truth for all AI operational protocols
- **Location**: `C:\Users\Dewy\OneDrive\Documents\JamWatHQ\Full Codebase\domain_zero\protocol\CLAUDE.md`

## Quick Navigation

The full protocol includes:
- **Domain Zero Concept & Philosophy** → see `domain_zero/protocol/CLAUDE.md`
- **Three-Tier Workflow System (v7.1.0)** → see `domain_zero/protocol/CLAUDE.md`
  - Tier 1 (Rapid): 10-15 min, no tests
  - Tier 2 (Standard): 30-45 min, test-first + security [DEFAULT]
  - Tier 3 (Critical): 60-90 min, enhanced security + multi-model review
- **CLAUDE.md Protection Protocol** → see `domain_zero/protocol/CLAUDE.md`
- **Backup & Rollback Protocol (MANDATORY)** → see `domain_zero/protocol/CLAUDE.md`
- **Trigger 19 Intelligence System** → see `domain_zero/protocol/CLAUDE.md`
- **Dual Workflow and Isolation Boundaries** → see `domain_zero/protocol/CLAUDE.md`
- **Mask Mode System** → see `protocol.config.yaml`
- **Quick Start Guide** → see `PROTOCOL_QUICKSTART.md`

## Protocol Files

- **CLAUDE.md** - Main protocol (this index points here)
- **YUUJI.md** - Implementation specialist protocol → `domain_zero/protocol/YUUJI.md`
- **MEGUMI.md** - Security analyst protocol → `domain_zero/protocol/MEGUMI.md`
- **NOBARA.md** - Creative strategy & UX protocol → `domain_zero/protocol/NOBARA.md`
- **GOJO.md** - Mission control protocol → `domain_zero/protocol/GOJO.md`
- **TIER-SELECTION-GUIDE.md** - Quick tier reference → `domain_zero/protocol/TIER-SELECTION-GUIDE.md`

## Maintenance Note

- **All edits** to the protocol must be made in `domain_zero/protocol/CLAUDE.md`
- This index file should remain a lightweight pointer
- Configuration settings are in `protocol.config.yaml`
- Only USER or Gojo (with USER authorization) can modify CLAUDE.md

## Verification

```bash
# Default check (accepts this index pattern)
npm run verify:claude

# Strict check (requires byte-for-byte identical content)
npm run verify:claude:strict
```

## Recent Updates

**Version 7.1.0 (2025-11-08)** - MINOR UPDATE:
- ✅ Mask Mode - Toggle between JJK-themed personality and professional mode
- ✅ protocol.config.yaml - Canonical single-source-of-truth configuration
- ✅ PROTOCOL_QUICKSTART.md - 2-minute express setup guide
- ✅ Enhanced GitHub Copilot integration support
- ✅ Improved protocol state management templates
- ✅ Updated all agent protocols with enhanced safety features

**Version 6.2.1 (2025-11-06)** - PATCH UPDATE:
- ✅ Interactive Work Session Alerts with user choice (Save/Continue)
- ✅ Enhanced Gojo enforcement and wellbeing monitoring
- ✅ Improved session duration tracking with escalating intervals
- ✅ Added configurable alert thresholds in protocol.config.yaml
- ✅ Enhanced safety principles and version control enforcement
