/* The prediction for the next round (Следващ • Кръг 7), shared by every page (2026-11-16, the
   user's request). One saved prediction, kept in localStorage ("fens-next-prediction"), and
   every slot that shows the next round's prediction draws itself from it, so they always show
   the same: the lobby's prediction panel and Прогнози's prediction-container (Следващ).

   - Nothing saved: the slot shows the empty state, <event-container variant="no-match">.
   - Saved: the match card with the prediction, editable (Изход от мача / Точен резултат, the
     pick, the score). With a power card, the active-trump-label sits over it ("Активен коз:",
     "Премахни"); without one, the trump cards show in the card's corner (trump-card), as the
     lobby's picked-match card in Figma.
   - "Запази Прогноза" in the prediction sheet (components/prediction-sheet.js) saves; an edit
     in a slot saves too, and the other slots follow (other open tabs as well, via "storage").

   A power card that stops applying after an edit is taken off, and a used team / level score
   shows the card's gold warning, by the same rules as the sheet (blocked() below).

   window.fensPrediction: { TRUMPS, get(), save(p), clear(), blocked(id, p), valid(p) }
   p = { date, home, away, homeCrest, awayCrest, homeUsed, awayUsed,
         variant, pick, homeScore, awayScore, trump } */
(function () {
  var KEY = 'fens-next-prediction';
  var A = 'assets/lobby-main/';
  var CARDS = 'assets/trump-cards/';

  // The six power cards (official names)
  var TRUMPS = [
    { id: 'even', name: 'Равенство', file: 'even',
      info: 'X', rule: 'Единственият начин да прогнозираш <b>равенство</b>. Не използва отбор. Познато равенство носи 3 точки, точен равен резултат — 4.',
      short: 'Единственият начин да прогнозираш равенство.',
      panel: 'Прогнозата за равен резултат е <b>валидна</b>.' },
    { id: 'repeat', name: 'Повторен избор', file: 'repeat',
      info: '<img src="assets/lobby-main/icon-card-swap.svg" alt="" width="14" height="14">', rule: 'Избери за победител <b>вече използван отбор</b> още веднъж. Отборът остава използван, точките са обичайните.',
      short: 'Избери за победител вече използван отбор.',
      panel: 'Избери отново <b>вече използван</b> отбор.' },
    { id: 'scorer', name: 'Голмайстор', file: 'scorer',
      info: 'x2', rule: 'Избери играч от мача. Ако отбележи в редовното или добавеното време, точките ти се <b>удвояват</b>.',
      short: 'Ако избраният играч отбележи: двойни точки.',
      panel: 'Ако избраният играч отбележи, точките се <b>удвояват</b>.' },
    { id: 'all-or-nothing', name: 'Всичко или нищо', file: 'all-or-nothing',
      info: '6/0', rule: 'Само за точен резултат: познатият носи <b>6 точки</b>, всеки друг резултат — 0.',
      short: 'Само за точен резултат: 6 точки или 0.',
      panel: 'Познат точен резултат носи <b>6 точки</b>, иначе 0.' },
    { id: 'rest', name: 'Почивка', file: 'rest',
      info: '+1', rule: 'Пропускаш кръга и получаваш <b>1 точка</b>, без да използваш отбор. Серията ти се запазва.',
      short: 'Пропусни кръга и вземи 1 точка.',
      panel: 'Пропускаш кръга и получаваш <b>1 точка</b>.' },
    { id: 'clean-sheet', name: 'Чиста мрежа', file: 'clean-sheet',
      info: '+2', rule: 'Получаваш <b>2 допълнителни точки</b>, ако избраният отбор спечели, без да допусне гол. В противен случай получаваш обичайните точки за прогнозата си.',
      short: 'При победа без допуснат гол: +2 точки.',
      panel: 'При победа без допуснат гол получаваш <b>+2 точки.</b>' }
  ];

  // Already used this half-season (sample, the same as the lobby's Козове: 4 available / 2 used,
  // the user's request 2026-11-16)
  // (Повторен избор kept available since the sheet offers it for a used team)
  var USED = ['scorer', 'all-or-nothing'];

  function trumpOf(id) { return TRUMPS.filter(function (t) { return t.id === id; })[0]; }

  // "Чиста мрежа" → "Чиста Мрежа", as Figma writes the names in labels
  function titleCase(name) {
    return name.replace(/(^|\s)(\S)/g, function (m, s, c) { return s + c.toUpperCase(); });
  }

  // What the prediction is: exact or not, the winner ('home' | 'away' | 'draw' | ''), whether
  // the winner is a used team
  function read(p) {
    var exact = p.variant === 'correct-score';
    var hs = +p.homeScore || 0, as = +p.awayScore || 0;
    var winner = exact ? (hs > as ? 'home' : as > hs ? 'away' : 'draw') : (p.pick || '');
    var used = winner === 'home' ? !!p.homeUsed : winner === 'away' ? !!p.awayUsed : false;
    return { exact: exact, winner: winner, used: used };
  }

  // Why a card can't be added to this prediction ('' = it can): the rules and clarifications
  // (a card only where it is needed)
  // Why a card can't be added ('' = it can). An available card can be added at any time (the
  // user's request, 2026-11-16); only a used one can't. Whether it then counts is mismatch().
  function blocked(id) {
    return USED.indexOf(id) >= 0 ? 'Вече е използван този полусезон.' : '';
  }

  // The card that's on but won't count with the prediction as it is ('' = it counts, or there
  // is no pick yet). The card stays on and the match card shows "Коз “…” няма да бъде
  // приложен." (the user's request, 2026-11-16):
  // - Равенство: a Точен резултат that isn't level
  // - Повторен избор: a winner that isn't a used team, or a draw
  // - Голмайстор: a draw
  // - Чиста мрежа: a draw, or a Точен резултат where the winner concedes (e.g. 2:1)
  // - Всичко или нищо: Изход от мача, or a draw
  // - Почивка: always counts
  function mismatch(p) {
    var t = p.trump;
    if (!t || t === 'rest') return '';
    var r = read(p);
    if (!r.winner) return '';
    var draw = r.winner === 'draw';
    var hs = +p.homeScore || 0, as = +p.awayScore || 0;
    switch (t) {
      case 'even': return r.exact && !draw ? t : '';
      case 'repeat': return draw || !r.used ? t : '';
      case 'scorer': return draw ? t : '';
      case 'clean-sheet': return draw || (r.exact && Math.min(hs, as) > 0) ? t : '';
      case 'all-or-nothing': return !r.exact || draw ? t : '';
    }
    return '';
  }

  // the card that counts ('' when none is on or it won't be applied)
  function effective(p) { return p.trump && !mismatch(p) ? p.trump : ''; }

  // the gold strip's text for a card that won't be applied
  function mismatchText(p) {
    var t = trumpOf(mismatch(p));
    return t ? 'Коз <b>“' + t.name + '”</b> няма да бъде приложен.' : '';
  }

  // Keeps the pick and the card in step after a change (the user's request, 2026-11-16: a draw
  // in Изход от мача is the Равенство card):
  // - Изход от мача with Равенство is the draw pick; picking a team instead takes the card off
  // - a draw pick without Равенство is no pick
  function settle(p) {
    p = Object.assign({}, p);
    var outcome = p.variant !== 'correct-score';
    if (outcome && p.trump === 'even' && (p.pick === 'home' || p.pick === 'away')) p.trump = '';
    if (outcome && p.trump !== 'even' && p.pick === 'draw') p.pick = '';
    return p;
  }

  // a prediction that can be saved: a card that won't be applied counts as no card
  function valid(p) {
    var r = read(p);
    var t = effective(p);
    if (t === 'rest') return true;
    if (!r.winner) return false;
    if (r.winner === 'draw') return t === 'even';
    return !r.used || t === 'repeat';
  }

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      var p = raw ? JSON.parse(raw) : null;
      // anything that isn't a whole prediction counts as none (the empty state)
      return p && p.home && p.away && p.homeCrest && p.awayCrest && p.variant ? p : null;
    } catch (e) { return null; }
  }

  var listeners = [];
  function changed(p, from) {
    listeners.forEach(function (fn) { fn(p, from); });
  }

  function save(p, from) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* kept for this page only */ }
    memory = p;
    changed(p, from);
  }

  function clear(from) {
    try { localStorage.removeItem(KEY); } catch (e) { /* storage blocked */ }
    memory = null;
    changed(null, from);
  }

  var memory = get();

  window.fensPrediction = {
    TRUMPS: TRUMPS, USED: USED, trumpOf: trumpOf, titleCase: titleCase,
    get: function () { return memory; }, save: save, clear: clear,
    blocked: blocked, valid: valid, read: read, settle: settle,
    mismatch: mismatch, effective: effective, mismatchText: mismatchText,
    onChange: function (fn) { listeners.push(fn); }
  };

  // ---------- the slots ----------
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // active-trump-label (273:8186) with "Премахни"
  function labelHtml(t) {
    return '<div class="trump-label">' +
        '<span class="trump-label__cards" aria-hidden="true">' +
          '<span class="trump-label__card trump-label__card--1"><img src="' + CARDS + 'a-small.webp" alt=""></span>' +
          '<span class="trump-label__card trump-label__card--2"><img src="' + CARDS + 'a-small.webp" alt=""></span>' +
          '<span class="trump-label__card trump-label__card--3"><img src="' + CARDS + 'a-small.webp" alt=""></span>' +
        '</span>' +
        '<p class="trump-label__text"><span>Активен коз:</span> <strong>“' + esc(titleCase(t.name)) + '”</strong></p>' +
        '<button class="trump-label__remove" type="button" data-trump-off>Премахни <span class="trump-label__close"><img src="' + A + 'icon-close.svg" alt=""></span></button>' +
      '</div>';
  }

  // the card's attributes for a saved prediction
  function cardAttrs(card, p) {
    var set = {
      variant: p.variant, state: 'default', date: p.date, home: p.home, away: p.away,
      'home-crest': p.homeCrest, 'away-crest': p.awayCrest, pick: p.pick || '',
      'home-score': p.homeScore, 'away-score': p.awayScore,
      'home-used': p.homeUsed || null, 'away-used': p.awayUsed || null,
      'allow-used': p.trump === 'repeat' ? '' : null,
      'allow-draw': p.trump === 'even' ? '' : null,
      'trump-card': p.trump ? null : '',
      'trump-warning': mismatchText(p) || null,
      'no-draw-card': USED.indexOf('even') >= 0 ? '' : null
    };
    Object.keys(set).forEach(function (k) {
      var v = set[k];
      if (v === null || v === undefined) { if (card.hasAttribute(k)) card.removeAttribute(k); }
      else if (card.getAttribute(k) !== String(v)) card.setAttribute(k, v);
    });
  }

  function draw(slot) {
    var p = memory;
    var note = slot.getAttribute('data-next-note');
    if (!p) {
      slot.innerHTML = '<event-container variant="no-match"' + (note ? ' note="' + esc(note) + '"' : '') + '></event-container>';
      return;
    }
    // Почивка on: the round is skipped, the slot shows "Днес гледаш от трибуните." (Figma's
    // Power Card Rest, 458:22492) instead of the match card; a tap opens the sheet to change it
    if (p.trump === 'rest') {
      slot.innerHTML = '<event-container variant="rest" data-rest-open></event-container>';
      return;
    }
    var t = trumpOf(p.trump);
    slot.innerHTML = (t ? labelHtml(t) : '') + '<event-container></event-container>';
    cardAttrs(slot.querySelector('event-container'), p);
  }

  function wire(slot) {
    draw(slot);
    // edits in the slot's card: the prediction is saved as it is now
    slot.addEventListener('change', function (e) {
      var card = e.target.closest('event-container');
      if (!card || !memory) return;
      var p = Object.assign({}, memory, {
        variant: card.getAttribute('variant'),
        pick: card.getAttribute('pick') || '',
        homeScore: +card.getAttribute('home-score') || 0,
        awayScore: +card.getAttribute('away-score') || 0
      });
      save(settle(p), slot);
    });
    slot.addEventListener('click', function (e) {
      // Почивка's panel: the sheet for this prediction, to change or take off the card
      if (e.target.closest('[data-rest-open]') && memory && window.openPredictionSheet) {
        window.openPredictionSheet(memory, slot.getAttribute('data-next-round') || 'Кръг 7');
        return;
      }
      // the card icons in the corner (no card on yet): the sheet on "Избери Коз"
      // (components/prediction-sheet.js), for this prediction
      if (e.target.closest('.event__trump') && memory && window.openPredictionPicker) {
        window.openPredictionPicker(memory, slot.getAttribute('data-next-round') || 'Кръг 7');
        return;
      }
      if (!e.target.closest('[data-trump-off]') || !memory) return;
      save(settle(Object.assign({}, memory, { trump: '' })), null); // redraws the slot: label off, corner cards on
    });
  }

  // follow a change: a full redraw when it came from elsewhere; in the slot that made the edit
  // only the trump label and the card's flags change, so its card keeps its animations
  function follow(slot, p, from) {
    var isRest = !!slot.querySelector('event-container[variant="rest"]');
    if (from !== slot || isRest !== !!(p && p.trump === 'rest')) { draw(slot); restPanel(p); return; }
    var label = slot.querySelector('.trump-label');
    var t = p && trumpOf(p.trump);
    if (label && !t) label.remove();
    var card = slot.querySelector('event-container');
    if (card && p) {
      // set quietly what the card already shows; only the trump flags may need a redraw
      cardAttrs(card, p);
    }
  }

  // Прогнози's График ends with the Почивка feature-panel; with Почивка already on for the
  // round it's hidden (the user's request, 2026-11-16)
  function restPanel(p) {
    document.querySelectorAll('[data-rest-panel]').forEach(function (el) {
      el.classList.toggle('is-rest-on', !!(p && p.trump === 'rest'));
    });
  }

  function start() {
    restPanel(memory);
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-next-slot]'));
    slots.forEach(wire);
    window.fensPrediction.onChange(function (p, from) {
      restPanel(p);
      slots.forEach(function (slot) { follow(slot, p, from); });
    });
    // another tab saved: follow it
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY) return;
      memory = get();
      slots.forEach(draw);
      restPanel(memory);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
