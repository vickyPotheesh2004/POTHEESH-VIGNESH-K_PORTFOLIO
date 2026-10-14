# ---------------------------------------------------------------------------
# prepare-media.ps1
#
# Moves the original media from the repository root into public/ under
# URL-safe slug names, generates portrait poster frames with ffmpeg, and then
# re-verifies every file against docs/media-manifest.txt by SHA-256.
#
# Nothing is copied and nothing is deleted: each file is MOVED, so the
# repository does not carry a 68 MB duplicate, and the hash check proves the
# bytes arrived intact.
#
# Source files with spaces or apostrophes are matched by name from the
# manifest, not by path globbing.
# ---------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)

$ffmpeg = "C:\ProgramData\chocolatey\bin\ffmpeg.exe"
if (-not (Test-Path $ffmpeg)) {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) { $ffmpeg = $cmd.Source } else { throw "ffmpeg not found." }
}

New-Item -ItemType Directory -Force -Path "public\videos\posters" | Out-Null
New-Item -ItemType Directory -Force -Path "public\images" | Out-Null

# original filename | destination path
$mapping = @'
AI Document Analysis System.mp4|public/videos/researchhelp.mp4
finbench.mp4|public/videos/finbench.mp4
VarshaAI.mp4|public/videos/varsha.mp4
Causa.mp4|public/videos/causa.mp4
Lexara.mp4|public/videos/lexara.mp4
Kitchen.mp4|public/videos/smartkitchen.mp4
Arome.mp4|public/videos/arome.mp4
RAW data to graphical.mp4|public/videos/data-analyst.mp4
formatting.mp4|public/videos/fina-suite.mp4
Crowd_Simulation.mp4|public/videos/antigravity.mp4
image 1.png|public/images/profile-portrait.png
image 2.png|public/images/workspace.png
'@

# Load the recorded hashes of the originals.
$manifest = @{}
foreach ($line in Get-Content "docs\media-manifest.txt") {
  if ($line -match '^\s*$') { continue }
  $parts = $line -split '\|'
  if ($parts.Count -lt 3) { continue }
  $manifest[$parts[0].Trim()] = @{
    Size = [int64]$parts[1].Trim()
    Hash = $parts[2].Trim()
  }
}

$results = @()

foreach ($row in ($mapping -split "`n")) {
  $row = $row.Trim()
  if ($row -eq "" -or $row.StartsWith("#")) { continue }

  $pair = $row -split '\|'
  $source = $pair[0]
  $dest = $pair[1]

  if (-not (Test-Path -LiteralPath $source)) {
    $results += [pscustomobject]@{ File = $source; Status = "MISSING SOURCE"; Detail = $dest }
    continue
  }

  # Move (not copy) — keeps the repository free of a duplicate 68 MB payload.
  Move-Item -LiteralPath $source -Destination $dest -Force

  $hash = (Get-FileHash -LiteralPath $dest -Algorithm SHA256).Hash
  $expected = $manifest[$source]

  if (-not $expected) {
    $results += [pscustomobject]@{ File = $source; Status = "MOVED (no manifest entry)"; Detail = $dest }
  }
  elseif ($hash -eq $expected.Hash) {
    $results += [pscustomobject]@{ File = $source; Status = "OK hash verified"; Detail = $dest }
  }
  else {
    $results += [pscustomobject]@{ File = $source; Status = "HASH MISMATCH"; Detail = $dest }
  }
}

# ---------------------------------------------------------------------------
# Poster frames. One representative frame per video, taken a few seconds in to
# skip any title card, scaled to portrait and saved as a small JPEG so a card
# never has to download the video just to show a still.
# ---------------------------------------------------------------------------
$posterResults = @()

Get-ChildItem "public\videos" -Filter "*.mp4" | ForEach-Object {
  $slug = $_.BaseName
  $out = "public\videos\posters\$slug.jpg"
  & $ffmpeg -y -loglevel error -ss 5 -i $_.FullName -frames:v 1 -vf "scale=540:-2" -q:v 4 $out
  if (Test-Path $out) {
    $posterResults += [pscustomobject]@{
      Slug = $slug
      Poster = "$slug.jpg"
      Bytes = (Get-Item $out).Length
    }
  }
  else {
    $posterResults += [pscustomobject]@{ Slug = $slug; Poster = "FAILED"; Bytes = 0 }
  }
}

Write-Output "===== MEDIA RELOCATION + INTEGRITY ====="
$results | Format-Table -AutoSize | Out-String -Width 200 | Write-Output
Write-Output "===== POSTER FRAMES ====="
$posterResults | Format-Table -AutoSize | Out-String -Width 200 | Write-Output

$bad = ($results | Where-Object { $_.Status -notlike "OK*" -and $_.Status -notlike "MOVED (no manifest*) " }).Count
Write-Output "Files not verified: $bad"
