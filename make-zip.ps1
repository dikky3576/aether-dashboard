# Builds a clean, upload-ready zip of Aether Dashboard.
# Run from the project folder:   powershell -ExecutionPolicy Bypass -File .\make-zip.ps1
#
# It (1) checks that the project builds, (2) copies the source without node_modules, dist,
# .history, .git, .env and this script, (3) zips it, and (4) checks the zip contents.

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

$pkg     = Get-Content -Raw -Path 'package.json' | ConvertFrom-Json
$name    = 'aether-dashboard'
$version = $pkg.version
$parent  = Split-Path -Path $PSScriptRoot -Parent
$zipPath = Join-Path $parent "$name-$version.zip"
$stage   = Join-Path ([System.IO.Path]::GetTempPath()) "$name-stage-$([guid]::NewGuid().ToString('N'))"
$target  = Join-Path $stage $name

Write-Host "1/4  Checking that the project builds..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw 'npm run build failed. Fix the errors first; no zip was created.' }

Write-Host "2/4  Copying files (without node_modules, dist, .history, .git, .env)..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $target -Force | Out-Null
robocopy $PSScriptRoot $target /E /NFL /NDL /NJH /NJS /NP `
  /XD node_modules dist .history .git .vscode .idea `
  /XF .env .env.local '.env.*.local' make-zip.ps1 '*.zip' '*.log' Thumbs.db .DS_Store | Out-Null
# robocopy exit codes 0-7 mean success; 8 and above mean failure.
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE." }

Write-Host "3/4  Creating $zipPath ..." -ForegroundColor Cyan
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
# bsdtar (built into Windows 10/11) writes zip entries with forward slashes, which every OS reads correctly.
tar -a -c -f $zipPath -C $stage $name
if ($LASTEXITCODE -ne 0) { throw 'tar failed to create the zip.' }
Remove-Item $stage -Recurse -Force

Write-Host "4/4  Verifying the zip..." -ForegroundColor Cyan
$entries = tar -tf $zipPath
$bad = $entries | Where-Object { $_ -match '/(node_modules|dist|\.history|\.git)/' -or $_ -match '/\.env$' }
if ($bad) { throw "Unexpected files found in the zip:`n$($bad | Select-Object -First 10 | Out-String)" }

$required = @('package.json', 'README.md', 'LICENSE.md', 'CHANGELOG.md', 'index.html', 'docs/CUSTOMIZATION.md', 'src/main.tsx')
foreach ($file in $required) {
  if (-not ($entries -contains "$name/$file")) { throw "Missing from the zip: $file" }
}

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ""
Write-Host "Done. $($entries.Count) entries, $sizeMb MB" -ForegroundColor Green
Write-Host $zipPath -ForegroundColor Green
