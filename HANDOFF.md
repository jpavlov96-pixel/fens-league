# Handoff — 2026-11-13 — end of day

## Done today (all on `main` and live, last feature commit 7529942)
- **Official resources as WebP.** The web copies of the crests, power cards and achievements are WebP (quality 90) instead of 256-colour PNG, which had broken their gradients into bands. `tools/optimize-resources.py` makes them; every page points at `.webp`.
- **Team Modal** (`components/team-modal.js`, Figma 396:19940 / 396:20047): bottom sheet from the team cards on the lobby's Отбори card and on Прогнози's Отбори tab. Light for Налични, dark for Използвани, both on one shared layout so switching moves nothing. Налични opens ЦСКА | Лудогорец | Славия as in Figma. The count runs like the lobby's counters. The Away/Home switch has Figma's gradient outlines. It closes on a tap outside, Escape, or a drag down (past 120px or a flick).
- **Прогнози:**
  - Текущ кръг list (finished / live / upcoming match cards).
  - Content rises in when График / История open and on arrival; Отбори's cards come in like the lobby's.
  - Следващ ↔ Текущ is a mild cross-fade with a slight scale (150ms out, 320ms in).
- **Match card** (shared): Figma's new sizes (13px tab text, 32px name boxes, 86px cards, used teams too). Прогнозирай / Предстои sit alone and centred (no "vs", Figma 361:11018), Прогнозирай is green.
- **Lobby prediction panel** (event-container):
  - Crests keep their shape.
  - The big "vs" has Figma's inner shadow.
  - The draw warning lies over the date after 1.35s, kept inside the card.
  - Премахни / Инфо are black at 60%.
- **Lobby:**
  - Следващ shows the empty state (No Match Selected); its Прогнозирай opens Прогнози on Текущ.
  - Ход на сезона has the legend (opens with an animation); "Виж Историята" opens Прогнози on История.
  - The Подвизи note has the Info icon.
- **Page changes:** the content under the top section fades out on leaving and rises in on arrival, with the ball and title.
- **Power card images** keep their 2:3 shape (not cropped) in the feature panel, the History break card and the info message.

## Unfinished / waiting on the user
- Класиране: only the header and hero; the rest isn't designed yet.
- Сезон (third round tab on Прогнози) and the bottom sheet "2.21 - Prediction / Schedule / Season": still waiting for its Figma node.
- Team Modal: every team shows Figma's sample details (rank, points, coach, form, next match); only the crest and name follow the team. Real data per team isn't designed.
- The lobby's Отбори count for Използвани is 4 (the lobby card's list); Figma's modal shows 6. The modal follows the page it opens from.
- Empty state: its note says "Кръг 7" (Следващ) but the button opens Текущ (Кръг 6), as the user asked.
- Not tried on a real phone today:
  - the drag-to-close
  - the crest fix (stretching for a moment on page change)
  - the empty state's border during animations
  - the WebP images in Safari
- If the tab bar still flickers on page change: a `_headers` file with longer caching for `assets/` would help (ask first).

## Decisions and gotchas
- **Figma's code export leaves things out.** It flattens gradient strokes to one colour and drops text effects (the vs inner shadow). When a border or shadow looks wrong, read the node's `strokes` / `effects` with `use_figma` (read-only).
- **Figma components change between sessions** (match card sizes, the button position, the draw warning): re-read the node before a fix.
- **Crests are never stretched or cropped:** the image box is sized to the crest's own shape (max-width / max-height), not `object-fit`, since phones briefly drew it stretched on page changes.
- **Borders that must stay visible over images** are drawn as a layer on top (`::after`, a masked ring for gradients). Phones can draw a clipped image over the element's own border while it animates.
- **Prefer a stable layout to Figma's per-state offsets** where they'd make content jump (Team Modal states, Следващ / Текущ heights).
- **Never go back to a colour palette for the resources:** it bands the gradients. Full-colour PNG is ~8x heavier; WebP is the choice.
- **Test in a background tab** (the user clicks in the pane). Background tabs run animations slowly: finish them (`getAnimations().forEach(a => a.finish())`) before measuring or screenshotting.
- View transitions between pages were tried and reverted on 2026-11-11 (flicker). Don't retry them.

## First task next time
Ask what to build next: Класиране, the Сезон bottom sheet (needs its Figma node), or more polish. Re-read that Figma frame first. If the user has tried today's work on their phone, start with what they found.
