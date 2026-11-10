# Handoff — 2026-11-09

## Done today
- Ball is now `assets/visual-primary.webm` (330×330, transparent, 16s loop, 2.9MB) in a `<video>`, shown at 110px. Old PNG frames and `visual-primary.png` moved to the Trash.
- Built 9 entry animations; the user **chose "Drop and bounce" refined (`introBounceRefined()`, `#intro-2`, the default)** as final. Its approved values are in memory (`chosen-intro-animation`) and at the top of the function.
- Added a permanent ball shadow (`.visual-primary-shadow`, not in Figma): 140×14px, centre 26px right of the ball.
- Intro plumbing for all intros: hero hidden from first paint (`intro-pending` class set in `<head>`), waits for the video (max 2.5s), once per visit on the plain address, tap to skip.
- `serve.py` (no-cache server) replaces `python3 -m http.server`.
- Republished the private logo-free copy: https://claude.ai/artifact/FXd8F2BLribqPFZ237YxoT (up to date as of today).

## Unfinished / waiting on the user
- Hosting: user wants it on GitHub + free hosting with a password. Recommended a private GitHub repo + Cloudflare Pages with a small password check (free). 2026-11-10: git repo made (branch `main`, logo in `.gitignore`) and pushed to private https://github.com/jpavlov96-pixel/fens-league; Cloudflare Pages still to do. `gh` isn't installed; SSH to GitHub works (account `jpavlov96-pixel`).
- 2026-11-10: final ball videos from the user (`~/Downloads/Juli_Ball2/ball_01.webm` / `.mov`, 330×330, 21.33s, 30fps). WebM swapped in as-is (old one in Trash). The 135MB PNG-codec .mov was re-encoded to `assets/visual-primary.mov`, HEVC with alpha at 1 Mbps (3.5MB), and the `<video>` now has a `video/quicktime; codecs="hvc1"` source first (Safari takes it, Chrome/Firefox skip to the WebM). Not yet checked on a real iPhone. The ball shows the EGT DIGITAL logo; the user is OK with that on the hosted site.
  - How it was encoded: ffmpeg/brew aren't installed, `avconvert`'s alpha preset rejects the file, and `swift` is broken on this Mac (Command Line Tools modulemap clash). What worked: JXA (`osascript -l JavaScript`) with AVFoundation, first copying each PNG sample out of the .mov, then encoding with AVAssetWriter (codec `muxa`, pixel buffer adaptor). Classes must be fetched with `$.NSClassFromString`.
- Draft intros (`#intro-1`, `-light`, `-roll`, `-chalk`, `-scoreboard`, `-tilt`, `-net`, `-2-old`) are still in the code; user may want them removed.
- Still open from before: event-card is an empty white box.
- 2026-11-10: the 375px width restriction is gone. The page fills any width: at 375 every element measures exactly as before; on desktop things just stretch (text left, ball on the right edge), not designed yet. Intro checked at 1440px: the ball lands in its new spot.
- The claude.ai link still stores the 360 old PNG frames (unused).

## Decisions and gotchas
- Intros must measure the page only after `intro-pending` is removed (the ball is parked 1000px up while pending); getting this wrong made the ball drop from below.
- The preview pane freezes animations and rAF when not drawn; check intros by pausing animations and seeking, and use timers (not rAF) for anything that must finish.
- Publishing: build a copy with styles inlined and the logo swapped for a "LOGO" placeholder; never include `egt-digital-logo.svg`.

## First task next time
Set up the GitHub repo (private, logo left out) and Cloudflare Pages with a password, if the user still wants it.
