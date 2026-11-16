/* Power card details: Figma "2.21 - Prediction / Open" 458:22246 (Frame 199, 458:22339), 2026-11-16.
   A 500px bottom sheet that opens on a tap on a lobby Козове card ("Детайли", or the card in
   the middle). It has the lobby card's head ("Козове", Налични / Използвани, the count), the
   cards in the picker's carousel (data-size="picker") opening on the card that was tapped, that
   card's rule under it, and a green "Към Прогнозите" that goes to Прогнози.

   The filter switches the set: Налични (the available cards) or Използвани (the used ones,
   greyed as in the lobby). The cards, their marks and rules come from
   components/next-prediction.js (TRUMPS, USED), the same as the prediction sheet.

   Close: a tap on the dimmed page, dragging the sheet down, or Escape. */
(function () {
  var lobbyTracks = document.querySelectorAll('.trumps-card .trumps');
  var P = window.fensPrediction;
  if (!lobbyTracks.length || !P) return;
  var A = 'assets/lobby-main/';
  var CARDS = 'assets/trump-cards/';

  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var root = document.createElement('div');
  root.className = 'predict-sheet trump-sheet is-picking';
  root.hidden = true;
  root.innerHTML =
    '<div class="predict-sheet__backdrop" data-close></div>' +
    '<div class="predict-sheet__panel">' +
      '<span class="predict-sheet__handle" aria-hidden="true"></span>' +
      '<div class="predict-sheet__sheet trump-sheet__sheet" role="dialog" aria-modal="true" aria-label="Козове">' +
        // content-top (462:22565): the lobby card's head
        '<div class="card-head trump-sheet__head">' +
          '<div class="card-head__left">' +
            '<h2 class="card__title">Козове</h2>' +
            '<div class="filter" role="tablist">' +
              '<button class="filter__item" type="button" role="tab" data-set="0">Налични</button>' +
              '<img src="' + A + 'filter-divider.svg" alt="" width="5" height="10">' +
              '<button class="filter__item" type="button" role="tab" data-set="1">Използвани</button>' +
            '</div>' +
          '</div>' +
          '<p class="card-head__count trump-sheet__count"></p>' +
        '</div>' +
        '<div class="trumps trumps--picker trump-sheet__cards" data-size="picker" tabindex="0" aria-label="Козове"></div>' +
        '<p class="predict-sheet__picker-rule trump-sheet__rule"></p>' +
        // Frame 132 (458:22341)
        '<button class="trump-sheet__go" type="button" data-go>Към Прогнозите</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);
  var q = function (s) { return root.querySelector(s); };

  var set = 0, cards = [], at = 0;

  function listOf(s) {
    return P.TRUMPS.filter(function (t) { return (P.USED.indexOf(t.id) >= 0) === (s === 1); });
  }

  function draw(s, startId) {
    set = s;
    cards = listOf(s);
    root.querySelectorAll('[data-set]').forEach(function (b) {
      var on = +b.getAttribute('data-set') === s;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    q('.trump-sheet__count').textContent = cards.length;
    var start = Math.max(0, cards.map(function (t) { return t.id; }).indexOf(startId));
    var old = q('.trump-sheet__cards');
    var track = old.cloneNode(false);
    track.classList.toggle('trumps--used', s === 1);
    track.setAttribute('data-start', start);
    track.innerHTML = cards.map(function (t) {
      return '<div class="trump">' +
          '<img class="trump__bgr" src="' + CARDS + t.file + '.webp" alt="" draggable="false">' +
          '<div class="trump__info' + (t.info === '6/0' ? ' trump__info--small' : '') + '">' + t.info + '</div>' +
          '<div class="trump__content"><div class="trump__text">' +
            '<p class="trump__name">' + esc(t.name.toUpperCase()).replace(' ', '<br>') + '</p>' +
          '</div><span class="trump__link" aria-hidden="true"></span></div>' +
        '</div>';
    }).join('');
    old.replaceWith(track);
    // the rule follows the middle card and moves with the cards, as in "Избери Коз"
    track.addEventListener('trumpcentre', function (e) { at = e.detail.index; rule(); });
    track.addEventListener('trumpmove', function (e) {
      var d = e.detail.offset, r = q('.trump-sheet__rule');
      r.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 2));
      r.style.transform = d ? 'translateX(' + (-d * 40) + 'px)' : '';
    });
    at = start;
    rule();
    if (window.initTrumpCarousel) window.initTrumpCarousel(track);
  }

  function rule() {
    var t = cards[at];
    q('.trump-sheet__rule').innerHTML = t ? '<span>' + t.rule + '</span>' : '';
  }

  function open(s, id) {
    root.hidden = false;
    draw(s, id);
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

  // a tap on a lobby card: "Детайли", or the card in the middle (a tap on a side card only
  // brings it to the middle: the carousel cancels that click)
  lobbyTracks.forEach(function (track) {
    var s = +track.getAttribute('data-trump-list') || 0;
    track.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      var card = e.target.closest('.trump');
      if (!card) return;
      e.preventDefault(); // "Детайли" is a link to #…
      var file = card.querySelector('.trump__bgr').getAttribute('src').split('/').pop().replace('.webp', '');
      var t = P.TRUMPS.filter(function (x) { return x.file === file; })[0];
      if (t) open(s, t.id);
    });
  });

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { close(); return; }
    var f = e.target.closest('[data-set]');
    if (f) {
      var s = +f.getAttribute('data-set');
      if (s !== set) draw(s, '');
      return;
    }
    if (e.target.closest('[data-go]')) {
      close();
      // to Прогнози the way the tab bar goes (pill slide, ball and title off)
      var tab = document.querySelector('.tab-nav__item[href="predictions.html"]');
      setTimeout(function () {
        if (tab) tab.click();
        else window.location.href = 'predictions.html';
      }, 260);
    }
  });

  // drag down to close, as the other sheets (not from the card carousel)
  var panel = q('.predict-sheet__panel');
  var backdrop = q('.predict-sheet__backdrop');
  var drag = null;
  panel.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 || e.target.closest('.trumps')) return;
    drag = { id: e.pointerId, y: e.clientY, dy: 0, t: e.timeStamp, v: 0, moving: false };
  });
  panel.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dy = Math.max(0, e.clientY - drag.y);
    if (!drag.moving) {
      if (dy < 6) return;
      drag.moving = true;
      try { panel.setPointerCapture(e.pointerId); } catch (err) { /* gone */ }
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
    panel.style.transition = '';
    backdrop.style.transition = '';
    void panel.offsetWidth;
    panel.style.transform = '';
    backdrop.style.opacity = '';
    if (d.dy > 120 || d.v > 0.5) close();
  }
  panel.addEventListener('pointerup', release);
  panel.addEventListener('pointercancel', release);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !root.hidden) close();
  });
})();
