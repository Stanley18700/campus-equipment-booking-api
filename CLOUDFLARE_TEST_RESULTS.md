# Cloudflare deployment verification

Worker: https://campus-equipment-booking-api.nyansintzaw.workers.dev
Live Base API URL: https://campus-equipment-booking-api.nyansintzaw.workers.dev/api
Cloudflare version: 7fca0079-7ca2-4967-a95b-c18295dff5ca

HTTP run at: 10/06/2026 07:37:14 UTC
cURL run at: 10/06/2026 07:37:15 UTC
Executed by the AI assistant against the real deployed Worker and separate remote D1 database.

41/41 HTTP cases and 9/9 instructor cURL-guide cases passed (50 live cases total).
Root API information endpoint returned 200. All test-created bookings were deleted.

# HTTP test evidence

Base API URL: `https://campus-equipment-booking-api.nyansintzaw.workers.dev/api`

Tested at: 2026-10-06T07:37:14.874Z (UTC). Client: Node.js fetch against the running Hono/D1 server. Executed by the AI assistant; student verification is separate.

41/41 cases passed.

| Case | Expected | Actual | Result |
|---|---|---|---|
| equipment seed | 200 | 200 | PASS |
| create booking | 201 | 201 | PASS |
| list includes booking | 200 | 200 | PASS |
| get booking | 200 | 200 | PASS |
| create overlap | 409 | 409 | PASS |
| contained overlap | 409 | 409 | PASS |
| enclosing overlap | 409 | 409 | PASS |
| adjacent allowed | 201 | 201 | PASS |
| same time different equipment | 201 | 201 | PASS |
| partial update excludes itself | 200 | 200 | PASS |
| update overlap | 409 | 409 | PASS |
| equipment change conflict | 409 | 409 | PASS |
| failed update unchanged | 200 | 200 | PASS |
| merged invalid interval | 400 | 400 | PASS |
| missing field | 400 | 400 | PASS |
| blank name | 400 | 400 | PASS |
| unknown equipment | 400 | 400 | PASS |
| reversed interval | 400 | 400 | PASS |
| equal interval | 400 | 400 | PASS |
| invalid date | 400 | 400 | PASS |
| impossible date | 400 | 400 | PASS |
| non UTC date | 400 | 400 | PASS |
| long name | 400 | 400 | PASS |
| wrong field type | 400 | 400 | PASS |
| unknown field | 400 | 400 | PASS |
| null body | 400 | 400 | PASS |
| array body | 400 | 400 | PASS |
| malformed JSON | 400 | 400 | PASS |
| empty patch | 400 | 400 | PASS |
| invalid patch timestamp | 400 | 400 | PASS |
| get missing | 404 | 404 | PASS |
| patch missing | 404 | 404 | PASS |
| delete missing | 404 | 404 | PASS |
| unknown route | 404 | 404 | PASS |
| SQL injection ID is data | 404 | 404 | PASS |
| SQL-looking name stored as data | 201 | 201 | PASS |
| equipment survives injection | 200 | 200 | PASS |
| concurrent overlap only one succeeds | 201 + 409 | 409 + 201 | PASS |
| delete booking | 204 | 204 | PASS |
| get deleted | 404 | 404 | PASS |
| repeat delete | 404 | 404 | PASS |

Full requests, responses and cleanup results: `evidence/http-results.json`. Test-created bookings are deleted afterward. Run on a local test database: fixed 2099 dates must be free.


# Instructor cURL guide test evidence

Base API URL: https://campus-equipment-booking-api.nyansintzaw.workers.dev/api
Executed at: 2026-10-06T07:37:15.017Z UTC
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


Live raw requests/responses: evidence/cloudflare/http-results.json and curl-results.json.
Live saved command output: evidence/cloudflare/http-console.txt and curl-console.txt.
The standalone 8 SQLite tests and screenshots in evidence/screenshots record the earlier local verification, not this live run.
