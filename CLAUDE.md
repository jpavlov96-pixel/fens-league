# Fens League

HTML/CSS prototype of the "Фенска Лига" lobby from the Figma file "Last Fan"
(https://www.figma.com/design/OrPsoRJGjW7r90HuKMFl7b/Last-Fan?node-id=238-6770), frame "1.0 - Lobby Main" (238:6770), designed for a **375px phone**. The page stretches to any width; desktop isn't designed or optimised yet, mobile is the focus. Since 2026-11-10 this is the only lobby: the older "Главно Лоби" page (frame 178:40236, hand-placed layout, intro drafts) was removed at the user's request and lives only in git history (before commit "Make the new lobby the only one").

## Where things live
- `index.html`: the lobby. It mirrors Figma's layers in order, with each block commented with its Figma name and node ID. The bounce intro (`introBounceRefined()`) is at the end of its script and plays on every load.
- `styles.css`: the page's styling, as plain hex values. Colours are the values Figma's variables resolve to.
- `assets/`: the ball video from the user, `visual-primary.webm` (Chrome/Firefox) and `visual-primary.mov` (HEVC with alpha, for Safari/iPhone), used in place of Figma's 30MB ball GIF. `assets/lobby-main/`: images and icons exported from Figma (never redrawn).
- `components/event-container.js` + `.css`: the match card as a reusable custom element `<event-container>` (Figma component set 276:9189), with Figma's 4 variants via `variant="match-outcome|correct-score"` and `state="default|locked"`, plus `date`, `home`/`away`, crests, scores, `pick` and `trump-card`. The header comment in the JS lists every attribute. `components.html` shows all four variants side by side.
- `HANDOFF.md`: where the last session stopped.
- Git: branch `main`, remote `origin` = private GitHub repo `jpavlov96-pixel/fens-league` (SSH).
- Hosting: Cloudflare Worker with static assets, https://fens-league.j-pavlov96.workers.dev/, deployed from GitHub on every push to `main`, so **a push is a public deploy**: push only when the user asks. `.assetsignore` keeps the notes and dev files off the site.
- Tab "Fens League" (renamed from Figma's "Fen League" by the user) replays the intro on every tap (`replayIntro()`).
- Changes the user made on purpose against Figma: crests stretched to their 114×68 slot (as Figma itself does), EGT logo 72×30 (Figma 48×20), "Месец" filter removed, "Как се играе?" has a moving white highlight on a 6% white border, no blue tap flash.

## How to run it
- Start the server from this folder: `python3 serve.py`, run with Bash in the background. It's `http.server` on port 8420 with caching turned off; plain `http.server` let browsers keep old copies of `styles.css`. A server launched from `.claude/launch.json` can't read ~/Documents, so that entry only attaches to the URL.
- Preview: http://localhost:8420/. A phone on the same Wi-Fi can use `http://<Mac IP>:8420/` (get the IP with `ipconfig getifaddr en0`).

## Working rules (from the user)
- Take every value and asset from Figma through the Figma connector. **Never estimate** from screenshots.
- **No variables** of any kind (no CSS custom properties, no Figma variable binding) until the user says so.
- **Reload the preview** after every change the user can see.
- **Don't publish** anything (claude.ai links or otherwise) unless the user asks again.
- Build only what's asked, section by section, and **re-read the Figma structure first**, because it changes between sessions.
- **The ball's bounce intro (`introBounceRefined()`) must always be included**: every lobby page or rebuilt screen that has the ball gets it, with the ball as the video (it needs `playbackRate` for the spin kicks), the tap-to-skip and the replay on the "Fens League" tab.
- Figma's generated code carries variable *fallback* colours (e.g. a blue gradient, mint button) that aren't what Figma shows; take colours from `get_variable_defs` on the frame instead.
- EGT Digital branding: the user is OK with it showing on the hosted site (2026-11-10), including the logo on the ball video and the header logo `assets/lobby-main/egt-digital-logo.svg`, which is in git and on the live site. claude.ai copies still swap the logo for a "LOGO" placeholder.
