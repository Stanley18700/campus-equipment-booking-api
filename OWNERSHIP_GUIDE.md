# Explain your API

Read this alongside src/index.ts and schema.sql. Use your own words during the instructor's questions.

1. **What is the data relationship?** One equipment item has many bookings. bookings.equipmentId is a foreign key to equipment.id. Each booking has a UUID, borrower, purpose and start/end UTC time.
2. **How do you detect overlap?** Two intervals overlap when the existing start is before the new end AND the existing end is after the new start, for the same equipment. Existing 09:00–11:00 conflicts with 10:00–12:00. New 11:00–12:00 is allowed: the old end is not greater than the new start. This is a half-open interval.
3. **Why exclude the booking ID on PATCH?** Otherwise a booking conflicts with itself. PATCH first loads the old record, merges supplied fields, then validates the complete interval and equipment.
4. **Why a database trigger as well as an API check?** Two requests can both pass a check before either writes. The trigger checks during each atomic SQL write, protecting the database itself. The API precheck provides a friendly error; the trigger prevents the race.
5. **Why normalize dates?** Strings sort chronologically only with a consistent UTC format. Date parsing alone can silently correct an impossible date such as February 30; comparing the parsed ISO result to the input catches that correction.
6. **What do 400, 404, 409 mean?** 400: invalid request data, including a nonexistent equipmentId. 404: requested booking or route missing. 409: otherwise valid request conflicts with another booking. POST uses 201; DELETE uses 204 and no JSON body.
7. **What is SQL injection protection?** SQL uses fixed text with question-mark placeholders. bind passes values separately, so a borrower name containing SQL punctuation is stored as text. Do not concatenate user data into SQL.
8. **What did AI do?** It generated the implementation, tests and documents and ran checks. Explain what you personally inspected and tested; do not claim the AI's checks as your own.
9. **What is the main code flow?** Routes parse JSON, validate field shape/type, normalize timestamps, check the equipment and merged interval, query conflicts, execute a bound SQL statement and return the appropriate response. Unexpected exceptions become generic JSON 500 errors.

Before submitting, personally reproduce: create; get; partial update; conflicting create; conflicting update; adjacent create; delete; invalid timestamp. Then complete AI_LOG.md with your observations. If a part of the code is unclear, ask for a walkthrough before claiming understanding.
