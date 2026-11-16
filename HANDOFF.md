# Handoff — 2026-11-16 — end of day

## Done today (all pushed to `main`, live)
- Official rules in `docs/` (BG, EN) + `docs/rules-clarifications.md` (the user's answers, #1–8); Правила, Класиране and the lobby's prize tables follow them.
- Prediction sheet (`components/prediction-sheet.js`) from "Прогнозирай" (Прогнози list, Team Modal): Изход от мача / Точен резултат, used teams (disabled until Повторен избор), draws via Равенство ("Равен"), points counter + ⓘ points table, Равенство / Повторен избор offers, Почивка panel, Figma's disabled save button.
- One saved next-round prediction (`components/next-prediction.js`, localStorage `fens-next-prediction`) shown in both slots (lobby, Прогнози); card icons on a saved prediction open "Избери Коз" and apply + save at once.
- "Избери Коз" picker (Figma 449:20222): carousel of the 4 available cards, rule text moving with the cards, A2c "Дъги" electricity + tremble on the middle card, slam on "Приложи Коз" (vibration, no sound), smooth hand-off (`components/card-fx.js`; demo in `demos/card-fx.html`, off the site).
- Power cards: split 4 available / 2 used (`USED`: Голмайстор, Всичко или нищо); any available card can be applied any time, a misfit says "Коз “…” няма да бъде приложен.".
- Lobby: Козове Използвани state, 2-card / 1-card layouts, card details sheet from "Детайли" (`components/trump-details.js`), "Към Класации" → Класиране, "Промени" → Прогнози.
- Landing page "Fens League Demo" + "Рестартирай демото"; header image preload; Прогнози tab row without the power-card button.

## Unfinished / waiting on the user
- **Flash on load** (yellow border / black button on the prediction panel): not reproducible in the built-in browser; asked which browser/device + a screen recording. The header flash was fixed (preload).
- Голмайстор has no player picker; saving doesn't change the match list's card; the sheet's head-to-head and form dots are samples.
- Класиране has no monthly tab; prize amounts are Figma samples; Подвизи page still only a hero.
- Not tried on a real phone: the electricity, slam timing, smooth scroll from "Промени".

## Decisions and gotchas
- Чиста мрежа with an exact score where the winner concedes is "not applied" — stricter than the official §5 (recorded as clarification #8).
- Test in a separate Browser-pane tab and keep it in front: a hidden pane pauses animations/rAF (the slam, carousel moves, counters) — the slam has a timer fallback for that.
- SVG filter effects: update turbulence ~14×/s, never every frame (it dropped to 2fps).
- Local `main` folder: an untracked `.agents/` copy once blocked the fast-forward; the files are in git now.

## First task next time
Ask about the load flash (browser/device, recording) and what the user found on the phone; then continue with what they pick (Голмайстор player picker, Подвизи page, monthly ranking).
