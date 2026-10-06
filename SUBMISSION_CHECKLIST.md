# Submission checklist

The instructor later requested **a GitHub repository link and a Cloudflare deployment link**, superseding the earlier local-only delivery advice. Submit the two URLs in SUBMISSION_LINKS.md through Teams. The campus-equipment-booking-submission.zip archive is an optional supplementary attachment containing the same source and evidence. Do not upload Assignment 1.

Before uploading:
- Name and student ID are recorded in AI_LOG.md.
- Review the recorded student-reported checks for accuracy. Independent understanding and any unconfirmed checks must be supplied by the student; assistant test evidence is included separately.
- The newly supplied quality_gate.md and curl_test_guide.md are included and applied. Review the checklist yourself in the final five minutes before actual submission; confirm the checkpoint treatment with the instructor.
- Regenerate the ZIP after edits: `powershell -File package-submission.ps1` from this folder.
- Confirm the uploaded attachment is the latest ZIP, then submit through the LMS.
- Include both final public URLs; a ZIP alone does not fulfill the later link requirement.

The ZIP includes:
- src/index.ts, package.json, tsconfig.json, wrangler.jsonc: runnable code and configuration.
- schema.sql: equipment seeds, relationship, constraints and overlap triggers.
- README.md: local setup, run and test instructions; Base API URL.
- API_CONTRACT.md: endpoints, payloads, statuses, assumptions and ERD.
- AI_LOG.md: transparent assistance record and student verification section.
- QUALITY_GATE_REVIEW.md: findings, fixes, evidence and checkpoint limitation.
- TEST_RESULTS.md and evidence/: real HTTP responses, direct database results, typecheck evidence and first-version source snapshot.
- tests/: repeatable HTTP and SQLite checks.
- OWNERSHIP_GUIDE.md: explanation preparation.
- Supplied exam_brief_en.md and rubric_en.md for reference.
- Supplied quality_gate.md and curl_test_guide.md, plus CURL_TEST_RESULTS.md and fresh cURL stdout/screenshots in evidence/.

The ZIP excludes dependencies and generated local database files; a fresh machine must run npm install and initialize the schema. The laptop version reuses existing installed packages locally.

The screenshot says due today at **16:00 (6 October 2026)** and allows multiple submissions. It also displays 13:00–16:00, while the brief says 120 minutes and the earlier announcement says 13:00–17:00. Use the LMS deadline shown and confirm any discrepancy with the instructor. This preparation does not submit to the LMS on your behalf.

The pre-30-minute checkpoint requirement is not fully satisfied: the available initial snapshot is timestamped 13:31:49 Bangkok time. Preserve that honest record.
