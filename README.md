# ericwork

Eric Huang's product design portfolio — case studies, resume, password gate.

## Upload to GitHub

**Don't use the GitHub website drag-and-drop.** It can't handle folders well and chokes on large file counts.

Use git from Terminal instead (one command uploads everything):

```bash
cd "/Users/eric.huang/Documents/Eric/case studies/Erin/ericwork"
git add .
git status          # confirm Leap/, .agents/, node_modules/ are NOT listed
git commit -m "Update portfolio"
git push
```

Repo: https://github.com/huangzehao123qwe/ericwork

## What's excluded from upload

These stay on your computer but won't go to GitHub (see `.gitignore`):

| Folder / file | Why |
|---|---|
| `Leap - find inv balance copy/` | Separate project (~393 MB) |
| `node_modules/` | npm dependencies — run `npm install` after clone |
| `.agents/` | Cursor dev skills |
| `.DS_Store` | macOS metadata |

## Local preview

```bash
python3 -m http.server 8765
# open http://localhost:8765
```
