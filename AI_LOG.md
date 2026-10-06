# AI assistance log

Tool: Codex. Date: 6 October 2026. Student name/ID: **Stanley18700/[student ID omitted from public copy]**.

| Important user prompt | What was used | Verification |
|---|---|---|
| Asked for help with the whole midterm based on the announcement | Assistant inspected the folder; initially found only Assignment 1 and requested the actual scenario | User corrected the target folder and supplied the equipment booking scenario |
| “I have put the platform midterm folder inside the folder ... can you do the whole thing ... tell me what to submit” | Assistant read exam_brief_en.md and rubric_en.md; authored API contract, TypeScript/Hono code, SQL schema, tests and documentation in Platform midterm | Assistant ran the actual local Hono/D1 API and HTTP client tests; 41 cases passed; tsc passed; separate SQLite constraint tests recorded in evidence/database-results.json |
| Same request, Quality Gate requirement from the brief | Assistant saved a first version, reviewed date handling, limits and simultaneous-write conflicts, then improved them | Compare evidence/first-version with src/index.ts and schema.sql; actual HTTP and database test evidence provided |
| Asked how to complete AI logs and how to satisfy the rubric | Assistant explained the personal verification steps and code-ownership questions | Student supplied a screenshot with four checks marked done; these are recorded below as student-reported, not assistant-observed |
| “I give you all the permissions ... do it all ... give me the submittables ... follow ... exam brief ... rubric” | Assistant audited the final package, clarified contract examples/status reasons, added a local startup helper and rubric coverage report, and packaged source and evidence | Final checks and extracted-package verification are recorded in evidence/; no new student understanding or checkpoint claims are made |
| “he has uploaded ... check and prepare ... use microsoft team ... terminal ... screenshots ... recreate the final submittables” | Assistant downloaded the instructor's actual quality_gate.md and curl_test_guide.md from the Teams post, audited all eight checklist areas, ran the nine exact cURL examples, saved real command output, captured read-only evidence-view screenshots, and rebuilt the final archive | 41 HTTP + 9 cURL-guide + 8 SQLite cases pass; tsc passes. Four screenshots show saved actual responses; they are browser evidence-view captures, not terminal-application screenshots. The source guide copies are unchanged. |
| “he said we need to submit the github link and the cloudflare link”; selected a public repository; corrected the owner to Stanley18700 | Assistant switched the GitHub CLI account to Stanley18700, prepared a public source repository, provisioned a separate remote D1 database and prepared a Worker deployment. Added a root API-information endpoint and updated run/deployment/submission instructions. | Exact final URLs and live deployment test evidence are recorded in SUBMISSION_LINKS.md and evidence/cloudflare/. This later requirement supersedes earlier notes saying public deployment was unnecessary. |

AI generated a substantial part of this implementation and documentation. These are **assistant-run checks**, not a claim that the student independently implemented, reviewed, or ran them. No other student was contacted. Source in Assignment 1 was inspected to identify the installed course stack; its Task Manager code was not submitted as the midterm API. Existing installed dependency packages were reused locally.

The instructor starter was not available. The Quality Gate and cURL guide were initially missing but later supplied via Teams; the assistant downloaded, read and applied both. Original copies are included. No pre-30-minute snapshot is claimed: the first source snapshot was saved at 13:31:49 +07:00. The fresh-install npm workflow is documented but was not run here because npm is unavailable in this session; tests used installed dependency versions declared in package.json.

## Student-reported verification

The student supplied a screenshot in this conversation marking four entries as done. The checked entries below reproduce that report; the assistant did not directly observe those manual actions. The remaining entries are unconfirmed, rather than being completed by the assistant on the student's behalf.

- [x] I ran the API locally and inspected the equipment response.
- [x] I created a booking and inspected its ID, fields and 201 status.
- [x] I reproduced an overlap conflict and explained why it returns 409.
- [ ] I tested a PATCH conflict and an adjacent booking.
- [x] I inspected a DELETE response and confirmed it is 204 with an empty body.
- [ ] I understand the overlap condition, exclusion of the current ID, parameter binding and database triggers.
- [ ] I read the source and can explain the parts I submitted.

Recorded student report: local API/equipment inspection; booking creation with ID/fields/201; overlap conflict/409; DELETE/204 with empty body. Source of this report: the student's screenshot. Exact manual commands, times, and personal implementation changes were not supplied and are not invented here.

Assistant verification: HTTP test requests, response bodies and statuses are saved in evidence/http-results.json; direct SQLite trigger and constraint tests in evidence/database-results.json; TypeScript results in evidence/typecheck.txt. These are separate from the student's personal report. OWNERSHIP_GUIDE.md supports preparation for the instructor's ownership questions, but does not certify independent understanding.

Final guide-based assistant verification: evidence/curl-console.txt contains actual curl.exe command output; evidence/curl-results.json contains all nine guide requests and responses. Screenshots and saved HTML show those recorded outputs clearly. The assistant's review applies the official eight-area checklist, including its warning about unconfirmed personal understanding; technical completion does not attest to the student's ability to explain the work.
