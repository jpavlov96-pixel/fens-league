# Handoff — 2026-11-09

## Done today
- Ball is now `assets/visual-primary.webm` (330×330, transparent, 16s loop, 2.9MB) in a `<video>`, shown at 110px. Old PNG frames and `visual-primary.png` moved to the Trash.
- Built 9 entry animations; the user **chose "Drop and bounce" refined (`introBounceRefined()`, `#intro-2`, the default)** as final. Its approved values are in memory (`chosen-intro-animation`) and at the top of the function.
- Added a permanent ball shadow (`.visual-primary-shadow`, not in Figma): 140×14px, centre 26px right of the ball.
- Intro plumbing for all intros: hero hidden from first paint (`intro-pending` class set in `<head>`), waits for the video (max 2.5s), once per visit on the plain address, tap to skip.
- `serve.py` (no-cache server) replaces `python3 -m http.server`.
- Republished the private logo-free copy: https://claude.ai/artifact/FXd8F2BLribqPFZ237YxoT (up to date as of today).

## Unfinished / waiting on the user
- Hosting: user wants it on GitHub + free hosting with a password. Recommended a private GitHub repo + Cloudflare Pages with a small password check (free). 2026-11-10: local git repo made (branch `main`, logo in `.gitignore`); GitHub repo + push and Cloudflare Pages still to do. `gh` isn't installed; SSH to GitHub works (account `jpavlov96-pixel`).
- iPhone/Safari can't show the WebM's transparency: needs an HEVC-with-alpha .mov (user's export was ~100MB; re-encode to ~3MB with ffmpeg `hevc_videotoolbox`, ffmpeg not installed).
- Draft intros (`#intro-1`, `-light`, `-roll`, `-chalk`, `-scoreboard`, `-tilt`, `-net`, `-2-old`) are still in the code; user may want them removed.
- Still open from before: event-card is an empty white box; page is fixed at 375px.
- The claude.ai link still stores the 360 old PNG frames (unused).

## Decisions and gotchas
- Intros must measure the page only after `intro-pending` is removed (the ball is parked 1000px up while pending); getting this wrong made the ball drop from below.
- The preview pane freezes animations and rAF when not drawn; check intros by pausing animations and seeking, and use timers (not rAF) for anything that must finish.
- Publishing: build a copy with styles inlined and the logo swapped for a "LOGO" placeholder; never include `egt-digital-logo.svg`.

## First task next time
Set up the GitHub repo (private, logo left out) and Cloudflare Pages with a password, if the user still wants it.
