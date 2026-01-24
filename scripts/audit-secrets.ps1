# PowerShell secret-audit script
# Searches repository files for common secret-like patterns and prints matches

$patterns = @(
  "API[_-]?KEY",
  "SECRET",
  "TOKEN",
  "PASSWORD",
  "ACCESS[_-]?TOKEN",
  "PRIVATE[_-]?KEY",
  "AWS[_-]?ACCESS[_-]?KEY",
  "AWS[_-]?SECRET[_-]?KEY"
)

Write-Output "Searching for potential secrets..."
Get-ChildItem -Recurse -File -Exclude node_modules,dist,.git | ForEach-Object {
    $path = $_.FullName
    try {
        $content = Get-Content -Raw -ErrorAction Stop -Path $path
    } catch { return }
    foreach ($p in $patterns) {
        if ($content -match $p) {
            Write-Output "Match: $p in $path"
        }
    }
}

Write-Output "Search complete."