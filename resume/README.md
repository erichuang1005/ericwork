# Resume

## View in browser (easiest)

With the local server running:

**http://127.0.0.1:8766/resume.html**

- **Download PDF** — blue button (uses `resume.pdf`)
- **Print / Save as PDF** — Chrome: File → Print → Save as PDF  
  - Paper: **Letter**  
  - Turn off **Headers and footers**

Start server if needed:

```bash
cd "/Users/eric.huang/Documents/Eric/case studies/Erin/ericwork"
python3 -m http.server 8766
```

## Edit workflow

1. Edit `resume/resume.md` (source text)
2. Sync changes into `resume.html` (root) — or ask the agent to sync
3. Rebuild PDF: `./resume/build-pdf.sh`
4. Refresh `resume.html` in browser

## Files

| File | What |
|---|---|
| `resume.html` | Web page — open in browser |
| `resume.pdf` | PDF for applications |
| `resume/resume.md` | Markdown source |
| `resume/build-pdf.sh` | Regenerate PDF |

Direct PDF link: **http://127.0.0.1:8766/resume.pdf**
