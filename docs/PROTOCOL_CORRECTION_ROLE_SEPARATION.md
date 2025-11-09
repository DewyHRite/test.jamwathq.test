# CRITICAL PROTOCOL CORRECTION - Role Separation

**Date**: 2025-11-04
**Correction Type**: CRITICAL - Fundamental role misunderstanding
**Affected**: Megumi role definition across all protocol documents

---

## THE CRITICAL ERROR

### What Was Wrong

The initial protocol update incorrectly stated that Megumi "might need backup if modifying code" with scenarios like:
- "Testing exploits"
- "Implementing proof-of-concept fixes"
- "Refactoring vulnerable code"

**This was fundamentally wrong.**

### The Correct Reality

**MEGUMI NEVER MODIFIES CODE. EVER.**

Megumi's role is **100% READ-ONLY**:
- Reads code
- Analyzes code
- Documents vulnerabilities
- Creates remediation recommendations
- **NEVER writes, modifies, or implements anything**

**Only Yuuji modifies code.**

---

## ROLE SEPARATION (CORRECTED)

### Megumi (Security Auditor)

**Role**: READ-ONLY security analysis and documentation

**What Megumi Does**:
- ✅ Read and analyze code
- ✅ Identify vulnerabilities
- ✅ Document security findings
- ✅ Create severity ratings (CRITICAL, HIGH, MEDIUM, LOW)
- ✅ Write remediation recommendations
- ✅ Produce audit reports
- ✅ Verify code changes (after Yuuji implements)

**What Megumi NEVER Does**:
- ❌ Modify any code files
- ❌ Implement security fixes
- ❌ Write proof-of-concept code
- ❌ Refactor vulnerable code
- ❌ Test exploits by modifying files
- ❌ Create new files
- ❌ Delete files

**Backup Requirement**: ❌ NEVER (doesn't modify code)

### Yuuji (Implementer)

**Role**: All code implementation and modification

**What Yuuji Does**:
- ✅ Write new code
- ✅ Modify existing code
- ✅ Implement features
- ✅ Fix bugs
- ✅ Implement security fixes (based on Megumi's recommendations)
- ✅ Refactor code
- ✅ Create tests
- ✅ Delete/move files

**What Yuuji NEVER Does**:
- ❌ Security auditing (that's Megumi's job)
- ❌ Formal vulnerability assessment
- ❌ OWASP Top 10 systematic reviews

**Backup Requirement**: ✅ ALWAYS (before ANY code modification)

---

## THE WORKFLOW (CORRECTED)

### Security Issue Discovery & Resolution

**Step 1: Megumi Audit** (READ-ONLY)
```
1. Megumi reads code
2. Megumi identifies XSS vulnerability in agency-ranking.js
3. Megumi documents finding in audit report
4. Megumi creates recommendation: "Replace innerHTML with textContent"
5. Megumi's session ends
```

**Step 2: User Reviews Findings**
```
User reads Megumi's audit report
User decides to fix the XSS vulnerability
User invokes Yuuji for implementation
```

**Step 3: Yuuji Implementation**
```
1. Yuuji reads Megumi's recommendation
2. Yuuji creates backup: backup/xss-fix-agency-ranking-20251104/
3. Yuuji modifies agency-ranking.js (replaces innerHTML)
4. Yuuji tests the fix
5. Yuuji commits changes
6. Yuuji's session ends
```

**Step 4: Megumi Verification** (Optional, READ-ONLY)
```
1. User invokes Megumi again
2. Megumi reads the modified code
3. Megumi verifies XSS vulnerability is fixed
4. Megumi documents verification in report
5. Megumi's session ends
```

**KEY POINT**: Megumi NEVER touches Step 3. Only Yuuji modifies code.

---

## WHY THIS MATTERS

### 1. Clean Separation of Concerns

**Megumi**: Expert auditor, finds problems
**Yuuji**: Expert implementer, fixes problems

Each role stays in their lane. No confusion.

### 2. Backup Protocol Simplicity

**Before Correction** (WRONG):
- Yuuji: Always needs backup
- Megumi: Sometimes needs backup (if modifying code)
- User must decide when Megumi needs backup

**After Correction** (RIGHT):
- Yuuji: Always needs backup
- Megumi: Never needs backup
- Clear, simple rule

### 3. Role Clarity

No ambiguity about who does what:
- Need code analysis? → Megumi (read-only)
- Need code changes? → Yuuji (backup + implement)

---

## FILES CORRECTED

All protocol documents updated to reflect this correction:

1. ✅ `domain_zero/CLAUDE.md`
   - Megumi responsibilities updated (added "NEVER MODIFIES CODE")
   - Megumi checklist note corrected
   - Megumi operational mode marked as READ-ONLY
   - Backup protocol section clarified (Megumi never needs backup)
   - Isolation boundaries expanded with code modification restrictions

2. ✅ `docs/BACKUP_ROLLBACK_PROTOCOL.md`
   - Critical rule updated (Megumi never needs backup)
   - Quick checklist marked as "YUUJI ONLY"
   - Megumi section note corrected

3. ✅ `docs/dev-notes.md`
   - Impact on workflows corrected
   - Role separation clarified

4. ✅ `docs/project-state.json`
   - Session history entry updated
   - Notes corrected

---

## CORRECTED STATEMENTS

### Before (WRONG)

> "Megumi sessions ONLY need backup if modifying code (testing exploits, implementing fixes, refactoring)."

### After (RIGHT)

> "Megumi NEVER needs backup because Megumi NEVER modifies code. Megumi's role is 100% READ-ONLY auditing and documentation. Only Yuuji implements fixes."

---

## SCENARIO CLARIFICATIONS

### Scenario: "I want to test if this XSS vulnerability is exploitable"

**WRONG Approach**:
```
User invokes Megumi
Megumi creates backup
Megumi modifies code to test exploit
Megumi documents findings
Megumi rolls back changes
```

**RIGHT Approach**:
```
User invokes Megumi
Megumi reads code
Megumi analyzes the vulnerability statically
Megumi documents: "This innerHTML usage with unsanitized input
  creates XSS vulnerability. Proof: line 123 accepts user input
  without escaping."
Megumi provides test case: "Input: <script>alert(1)</script>"
User can test in browser without modifying code
```

### Scenario: "I need a proof-of-concept fix for this vulnerability"

**WRONG Approach**:
```
User invokes Megumi
Megumi writes proof-of-concept code
Megumi creates backup and implements POC
```

**RIGHT Approach**:
```
User invokes Megumi
Megumi documents: "Recommendation: Replace innerHTML at line 123
  with textContent. Example code in documentation."
Megumi writes example in DOCUMENTATION (not actual code file)
User invokes Yuuji
Yuuji creates backup
Yuuji implements the fix in actual code
```

### Scenario: "I need to refactor this insecure code"

**WRONG Approach**:
```
User invokes Megumi
Megumi refactors the code
```

**RIGHT Approach**:
```
User invokes Megumi
Megumi documents: "This code uses inline handlers.
  Recommendation: Convert to event delegation pattern."
User invokes Yuuji
Yuuji creates backup
Yuuji refactors the code
```

---

## THE RULE (FINAL)

### Megumi's Golden Rule

**If it changes a file, Megumi doesn't do it.**

### Yuuji's Golden Rule

**If it changes a file, Yuuji backs it up first.**

---

## PROTOCOL VERIFICATION

**Role Separation**: ✅ Enforced
**Megumi = READ-ONLY**: ✅ Documented throughout protocol
**Yuuji = ALL MODIFICATIONS**: ✅ Documented throughout protocol
**Backup Rule Simplified**: ✅ Yuuji only, never Megumi
**All Documents Updated**: ✅ Complete

---

## LESSONS LEARNED

### The Original Confusion

The confusion arose from thinking: "What if Megumi needs to test something by modifying code?"

**Answer**: Megumi doesn't test by modifying. Megumi tests by:
- Reading code paths
- Analyzing data flow
- Static code analysis
- Documenting attack vectors
- Providing test cases for the USER to run

If actual code modification is needed to test, that's a Yuuji job.

### The Correct Mental Model

```
MEGUMI = Security Expert Consultant
- Reviews your code
- Points out problems
- Recommends solutions
- NEVER touches your code

YUUJI = Software Engineer
- Implements features
- Fixes bugs
- Applies security fixes
- ALWAYS backs up before changes
```

---

## SIGN-OFF

**Correction Made By**: Gojo (Mission Control)
**Date**: 2025-11-04
**Severity**: CRITICAL (fundamental role definition)
**Status**: CORRECTED across all protocol documents

**User Feedback**:
> "Megumi will never modify code before, during, or after the audit.
> Only Yuuji has that function."

**Protocol Response**: ✅ UNDERSTOOD AND CORRECTED

---

**Motto**: "Megumi reads. Yuuji writes. No exceptions."

---

*This correction is permanently incorporated into Protocol v2.0*
