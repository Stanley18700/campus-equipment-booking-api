import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
const base = process.env.BASE_URL || 'http://localhost:8787/api';
const evidence = [];
const created = new Set();
const sample = {equipmentId:'eq-1',borrowerName:'HTTP Test Student',startAt:'2099-10-20T09:00:00.000Z',endAt:'2099-10-20T11:00:00.000Z',purpose:'Automated lab test'};
async function request(name, method, path, body, expected, verify = () => {}) {
  const response = await fetch(base + path, {method, headers: body === undefined ? {} : {'Content-Type':'application/json'}, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)});
  const raw = await response.text();
  const json = raw ? JSON.parse(raw) : null;
  if (response.status === 201 && json?.id) created.add(json.id);
  const item = {name,method,url:base+path,request:body??null,expectedStatus:expected,actualStatus:response.status,response:json,rawBody:raw,contentType:response.headers.get('content-type'),location:response.headers.get('location'),passed:false};
  evidence.push(item);
  assert.equal(response.status, expected, name);
  if (expected >= 400) { assert.equal(typeof json.error, 'string'); assert.match(item.contentType, /application\/json/); }
  if (expected === 204) assert.equal(raw, '');
  verify(json, response);
  item.passed = true;
  console.log(`PASS ${name} (${response.status})`);
  return json;
}
let failure;
try {
  await request('equipment seed', 'GET', '/equipment', undefined, 200, data => {assert.ok(data.some(e=>e.id==='eq-1'));assert.ok(data.some(e=>e.id==='eq-2'));});
  const a = await request('create booking', 'POST', '/bookings', sample, 201, (data,res) => {for(const k of Object.keys(sample)) assert.equal(data[k],sample[k]);assert.equal(res.headers.get('location'), `/api/bookings/${data.id}`);});
  await request('list includes booking','GET','/bookings',undefined,200,data=>assert.ok(data.some(b=>b.id===a.id)));
  await request('get booking','GET',`/bookings/${a.id}`,undefined,200,data=>assert.equal(data.id,a.id));
  await request('create overlap','POST','/bookings',{...sample,startAt:'2099-10-20T10:00:00.000Z'},409);
  await request('contained overlap','POST','/bookings',{...sample,startAt:'2099-10-20T09:30:00.000Z',endAt:'2099-10-20T10:00:00.000Z'},409);
  await request('enclosing overlap','POST','/bookings',{...sample,startAt:'2099-10-20T08:00:00.000Z',endAt:'2099-10-20T12:00:00.000Z'},409);
  const adjacent = await request('adjacent allowed','POST','/bookings',{...sample,startAt:sample.endAt,endAt:'2099-10-20T12:00:00.000Z'},201);
  const other = await request('same time different equipment','POST','/bookings',{...sample,equipmentId:'eq-2'},201);
  await request('partial update excludes itself','PATCH',`/bookings/${a.id}`,{purpose:'Updated purpose'},200,data=>assert.equal(data.purpose,'Updated purpose'));
  await request('update overlap','PATCH',`/bookings/${adjacent.id}`,{startAt:'2099-10-20T10:30:00.000Z'},409);
  await request('equipment change conflict','PATCH',`/bookings/${other.id}`,{equipmentId:'eq-1'},409);
  await request('failed update unchanged','GET',`/bookings/${adjacent.id}`,undefined,200,data=>assert.equal(data.startAt,sample.endAt));
  await request('merged invalid interval','PATCH',`/bookings/${a.id}`,{endAt:'2099-10-20T08:00:00.000Z'},400);
  for (const [name,body] of [
    ['missing field',{equipmentId:'eq-1'}], ['blank name',{...sample,borrowerName:' '}],
    ['unknown equipment',{...sample,equipmentId:'eq-missing'}],['reversed interval',{...sample,startAt:sample.endAt,endAt:sample.startAt}],
    ['equal interval',{...sample,endAt:sample.startAt}],['invalid date',{...sample,startAt:'tomorrow'}],
    ['impossible date',{...sample,startAt:'2099-02-30T09:00:00.000Z'}],['non UTC date',{...sample,startAt:'2099-10-20T16:00:00+07:00'}],
    ['long name',{...sample,borrowerName:'a'.repeat(101)}],['wrong field type',{...sample,purpose:42}],
    ['unknown field',{...sample,admin:true}],['null body','null'],['array body',[]],['malformed JSON','{"equipmentId":']
  ]) await request(name,'POST','/bookings',body,400);
  await request('empty patch','PATCH',`/bookings/${a.id}`,{},400);
  await request('invalid patch timestamp','PATCH',`/bookings/${a.id}`,{startAt:'bad'},400);
  await request('get missing','GET','/bookings/missing',undefined,404);
  await request('patch missing','PATCH','/bookings/missing',{purpose:'x'},404);
  await request('delete missing','DELETE','/bookings/missing',undefined,404);
  await request('unknown route','GET','/unknown',undefined,404);
  await request('SQL injection ID is data','GET',"/bookings/"+encodeURIComponent("' OR 1=1 --"),undefined,404);
  const injected = await request('SQL-looking name stored as data','POST','/bookings',{...sample,borrowerName:"Robert'); DROP TABLE equipment; --",startAt:'2099-10-21T09:00:00Z',endAt:'2099-10-21T11:00:00Z'},201,data=>assert.equal(data.startAt,'2099-10-21T09:00:00.000Z'));
  await request('equipment survives injection','GET','/equipment',undefined,200,data=>assert.ok(data.length>=2));
  // Concurrent HTTP writes exercise the atomic database trigger path.
  const concurrentBody = {...sample,startAt:'2099-10-22T09:00:00.000Z',endAt:'2099-10-22T11:00:00.000Z'};
  const responses = await Promise.all([1,2].map(async () => {
    const res = await fetch(base+'/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(concurrentBody)});
    const data = await res.json(); if(res.status===201)created.add(data.id);
    return {status:res.status,body:data};
  }));
  const concurrentCase = {name:'concurrent overlap only one succeeds',method:'POST x2 concurrently',url:base+'/bookings',request:concurrentBody,response:responses,passed:false};
  evidence.push(concurrentCase);
  assert.deepEqual(responses.map(r=>r.status).sort(),[201,409]);
  assert.equal(typeof responses.find(r=>r.status===409).body.error,'string');
  concurrentCase.passed=true;
  console.log('PASS concurrent overlap (201, 409)');
  await request('delete booking','DELETE',`/bookings/${a.id}`,undefined,204); created.delete(a.id);
  await request('get deleted','GET',`/bookings/${a.id}`,undefined,404);
  await request('repeat delete','DELETE',`/bookings/${a.id}`,undefined,404);
} catch (err) { failure = err; console.error(err); process.exitCode = 1; }
finally {
  const cleanup=[];
  for (const id of created) {
    try {const res=await fetch(base+`/bookings/${id}`,{method:'DELETE'});cleanup.push({id,status:res.status});}
    catch(err){cleanup.push({id,error:String(err)});process.exitCode=1;}
  }
  if(cleanup.some(c=>c.status!==204))process.exitCode=1;
  await mkdir('evidence',{recursive:true});
  const report={testedAt:new Date().toISOString(),baseUrl:base,client:'Node.js fetch HTTP client',passed:evidence.filter(e=>e.passed).length,total:evidence.length,failure:failure?String(failure):null,cases:evidence,cleanup};
  await writeFile('evidence/http-results.json',JSON.stringify(report,null,2)+'\n');
  await writeFile('TEST_RESULTS.md',`# HTTP test evidence\n\nBase API URL: \`${base}\`\n\nTested at: ${report.testedAt} (UTC). Client: Node.js fetch against the running Hono/D1 server. Executed by the AI assistant; student verification is separate.\n\n${report.passed}/${report.total} cases passed.\n\n| Case | Expected | Actual | Result |\n|---|---|---|---|\n`+evidence.map(e=>`| ${e.name} | ${e.expectedStatus??'201 + 409'} | ${e.actualStatus??e.response.map(r=>r.status).join(' + ')} | ${e.passed?'PASS':'FAIL'} |`).join('\n')+'\n\nFull requests, responses and cleanup results: `evidence/http-results.json`. Test-created bookings are deleted afterward. Run on a local test database: fixed 2099 dates must be free.\n');
}
