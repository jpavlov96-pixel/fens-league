# Fan League — Game Rules

**Version:** 1.1 · **Updated:** 16 November 2026  
**Status:** Agreed rules, with unresolved cases explicitly marked.  
**Purpose:** A single reference for game rules, product design, development, testing, and player support.

This document describes the agreed rules. Edition-specific settings and unresolved decisions are listed in [§9](#9-settings-and-open-questions). Examples and mockups do not introduce new rules. Do not treat proposals marked as open in §9 as confirmed rules.

## 1. Format and participation

- **Fan League** is a free football prediction game. There is no entry fee, required deposit, or paid bet to participate.
- The reference edition uses the Bulgarian First League regular season: **14 teams, 26 rounds, and 7 scheduled matches per round**. Play-offs and relegation play-offs are outside the game.
- The edition has two half-season leaderboards: **rounds 1–13** and **rounds 14–26**. The season leaderboard covers all 26 rounds.
- Per round, a player may save **at most one prediction on one match**, or activate Skip Round. A prediction on a different match in the same round replaces the previous one only when successfully saved.
- Players may join after the season starts. They receive all teams and a full set of Power Cards for the current availability period, and enter all applicable ongoing leaderboards with the points they actually earn. They cannot predict past rounds or receive points for rounds before they joined.

## 2. Selection, saving, and locking

1. Choose a match from the current or next round if predictions are open for that round. The schedule for later rounds is available for planning.
2. Choose **Winner** or **Exact Score**. These are alternative modes for a single prediction. Saving an exact score replaces the outcome prediction; it does not create a second prediction.
3. You may add one applicable Power Card. You cannot save a predicted draw or a win by an already used team without the appropriate card. **An exact score with an available winning team does not require a Power Card.**
4. You can edit your match, mode, score, and Power Card up to the round deadline: **kickoff of the first match in the round**, regardless of when your selected match starts. Saved predictions lock automatically; no second confirmation is required.
5. Before the deadline, a saved prediction for an upcoming round reserves its team and Power Card for that round. A valid edit or cancellation releases the reservation. For a prediction that locks after the refresh, see §4. Once locked, the selection is counted as used. Team and card restrictions also apply when two rounds are open at once; Reuse can make an exception for a team.

**Example:** You save a CSKA win for round 7. You can change it to 2–1 before the round starts. A 1–2 prediction picks the opposing team to win, so that team must be available or you must apply Reuse. A 1–1 prediction requires Draw.

## 3. Points and settlement

### 3.1. Base points

| Mode | Actual result compared with your prediction | Points |
|---|---|---:|
| Winner / Outcome | Correct winner, or correct draw (X) with the Draw card | 3 |
| Exact Score | Correct exact score | 4 |
| Exact Score | Correct outcome only, including a different drawn score when you predicted an exact draw | 2 |
| Any mode | Incorrect outcome | 0 |
| Missed round | No saved prediction and no Skip Round card at lock | 0 |

- An **outcome** is a home win, a draw, or an away win.
- Points from the two modes are not added together. Power Card effects are applied as described in §5.
- A correct exact score also counts as a correct outcome. With All or Nothing, picking the right winner but the wrong score still counts as a **correct outcome**, even though it earns 0 points.
- A missed round does not use a team or Power Card. It breaks active streaks.

### 3.2. Official results and exceptions

- The official score after regular time and stoppage time is used. Extra time and penalty shootouts do not count. An officially awarded result counts for base scoring, the correct outcome and exact score statistics, and achievements based on those results. If a result is awarded without the match being played, Clean Sheet is returned without a bonus; the underlying prediction is settled using the awarded result.
- **Postponed match:** The prediction remains pending until there is an official result, including a draw. Points and progress are credited to the original round and its leaderboard periods, in round order.
- **Permanently cancelled match with no official result:** The prediction is void and earns no points. The used team and Power Card are returned, but do not carry over to a new set or period after the old one expires. Voiding does not break a streak. The prediction counts towards To the Finish if it was saved on time.
- **Entire round voided:** The activated Power Card is returned. How this affects To the Finish is open in §9.
- Leaderboards remain provisional until all predictions for the period are settled. Streaks and achievements are evaluated **in round order**, not in the order results become available. If a pending result could affect an achievement, its evaluation waits.

## 4. Team availability and the mid-season refresh

- Each team may be picked to win **once per availability period**, except when using Reuse. An exact-score prediction uses up the predicted winning team, even if the prediction is wrong.
- If you have already used both teams in a match, choose a different match or use an applicable Power Card. Draw does not use up a team. **There is no separate X token.**
- **Teams and Power Cards refresh at a fixed date and time set in the edition configuration, aligned with the league's actual mid-season break.** The round number and fixture rescheduling do not trigger a refresh. Playing round 14 before round 13 does not, by itself, refresh either set.
- At the refresh, all teams become available again and players receive a fresh set of Power Cards. Unused cards from the previous set expire. Points, leaderboard results, and achievement progress carry over. Locked predictions awaiting results are not voided by the refresh.
- **A prediction saved before the refresh for a round that locks after it uses the new set.** The predicted winner's availability and the card's availability and applicability are checked against the new set. The old reservation does not grant the right to use a team or card from the previous set.

## 5. Power Cards

Each player receives **one of each of the six Power Cards** at the start of the season and a fresh set at the time specified in §4. Cards are single-use, cannot be purchased, and cannot be combined: **one per round**. The card and any selection it requires lock with the prediction. Cards do not multiply achievement progress.

| Power Card | Effect and settlement |
|---|---|
| **Reuse** | Pick an already used team to win one more time, including in Exact Score mode. The team remains used and does not become available for another pick. Usual scoring applies. |
| **Draw** | The only way to predict a draw (X) or an exact drawn score. No team is used. A correct X earns 3 pts; the exact drawn score earns 4 pts; a different draw in Exact Score mode earns 2 pts; a win by either team earns 0 pts. |
| **Goalscorer** | Before lock, select a footballer from your predicted match. If they score in regular time or stoppage time, your base points double (3→6, 4→8, 2→4, 0→0). Penalty goals during play count; own goals do not. The multiplier remains ×2 regardless of the number of goals. If the player appears but does not score, usual points apply. If the player does not appear at all, or an awarded result has no recognised individual statistics, the card is returned and the underlying prediction is settled normally. |
| **Skip Round** | Replaces the whole round's prediction with **1 pt** without using a team. The point counts towards both total points and Power Card bonus points. It preserves your correct-outcome streak without advancing it. It does not count as a correct outcome or exact score, breaks a consecutive-round exact-score streak, and rules out Perfect Month for that period. It counts towards To the Finish. |
| **Clean Sheet** | Adds **2 pts** if the team you picked wins without conceding. This condition is checked against the actual result, regardless of how many goals you predicted. Otherwise, usual scoring applies. If a result is awarded without the match being played, the card is returned and no bonus is awarded. |
| **All or Nothing** | Exact Score mode only. Earn **6 pts** for the exact score or **0 pts** for any other result, even if you picked the right winner. A correct outcome still counts for achievements and for the correct-outcome tiebreaker. |

Goalscorer, Clean Sheet, and All or Nothing use up the predicted winning team as usual. With one card per round, they cannot be combined with Draw or Reuse.

**Example:** With Clean Sheet, you predict 2–1, but the same team wins 2–0. You earn 2 pts for the correct outcome and 2 pts from the card, for 4 pts total.

## 6. Leaderboards, tiebreakers, and prizes

Each round's points count towards the applicable **monthly, half-season, and season leaderboards**. Monthly periods consist of whole rounds assigned in advance; postponement does not change a match's period. The second half of the season has its own leaderboard. The season leaderboard accumulates results across the full edition.

| Leaderboard | Top prizes | Additional prize ranges |
|---|---|---|
| Monthly | 1st, 2nd, and 3rd | 4–10, 11–30 |
| Half-season | 1st, 2nd, and 3rd | 4–10, 11–30, 31–50 |
| Season | 1st, 2nd, and 3rd | 4–10, 11–30, 31–50, 51–100 |

Specific prizes and values are set for each edition. Achievement rewards are separate from placement prizes.

**Ranking order** — all metrics are for the applicable leaderboard period:

1. More total points.
2. If tied on points, more correct exact scores.
3. If still tied, more correct outcomes.
4. If still tied, **fewer Power Card bonus points**. The point from Skip Round counts towards this metric.
5. If still tied, **a tiebreak draw** determines a unique order among the tied players for the positions they occupy. Each player receives the prize for their resulting position. An indivisible prize is awarded to one player according to that order.

Power Card bonus points are the points added by the card: the extra points from doubling for Goalscorer; 2 extra pts for Clean Sheet; 2 pts above the base 4 for a correct score with All or Nothing; and 1 pt for Skip Round. Draw and Reuse enable selections without adding bonus points. Base points do not become bonus points just because a Power Card was used. Only positive additions count. An unsuccessful All or Nothing earns **0 bonus pts**, even when picking just the correct winner would otherwise have earned 2 pts.

An additional prediction for the **total number of goals in a round** was discussed and is not part of the confirmed scoring or leaderboard rules.

## 7. Achievements

**16 achievements across 10 cards:** 4 groups with tiers and 6 standalone achievements. Each tier or standalone achievement grants a separate reward **once per season**. Progress carries over across the mid-season break. A single prediction may unlock multiple achievements; their rewards do not add leaderboard points.

| Card | Tiers and requirements |
|---|---|
| Correct outcome streak | **Hat Trick** — 3; **In Form** — 5; **Unbeaten** — 10 consecutive correct outcomes. An incorrect outcome or missed round breaks the streak. Skip Round preserves it without advancing it. |
| Exact scores | **Sharpshooter** — 3; **Expert** — 5; **Precision Analyst** — 10 correct exact scores in total during the season. They do not need to be consecutive. |
| Consecutive exact scores | **Back-to-Back** — 2; **Triple Precision** — 3 exact scores in consecutive rounds. A correct outcome without the exact score, a missed round, or Skip Round breaks the streak. |
| Wins by different teams | **Variety** — correctly predict wins by 5 different teams; **League Expert** — by 10. Each team counts at most once per season. |
| **Perfect Month** | Correctly predict the outcome in every round of a monthly period. An incorrect prediction, missed round, or Skip Round means the requirement is not met for that period. |
| **Goal Fest** | Correctly predict the exact score of a match with at least 5 total goals, e.g. 3–2. |
| **Power Card Master** | Earn bonus points with each of these three cards: Goalscorer, Clean Sheet, and All or Nothing. The cards can succeed in different halves of the season. Playing a card alone does not count; doubling 0 pts with Goalscorer earns no bonus. |
| **Strong Finish** | Correctly predict the outcome in each of rounds 24, 25, and 26. Skip Round does not replace a correct outcome. |
| **To the Finish** | Participate in at least 24 of 26 rounds. Any prediction saved on time counts, including an incorrect prediction or one voided because the selected match was cancelled. Skip Round also counts. |
| **Derby Instinct** | Correctly predict the exact score of a match designated as a derby in advance. Predicting only the correct outcome is insufficient. |

## 8. Season prize draw — To the Finish

**To the Finish** replaces Full Season. Participating in at least **24 of 26 rounds** earns **one entry to the season prize draw**. Prediction results and leaderboard position do not affect qualification. More points, deposits, or paid bets do not earn extra entries. All eligible players have an equal chance.

This prize draw is separate from the leaderboard tiebreak draw. The number and value of prizes and the date of the season prize draw are configured for each edition.

## 9. Settings and open questions

**Edition settings:** Official team and fixture list; team and Power Card refresh date and time; monthly periods by whole rounds; designated derbies; prize list; and draw date. Mockups are not a source for these settings.

**Reference monthly periods** proposed for the original 2026/27 schedule, subject to confirmation when configuring the edition:

| Period | Rounds |
|---|---|
| July | 1–3 |
| August | 4–7 |
| September | 8–10 |
| October | 11–13 |
| November–December | 14–17 |
| February | 18–20 |
| March | 21–23 |
| April | 24–26 |

The following cases **require a decision before the corresponding behaviour is implemented**:

| Topic | Decision still needed |
|---|---|
| Reordered and fully postponed rounds | How Current and Next are determined when rounds are reordered, and what happens to the deadline if the first match or all matches in a round are postponed. |
| Achievements when a prediction is voided | How a voided prediction affects Perfect Month, an exact-score streak across consecutive rounds, and Strong Finish, and whether the 24-of-26 threshold changes if an entire round is voided. |
| Finalisation and prizes | Official source for match results and goalscorers; deadline and effect of corrections; process for tiebreak draws and the season prize draw; eligibility; fair play; winner confirmation; and prize claiming, validity periods, and terms. |

## 10. Verification examples

Unless stated otherwise, the examples assume that the prediction was saved on time and that the match was played and has an official result.

| Case | Expected behaviour |
|---|---|
| Predicted CSKA win, official result 2–1 to CSKA, no card | 3 pts, 1 correct outcome, 0 exact scores, and 0 Power Card bonus pts. |
| Predicted 3–0 for an available team, official result 3–1, no card | The prediction is valid. Award 2 pts, 1 correct outcome, and 0 exact scores. |
| Predicted 1–1 with Draw, official result 0–0 | 2 pts, 1 correct outcome, and 0 exact scores. No team is used. |
| Predicted win by an already used team, without Reuse | The prediction cannot be saved, even in Exact Score mode. Any previously saved prediction stays in place. |
| Goalscorer, correct winner worth 3 pts, and the selected footballer scores | 6 pts total, including 3 Power Card bonus pts. Count 1 correct outcome and a successful use of the card towards Power Card Master. |
| All or Nothing, predicted 2–0 and official result 2–0 | 6 pts total, including 2 Power Card bonus pts. Count 1 exact score and 1 correct outcome. |
| Skip Round, no match prediction | 1 pt total and 1 Power Card bonus pt. No team is used. To the Finish progress increases by 1. |
| Two leaders have 40 pts, 3 exact scores, and 8 correct outcomes each. One has earned 2 Power Card bonus pts and the other 4. | The player with 2 bonus pts ranks higher. If bonus points are also equal, the tiebreak draw decides the order. |
| A player with 23 rounds of participation uses Skip Round in the next round | They reach 24 rounds of participation and earn one entry to the season prize draw. |
| A prediction is saved before the refresh, but the round locks after it | The selected team and Power Card are checked against the new set. |
| All or Nothing, predicted 2–0 and official result 3–0 | 0 pts total, 0 Power Card bonus pts, 1 correct outcome, and 0 exact scores. |
| Clean Sheet, predicted 3–0 and official 3–0 awarded without the match being played | 4 pts total and 0 Power Card bonus pts. The exact score and outcome count towards achievements; the card is returned. |
