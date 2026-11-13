// <event-container>: the match card from the Figma component set "event-container"
// (276:9189, file "Last Fan"), as a reusable custom element. Styles: event-container.css.
//
// Five variants, as in Figma:
//   variant="no-match"                       "Топката е в твоето поле." with a green "Прогнозирай"
//                                            (Variant=No Match Selected, State=Empty, 352:10051);
//                                            optional note="…" replaces "Избери един мач от Кръг 7."
//   variant="match-outcome" state="default"  pick a team (tap a team button)
//   variant="correct-score" state="default"  set the score with the arrow buttons
//   variant="match-outcome" state="locked"   "Заключен за прогнози": the pick is shown, nothing can change
//   variant="correct-score" state="locked"   "Заключен за прогнози": the score is greyed out, the pick is shown
//
// Attributes (all optional; the defaults are Figma's):
//   variant      "match-outcome" | "correct-score"            (default "match-outcome")
//   state        "default" | "locked"                         (default "default")
//   date         time-stamp text                              (default "Четвъртък, 22/11 13:00ч.")
//   home, away   team names on the buttons; a line break      (default "ЦСКА", "Лудогорец Разград")
//                (&#10;) in the name is kept
//   home-crest, away-crest   crest image URLs                 (default the two Figma crests)
//   home-score, away-score   Correct Score numbers            (default 3 and 0)
//   pick         "home" | "away" | "" (no pick)               (default "home")
//   trump-card   present = the trump cards show in the top right corner
//
// When not locked, the "Точен Резултат" / "Изход от мача" button switches between the two
// variants; switching to Correct Score starts the score at 1 : 0 for the picked team. Every change the user makes updates the attributes and fires a "change" event.

(function () {
  var ASSETS = 'assets/lobby-main/';
  var MAX_SCORE = 20;

  function esc(text) {
    return String(text).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  class EventContainer extends HTMLElement {
    static get observedAttributes() {
      return ['variant', 'state', 'date', 'home', 'away', 'home-crest', 'away-crest',
        'home-score', 'away-score', 'pick', 'trump-card', 'note'];
    }

    connectedCallback() {
      if (!this._wired) {
        this._wired = true;
        this.addEventListener('click', this._onClick.bind(this));
      }
      this._render();
    }

    attributeChangedCallback() {
      if (this.isConnected && !this._quiet) this._render();
    }

    _get(name, fallback) {
      var value = this.getAttribute(name);
      return value === null ? fallback : value;
    }

    _score(name, fallback) {
      var n = parseInt(this._get(name, fallback), 10);
      return isNaN(n) ? 0 : Math.min(Math.max(n, 0), MAX_SCORE);
    }

    _render() {
      // Variant=No Match Selected, State=Empty (352:10051): no match picked for the round yet
      if (this._get('variant', 'match-outcome') === 'no-match') {
        this.innerHTML =
          '<div class="event event--empty">' +
            '<img class="event__empty-bgr" src="' + ASSETS + 'event-empty-bgr.png" alt="">' +
            '<div class="event__empty-head">' +
              '<p class="event__empty-title">Топката е в твоето поле.</p>' +
              '<p class="event__empty-note">' + esc(this._get('note', 'Избери един мач от Кръг 7.')) + '</p>' +
            '</div>' +
            '<button class="event__primary-btn" type="button" data-predict>Прогнозирай</button>' +
          '</div>';
        return;
      }
      var correctScore = this._get('variant', 'match-outcome') === 'correct-score';
      var locked = this._get('state', 'default') === 'locked';
      var home = this._get('home', 'ЦСКА');
      var away = this._get('away', 'Лудогорец Разград');
      var pick = this._get('pick', 'home');
      var dis = locked ? ' disabled' : '';

      function crest(src, name) {
        // the slot is the span; the image inside keeps its own proportions (see the CSS)
        return '<span class="event__crest"><img src="' + esc(src) + '" alt="' + esc(name) + '"></span>';
      }

      function teamBtn(side, name) {
        var picked = pick === side;
        return '<button class="event__team-btn' + (picked ? ' is-selected' : '') + '" type="button" data-pick="' + side + '"' +
          ' aria-pressed="' + picked + '"' + dis + '>' + esc(name) + '</button>';
      }

      // at 0 the down arrow is greyed out, as Figma shows it for the away team's 0
      var self = this;
      function arrows(side, name) {
        var atZero = self._score(side + '-score', side === 'home' ? 3 : 0) === 0;
        return '<div class="event__arrows">' +
          '<button class="event__arrow-btn" type="button" data-score="' + side + '" data-step="-1" aria-label="' + esc(name) + ': по-малко голове"' + (atZero ? ' disabled' : '') + '>' +
            '<span class="event__arrow-icon event__arrow-icon--down"><img src="' + ASSETS + 'arrow-btn-chevron-down.svg" alt=""></span></button>' +
          '<button class="event__arrow-btn" type="button" data-score="' + side + '" data-step="1" aria-label="' + esc(name) + ': повече голове">' +
            '<span class="event__arrow-icon"><img src="' + ASSETS + 'arrow-btn-chevron-up.svg" alt=""></span></button>' +
          '</div>';
      }

      // Middle of the teams row: "vs", or the score
      var middle = correctScore
        ? '<div class="event__score" aria-label="' + this._score('home-score', 3) + ' : ' + this._score('away-score', 0) + '">' +
            '<span class="event__score-num">' + this._score('home-score', 3) + '</span>' +
            '<span class="event__score-colon">:</span>' +
            '<span class="event__score-num">' + this._score('away-score', 0) + '</span></div>'
        : '<span class="event__vs">vs</span>';

      // Buttons row: the arrows only in Correct Score, Default; the team buttons otherwise
      var buttons = correctScore && !locked
        ? arrows('home', home) + '<span class="event__btns-gap"></span>' + arrows('away', away)
        : teamBtn('home', home) + '<span class="event__btns-gap"></span>' + teamBtn('away', away);

      // market-change-btn: offers the other variant; Locked (both variants) says it's locked
      var market = locked
        ? '<button class="event__market-btn is-locked" type="button" disabled>' +
            '<span class="event__market-text">Заключен<br>за прогнози</span></button>'
        : '<button class="event__market-btn" type="button" data-switch>' +
            '<img src="' + ASSETS + 'icon-view-more.svg" alt="" width="14" height="14">' +
            '<span class="event__market-text">' + (correctScore ? 'Изход от мача' : 'Точен Резултат') + '</span></button>';

      var trump = this.hasAttribute('trump-card')
        ? '<div class="event__trump" aria-hidden="true">' +
            '<img class="event__trump-blur" src="' + ASSETS + 'trump-blur.svg" alt="">' +
            '<span class="event__trump-card event__trump-card--1"><img src="' + ASSETS + 'trump-card-a.png" alt=""></span>' +
            '<span class="event__trump-card event__trump-card--2"><img src="' + ASSETS + 'trump-card-a.png" alt=""></span>' +
            '<span class="event__trump-card event__trump-card--3"><img src="' + ASSETS + 'trump-card-b.png" alt=""></span>' +
          '</div>'
        : '';

      var html =
        '<div class="event' + (locked ? ' event--locked' : '') + '">' +
          '<img class="event__bgr" src="' + ASSETS + 'event-bgr-frame.svg" alt="">' +
          '<div class="event__top">' +
            '<div class="event__time">' +
              '<img class="event__time-bgr" src="' + ASSETS + 'time-stamp-bgr.svg" alt="">' +
              '<span class="event__time-text">' + esc(this._get('date', 'Четвъртък, 22/11 13:00ч.')) + '</span>' +
            '</div>' +
            '<div class="event__teams">' +
              crest(this._get('home-crest', 'assets/crests/cska.png'), home) +
              middle +
              crest(this._get('away-crest', 'assets/crests/ludogorets.png'), away) +
            '</div>' +
          '</div>' +
          '<div class="event__btns">' + buttons + '</div>' +
          market +
          trump +
        '</div>';

      // During a variant switch only the parts that differ are swapped, so the crests,
      // background and trump cards stay put (no flicker while images are redrawn)
      var current = this.querySelector('.event');
      if (this._partial && current) {
        var next = document.createElement('div');
        next.innerHTML = html;
        ['.event__teams > :nth-child(2)', '.event__btns', '.event__market-btn'].forEach(function (selector) {
          current.querySelector(selector).replaceWith(next.querySelector(selector));
        });
        current.className = next.firstChild.className;
        this._drawWarning();
        return;
      }
      this.innerHTML = html;
      this._drawWarning();
    }

    // A level score in Correct Score (Figma 316:13024) isn't a valid pick: after the score has
    // stayed level for 1.35 seconds (not just passed through on the way to another score), the
    // gold warning "Невалиден залог. Използвайте коз за “Равенство”." unrolls over the date
    // strip. The date stays where it is underneath the whole time (the user's request); the
    // warning is laid on top of it. Once the score isn't level the warning rolls away straight
    // away (no wait), showing the date again.
    _drawWarning() {
      var self = this;
      clearTimeout(this._warnTimer);
      var level = this._get('variant', 'match-outcome') === 'correct-score' &&
        this._get('state', 'default') !== 'locked' &&
        this._score('home-score', 3) === this._score('away-score', 0);
      var time = this.querySelector('.event__time:not(.event__time--warning)');
      if (!time) return;
      var motion = !!time.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var current = this.querySelector('.event__time--warning');

      // the warning, laid over the date strip: same top, centred, above it
      function addWarning() {
        var w = document.createElement('div');
        w.className = 'event__time event__time--warning';
        w.setAttribute('role', 'status');
        w.innerHTML = '<span class="event__time-text">Невалиден залог. Използвайте коз за <b>“Равенство”.</b></span>';
        w.style.position = 'absolute';
        w.style.top = time.offsetTop + 'px';
        w.style.left = '50%';
        w.style.transform = 'translateX(-50%)';
        w.style.zIndex = '1';
        time.after(w);
        return w;
      }

      if (!level) {
        if (!this._warningShown) return;
        this._warningShown = false;
        if (!current) return;
        if (!motion) return current.remove();
        // rolls back up into the card's top edge while fading (clipped, it never moves, so
        // nothing shows outside the card); then it's removed
        var remove = function () { if (current.isConnected) current.remove(); };
        current.getAnimations().forEach(function (a) { a.cancel(); });
        current.animate([
          { opacity: 1, clipPath: 'inset(0 0 0 0)' },
          { opacity: 0, clipPath: 'inset(0 0 100% 0)' }
        ], { duration: 320, easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)', fill: 'forwards' }).onfinish = remove;
        setTimeout(remove, 500); // gone even if the animation is paused (a hidden tab)
        return;
      }

      if (this._warningShown) {
        // still level after a redraw (e.g. 1 : 1 → 2 : 2): keep the warning, no new wait
        if (!current) addWarning();
        return;
      }
      this._warnTimer = setTimeout(function () {
        if (!time.isConnected) return;
        var warning = addWarning();
        self._warningShown = true;
        if (motion) {
          // unrolls down from the card's top edge over the date (clipped, so it stays inside
          // the card), soft and unhurried: the fade runs a little behind the unroll
          warning.animate([
            { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
            { opacity: 0.6, clipPath: 'inset(0 0 25% 0)', offset: 0.55 },
            { opacity: 1, clipPath: 'inset(0 0 0 0)' }
          ], { duration: 480, easing: 'cubic-bezier(0.33, 0, 0.2, 1)' });
        }
      }, 1350);
    }

    // Switching Match Outcome ↔ Correct Score: the middle ("vs" / score), the buttons row
    // and the pill's label fade and drop out, the pill's icon turns, and the new ones
    // settle in, the score popping slightly
    _switchVariant() {
      var self = this;
      var target = this._get('variant', 'match-outcome') === 'correct-score' ? 'match-outcome' : 'correct-score';
      // Correct Score starts at 1 : 0 for the team picked to win (the green button), 0 : 0
      // with no pick. Set quietly: Match Outcome doesn't show the score, so nothing is redrawn
      if (target === 'correct-score') {
        var pick = this._get('pick', 'home');
        this._quiet = true;
        this.setAttribute('home-score', pick === 'home' ? 1 : 0);
        this.setAttribute('away-score', pick === 'away' ? 1 : 0);
        this._quiet = false;
      }
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !Element.prototype.animate) {
        this.setAttribute('variant', target);
        this.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      if (this._switching) return;
      this._switching = true;

      var outTime = 160;
      var easeIn = 'cubic-bezier(0.4, 0, 1, 1)';
      var easeOut = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
      var outs = [
        [this.querySelector('.event__teams > :nth-child(2)'), 'scale(0.85)'],
        [this.querySelector('.event__btns'), 'translateY(4px)'],
        [this.querySelector('.event__market-text'), 'translateY(-3px)']
      ].map(function (item) {
        return item[0].animate([
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: item[1] }
        ], { duration: outTime, easing: easeIn, fill: 'forwards' });
      });
      var icon = this.querySelector('.event__market-btn img');
      // the icon turns half a turn anticlockwise (the user's choice), a quarter out and a
      // quarter in; the arrows look the same at 180°, so it rests back at 0° unseen
      if (icon) icon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-90deg)' }],
        { duration: outTime, easing: easeIn, fill: 'forwards' });

      outs[0].finished.then(function () {
        self._partial = true;
        self.setAttribute('variant', target);
        self._partial = false;

        self.querySelector('.event__teams > :nth-child(2)').animate([
          { opacity: 0, transform: 'scale(0.7)' },
          { opacity: 1, transform: 'scale(1.06)', offset: 0.6 },
          { opacity: 1, transform: 'none' }
        ], { duration: 320, easing: easeOut });
        self.querySelector('.event__btns').animate([
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 280, delay: 40, easing: easeOut, fill: 'backwards' });
        self.querySelector('.event__market-text').animate([
          { opacity: 0, transform: 'translateY(3px)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 240, delay: 20, easing: easeOut, fill: 'backwards' });
        var newIcon = self.querySelector('.event__market-btn img');
        if (newIcon) newIcon.animate([{ transform: 'rotate(-90deg)' }, { transform: 'rotate(-180deg)' }],
          { duration: 280, easing: easeOut });
        setTimeout(function () { self._switching = false; }, 320);
        self.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }

    _onClick(e) {
      var btn = e.target.closest('button');
      if (!btn || btn.disabled || !this.contains(btn)) return;
      if (btn.hasAttribute('data-predict')) {
        // No Match Selected: the page decides where "Прогнозирай" leads
        this.dispatchEvent(new CustomEvent('predict', { bubbles: true }));
        return;
      }
      if (btn.hasAttribute('data-pick')) {
        this.setAttribute('pick', btn.getAttribute('data-pick'));
      } else if (btn.hasAttribute('data-score')) {
        var name = btn.getAttribute('data-score') + '-score';
        var fallback = name === 'home-score' ? 3 : 0;
        var next = this._score(name, fallback) + parseInt(btn.getAttribute('data-step'), 10);
        this.setAttribute(name, Math.min(Math.max(next, 0), MAX_SCORE));
      } else if (btn.hasAttribute('data-switch')) {
        this._switchVariant(); // fires its own "change" once the new variant is in
        return;
      } else {
        return;
      }
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  customElements.define('event-container', EventContainer);

  // The big "vs" has an inner shadow in Figma (273:9128: black 65%, x −1, y 1, blur 2), which CSS
  // can't put on text; this SVG filter draws it, once per page, used by .event__vs in the CSS
  function addVsShadow() {
    if (document.getElementById('event-vs-inner-shadow')) return;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML =
      '<filter id="event-vs-inner-shadow" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">' +
        '<feOffset in="SourceAlpha" dx="-1" dy="1" result="shifted"/>' +
        '<feGaussianBlur in="shifted" stdDeviation="1" result="blurred"/>' +
        '<feComposite in="SourceAlpha" in2="blurred" operator="out" result="inner"/>' +
        '<feFlood flood-color="#000000" flood-opacity="0.65"/>' +
        '<feComposite in2="inner" operator="in" result="shadow"/>' +
        '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shadow"/></feMerge>' +
      '</filter>';
    document.body.appendChild(svg);
  }
  if (document.body) addVsShadow();
  else document.addEventListener('DOMContentLoaded', addVsShadow);
})();
