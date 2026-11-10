# Fens League

HTML/CSS prototype of the "Фенска Лига" lobby from the Figma file "Last Fan"
(https://www.figma.com/design/OrPsoRJGjW7r90HuKMFl7b/Last-Fan?node-id=178-40236), designed for a **375px phone**. Since 2026-11-10 the page stretches to any width: full-width layers are 100%, and elements on the right of the Figma frame are pinned to the right edge (right offset = 375 − Figma left − width). Desktop isn't designed or optimised yet; mobile is the focus.

## Where things live
- `index.html`: page structure. It mirrors Figma's layers in order, with each block commented with its Figma name and node ID.
- `styles.css`: all styling, as plain hex values.
- `assets/`: images and icons exported from Figma (never redrawn), plus the ball video from the user: `visual-primary.webm` (Chrome/Firefox) and `visual-primary.mov` (HEVC with alpha, for Safari/iPhone).
- Entry animations live at the end of `index.html`'s script. The final one is `introBounceRefined()` (`#intro-2`, the default); the others are drafts picked by `#intro-…` in the address. Keep the chosen motion if assets change.
- `HANDOFF.md`: where the last session stopped.
- Git: branch `main`, remote `origin` = private GitHub repo `jpavlov96-pixel/fens-league` (SSH).
- Hosting: Cloudflare Worker with static assets, https://fens-league.j-pavlov96.workers.dev/, deployed from GitHub on every push to `main`. `.assetsignore` keeps the notes and dev files off the site.

## How to run it
- Start the server from this folder: `python3 serve.py`, run with Bash in the background. It's `http.server` on port 8420 with caching turned off; plain `http.server` let browsers keep old copies of `styles.css`. A server launched from `.claude/launch.json` can't read ~/Documents, so that entry only attaches to the URL.
- Preview: http://localhost:8420/. A phone on the same Wi-Fi can use `http://<Mac IP>:8420/` (get the IP with `ipconfig getifaddr en0`).

## Working rules (from the user)
- Take every value and asset from Figma through the Figma connector. **Never estimate** from screenshots.
- **No variables** of any kind (no CSS custom properties, no Figma variable binding) until the user says so.
- **Reload the preview** after every change the user can see.
- **Don't publish** anything (claude.ai links or otherwise) unless the user asks again.
- Build only what's asked, section by section, and **re-read the Figma structure first**, because it changes between sessions.
- EGT Digital branding: the user is OK with it showing on the hosted site (2026-11-10), including the logo on the ball video and the header logo `egt-digital-logo.svg`, which is in git and on the live site. claude.ai copies still swap the logo for a "LOGO" placeholder.
