$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$submissionFiles = @('src', 'tests', 'evidence', 'package.json', 'tsconfig.json', 'wrangler.jsonc', 'schema.sql', 'README.md', 'API_CONTRACT.md', 'AI_LOG.md', 'QUALITY_GATE_REVIEW.md', 'TEST_RESULTS.md', 'CURL_TEST_RESULTS.md', 'CLOUDFLARE_TEST_RESULTS.md', 'SUBMISSION_LINKS.md', 'OWNERSHIP_GUIDE.md', 'SUBMISSION_CHECKLIST.md', 'SUBMISSION_REPORT.md', 'exam_brief_en.md', 'rubric_en.md', 'quality_gate.md', 'curl_test_guide.md', 'start-local.ps1', 'package-submission.ps1')
Compress-Archive -LiteralPath $submissionFiles -DestinationPath (Join-Path $PSScriptRoot 'campus-equipment-booking-submission.zip') -Force
Write-Output 'Created campus-equipment-booking-submission.zip; source and evidence included, dependencies and local database excluded.'
