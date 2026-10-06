PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);
INSERT OR IGNORE INTO equipment VALUES ('eq-1', 'Projector A', 'Building 1');
INSERT OR IGNORE INTO equipment VALUES ('eq-2', 'Camera A', 'Media Lab');
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY NOT NULL,
  equipmentId TEXT NOT NULL REFERENCES equipment(id),
  borrowerName TEXT NOT NULL CHECK(length(trim(borrowerName)) BETWEEN 1 AND 100),
  startAt TEXT NOT NULL,
  endAt TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK(length(trim(purpose)) BETWEEN 1 AND 500),
  CHECK(startAt < endAt)
);
CREATE INDEX IF NOT EXISTS booking_interval ON bookings(equipmentId, startAt, endAt);
