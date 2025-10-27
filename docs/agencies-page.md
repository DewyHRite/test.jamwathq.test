# Agencies Page Deployment Sync Audit

**Date:** October 27, 2025  \
**Branch:** `backup/agencies-sync-20251027`

---

## Summary
- GitHub Pages continued serving an outdated `agencies.html` even after local testing showed new content.
- Local edits were made inside `Main/Live Code v.1/Code/`, a directory excluded by the repository root `.gitignore`.
- The tracked production file at the repository root (`agencies.html`) was never updated, so deploys remained unchanged.

---

## Root Cause Analysis
- `.gitignore` rule: `Main/` excludes the entire archived working directory from version control.
- Command verification:
  ```pwsh
  git check-ignore -v "Main/Live Code v.1/Code/agencies.html"
  # .gitignore:172:Main/    Main/Live Code v.1/Code/agencies.html
  ```
- GitHub Pages is configured to deploy from the repository root `main` branch (static files such as `CNAME`, `index.html`, `agencies.html` live at the top level). Pages therefore never sees files stored under the ignored archive directory.

---

## Fix Applied
1. Copied the verified local build from `Main/Live Code v.1/Code/frontend/agencies.html` to the tracked root `agencies.html`.
2. Retained inline tooling comment for auditing and expanded it to point to this document:
   ```html
   <!-- Past Reviews Toggle Script -->
   <script>
     // See docs/agencies-page.md for commit timestamp audit and sync details
   ```
3. Prepared new documentation (this file) summarising the discrepancy, remediation, and verification steps.

---

## Verification
- Working tree diff confirms the root file changed:
  ```pwsh
  git status -sb
  # M agencies.html
  ```
- Hash comparison after overwrite (PowerShell):
  ```pwsh
  (Get-FileHash "agencies.html" -Algorithm MD5).Hash.ToLower()
  # 2372f87a785b7e83d88bea62c5544e98
  ```
- Remote reference hash prior to fix (for historical comparison):
  ```pwsh
  Invoke-WebRequest "https://raw.githubusercontent.com/DewyHRite/test.jamwathq.test/main/agencies.html" -UseBasicParsing \
    | Select-Object -ExpandProperty Content \
    | % { [System.BitConverter]::ToString([System.Security.Cryptography.MD5]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($_))).Replace("-","").ToLower() }
  # dcb5003b43fcf43c8fdef382cdc134a9
  ```
- Post-deploy validation (to run after push):
  ```text
  https://dewyhrite.github.io/test.jamwathq.test/agencies.html?v=202510270130
  ```
  Expect the refreshed page to display all recent UI changes seen locally.

---

## Evidence To Capture
- Screenshot: GitHub Pages deploy history showing new commit (add to `docs/screenshots/agencies-sync-20251027/`).
- Screenshot: Updated agencies page rendered from Pages after cache-busting query string.

---

## Next Steps
1. Commit with message `Sync agencies.html updates to main branch root for deployment`.
2. Push to `test.jamwathq.test` `main` and wait for GitHub Pages build to finish.
3. Re-verify the live URL with cache busting and attach evidence.
4. Archive older working copy under `Main/` as a reference only; continue editing tracked root files for future deploys.
