#!/usr/bin/env node
/*
  verify-claude-sync.js
  Verifies relationship between CLAUDE.md (root) and domain_zero/CLAUDE.md

  Modes:
    - default: PASS if files are identical OR if domain_zero/CLAUDE.md is an index that points to CLAUDE.md
    - --strict: PASS only if files are byte-for-byte identical

  Exit codes:
    0 = PASS
    1 = FAIL (mismatch)
    2 = ERROR (missing files or other issue)
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function readFileAbs(p) {
  try {
    return fs.readFileSync(p);
  } catch (e) {
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const isStrict = args.includes('--strict');

  const root = path.resolve(__dirname, '..');
  const canonicalPath = path.join(root, 'CLAUDE.md');
  const dzPath = path.join(root, 'domain_zero', 'CLAUDE.md');

  const canonicalBuf = readFileAbs(canonicalPath);
  const dzBuf = readFileAbs(dzPath);

  if (!canonicalBuf || !dzBuf) {
    console.error('ERROR: Missing required files:');
    if (!canonicalBuf) console.error(`  - Not found: ${canonicalPath}`);
    if (!dzBuf) console.error(`  - Not found: ${dzPath}`);
    console.error('Ensure both files exist and try again.');
    process.exit(2);
  }

  const canonicalHash = sha256(canonicalBuf);
  const dzHash = sha256(dzBuf);

  const identical = canonicalHash === dzHash;

  if (isStrict) {
    if (identical) {
      console.log('PASS: Strict mode — files are identical.');
      process.exit(0);
    } else {
      console.error('FAIL: Strict mode — files are NOT identical.');
      console.error(`  CLAUDE.md:            ${canonicalHash}`);
      console.error(`  domain_zero/CLAUDE.md: ${dzHash}`);
      console.error('Tip: If you intend Domain Zero to be an index, run without --strict.');
      process.exit(1);
    }
  } else {
    // Non-strict: accept identical or index pattern in domain_zero file
    const dzText = dzBuf.toString('utf8');
    const hasIndexPointer = /Canonical protocol:\s*\[CLAUDE\.md\]\(\.\.\/CLAUDE\.md\)/i.test(dzText);

    if (identical) {
      console.log('PASS: Files are identical (non-strict).');
      process.exit(0);
    }

    if (hasIndexPointer) {
      console.log('PASS: Domain Zero file is an index pointing to canonical CLAUDE.md (non-strict).');
      process.exit(0);
    }

    console.error('FAIL: Non-strict mode — neither identical nor index pattern detected.');
    console.error(`  CLAUDE.md hash:            ${canonicalHash}`);
    console.error(`  domain_zero/CLAUDE.md hash: ${dzHash}`);
    console.error('Expected either:');
    console.error('  - exact content match, or');
    console.error('  - an index in domain_zero/CLAUDE.md with a "Canonical protocol" link to ../CLAUDE.md');
    process.exit(1);
  }
}

if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: node scripts/verify-claude-sync.js [--strict]');
    console.log('Default: PASS if identical OR if Domain Zero is an index.');
    console.log('--strict: PASS only if identical.');
    process.exit(0);
  }
  main();
}
