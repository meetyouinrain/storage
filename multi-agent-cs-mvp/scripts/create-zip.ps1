$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$zipPath = Join-Path $root "multi-agent-cs-mvp.zip"

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

$items = Get-ChildItem -LiteralPath $root -Force | Where-Object {
  $_.Name -notin @("node_modules", "multi-agent-cs-mvp.zip")
}

Compress-Archive -Path $items.FullName -DestinationPath $zipPath -Force
Write-Output "Created: $zipPath"
