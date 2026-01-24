# PowerShell script to scan repo for common secret patterns
$patterns = @(
  'API[_-]?KEY',
  'SECRET',
  'TOKEN',
  'PRIVATE[_-]?KEY',
  'AWS[_-]?KEY',
  'PASSWORD'
)
Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\.git' -and $_.FullName -notmatch 'node_modules' -and $_.FullName -notmatch 'dist' } | ForEach-Object {
  $content = Get-Content -Raw -ErrorAction SilentlyContinue $_.FullName
  foreach ($p in $patterns) {
    if ($content -match $p) {
      Write-Output "Potential secret pattern '$p' found in: $($_.FullName)"
    }
  }
}
