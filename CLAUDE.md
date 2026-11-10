# Fens League

HTML/CSS prototype of the "Фенска Лига" lobby from the Figma file "Last Fan"
(https://www.figma.com/design/OrPsoRJGjW7r90HuKMFl7b/Last-Fan?node-id=178-40236), for a **375px phone only**.

## Where things live
- `index.html`: page structure. It mirrors Figma's layers in order, with each block commented with its Figma name and node ID.
- `styles.css`: all styling, as plain hex values.
- `assets/`: images and icons exported from Figma (never redrawn), plus the ball video `visual-primary.webm` from the user.
- Entry animations live at the end of `index.html`'s script. The final one is `introBounceRefined()` (`#intro-2`, the default); the others are drafts picked by `#intro-…` in the address. Keep the chosen motion if assets change.
- `HANDOFF.md`: where the last session stopped.

## How to run it
- Start the server from this folder: `python3 serve.py`, run with Bash in the background. It's `http.server` on port 8420 with caching turned off; plain `http.server` let browsers keep old copies of `styles.css`. A server launched from `.claude/launch.json` can't read ~/Documents, so that entry only attaches to the URL.
- Preview: http://localhost:8420/. A phone on the same Wi-Fi can use `http://<Mac IP>:8420/` (get the IP with `ipconfig getifaddr en0`).

## Working rules (from the user)
- Take every value and asset from Figma through the Figma connector. **Never estimate** from screenshots.
- **No variables** of any kind (no CSS custom properties, no Figma variable binding) until the user says so.
- **Reload the preview** after every change the user can see.
- **Don't publish** anything (claude.ai links or otherwise) unless the user asks again.
- Build only what's asked, section by section, and **re-read the Figma structure first**, because it changes between sessions.
- Don't publish anything showing the real EGT Digital logo or branding. Published copies inline the styles and swap the logo for a "LOGO" placeholder.
