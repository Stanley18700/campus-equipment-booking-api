import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.BASE_URL || 'http://localhost:8787/api';
const cases=[];
let bookingId;
let failure;
mkdirSync('evidence/curl-payloads',{recursive:true});
const startedAt=new Date().toISOString();
let transcript=`INSTRUCTOR cURL QUICK TEST GUIDE — ACTUAL TERMINAL OUTPUT\nExecuted by the AI assistant, not a claim of student execution.\nTime (UTC): ${startedAt}\nBase API URL: ${base}\n\n`;
function run(name,method,path,body,expected,verify=()=>{}) {
  const args=['--silent','--show-error','--include','--request',method,base+path];
  let payloadFile;
  if(body) {
    payloadFile=`evidence/curl-payloads/${cases.length+1}.json`;
    writeFileSync(payloadFile,JSON.stringify(body,null,2)+'\n');
    args.push('--header','Content-Type: application/json','--data-binary','@'+payloadFile);
  }
  const command='curl.exe '+args.map(a=>JSON.stringify(a)).join(' ');
  const result=spawnSync('curl.exe',args,{encoding:'utf8',timeout:15000});
  const output=result.stdout||'';
  transcript+=`${cases.length+1}. ${name} — EXPECT ${expected}\n$ ${command}\n${output}\n`;
  process.stdout.write(`${cases.length+1}. ${name}\n${output}\n`);
  const status=Number(output.match(/^HTTP\/\S+ (\d+)/m)?.[1]);
  const separator=output.match(/\r?\n\r?\n/);
  const raw=separator ? output.slice(separator.index+separator[0].length) : '';
  const json=raw.trim() ? JSON.parse(raw) : null;
  const entry={name,method,url:base+path,request:body??null,command,expectedStatus:expected,actualStatus:status,rawOutput:output,response:json,passed:false};
  cases.push(entry);
  if(status===201 && json?.id)bookingId=json.id;
  assert.equal(result.status,0, result.stderr || result.error?.message || 'curl failed');
  assert.equal(status,expected,name);
  if(expected>=400)assert.equal(typeof json.error,'string');
  if(expected===204)assert.equal(raw.trim(),'');
  verify(json);
  entry.passed=true;
  transcript+='PASS\n\n';
  return json;
}
const original={equipmentId:'eq-1',borrowerName:'Somchai Jaidee',startAt:'2026-10-20T09:00:00.000Z',endAt:'2026-10-20T11:00:00.000Z',purpose:'Class presentation'};
try {
  run('List equipment','GET','/equipment',null,200,data=>assert.ok(data.length>=2));
  run('List bookings','GET','/bookings',null,200,data=>assert.ok(Array.isArray(data)));
  const booking=run('Create booking','POST','/bookings',original,201,data=>{for(const key of Object.keys(original))assert.equal(data[key],original[key]);});
  run('Get one booking','GET',`/bookings/${booking.id}`,null,200,data=>assert.equal(data.id,booking.id));
  const updated={...original,startAt:'2026-10-20T12:00:00.000Z',endAt:'2026-10-20T14:00:00.000Z',purpose:'Updated class presentation'};
  run('Update booking','PATCH',`/bookings/${booking.id}`,updated,200,data=>{for(const key of Object.keys(updated))assert.equal(data[key],updated[key]);});
  run('Invalid time range','POST','/bookings',{...original,startAt:'2026-10-21T11:00:00.000Z',endAt:'2026-10-21T09:00:00.000Z',purpose:'Invalid time range test'},400);
  run('Overlapping booking','POST','/bookings',{...original,borrowerName:'Suda Dee',startAt:'2026-10-20T12:30:00.000Z',endAt:'2026-10-20T13:30:00.000Z',purpose:'Conflict test'},409);
  run('Missing booking','GET','/bookings/not-found',null,404);
  run('Delete booking','DELETE',`/bookings/${booking.id}`,null,204);
  bookingId=undefined;
} catch(err) {failure=String(err);process.exitCode=1;transcript+=`FAIL: ${failure}\n`;console.error(err);}
finally {
  if(bookingId)spawnSync('curl.exe',['--silent','--request','DELETE',base+`/bookings/${bookingId}`],{encoding:'utf8',timeout:15000});
  const passed=cases.filter(c=>c.passed).length;
  transcript+=`SUMMARY: ${passed}/${cases.length} cURL guide cases passed.\n`;
  console.log(`SUMMARY: ${passed}/${cases.length} cURL guide cases passed.`);
  writeFileSync('evidence/curl-console.txt',transcript);
  writeFileSync('evidence/curl-results.json',JSON.stringify({testedAt:startedAt,baseUrl:base,client:'Windows curl.exe, spawned as an actual command-line HTTP client',executor:'AI assistant',passed,total:cases.length,failure,cases},null,2)+'\n');
  writeFileSync('CURL_TEST_RESULTS.md',`# Instructor cURL guide test evidence\n\nBase API URL: ${base}\nExecuted at: ${startedAt} UTC\nExecutor: AI assistant; actual Windows curl.exe commands adapted from the supplied guide.\n\n${passed}/${cases.length} guide cases passed.\n\n| Case | Expected | Actual | Result |\n|---|---|---|---|\n`+cases.map(c=>`| ${c.name} | ${c.expectedStatus} | ${c.actualStatus} | ${c.passed?'PASS':'FAIL'} |`).join('\n')+'\n\nActual terminal commands, headers and bodies: evidence/curl-console.txt.\nDetailed requests and raw response data: evidence/curl-results.json.\nSupplementary screenshots of read-only saved-evidence views: evidence/screenshots/.\nOriginal instructor guide: curl_test_guide.md.\n');
}
