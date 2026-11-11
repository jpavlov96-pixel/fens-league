# Handoff — 2026-11-11 — end of day

## Done today (all on `main` and live, last feature commit 3f9ea99)
- Match card: half-turn swap icon, stronger intro squash, Кръг 6 shows the Locked variant with "Активен коз", Correct Score starts 1:0 for the picked team, disabled down arrow without fill, market-button text centred on its letters (`text-box: trim-both cap alphabetic`, button fixed at 32px), and a draw warning (Figma 316:13024) that replaces the date after a level score has held for 2s.
- New pages: Прогнози (`predictions.html`, 308:9440) and Класиране (`rankings.html`, 308:9739), with counters that count up after the subtitle comes in.
- Floating tab bar (299:9412) on every page. Changing pages slides the ball out right and the text out left, then back in. The intro plays only when entering the product from outside (`page-boot.js`).
- Lobby: Отбори, Козове (looping 6-card carousel, blurred sides) and Подвизи cards. The ball video starts at a random point.
- Lobby filters: inactive items have no side padding (vertical 5px kept so the row height holds); the pill's padding and colours ease over 0.2s so the push is smooth. A version where the pill grew outward without moving the words was tried and rejected.
- `index.html` is now the Sport demo landing page (329:12817). The lobby moved to `lobby.html` (live at `/lobby`). "Fens League" draws the tap: white word, gold sweep, pop, bouncing NEW badge.

## Unfinished / waiting on the user
- Прогнози and Класиране only have the header and hero; the rest isn't designed yet.
- Not tested on a real iPhone: the .mov ball in Safari, the carousel feel and the page slide smoothness.
- Bottom-sheet pop-up "2.21 - Prediction / Schedule / Season": still waiting for its Figma node.

## Decisions and gotchas
- View transitions between pages were tried and reverted (flicker, white flashes). Don't retry them.
- The user dislikes blurred glows on the header lure; keep effects crisp.
- Hosting and `serve.py` have no HTTP Range support, so the ball video is loaded as a blob to seek it.
- The preview pane barely draws frames and the user clicks in it: test in a separate background tab and check with JS (pause animations at a time to screenshot).
- `background-clip: text` on a parent also paints child text: the lure's shine sits on its own span.

## First task next time
Ask what to build next on Прогнози / Класиране (or the bottom sheet), and re-read that Figma frame first.
