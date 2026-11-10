# Handoff — 2026-11-10

## Done today
- Git + GitHub: private repo https://github.com/jpavlov96-pixel/fens-league (`main`, SSH). `gh` isn't installed; the user creates repos on github.com.
- Hosting: Cloudflare Worker (static assets), https://fens-league.j-pavlov96.workers.dev/, free, no password. Every push to `main` goes live in ~30s. `.assetsignore` hides the notes and dev files (checked: 404).
- Final ball videos from the user (`~/Downloads/Juli_Ball2/ball_01.*`): the WebM is swapped in, and the 135MB MOV is re-encoded to a 3.5MB HEVC-with-alpha `assets/visual-primary.mov`, which Safari takes first.
- The 375px limit is gone: the page fills any width (375 is pixel-identical to before; desktop just stretches).
- The header logo is now in git and live (the user is OK with EGT branding on the hosted site).
- The tab is renamed "Fens League" (Figma says "Fen League"), and every tap replays the intro (`replayIntro()`).
- All live files were checked byte for byte against local.

## Unfinished / waiting on the user
- The MOV isn't tested on a real iPhone yet (open the live link in Safari).
- Cloudflare's settings show "disconnected from your Git account", but deploys still arrive. If they stop, the user reconnects via Manage → GitHub app → repo access.
- The event-card is still an empty white box. Draft intros are still in the code (the user may want them removed). Desktop isn't designed.
- The user is designing a bottom-sheet pop-up ("2.21 - Prediction / Schedule / Season"). Advice given: design at 375×548 (iPhone SE in Safari), sheet ≤520px (500 for a clear top gap), key content in the top ~470px, 34px bottom safe area; in code `max-height: calc(100svh - 48px)` with internal scroll.

## Gotchas
- Re-encoding video: no ffmpeg/brew, `swift` is broken (CLT modulemap clash), and `avconvert`'s alpha preset rejects PNG-codec MOVs. What works: JXA (`osascript -l JavaScript`) + AVFoundation, getting classes via `$.NSClassFromString`; copy the PNG samples out, then encode with codec `muxa` through a pixel buffer adaptor.
- The preview pane pauses video and rAF while hidden (`document.hidden`); that's not a page bug.

## First task next time
Build the bottom-sheet pop-up once the user shares its Figma node (re-read the Figma structure first).
