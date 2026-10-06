# Instructor cURL guide test evidence

Base API URL: http://localhost:8787/api
Executed at: 10/06/2026 07:13:37 UTC
Executor: AI assistant; actual Windows curl.exe commands adapted from the supplied guide.

9/9 guide cases passed.

| Case | Expected | Actual | Result |
|---|---|---|---|
| List equipment | 200 | 200 | PASS |
| List bookings | 200 | 200 | PASS |
| Create booking | 201 | 201 | PASS |
| Get one booking | 200 | 200 | PASS |
| Update booking | 200 | 200 | PASS |
| Invalid time range | 400 | 400 | PASS |
| Overlapping booking | 409 | 409 | PASS |
| Missing booking | 404 | 404 | PASS |
| Delete booking | 204 | 204 | PASS |

Actual terminal commands, headers and bodies: evidence/curl-console.txt.
Detailed requests and raw response data: evidence/curl-results.json.
Supplementary screenshots of read-only saved-evidence views: evidence/screenshots/.
Original instructor guide: curl_test_guide.md.
