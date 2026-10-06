import { Hono } from 'hono';

type Booking = { id: string; equipmentId: string; borrowerName: string; startAt: string; endAt: string; purpose: string };
type Input = Omit<Booking, 'id'>;
const fields = ['equipmentId', 'borrowerName', 'startAt', 'endAt', 'purpose'] as const;
const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.get('/', c => c.json({name:'Campus Equipment Booking API',equipment:'/api/equipment',bookings:'/api/bookings',documentation:'See README.md and API_CONTRACT.md in the submitted GitHub repository'}));

function validate(value: unknown, partial = false): Partial<Input> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Body must be a JSON object');
  const body = value as Record<string, unknown>;
  if (!Object.keys(body).length) throw new Error('Provide booking fields');
  if (Object.keys(body).some(k => !fields.includes(k as typeof fields[number]))) throw new Error('Unknown booking field');
  const result: Partial<Input> = {};
  for (const key of fields) {
    if (partial && !(key in body)) continue;
    const value = body[key];
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${key} must be a nonblank string`);
    result[key] = value.trim();
    if (key === 'startAt' || key === 'endAt') {
      const raw = result[key]!;
      const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
      const date = new Date(raw);
      const normalized = raw.includes('.') ? raw : raw.replace('Z', '.000Z');
      if (!pattern.test(raw) || !Number.isFinite(date.getTime()) || date.toISOString() !== normalized) {
        throw new Error(`${key} must be a real ISO UTC timestamp, e.g. 2026-10-20T09:00:00.000Z`);
      }
      result[key] = date.toISOString();
    } else {
      const limit = key === 'purpose' ? 500 : 100;
      if (result[key]!.length > limit) throw new Error(`${key} must be at most ${limit} characters`);
    }
  }
  return result;
}

async function check(db: D1Database, booking: Input, exclude = ''): Promise<{error: string; status: 400 | 409} | null> {
  if (!await db.prepare('SELECT id FROM equipment WHERE id = ?').bind(booking.equipmentId).first()) return {error: 'equipmentId does not exist', status: 400};
  if (!(booking.startAt < booking.endAt)) return {error: 'startAt must be before endAt', status: 400};
  const conflict = await db.prepare('SELECT id FROM bookings WHERE equipmentId = ? AND startAt < ? AND endAt > ? AND id <> ?')
    .bind(booking.equipmentId, booking.endAt, booking.startAt, exclude).first();
  return conflict ? {error: 'Equipment is already booked during that time', status: 409} : null;
}

app.get('/api/equipment', async c => c.json((await c.env.DB.prepare('SELECT * FROM equipment ORDER BY id').all()).results));
app.get('/api/bookings', async c => c.json((await c.env.DB.prepare('SELECT * FROM bookings ORDER BY startAt, id').all()).results));
app.get('/api/bookings/:id', async c => {
  const row = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(c.req.param('id')).first<Booking>();
  return row ? c.json(row) : c.json({error: 'Booking not found'}, 404);
});
app.post('/api/bookings', async c => {
  let input: Input;
  try { input = validate(await c.req.json()) as Input; }
  catch (err) { return c.json({error: err instanceof SyntaxError ? 'Body must be valid JSON' : (err as Error).message}, 400); }
  const problem = await check(c.env.DB, input);
  if (problem) return c.json({error: problem.error}, problem.status);
  const id = crypto.randomUUID();
  const row = await c.env.DB.prepare('INSERT INTO bookings (id,equipmentId,borrowerName,startAt,endAt,purpose) VALUES (?,?,?,?,?,?) RETURNING *')
    .bind(id, input.equipmentId, input.borrowerName, input.startAt, input.endAt, input.purpose).first<Booking>();
  c.header('Location', `/api/bookings/${id}`);
  return c.json(row, 201);
});
app.patch('/api/bookings/:id', async c => {
  const id = c.req.param('id');
  const current = await c.env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first<Booking>();
  if (!current) return c.json({error: 'Booking not found'}, 404);
  let patch: Partial<Input>;
  try { patch = validate(await c.req.json(), true); }
  catch (err) { return c.json({error: err instanceof SyntaxError ? 'Body must be valid JSON' : (err as Error).message}, 400); }
  const input = {...current, ...patch};
  const problem = await check(c.env.DB, input, id);
  if (problem) return c.json({error: problem.error}, problem.status);
  const row = await c.env.DB.prepare('UPDATE bookings SET equipmentId=?,borrowerName=?,startAt=?,endAt=?,purpose=? WHERE id=? RETURNING *')
    .bind(input.equipmentId, input.borrowerName, input.startAt, input.endAt, input.purpose, id).first<Booking>();
  return row ? c.json(row) : c.json({error: 'Booking not found'}, 404);
});
app.delete('/api/bookings/:id', async c => {
  const deleted = await c.env.DB.prepare('DELETE FROM bookings WHERE id=? RETURNING id').bind(c.req.param('id')).first();
  return deleted ? c.body(null, 204) : c.json({error: 'Booking not found'}, 404);
});
app.notFound(c => c.json({error: 'Route not found'}, 404));
app.onError((err, c) => {
  // A trigger protects concurrent writes even after the application precheck.
  if (err.message.includes('BOOKING_CONFLICT')) return c.json({error: 'Equipment is already booked during that time'}, 409);
  console.error(err);
  return c.json({error: 'Internal server error'}, 500);
});
export default app;
