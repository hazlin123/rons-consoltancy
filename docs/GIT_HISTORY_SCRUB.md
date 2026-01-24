# Rewriting Git History to Remove Sensitive Strings

WARNING: Rewriting history will change commit SHAs and require force-pushing. Only do this on repositories where you control all clones.

Option A — Start fresh (recommended if provenance or previous history is not needed):

1. Create a fresh clone of the repository folder (outside current repo) and copy only the working tree files you want to keep (no .git folder).
2. In the new folder:

```bash
git init
git add .
git commit -m "Initial import — cleaned"
# add remote and push
git remote add origin <YOUR_REMOTE_URL>
git push -u --force origin main
```

Option B — Use git-filter-repo (recommended for advanced scrubbing):

1. Install `git-filter-repo` (not included with git):

```bash
pip install git-filter-repo
```

2. Create `replacements.txt` listing literal replacements, e.g.: 

```
# file:replace:with
lovable==REMOVED
lovable.dev==REMOVED
"lovable-tagger"=="REMOVED"
```

3. Run filter-repo on a clone (always test on a backup clone):

```bash
git clone --mirror <your-repo-url> repo-mirror.git
cd repo-mirror.git
git filter-repo --replace-text replacements.txt
# verify history
# push back
git push --force --all
git push --force --tags
```

Option C — Use BFG Repo-Cleaner for simple token removal:

1. Download BFG jar (https://rtyley.github.io/bfg-repo-cleaner/).
2. Mirror clone:

```bash
git clone --mirror <your-repo-url>
java -jar bfg.jar --replace-text replacements.txt repo.git
cd repo.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

Checklist before pushing rewritten history:
- Inform collaborators they must re-clone.
- Rotate any leaked keys even if removed from history.
- Verify no sensitive files remain using a secrets scan.

If you want, I can prepare a `replacements.txt` for the strings I found and produce the exact `git-filter-repo` command to run locally.
