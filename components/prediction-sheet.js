/* Prediction sheet: Figma "2.21 - Prediction / Open" (330:17117, no power card; 440:19105,
   a power card picked and the head-to-head row open), Section 2 (440:19350). It opens on a
   tap on "Прогнозирай" in Прогнози's match list or the Team Modal's next match, with that match's teams, crests, date and
   used teams (the match-card's "К3" marks).

   It always opens on "Изход от мача" with no team picked and 0т. in the top right corner (the
   user's request, 2026-11-16). The top right shows the most the prediction can bring, per the
   official rules (docs/fan-league-rules-bg.md, §3 and §5):
     no pick / an invalid one 0 · a winner 3 · an exact score 4 · "Голмайстор" ×2 ·
     "Чиста мрежа" +2 · "Всичко или нищо" 6 · "Почивка" 1 (instead of the prediction)

   States:
   - the match card is <event-container form>: Изход от мача ↔ Точен Резултат, used teams
     greyed out with their round; picking a used team to win, or a level score, shows the
     card's gold warning until the right power card is added ("Повторен избор", "Равенство").
   - power cards: any available card can be added at any time; one that won't count with the
     prediction as it is stays on, and the card's gold strip says "Коз “…” няма да бъде
     приложен." (P.mismatch; the points are counted without it).
   - power cards: Figma's two panels, "6 НАЛИЧНИ КОЗА" + "Избери Коз" (330:17255) and the
     picked card (440:19335) with the bin to take it off. The list that "Избери Коз" opens
     isn't in Figma: the six official cards in the Правила list's style, the ones that don't
     apply to the prediction as it is greyed out with the reason (clarifications: a card can
     only be added where it is needed). A card that stops applying is taken off.
   - head-to-head (440:19086 closed / 440:19255 open): a tap opens and closes it. The record
     is Figma's sample ("5 победи" each) for every match.
   - "Запази Прогноза" is dimmed while the prediction can't be saved; it saves the prediction as
     the next round's (components/next-prediction.js: the lobby's and Прогнози's slots show it)
     and closes the sheet.

   The info icon by the points opens the points table (Group 61, 448:19962): Figma's four rows,
   and a row for the picked card when it adds points (Figma shows "Чиста Мрежа" 2т; the others
   follow the rules: Голмайстор ×2, Всичко или нищо 6т, Почивка 1т), highlighted. A tap
   anywhere else closes it.

   Close: a tap on the dimmed page, dragging the sheet down, or Escape. */
(function () {
  // Every match-card "Прогнозирай" inside a [data-predict-list="Кръг N"] opens it: Прогнози's
  // Следващ list and the Team Modal's next match (lobby and Прогнози)
  var A = 'assets/lobby-main/';
  var CARDS = 'assets/trump-cards/';

  // The power cards and the rules for them are shared with the saved prediction's slots
  // (components/next-prediction.js)
  var P = window.fensPrediction;
  var TRUMPS = P.TRUMPS;

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var root = document.createElement('div');
  root.className = 'predict-sheet';
  root.hidden = true;
  root.innerHTML =
    '<div class="predict-sheet__backdrop" data-close></div>' +
    '<div class="predict-sheet__panel">' +
      '<span class="predict-sheet__handle" aria-hidden="true"></span>' +
      '<div class="predict-sheet__sheet" role="dialog" aria-modal="true" aria-label="Прогноза">' +
        // Frame 2147208144: the round, "Прогноза за максимум:" and the points
        '<div class="predict-sheet__head">' +
          '<div class="predict-sheet__titles">' +
            '<p class="predict-sheet__round"></p>' +
            '<p class="predict-sheet__label">Прогноза за максимум:</p>' +
          '</div>' +
          '<div class="predict-sheet__points">' +
            '<button class="predict-sheet__info" type="button" aria-label="Как се смятат точките" aria-expanded="false" data-info>' +
              '<img src="' + A + 'icon-info-gold.svg" alt="" width="17.0625" height="17.0625"></button>' +
            '<p class="predict-sheet__points-value"><span class="predict-sheet__points-num">0</span><span class="predict-sheet__points-unit">т.</span></p>' +
          '</div>' +
        '</div>' +
        '<div class="predict-sheet__event"></div>' +
        // Group 61 (448:19962): the points table under the info icon
        '<div class="predict-sheet__tip" hidden>' +
          '<img class="predict-sheet__tip-pointer" src="' + A + 'points-info-pointer.svg" alt="" width="20.5742" height="9.46677">' +
          '<div class="predict-sheet__tip-box"></div>' +
        '</div>' +
        '<div class="predict-sheet__trump"></div>' +
        // Frame 76: the last 10 meetings
        '<button class="predict-sheet__h2h" type="button" aria-expanded="false">' +
          '<span class="predict-sheet__h2h-title">Последни 10 преки двубоя:</span>' +
          '<span class="predict-sheet__h2h-text"></span>' +
          '<span class="predict-sheet__h2h-chevron"><img src="' + A + 'h2h-chevron.svg" alt="" width="5.25" height="9.33333"></span>' +
        '</button>' +
        // Frame 132
        '<button class="predict-sheet__save" type="button" data-save>Запази Прогноза</button>' +
        // "Избери Коз" (Figma 449:20222): the available cards in a carousel, the middle card's
        // rule under it, "Назад" and "Приложи Коз"
        '<div class="predict-sheet__picker" hidden>' +
          '<div class="predict-sheet__picker-head">' +
            '<div class="predict-sheet__titles">' +
              '<p class="predict-sheet__round">Избери Коз</p>' +
              '<p class="predict-sheet__label predict-sheet__label--picker">От наличните ти</p>' +
            '</div>' +
            '<p class="predict-sheet__picker-count"></p>' +
          '</div>' +
          '<div class="trumps trumps--picker predict-sheet__picker-cards" data-size="picker" tabindex="0" aria-label="Козове"></div>' +
          '<p class="predict-sheet__picker-rule"></p>' +
          '<button class="predict-sheet__picker-back" type="button" data-picker-close>' +
            '<img src="' + A + 'icon-arrow-back.svg" alt="" width="10" height="10">Назад</button>' +
          '<button class="predict-sheet__picker-apply" type="button" data-picker-apply>Приложи Коз</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var q = function (s) { return root.querySelector(s); };
  var panel = q('.predict-sheet__panel');
  var event = null;
  var trump = ''; // the picked power card's id
  var match = null;

  // The prediction as it is in the sheet (the shape window.fensPrediction saves)
  function current() {
    return {
      date: match.date, home: match.home, away: match.away,
      homeCrest: match.homeCrest, awayCrest: match.awayCrest,
      homeUsed: match.homeUsed, awayUsed: match.awayUsed,
      variant: event.getAttribute('variant'),
      pick: event.getAttribute('pick') || '',
      homeScore: parseInt(event.getAttribute('home-score'), 10) || 0,
      awayScore: parseInt(event.getAttribute('away-score'), 10) || 0,
      trump: trump
    };
  }

  // exact or not, the winner, whether it's a used team
  function read() { return P.read(current()); }

  // Why a card can't be added right now ('' = it can), per the rules and clarifications
  function blocked(id) { return P.blocked(id, current()); }

  function valid() { return P.valid(current()); }

  // a card that won't be applied (P.mismatch) adds nothing
  function points(p) {
    var t = P.effective(current());
    if (t === 'rest') return 1;
    if (!valid(p)) return 0;
    var base = p.exact ? 4 : 3;
    if (t === 'scorer') return base * 2;
    if (t === 'clean-sheet') return base + 2;
    if (t === 'all-or-nothing') return 6;
    return base;
  }

  // The points table (Figma's four rows), plus a row for the picked card when it adds points
  var CARD_ROW = { 'clean-sheet': '2', scorer: '×2', 'all-or-nothing': '6', rest: '1' };
  function drawTip() {
    var rows = [
      ['Познат победител и точен резултат', '4'],
      ['Познат победител', '3'],
      ['Познат победител, грешен резултат', '2'],
      ['Грешен победител', '0']
    ];
    var t = P.trumpOf(P.effective(current()));
    if (t && CARD_ROW[t.id]) rows.push(['Коз “' + t.name.replace(/ (\S)/g, function (m, c) { return ' ' + c.toUpperCase(); }) + '”', CARD_ROW[t.id], true]);
    q('.predict-sheet__tip-box').innerHTML = rows.map(function (r, i) {
      var num = r[1].charAt(0) === '×' ? r[1] : r[1] + '<small>т</small>';
      return (i ? '<span class="predict-sheet__tip-divider"></span>' : '') +
        '<p class="predict-sheet__tip-row' + (r[2] ? ' is-trump' : '') + '"><span>' + esc(r[0]) + '</span><b>' + num + '</b></p>';
    }).join('');
  }

  function setTip(on) {
    var tip = q('.predict-sheet__tip');
    if (on) drawTip();
    tip.hidden = !on;
    if (on) {
      // the pointer stays under the icon, which moves with the points' width (Figma: x 313)
      var icon = q('[data-info]').getBoundingClientRect();
      var ptr = q('.predict-sheet__tip-pointer');
      ptr.style.left = (icon.left + icon.width / 2 - tip.getBoundingClientRect().left - ptr.offsetWidth / 2) + 'px';
    }
    q('[data-info]').setAttribute('aria-expanded', String(on));
    if (on && tip.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tip.animate([{ opacity: 0, transform: 'translateY(-4px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
        { duration: 180, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    }
  }

  function setPoints(n) {
    var num = q('.predict-sheet__points-num');
    if (num.textContent === String(n)) return;
    num.textContent = n;
    if (num.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      num.animate([{ transform: 'scale(1.18)' }, { transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
    }
  }

  // Figma's power card panels. While the card's "Невалиден залог" warning is up for a level
  // score and no card is on, the panel offers Равенство (449:21195: the card, "Отключи прогноза
  // за равенство.", "Използвай")
  var suggest = '';
  function drawTrump() {
    var box = q('.predict-sheet__trump');
    var t = TRUMPS.filter(function (x) { return x.id === trump; })[0];
    // the card the warning asks for: a level score → Равенство (Figma 449:21195); a used team
    // → Повторен избор (the user's request, 2026-11-16, in the same look)
    var OFFER = {
      draw: { id: 'even', mark: 'Равенство', title: 'Равенство', text: 'Отключи прогноза за равенство.' },
      used: { id: 'repeat', mark: 'Повторен<br>избор', title: 'Повторен избор', text: 'Избери отново вече използван отбор.' }
    };
    var o = OFFER[suggest];
    if (!t && o && P.USED.indexOf(o.id) < 0) {
      box.className = 'predict-sheet__trump predict-sheet__trump--suggest';
      box.innerHTML =
        '<span class="predict-sheet__trump-cards" aria-hidden="true">' +
          '<span class="predict-sheet__trump-back"><img src="' + CARDS + 'b-small.webp" alt=""></span>' +
          '<span class="predict-sheet__trump-front"><img src="' + CARDS + P.trumpOf(o.id).file + '-small.webp" alt=""></span>' +
          '<span class="predict-sheet__trump-mark">' + o.mark + '</span>' +
        '</span>' +
        '<p class="predict-sheet__trump-title">' + o.title + '</p>' +
        '<p class="predict-sheet__trump-text">' + o.text + '</p>' +
        '<button class="predict-sheet__trump-btn" type="button" data-trump="' + o.id + '">Използвай</button>';
      return;
    }
    if (!t) {
      box.className = 'predict-sheet__trump';
      box.innerHTML =
        '<span class="predict-sheet__trump-cards" aria-hidden="true">' +
          '<span class="predict-sheet__trump-back"><img src="' + CARDS + 'b-small.webp" alt=""></span>' +
          '<span class="predict-sheet__trump-front"><img src="' + CARDS + 'b-small.webp" alt=""></span>' +
        '</span>' +
        '<p class="predict-sheet__trump-title"><span>' + (TRUMPS.length - P.USED.length) + '</span> НАЛИЧНИ КОЗА</p>' +
        '<p class="predict-sheet__trump-text">Промени играта с един ход. Избери коз за този кръг.</p>' +
        '<button class="predict-sheet__trump-btn" type="button" data-picker-open>Избери Коз</button>';
      return;
    }
    box.className = 'predict-sheet__trump predict-sheet__trump--picked';
    box.innerHTML =
      '<span class="predict-sheet__trump-cards" aria-hidden="true">' +
        '<span class="predict-sheet__trump-back"><img src="' + CARDS + 'b-small.webp" alt=""></span>' +
        '<span class="predict-sheet__trump-front"><img src="' + CARDS + t.file + '-small.webp" alt="">' +
          // the card's name printed on its front, as on the Равенство offer (the user's request)
          '<span class="predict-sheet__trump-front-name">' + esc(t.name.toUpperCase()).replace(' ', '<br>') + '</span></span>' +
      '</span>' +
      '<p class="predict-sheet__trump-title">' + esc(t.name.toUpperCase()) + '</p>' +
      '<p class="predict-sheet__trump-text">' + t.panel + '</p>' +
      '<span class="predict-sheet__trump-divider" aria-hidden="true"></span>' +
      // an X in place of Figma's bin (the user's request, 2026-11-16): the "Премахни" label's
      // X (icon-close.svg) in the bin's grey
      '<button class="predict-sheet__trump-bin" type="button" data-trump-remove aria-label="Махни коза">' +
        '<img src="' + A + 'icon-close-grey.svg" alt="" width="12" height="12"></button>';
  }

  // The available cards (not the used ones), in the carousel; it opens on the picked card, or
  // the first one that applies to the prediction as it is
  var pickerCards = [];
  var pickerAt = 0;
  function drawPicker() {
    pickerCards = TRUMPS.filter(function (t) { return P.USED.indexOf(t.id) < 0; });
    var start = pickerCards.map(function (t) { return t.id; }).indexOf(trump);
    if (start < 0) {
      start = 0;
      for (var i = 0; i < pickerCards.length; i++) if (!blocked(pickerCards[i].id)) { start = i; break; }
    }
    q('.predict-sheet__picker-count').textContent = pickerCards.length;
    var old = q('.predict-sheet__picker-cards');
    var track = old.cloneNode(false); // a fresh track: the carousel sets itself up on it
    track.setAttribute('data-start', start);
    track.innerHTML = pickerCards.map(function (t) {
      return '<div class="trump">' +
          '<img class="trump__bgr" src="' + CARDS + t.file + '.webp" alt="" draggable="false">' +
          '<div class="trump__info' + (t.info === '6/0' ? ' trump__info--small' : '') + '">' + t.info + '</div>' +
          '<div class="trump__content"><div class="trump__text">' +
            '<p class="trump__name">' + esc(t.name.toUpperCase()).replace(' ', '<br>') + '</p>' +
          '</div><span class="trump__link" aria-hidden="true"></span></div>' +
        '</div>';
    }).join('');
    old.replaceWith(track);
    track.addEventListener('trumpcentre', function (e) {
      pickerAt = e.detail.index;
      drawRule();
      // the A2c "Дъги" current goes onto the card in the middle (components/card-fx.js)
      if (window.CardFx) window.CardFx.attach(track.querySelectorAll('.trump')[pickerAt]);
    });
    // the rule moves with the cards (the user's request): as the middle card leaves, its text
    // fades out and drifts the same way; the next one's comes in as that card arrives, and is
    // fully there once it has settled
    track.addEventListener('trumpmove', function (e) {
      var d = e.detail.offset;
      var rule = q('.predict-sheet__picker-rule');
      rule.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 2));
      rule.style.transform = d ? 'translateX(' + (-d * 40) + 'px)' : '';
    });
    pickerAt = start;
    drawRule();
    return track;
  }

  // the middle card's rule; when it can't go on this prediction, the reason instead and
  // "Приложи Коз" dimmed
  function drawRule() {
    var t = pickerCards[pickerAt];
    if (!t) return;
    var why = blocked(t.id);
    var rule = q('.predict-sheet__picker-rule');
    // one inline box, so the flex centring doesn't split the text from its gold part
    rule.innerHTML = '<span>' + (why ? '<span class="predict-sheet__picker-why">' + esc(why) + '</span>' : t.rule) + '</span>';
    q('[data-picker-apply]').disabled = !!why;
  }

  function setPicker(on) {
    var picker = q('.predict-sheet__picker');
    if (on) {
      picker.hidden = false;
      root.classList.add('is-picking');
      var track = drawPicker();
      if (window.initTrumpCarousel) window.initTrumpCarousel(track);
      // everything comes in at once (the user's request): hidden until the cards' pictures are
      // ready (at most 400ms), then the whole view fades in
      picker.style.opacity = '0';
      var imgs = Array.prototype.map.call(track.querySelectorAll('img'), function (img) {
        return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      });
      var shown = false;
      var show = function () {
        if (shown) return;
        shown = true;
        picker.style.opacity = '';
        if (picker.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          picker.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
        }
      };
      Promise.all(imgs).then(show);
      setTimeout(show, 400);
    } else {
      picker.hidden = true;
      root.classList.remove('is-picking');
      if (window.CardFx) window.CardFx.stop();
    }
  }

  function applyTrump(id) {
    trump = id;
    // Равенство in Изход от мача: the prediction becomes the draw ("Равен", both teams)
    if (trump === 'even' && event.getAttribute('variant') !== 'correct-score') event.setAttribute('pick', 'draw');
    setPicker(false);
    drawTrump();
    update();
  }

  // Everything that follows the prediction: the card's allow-* flags, the card that stopped
  // applying, the points and the save button
  function update() {
    // the pick and the card kept in step (P.settle: Равенство in Изход от мача is the draw pick)
    var s0 = P.settle(current());
    if (s0.trump !== trump) {
      trump = s0.trump;
      drawTrump();
    }
    if ((event.getAttribute('pick') || '') !== s0.pick) event.setAttribute('pick', s0.pick);
    var want = { 'allow-used': trump === 'repeat', 'allow-draw': trump === 'even' };
    Object.keys(want).forEach(function (k) {
      if (want[k] !== event.hasAttribute(k)) {
        if (want[k]) event.setAttribute(k, '');
        else event.removeAttribute(k);
      }
    });
    // the card that won't be applied with this prediction: the gold strip says so
    var warn = P.mismatchText(current());
    if ((event.getAttribute('trump-warning') || '') !== warn) {
      if (warn) event.setAttribute('trump-warning', warn);
      else event.removeAttribute('trump-warning');
    }
    // Почивка on: the match card makes way for the Почивка panel (event-container
    // variant="rest", Figma 458:22492), as in the slots
    var box = q('.predict-sheet__event');
    var rest = box.querySelector('[data-sheet-rest]');
    if (trump === 'rest' && !rest) {
      rest = document.createElement('event-container');
      rest.setAttribute('variant', 'rest');
      rest.setAttribute('data-sheet-rest', '');
      box.appendChild(rest);
    } else if (trump !== 'rest' && rest) rest.remove();
    box.classList.toggle('is-rest', trump === 'rest');
    var p = read();
    if (!q('.predict-sheet__tip').hidden) drawTip();
    setPoints(points(p));
    q('[data-save]').disabled = !valid(p);
  }

  // m: the match; saved (optional): a saved prediction to start from; picker: open on
  // "Избери Коз" (the card icons in a saved prediction's corner)
  function open(m, saved, picker) {
    match = m;
    trump = '';
    suggest = '';
    q('.predict-sheet__round').textContent = m.round;
    var box = q('.predict-sheet__event');
    box.innerHTML = '';
    event = document.createElement('event-container');
    event.setAttribute('form', '');
    event.setAttribute('variant', 'match-outcome');
    event.setAttribute('pick', '');
    event.setAttribute('date', m.date);
    event.setAttribute('home', m.home);
    event.setAttribute('away', m.away);
    event.setAttribute('home-crest', m.homeCrest);
    event.setAttribute('away-crest', m.awayCrest);
    if (m.homeUsed) event.setAttribute('home-used', m.homeUsed);
    if (m.awayUsed) event.setAttribute('away-used', m.awayUsed);
    if (saved) {
      event.setAttribute('variant', saved.variant);
      event.setAttribute('pick', saved.pick || '');
      event.setAttribute('home-score', saved.homeScore);
      event.setAttribute('away-score', saved.awayScore);
      trump = saved.trump || '';
    }
    box.appendChild(event);
    event.addEventListener('change', update);
    event.addEventListener('warning', function (e) {
      suggest = e.detail.kind;
      if (!trump) drawTrump();
    });
    q('.predict-sheet__h2h-text').textContent =
      m.home.replace(/\n/g, ' ') + ': 5 победи · ' + m.away.replace(/\n/g, ' ') + ': 5 победи';
    setH2h(false);
    setPicker(false);
    setTip(false);
    drawTrump();
    q('.predict-sheet__points-num').textContent = '0';
    update();

    root.hidden = false;
    if (picker) setPicker(true);
    document.documentElement.classList.add('predict-sheet-open');
    root.classList.remove('is-closing');
    void root.offsetWidth;
    root.classList.add('is-open');
  }

  function close() {
    if (root.hidden || root.classList.contains('is-closing')) return;
    root.classList.remove('is-open');
    root.classList.add('is-closing');
    setTimeout(function () {
      root.hidden = true;
      root.classList.remove('is-closing');
      document.documentElement.classList.remove('predict-sheet-open');
    }, 250);
  }

  function setH2h(on) {
    var h = q('.predict-sheet__h2h');
    h.classList.toggle('is-open', on);
    h.setAttribute('aria-expanded', String(on));
  }

  // The match a "Прогнозирай" belongs to, read from its match-card
  function matchOf(card, list) {
    function side(logo) {
      var name = logo.querySelector('.team-logo__name');
      var used = logo.classList.contains('team-logo--disabled') && logo.querySelector('.team-logo__used');
      return {
        name: name.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim(),
        // the match-card's 180px copy → the 360px one for the 114 × 68 slot
        crest: logo.querySelector('img').getAttribute('src').replace('-small.webp', '.webp'),
        used: used ? used.textContent.trim() : ''
      };
    }
    var logos = card.querySelectorAll('.team-logo');
    var h = side(logos[0]), a = side(logos[1]);
    return {
      round: list.getAttribute('data-predict-list'),
      date: card.querySelector('.time-stamp span').textContent.trim(),
      home: h.name, away: a.name, homeCrest: h.crest, awayCrest: a.crest,
      homeUsed: h.used, awayUsed: a.used
    };
  }

  // a saved prediction's sheet, straight on "Избери Коз" (components/next-prediction.js: the
  // card icons in its corner)
  window.openPredictionSheet = function (saved, round) {
    open({
      round: round, date: saved.date, home: saved.home, away: saved.away,
      homeCrest: saved.homeCrest, awayCrest: saved.awayCrest,
      homeUsed: saved.homeUsed || '', awayUsed: saved.awayUsed || ''
    }, saved, false);
  };

  window.openPredictionPicker = function (saved, round) {
    open({
      round: round, date: saved.date, home: saved.home, away: saved.away,
      homeCrest: saved.homeCrest, awayCrest: saved.awayCrest,
      homeUsed: saved.homeUsed || '', awayUsed: saved.awayUsed || ''
    }, saved, true);
  };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.match-card__middle--action .secondary-btn');
    var list = btn && btn.closest('[data-predict-list]');
    if (!list) return;
    open(matchOf(btn.closest('.match-card'), list));
  });

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-info]')) {
      setTip(q('.predict-sheet__tip').hidden);
      return;
    }
    if (!q('.predict-sheet__tip').hidden && !e.target.closest('.predict-sheet__tip')) setTip(false);
    if (e.target.closest('[data-close]')) { close(); return; }
    if (e.target.closest('.predict-sheet__h2h')) {
      setH2h(!q('.predict-sheet__h2h').classList.contains('is-open'));
      return;
    }
    if (e.target.closest('[data-picker-open]')) { setPicker(true); return; }
    if (e.target.closest('[data-picker-close]')) { setPicker(false); return; }
    var apply = e.target.closest('[data-picker-apply]');
    if (apply) {
      if (apply.disabled || !pickerCards[pickerAt] || root.classList.contains('is-slamming')) return;
      var id = pickerCards[pickerAt].id;
      var card = q('.predict-sheet__picker-cards').querySelectorAll('.trump')[pickerAt];
      // the slam (components/card-fx.js): the card is hit on the table, then it goes on
      if (window.CardFx && card) {
        root.classList.add('is-slamming');
        window.CardFx.slam(card, q('.predict-sheet__picker'), function () {
          root.classList.remove('is-slamming');
          applyTrump(id);
        });
      } else applyTrump(id);
      return;
    }
    // the offers' "Използвай" (Равенство, Повторен избор)
    var pick = e.target.closest('[data-trump]');
    if (pick && !pick.disabled) { applyTrump(pick.getAttribute('data-trump')); return; }
    if (e.target.closest('[data-trump-remove]')) {
      trump = '';
      drawTrump();
      update();
      return;
    }
    var save = e.target.closest('[data-save]');
    if (save && !save.disabled) {
      // it becomes the next round's prediction, in every slot that shows it
      P.save(current(), null);
      close();
    }
  });

  // Drag down to close, as the Team Modal: the sheet follows the finger down, the dimmed page
  // lightens with it; past 120px or a quick flick it closes, otherwise it springs back
  var backdrop = q('.predict-sheet__backdrop');
  var drag = null;
  var draggedAt = 0;
  panel.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || root.classList.contains('is-closing')) return;
    if (e.target.closest('.trumps')) return; // the card carousel swipes sideways
    drag = { id: e.pointerId, y: e.clientY, dy: 0, t: e.timeStamp, v: 0, moving: false };
  });
  panel.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dy = Math.max(0, e.clientY - drag.y);
    if (!drag.moving) {
      if (dy < 6) return;
      drag.moving = true;
      try { panel.setPointerCapture(e.pointerId); } catch (err) { /* already gone */ }
      panel.style.transition = 'none';
      backdrop.style.transition = 'none';
    }
    var dt = e.timeStamp - drag.t;
    if (dt > 0) drag.v = (dy - drag.dy) / dt;
    drag.dy = dy;
    drag.t = e.timeStamp;
    panel.style.transform = 'translate(-50%, ' + dy + 'px)';
    backdrop.style.opacity = String(Math.max(0, 1 - dy / panel.offsetHeight));
  });
  function release(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    if (!d.moving) return;
    draggedAt = performance.now();
    panel.style.transition = '';
    backdrop.style.transition = '';
    void panel.offsetWidth;
    panel.style.transform = '';
    backdrop.style.opacity = '';
    if (d.dy > 120 || d.v > 0.5) close();
  }
  panel.addEventListener('pointerup', release);
  panel.addEventListener('pointercancel', release);
  panel.addEventListener('click', function (e) {
    if (performance.now() - draggedAt > 300) return;
    draggedAt = 0;
    e.stopPropagation();
    e.preventDefault();
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !root.hidden) close();
  });
})();
