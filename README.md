# ericwork

Eric Huang's product design portfolio — case studies, resume, password gate.

## Folder structure (what you need)

```
ericwork/
├── index.html              ← home page
├── *.html                  ← case study pages
├── style.css, material-*.css
├── auth.js, analytics.js, liquid-glass-tabs.bundle.js
├── resume.pdf
├── images/                 ← screenshots (organized by project)
└── hub/                    ← inventory picking demo app
```

**Dev-only** (not needed to host the site): `src/`, `package.json`, `vite.config.js`, `node_modules/`

## Upload to GitHub

### Best way: git push (one command, handles all folders)

```bash
cd "/Users/eric.huang/Documents/Eric/case studies/Erin/ericwork"
git push -u origin main
```

Set up personal SSH first (doesn't affect Work GitHub): see below.

### Can I upload a zip?

**Not to GitHub's website** — drag-and-drop adds the zip as a single file; it won't extract into folders. Your site won't work.

**Options that do work:**

| Method | How |
|---|---|
| **git push** | Recommended — uploads everything correctly |
| **Export folder** | Run `./scripts/export-for-github.sh`, then upload files inside `github-upload/` |
| **Netlify / Vercel** | Drag the zip from the script — those hosts extract it |

Create a clean upload package:

```bash
chmod +x scripts/export-for-github.sh
./scripts/export-for-github.sh
# → github-upload/  (folder to upload)
# → ericwork-site.zip (for Netlify/Vercel)
```

## Personal GitHub SSH (keeps Work login separate)

Work GitHub (`ghe.megaleo.com`) stays unchanged. Only this repo uses a personal key:

```bash
ssh-keygen -t ed25519 -C "erichuang1005@github" -f ~/.ssh/id_ed25519_personal
pbcopy < ~/.ssh/id_ed25519_personal.pub
# Add key at https://github.com/settings/keys (signed in as erichuang1005)

mkdir -p ~/.ssh && cat >> ~/.ssh/config << 'EOF'
Host github.com-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
EOF

cd "/Users/eric.huang/Documents/Eric/case studies/Erin/ericwork"
git remote set-url origin git@github.com-personal:erichuang1005/ericwork.git
git push -u origin main
```

## Excluded from upload (.gitignore)

| Item | Why |
|---|---|
| `Leap - find inv balance copy/` | Separate project (~393 MB) |
| `node_modules/` | Run `npm install` after clone |
| `.agents/` | Cursor dev skills |
| `*.zip`, `github-upload/` | Generated export packages |

## Local preview

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Rebuild liquid-glass tabs (optional)

```bash
npm install
npm run build
```
