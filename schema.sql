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
-- Statements are atomic: this closes the gap between a precheck and a write.
CREATE TRIGGER IF NOT EXISTS prevent_booking_overlap_insert
BEFORE INSERT ON bookings
WHEN EXISTS (SELECT 1 FROM bookings WHERE equipmentId=NEW.equipmentId AND startAt<NEW.endAt AND endAt>NEW.startAt)
BEGIN
  SELECT RAISE(ABORT, 'BOOKING_CONFLICT');
END;
CREATE TRIGGER IF NOT EXISTS prevent_booking_overlap_update
BEFORE UPDATE ON bookings
WHEN EXISTS (SELECT 1 FROM bookings WHERE equipmentId=NEW.equipmentId AND id<>OLD.id AND startAt<NEW.endAt AND endAt>NEW.startAt)
BEGIN
  SELECT RAISE(ABORT, 'BOOKING_CONFLICT');
END;
