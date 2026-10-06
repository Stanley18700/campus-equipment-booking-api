# Submission report: Campus Equipment Booking API

Student: Stanley18700 / [student ID omitted from public copy]. Local Base API URL: http://localhost:8787/api. Live Base API URL: https://campus-equipment-booking-api.nyansintzaw.workers.dev/api. GitHub owner: Stanley18700. Exact submission links: SUBMISSION_LINKS.md.

## Design and result

Implemented the exact equipment and bookings routes from the brief with Hono/TypeScript and local D1. Two equipment records are seeded. Booking create and update validate required fields, field types, genuine UTC timestamps, equipment existence and interval ordering. Half-open intervals allow adjacent reservations. Application checks provide clear 409 responses; atomic SQL triggers enforce no overlap for both insert and update. Every request value is bound to a SQL placeholder. DELETE returns an empty 204 response.

The API contract and schema were written before the first implementation. evidence/first-version preserves that initial implementation, and QUALITY_GATE_REVIEW.md traces timestamp validation, input length limits, and database conflict protection to specific fixes and tests. The initial contract records intended behavior; the snapshot implementation had not yet implemented every validation safeguard.

## Rubric coverage

| Rubric area | Submitted evidence | Assessment limit |
|---|---|---|
| API contract / analysis (20) | API_CONTRACT.md: routes, payloads, status reasons, assumptions, response examples | Instructor assesses correctness and explanation. |
| Data design / rules (20) | schema.sql and Mermaid ERD; tests for create/update overlap, adjacency and different equipment | Student must explain the relation and overlap formula. |
| Implementation / security (25) | src/index.ts; bound SQL; validation; generic JSON error handler; atomic triggers; tsc check | Local sample contract; no unspecified authentication or frontend. |
| Testing / evidence (15) | 41 HTTP cases, 9 instructor cURL-guide cases and 8 direct SQLite cases; exact Base API URL; repeatable scripts; actual stdout and screenshots of saved-result views | Assistant execution is explicitly disclosed; student report is separate. |
| Quality Gate (10) | Initial source snapshot; five finding/action/evidence rows; audit of the eight actual checklist areas including Reliability/Accuracy and Reasoning/You Own It | Snapshot at 13:31:49 +07:00 is after minute 30 relative to 13:00; official checklist now downloaded and applied. |
| AI responsibility / ownership (10) | AI_LOG.md prompt/use/verification record; student-reported checks; OWNERSHIP_GUIDE.md | Independent understanding must be confirmed by the student, not by AI. |

## Evidence and reproducibility

TEST_RESULTS.md summarizes the real HTTP run. evidence/http-results.json retains detailed requests, statuses and responses. CURL_TEST_RESULTS.md and evidence/curl-console.txt report the nine exact guide cases executed with Windows curl.exe. evidence/curl-results.json preserves response headers/bodies. Four screenshots are browser captures of read-only views of this saved evidence, not terminal-application captures. evidence/database-results.json verifies the same schema's triggers/constraints using an isolated SQLite database. evidence/typecheck.txt records compiler verification. evidence/package-verification.json and evidence/final-package-audit.json record an earlier extracted archive before the root information endpoint and Cloudflare binding were added. The final deployed source hash and 50 live test results are recorded in evidence/cloudflare/deployment.json and CLOUDFLARE_TEST_RESULTS.md. This is not a claim that npm installation on a fresh machine was tested.

The source ZIP excludes node_modules and the working D1 database. Install dependencies from package.json, initialize schema.sql, then run locally according to README.md. The instructor starter was unavailable, so this is a standalone project following the specified course stack. The checklist and cURL guide were later downloaded directly through Teams from the instructor's 09_Midterm_Exam post; original files are now included and applied. No instructor checklist contents or historical timestamp were fabricated. The Quality Gate decision is REVIEW WITH INSTRUCTOR for checkpoint treatment; final personal ownership and the final-five-minute student review are not completed by AI.

## What to submit

Submit the GitHub repository and Cloudflare Worker links in SUBMISSION_LINKS.md, as required by the instructor's later instruction reported by the student. The public repository belongs to Stanley18700 and omits the student ID, course email and identity-labelled screenshots. The optional campus-equipment-booking-submission.zip retains the identified documents, screenshots, source, configuration, schema/ERD, contract, README, AI log, Quality Gate review, live and local test evidence and first version. No slides or frontend are required. This report does not certify full marks or perform the LMS submission.

