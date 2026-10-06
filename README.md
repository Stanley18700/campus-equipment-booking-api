# Campus Equipment Booking API

TypeScript/Hono API using Cloudflare D1 (SQLite). Matches the supplied equipment and booking contract. The instructor subsequently requested a GitHub repository link and a deployed Cloudflare link, so this submission includes both local execution and cloud deployment. No frontend is required.

GitHub: https://github.com/Stanley18700/campus-equipment-booking-api

Live API: https://campus-equipment-booking-api.nyansintzaw.workers.dev/api

Inspect equipment: https://campus-equipment-booking-api.nyansintzaw.workers.dev/api/equipment

## Run on this laptop now

Open PowerShell in this folder. Node.js is already available; npm is not currently on this session's PATH. Dependencies are locally linked from the existing Assignment 1 dependency installation; the midterm source and database are separate.

Shortcut: `powershell -File start-local.ps1` initializes the database and starts the API. It also locates this laptop's bundled Node.js if node is not on PATH. The longer commands below show each step separately.

Initialize the database (safe to repeat; does not delete bookings):
```powershell
$env:WRANGLER_LOG_PATH = Join-Path (Get-Location) '.wrangler/logs'
$env:WRANGLER_SEND_METRICS = 'false'
node node_modules/wrangler/bin/wrangler.js d1 execute campus-booking-db --local --file=schema.sql
```
Start the server in that terminal:
```powershell
node node_modules/wrangler/bin/wrangler.js dev --local --ip 127.0.0.1 --port 8787
```
In a second terminal in this folder:
```powershell
node node_modules/typescript/bin/tsc --noEmit
node tests/http-tests.mjs
node tests/database-tests.mjs
node tests/curl-guide-tests.mjs
```

Base API URL: **http://localhost:8787/api**. The server listens only on loopback. Stop it with Ctrl+C. If port 8787 is in use, stop your old server or change the port and set `$env:BASE_URL = 'http://localhost:8788/api'` before HTTP testing.

## Run after extracting the submission on another machine

Install Node.js 24 and npm. In the extracted folder:
```powershell
npm install
npm run db:local
npm run dev
```
In a second terminal:
```powershell
npm run typecheck
npm test
node tests/database-tests.mjs
node tests/curl-guide-tests.mjs
```
Dependencies are declared in package.json; the ZIP excludes node_modules. wrangler.jsonc contains the submitted remote database binding. Local commands use a separate local SQLite database; no Cloudflare sign-in is required for local testing. To deploy in a different account, create your own D1 database and replace database_id.

## Cloudflare deployment

For the owner account, sign in with `node node_modules/wrangler/bin/wrangler.js login`, then:
```powershell
node node_modules/wrangler/bin/wrangler.js d1 execute campus-booking-db --remote --file=schema.sql
node node_modules/wrangler/bin/wrangler.js deploy
```
The first command applies the schema and equipment seeds to remote D1. It does not delete existing bookings. The deployed Worker uses the DB binding in wrangler.jsonc. The root URL returns API information; append `/api/equipment` to inspect equipment. Exact submitted URLs and live test evidence are in SUBMISSION_LINKS.md.

## Test manually using PowerShell's HTTP client

```powershell
$base = 'http://localhost:8787/api'
Invoke-RestMethod "$base/equipment"
$payload = @{
  equipmentId = 'eq-1'
  borrowerName = 'Somchai Jaidee'
  startAt = '2026-10-20T09:00:00.000Z'
  endAt = '2026-10-20T11:00:00.000Z'
  purpose = 'Class presentation'
} | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri "$base/bookings" -ContentType 'application/json' -Body $payload
Invoke-RestMethod "$base/bookings/$($created.id)"
Invoke-RestMethod -Method Patch -Uri "$base/bookings/$($created.id)" -ContentType 'application/json' -Body '{"purpose":"Updated presentation"}'
# A repeat POST with the same interval should return HTTP 409.
# PowerShell displays an error for a non-2xx HTTP response.
Invoke-RestMethod -Method Post -Uri "$base/bookings" -ContentType 'application/json' -Body $payload
Invoke-WebRequest -Method Delete -Uri "$base/bookings/$($created.id)"
```

The automated HTTP client records actual statuses, request bodies and response bodies for 41 success/error cases in TEST_RESULTS.md and evidence/http-results.json, including CRUD, date validation, overlaps, adjacency, SQL-looking input, and simultaneous writes. Tests clean up only bookings they create. Fixed test dates in 2099 must be free. The separate SQLite tests verify the database constraints and triggers directly in memory; they never modify your D1 data. TypeScript checking passed before delivery.

The instructor's curl_test_guide.md is now included. `node tests/curl-guide-tests.mjs` executes all nine examples using Windows curl.exe and saves actual terminal output in evidence/curl-console.txt, plus detailed curl-results.json and a CURL_TEST_RESULTS.md summary. Its exact guide dates (20 October 2026, eq-1) must be available; it deletes only its own created booking. Supplementary screenshots in evidence/screenshots capture read-only browser views of saved test results, not a terminal application. The corresponding HTML views are under evidence/screenshot-pages. They never request live API data and need no CORS.

## Design and explanation

See API_CONTRACT.md for routes, status codes, assumptions and ERD; schema.sql for database design. Start by reading OWNERSHIP_GUIDE.md, then personally run and explain several tests. AI_LOG.md distinguishes assistant verification from your own verification. QUALITY_GATE_REVIEW.md records real improvements, with the first implementation under evidence/first-version.

The instructor's quality_gate.md and curl_test_guide.md were initially unavailable and were subsequently downloaded unchanged from the instructor's Teams channel post. They are included, and QUALITY_GATE_REVIEW.md is reconciled with all eight checklist areas. A starter repository was not provided. The first snapshot was saved at 13:31:49 Bangkok time, after minute 30 relative to a 13:00 start; discuss that timing with the instructor and preserve the actual record. The checklist also asks the student to review again during the final five minutes before actual submission.

No authentication is implemented because the supplied contract does not specify it; the deployed API is a public assessment demo using fictitious booking data. No browser API client is included, so CORS is not needed according to the brief. An operational campus deployment would need authentication and booking permissions, which are outside this test contract.

## Submit

Read SUBMISSION_CHECKLIST.md and SUBMISSION_REPORT.md. The ZIP contains runnable source, schema, API design, honest AI/review logs, first-version snapshot, and actual test evidence. AI_LOG.md distinguishes assistant checks, student-reported checks from the supplied screenshot, and understanding not yet confirmed. After any personal verification or edits, regenerate the ZIP with `powershell -File package-submission.ps1`.
