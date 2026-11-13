/* Team Modal: "1.1 - Team Modal / Available Teams" (396:19940) and "1.2 - Team Modal / Used
   Teams" (396:20047). Figma's note: it opens on a tap on the lobby's white team cards;
   Прогнози's Отбори tab opens it the same way (the user's request, 2026-11-13).

   A bottom sheet over a dimmed, blurred page (blur-bgr 396:19954). Its filter is the lobby card's:
   Налични shows the light card (396:19955), Използвани the dark one (396:20062). The crest row
   is a carousel through that filter's teams (the lobby card's own list), with the neighbours
   blurred at the sides; the chevrons and the side crests move it.

   Figma has one team's details per state (Лудогорец / Арда); every team shows those sample
   values for now, only the crest and the name follow the team. The next match ("Предстоящ Мач")
   is Figma's sample per state, as the shared match-card.

   Both states use Налични's positions and sizes, so switching the filter only changes colours
   and content, nothing moves (the user's request).

   Close: a tap on the dimmed page, or Escape. */
(function () {
  // The team lists it opens from, on any page: data-team-list="0" (Налични) / "1" (Използвани).
  // The lobby's Отбори card and Прогнози's Отбори tab mark theirs.
  var cards = document.querySelectorAll('[data-team-list]');
  if (!cards.length) return;
  var CARD = '.team-card, .team-card-02';

  // Figma's sample values per state: rank, points, matches
  var SAMPLE = [
    { rank: '3-то', points: '30', matches: '13' },
    { rank: '6-то', points: '21', matches: '14' }
  ];

  var A = 'assets/lobby-main/';

  function row(label, value) {
    return '<p class="team-modal__row"><span>' + label + '</span><strong>' + value + '</strong></p>';
  }

  function stat(cls, icon, label, value) {
    return '<div class="team-modal__stat ' + cls + '">' +
      '<p class="team-modal__stat-head"><span class="team-modal__icon team-modal__icon--' + icon + '">' +
      '<img data-icon="' + icon + '" alt=""></span>' + label + '</p>' +
      '<p class="team-modal__stat-value">' + value + '</p></div>';
  }

  var root = document.createElement('div');
  root.className = 'team-modal';
  root.hidden = true;
  root.innerHTML =
    '<div class="team-modal__backdrop" data-close></div>' +
    '<div class="team-modal__sheet" role="dialog" aria-modal="true" aria-label="Отбори">' +
      '<div class="team-modal__card"><img class="team-modal__card-bgr" alt=""></div>' +
      '<div class="team-modal__head card-head">' +
        '<div class="card-head__left">' +
          '<h2 class="card__title">Отбори</h2>' +
          '<div class="filter" role="tablist">' +
            '<button class="filter__item" type="button" role="tab">Налични</button>' +
            '<img src="' + A + 'filter-divider.svg" alt="" width="5" height="10">' +
            '<button class="filter__item" type="button" role="tab">Използвани</button>' +
          '</div>' +
        '</div>' +
        '<p class="card-head__count"><span class="team-modal__count"></span></p>' +
      '</div>' +
      '<div class="team-modal__crests">' +
        '<img class="team-modal__side" data-step="-1" alt="">' +
        '<span class="team-modal__main"><img class="team-modal__glow" alt=""><img class="team-modal__crest" alt=""></span>' +
        '<img class="team-modal__side" data-step="1" alt="">' +
        '<button class="team-modal__chevron team-modal__chevron--prev" type="button" data-step="-1" aria-label="Предишен отбор"><img data-icon="chevron-left" alt=""></button>' +
        '<button class="team-modal__chevron team-modal__chevron--next" type="button" data-step="1" aria-label="Следващ отбор"><img data-icon="chevron-right" alt=""></button>' +
      '</div>' +
      '<p class="team-modal__rank"><strong></strong><i> </i><span>място</span></p>' +
      '<p class="team-modal__name"></p>' +
      '<div class="team-modal__totals">' +
        '<p><span>Точки:</span><strong data-points></strong></p><i></i>' +
        '<p><span>Мачове:</span><strong data-matches></strong></p>' +
      '</div>' +
      '<div class="team-modal__info"></div>' +
      '<div class="team-modal__shirts">' +
        '<span class="team-modal__shirt-home"><img src="' + A + 'shirt-home.png" alt=""><img class="team-modal__shirt-away" src="' + A + 'shirt-away.png" alt=""></span>' +
        '<span class="team-modal__kit"><span>Away</span><strong>Home</strong></span>' +
      '</div>' +
      '<div class="team-modal__divider"></div>' +
      '<div class="team-modal__rows">' +
        row('Треньор:', 'Игор Йовичевич') + row('Топ Играч:', 'Ивайло Чочев') + row('Титли:', '4') +
        '<p class="team-modal__row team-modal__form"><span>Форма:</span><img src="' + A + 'team-form.svg" alt="" width="66" height="10"></p>' +
        '<p class="team-modal__badges"><b class="is-win">W</b><b class="is-lose">L</b><b class="is-win">W</b><b class="is-win">W</b><b class="is-draw">D</b></p>' +
      '</div>' +
      '<div class="team-modal__stats">' +
        stat('', 'football', 'Голове:', '0') + stat('', 'trophy', 'Победи:', '0') +
        stat('team-modal__stat--80', 'close-circle', 'Загуби:', '0') + stat('team-modal__stat--56', 'statistics', 'ГР:', '32:9') +
      '</div>' +
      '<div class="team-modal__next">' +
        '<p class="team-modal__next-title">Предстоящ Мач <img src="' + A + 'team-modal-dot.svg" alt="" width="4" height="4"> Кръг 9</p>' +
        // match-card 404:12582 (Налични) and 404:12606 (Използвани: both teams used)
        '<div class="match-card" data-for="0">' +
          '<div class="time-stamp time-stamp--dark"><span>Четвъртък, 22/11 13:00ч.</span></div>' +
          '<div class="match-card__teams">' +
            '<div class="team-logo team-logo--02"><img src="assets/crests/cska-small.webp" alt=""><span class="team-logo__name">ЦСКА</span></div>' +
            '<div class="match-card__middle match-card__middle--action"><button class="secondary-btn" type="button">Прогнозирай</button></div>' +
            '<div class="team-logo team-logo--02"><img src="assets/crests/ludogorets-small.webp" alt=""><span class="team-logo__name">Лудогорец<br>Разград</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="match-card" data-for="1">' +
          '<div class="time-stamp time-stamp--dark"><span>Петък, 23/11 14:30ч.</span></div>' +
          '<div class="match-card__teams">' +
            '<div class="team-logo team-logo--02 team-logo--disabled"><img src="assets/crests/arda-small.webp" alt=""><span class="team-logo__name">Aрда Кърджали</span><span class="team-logo__used team-logo__used--left">К3</span></div>' +
            '<div class="match-card__middle match-card__middle--unavailable"><p class="match-card__note">И двата отбора са използвани.</p></div>' +
            '<div class="team-logo team-logo--02 team-logo--disabled"><img src="assets/crests/botev-vratsa-small.webp" alt=""><span class="team-logo__name">Ботев Враца</span><span class="team-logo__used">К5</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var q = function (s) { return root.querySelector(s); };
  var filters = root.querySelectorAll('.filter__item');
  var state = 0;
  var index = 0;

  // Налични's carousel as in Figma (396:19955): Лудогорец in the middle, ЦСКА on its left,
  // Славия on its right; the other available teams follow round the loop
  var FIGMA_ORDER = ['cska', 'ludogorets', 'slavia'];
  var FIGMA_START = 'ludogorets';

  function key(team) { return team.crest.split('/').pop().replace('.webp', ''); }

  // the teams of each filter state, read from the lobby card
  function teams(s) {
    var list = document.querySelector('[data-team-list="' + s + '"]');
    var all = Array.prototype.map.call(list.querySelectorAll(CARD), function (card) {
      var img = card.querySelector('img');
      return {
        crest: img.getAttribute('src').replace('-small.webp', '.webp'),
        name: card.querySelector('span').innerHTML.replace(/<br\s*\/?>/g, ' ')
      };
    });
    if (s !== 0) return all;
    var first = FIGMA_ORDER.map(function (k) {
      return all.filter(function (t) { return key(t) === k; })[0];
    }).filter(Boolean);
    return first.concat(all.filter(function (t) { return first.indexOf(t) < 0; }));
  }

  // where a team sits in its state's carousel (Налични starts on Лудогорец)
  function indexOf(s, crestKey) {
    var list = teams(s);
    for (var i = 0; i < list.length; i++) if (key(list[i]) === crestKey) return i;
    return 0;
  }

  // The count runs to its new value as on the lobby's cards (lobby.html's countTo: 600ms,
  // ease-out cubic); used when the filter switches, not when the modal opens
  function countTo(el, to) {
    var from = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
    cancelAnimationFrame(el._countFrame);
    if (from === to || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = to;
      return;
    }
    var duration = 600;
    var start = performance.now();
    (function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) el._countFrame = requestAnimationFrame(step);
    })(start);
  }

  function render(countUp) {
    var list = teams(state);
    var n = list.length;
    var at = function (i) { return list[((i % n) + n) % n]; };
    var dark = state === 1;
    root.classList.toggle('team-modal--used', dark);
    filters.forEach(function (f, i) {
      f.classList.toggle('is-active', i === state);
      f.setAttribute('aria-selected', String(i === state));
    });
    // the lobby card's own count where there is one, else the number of teams in the list
    var counter = document.querySelector('.teams-card .count');
    var count = counter ? parseInt(counter.dataset.counts.split(' ')[state], 10) : n;
    if (countUp) countTo(q('.team-modal__count'), count);
    else {
      cancelAnimationFrame(q('.team-modal__count')._countFrame);
      q('.team-modal__count').textContent = count;
    }
    q('.team-modal__card-bgr').src = A + (dark ? 'team-modal-card-bgr-dark.png' : 'team-modal-card-bgr.png');
    q('.team-modal__glow').src = A + (dark ? 'team-modal-glow-dark.svg' : 'team-modal-glow.svg');
    root.querySelectorAll('[data-icon]').forEach(function (img) {
      img.src = A + (/chevron/.test(img.dataset.icon) ? 'team-modal-' : 'icon-') + img.dataset.icon + (dark ? '-dark' : '') + '.svg';
    });
    q('.team-modal__crest').src = at(index).crest;
    var sides = root.querySelectorAll('.team-modal__side');
    sides[0].src = at(index - 1).crest;
    sides[1].src = at(index + 1).crest;
    q('.team-modal__name').textContent = at(index).name;
    q('.team-modal__rank strong').textContent = SAMPLE[state].rank;
    q('[data-points]').textContent = SAMPLE[state].points;
    q('[data-matches]').textContent = SAMPLE[state].matches;
    root.querySelectorAll('.team-modal__next [data-for]').forEach(function (card) {
      card.hidden = card.getAttribute('data-for') !== String(state);
    });
  }

  function open(s, i) {
    state = s;
    index = i;
    render();
    root.hidden = false;
    document.documentElement.classList.add('team-modal-open');
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
      document.documentElement.classList.remove('team-modal-open');
    }, 250);
  }

  cards.forEach(function (list) {
    var s = parseInt(list.getAttribute('data-team-list'), 10);
    list.querySelectorAll(CARD).forEach(function (card) {
      var k = card.querySelector('img').getAttribute('src').split('/').pop().replace('-small.webp', '');
      card.addEventListener('click', function () { open(s, indexOf(s, k)); });
    });
  });

  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { close(); return; }
    var step = e.target.closest('[data-step]');
    if (step) {
      index += parseInt(step.getAttribute('data-step'), 10);
      var main = q('.team-modal__main');
      render();
      if (main.animate) {
        main.animate([{ opacity: 0.4, transform: 'scale(0.92)' }, { opacity: 1, transform: 'none' }],
          { duration: 220, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
      }
    }
  });

  filters.forEach(function (f, i) {
    f.addEventListener('click', function () {
      if (i === state) return;
      state = i;
      index = i === 0 ? indexOf(0, FIGMA_START) : 0;
      render(true);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
