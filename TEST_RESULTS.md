# HTTP test evidence

Base API URL: `http://localhost:8787/api`

Tested at: 2026-10-06T07:13:44.517Z (UTC). Client: Node.js fetch against the running Hono/D1 server. Executed by the AI assistant; student verification is separate.

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
| concurrent overlap only one succeeds | 201 + 409 | 201 + 409 | PASS |
| delete booking | 204 | 204 | PASS |
| get deleted | 404 | 404 | PASS |
| repeat delete | 404 | 404 | PASS |

Full requests, responses and cleanup results: `evidence/http-results.json`. Test-created bookings are deleted afterward. Run on a local test database: fixed 2099 dates must be free.
