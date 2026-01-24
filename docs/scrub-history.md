Git history scrub options

Option A — Fresh repository (recommended, safest):
1. Create a clean copy of the working tree (no .git):

   powershell
   robocopy . ..\clean-ielts /E /XF .git /XD node_modules
   cd ..\clean-ielts
   git init
   git add .
   git commit -m "Initial import after sanitizing project"

2. Push to a new remote or overwrite existing remote only after verifying.

Option B — Rewrite history (advanced):
- Use `git-filter-repo` (recommended over filter-branch/BFG):

  # Install git-filter-repo (your package manager)
  # Create a replacements file, e.g. replacements.txt with lines like:
  # lovable==REMOVED
  git clone --mirror <REPO_URL> repo-mirror.git
  cd repo-mirror.git
  git filter-repo --replace-text ../replacements.txt
  # Verify changes, then push --force to remote

- BFG is an alternative for removing files / large blobs; see https://rtyley.github.io/bfg-repo-cleaner/

Notes:
- Rewriting history is destructive and will require everyone using the repo to reclone or reset.
- Test on a local mirror clone before pushing.
