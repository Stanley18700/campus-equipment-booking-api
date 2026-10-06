$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$labNodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($labNodeCommand) {
  $labNodePath = $labNodeCommand.Source
} else {
  $labNodePath = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
}
if (-not (Test-Path -LiteralPath $labNodePath)) { throw 'Node.js is required. Install Node.js 24, then reopen your terminal.' }
if (-not (Test-Path -LiteralPath 'node_modules/wrangler/bin/wrangler.js')) { throw 'Dependencies are missing. Run npm install in this folder first.' }
$env:WRANGLER_LOG_PATH = Join-Path $PSScriptRoot '.wrangler/logs'
$env:WRANGLER_SEND_METRICS = 'false'
& $labNodePath 'node_modules/wrangler/bin/wrangler.js' d1 execute campus-booking-db --local --file=schema.sql
if ($LASTEXITCODE -ne 0) { throw 'Local database initialization failed.' }
& $labNodePath 'node_modules/wrangler/bin/wrangler.js' dev --local --ip 127.0.0.1 --port 8787
