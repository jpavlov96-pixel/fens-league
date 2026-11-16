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
      short: 'Единственият начин да прогнозираш равенство.',
      panel: 'Прогнозата за равен резултат е <b>валидна</b>.' },
    { id: 'repeat', name: 'Повторен избор', file: 'repeat',
      short: 'Избери за победител вече използван отбор.',
      panel: 'Избери отново <b>вече използван</b> отбор.' },
    { id: 'scorer', name: 'Голмайстор', file: 'scorer',
      short: 'Ако избраният играч отбележи: двойни точки.',
      panel: 'Ако избраният играч отбележи, точките се <b>удвояват</b>.' },
    { id: 'all-or-nothing', name: 'Всичко или нищо', file: 'all-or-nothing',
      short: 'Само за точен резултат: 6 точки или 0.',
      panel: 'Познат точен резултат носи <b>6 точки</b>, иначе 0.' },
    { id: 'rest', name: 'Почивка', file: 'rest',
      short: 'Пропусни кръга и вземи 1 точка.',
      panel: 'Пропускаш кръга и получаваш <b>1 точка</b>.' },
    { id: 'clean-sheet', name: 'Чиста мрежа', file: 'clean-sheet',
      short: 'При победа без допуснат гол: +2 точки.',
      panel: 'При победа без допуснат гол получаваш <b>+2 точки.</b>' }
  ];

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
  function blocked(id, p) {
    var r = read(p);
    var hasWinner = r.winner === 'home' || r.winner === 'away';
    switch (id) {
      case 'rest': return '';
      case 'even': return r.exact && r.winner === 'draw' ? '' : 'Само за равен точен резултат.';
      case 'repeat': return r.used ? '' : 'Само за вече използван отбор.';
      case 'all-or-nothing':
        if (!r.exact) return 'Само за точен резултат.';
        if (!hasWinner) return 'Само за прогноза с победител.';
        return r.used ? 'Отборът е използван.' : '';
      default: // scorer, clean-sheet
        if (!hasWinner) return 'Само за прогноза с победител.';
        return r.used ? 'Отборът е използван.' : '';
    }
  }

  function valid(p) {
    var r = read(p);
    if (p.trump === 'rest') return true;
    if (!r.winner) return false;
    if (r.winner === 'draw') return p.trump === 'even';
    return !r.used || p.trump === 'repeat';
  }

  function get() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
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
    TRUMPS: TRUMPS, trumpOf: trumpOf, titleCase: titleCase,
    get: function () { return memory; }, save: save, clear: clear,
    blocked: blocked, valid: valid, read: read,
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
      'trump-card': p.trump ? null : ''
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
      // a card that no longer applies is taken off (Почивка always applies)
      if (p.trump && p.trump !== 'rest' && blocked(p.trump, p)) p.trump = '';
      save(p, slot);
    });
    slot.addEventListener('click', function (e) {
      if (!e.target.closest('[data-trump-off]') || !memory) return;
      save(Object.assign({}, memory, { trump: '' }), null); // redraws the slot: label off, corner cards on
    });
  }

  // follow a change: a full redraw when it came from elsewhere; in the slot that made the edit
  // only the trump label and the card's flags change, so its card keeps its animations
  function follow(slot, p, from) {
    if (from !== slot) { draw(slot); return; }
    var label = slot.querySelector('.trump-label');
    var t = p && trumpOf(p.trump);
    if (label && !t) label.remove();
    var card = slot.querySelector('event-container');
    if (card && p) {
      // set quietly what the card already shows; only the trump flags may need a redraw
      cardAttrs(card, p);
    }
  }

  function start() {
    var slots = Array.prototype.slice.call(document.querySelectorAll('[data-next-slot]'));
    slots.forEach(wire);
    window.fensPrediction.onChange(function (p, from) {
      slots.forEach(function (slot) { follow(slot, p, from); });
    });
    // another tab saved: follow it
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY) return;
      memory = get();
      slots.forEach(draw);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
