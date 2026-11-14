# Фенска Лига: the rules of the game

From the user, 2026-11-14. This is the source for the Правила page and for any copy that states a rule. Not served on the site (`.assetsignore`).

## Season
- A season has 26 rounds, split into two half-seasons.
- Each round you pick one match and make one prediction.
- Predictions lock when the round starts. A round you don't predict ("пропуск") is a 0-point bet.
- Using Почивка instead gives 1 point (the card's own effect).

## Points
| Prediction | Result | Points |
|---|---|---|
| Изход от мача | correct outcome | 3 |
| Точен резултат | exact score | 4 |
| Точен резултат | wrong score, correct outcome | 2 |
| any | wrong outcome | 0 |

- Postponed matches count in the ranking like any other; their points come later in the half-season.

## Teams
- The league should have 14 teams; the project keeps all 15 crests for now (user, 2026-11-14).
- The team you pick is the one that's used (not its opponent). Every team can be used once per half-season.
- You can't run out: there are more teams than rounds.

## Power cards (козове)
- 6 cards, restored at the start of each half-season.
- At most one card per round.
- Texts (Figma 231:11202):
  - Равенство: unlocks a prediction of a draw.
  - Повторение: pick an already used team again.
  - Голмайстор: if the chosen player scores, double points.
  - Почивка: skip a round, keep the streak, get a point.
  - Чиста мрежа: a win without conceding gives 2 extra points.
  - Всичко или нищо: exact score gives 6 points, otherwise 0.

## Ranking and prizes
- Ranking for the season and for the half-season.
- Ties are broken in this order (user's choice, 2026-11-14):
  1. More correctly guessed exact scores.
  2. More correct outcomes.
  3. Fewer bonus points from power cards.
  4. Still level: the players share the place; the prizes for the places they cover are added together and split equally.
- Prizes below the podium are credited directly to the players in the stated positions.

## Streak
- The streak exists only for achievements (подвизи); it gives no points by itself.

## Achievements (подвизи)
| Подвиг | Кратко описание | Дълго описание |
|---|---|---|
| Серия от познати изходи: Хеттрик · Във форма · Безпогрешен | 3 / 5 / 10 поредни познати изхода. | Отключваш „Хеттрик“ при 3, „Във форма“ при 5 и „Безпогрешен“ при 10 поредни познати изхода. Грешна прогноза или пропуснат кръг прекъсва серията. Козът „Почивка“ я запазва, без да я увеличава. |
| Точни резултати: Снайперист · Експерт · Прецизен анализатор | Общо 3 / 5 / 10 точни резултата. | Отключваш „Снайперист“ при 3, „Експерт“ при 5 и „Прецизен анализатор“ при 10 познати точни резултата през сезона. Не е нужно да са поредни. |
| Поредни точни резултати: Двоен точен · Троен точен | 2 / 3 поредни точни резултата. | Отключваш „Двоен точен“ при точен резултат в 2 последователни кръга, а „Троен точен“ — в 3. Познат само изход, пропуск или „Почивка“ прекъсва поредицата. |
| Победи с различни отбори: Разнообразие · Познавач на лигата | Познай победи на 5 / 10 различни отбора. | Отключваш „Разнообразие“ при 5, а „Познавач на лигата“ — при 10 различни отбора, чиито победи си познал. Всеки отбор се брои само веднъж за сезона. |
| Перфектен месец | Познай изхода във всеки кръг от месеца. | Познай изхода във всички кръгове от един месечен период на играта. Пропуск или използване на „Почивка“ означава, че не можеш да отключиш подвига за този период. |
| Голов спектакъл | Точен резултат с поне 5 гола. | Познай точния резултат в мач с поне 5 гола общо. Например 3:2 и 4:1 покриват условието. |
| Майстор на козовете | Спечели бонус с 3 конкретни коза. | Спечели бонус точки с всеки от трите коза: „Голмайстор“, „Чиста мрежа“ и „Всичко или нищо“. Можеш да изпълниш условията в различни полусезони. |
| Силен финал | Познай изхода в последните 3 кръга. | Познай изхода в кръгове 24, 25 и 26. „Почивка“ не замества правилна прогноза. |
| До финала | Участвай в поне 24 от 26 кръга. | Брои се всяка подадена навреме прогноза, дори да е грешна или мачът впоследствие да бъде отменен, както и използването на „Почивка“. При 24 участия получаваш едно участие в сезонното теглене. |
| Дерби усет | Познай точния резултат в дерби. | Познай точния резултат в мач, предварително обозначен като дерби в играта. Познатият само изход не е достатъчен. |

Всяка степен и всеки самостоятелен подвиг се награждават **веднъж за сезона**. Прогресът се запазва между полусезоните, а една прогноза може да отключи няколко подвига. Наградите от подвизи не добавят точки към класирането.

Achievement rewards are usually freebet credit or money.

Achievement images (`assets/achievements/`): hat-trick, in-form, flawless, sniper, expert, precise-analyst, double-exact, triple-exact, variety, league-connoisseur, perfect-month, goal-spectacle, trump-master, strong-finish, full-season (= „До финала“), derby-instinct.
