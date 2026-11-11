// The Козове carousel: the full power-card collection, swiped left and right.
//
// Sizes and spacing are the lobby design's (Figma group-05): the middle card is 193 × 290,
// the others 175 × 263, 10px apart. Text (the user's sizes): a 20px name and 12px
// "Детайли" on every card, the description 13px in the middle and 12px at the sides;
// 12px padding. Every card's place and size follow from how far it is from the middle, so as you
// drag, a card grows smoothly into the middle size and the last one shrinks back. On
// release it settles on the nearest card (a quick flick goes one further); tapping a side
// card brings it to the middle; the arrow keys work when it has focus. The page dots under
// it follow. Vertical swipes still scroll the page.
// With 3 or more cards it loops: past the last card comes the first again, both ways
// (cards change sides off screen). With fewer it stops at the ends.
// Side cards are blurred, as the trump-card component's "State=Blur" variant (289:9269:
// a layer blur of 3, CSS blur(1.5px)); the blur fades out as a card reaches the middle.

(function () {
  var track = document.querySelector('.trumps');
  if (!track) return;
  var cards = Array.prototype.slice.call(track.querySelectorAll('.trump'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.trumps-card .pagination span'));
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SMALL = { w: 175, h: 263, name: 20, desc: 12 };
  var BIG = { w: 193, h: 290, name: 20, desc: 13 };
  var GAP = 10;
  var BLUR = 1.5; // px, on the side cards
  var NEXT = BIG.w / 2 + GAP + SMALL.w / 2; // middle card's centre to its neighbour's: 194
  var STEP = SMALL.w + GAP;                  // between two side cards: 185

  var PAD = 12; // each card's padding (as in styles.css)

  // Each description stays on its own lines (as in Figma); a line that would be wider than
  // the card makes that card's text a touch smaller instead of wrapping. Measured once per
  // card at the middle size: the width of its widest line.
  var descWidth = [];
  function measure() {
    descWidth = cards.map(function (card) {
      var desc = card.querySelector('.trump__desc');
      var keep = desc.style.fontSize;
      desc.style.fontSize = BIG.desc + 'px';
      var w = desc.scrollWidth;
      desc.style.fontSize = keep;
      return w;
    });
  }

  var count = cards.length;
  var loop = count >= 3;
  var pos = parseInt(track.getAttribute('data-start'), 10) || 0; // the card in the middle, fractional while moving

  // the card index a position stands for (positions run on forever when looping)
  function wrap(i) { return ((i % count) + count) % count; }

  // how far card i is from the middle, in cards; when looping, the short way round
  function distance(i) {
    var d = i - pos;
    if (loop) {
      d = wrap(d);
      if (d > count / 2) d -= count;
    }
    return d;
  }
  var anim = null;
  var heading = pos; // where it's moving to; quick repeated presses continue from here

  function lerp(a, b, t) { return a + (b - a) * t; }

  // a card's centre, relative to the track's centre, at distance d (in cards) from the middle
  function offset(d) {
    var a = Math.abs(d);
    var x = a <= 1 ? NEXT * a : NEXT + STEP * (a - 1);
    return d < 0 ? -x : x;
  }

  function render() {
    var centre = track.clientWidth / 2;
    cards.forEach(function (card, i) {
      var d = distance(i);
      var t = Math.max(0, 1 - Math.abs(d)); // 1 in the middle, 0 from one card away
      var w = lerp(SMALL.w, BIG.w, t);
      var h = lerp(SMALL.h, BIG.h, t);
      card.style.width = w + 'px';
      card.style.height = h + 'px';
      card.style.transform = 'translate(' + (centre + offset(d) - w / 2) + 'px, ' + (BIG.h - h) / 2 + 'px)';
      card.style.filter = t < 1 ? 'blur(' + BLUR * (1 - t) + 'px)' : '';
      card.querySelector('.trump__name').style.fontSize = lerp(SMALL.name, BIG.name, t) + 'px';
      var size = lerp(SMALL.desc, BIG.desc, t);
      var need = descWidth[i] * size / BIG.desc;
      var room = w - 2 * PAD;
      if (need > room) size *= room / need;
      card.querySelector('.trump__desc').style.fontSize = size + 'px';
      card.classList.toggle('is-centre', wrap(Math.round(pos)) === i);
    });
    var active = wrap(Math.round(pos));
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === active); });
  }

  function clamp(i) { return loop ? i : Math.max(0, Math.min(count - 1, i)); }

  // ease to a position (when looping, any whole number: it stands for wrap(target))
  function goTo(target) {
    target = clamp(target);
    heading = target;
    if (anim) cancelAnimationFrame(anim);
    if (reduced) { pos = target; render(); return; }
    var from = pos;
    var start = performance.now();
    var duration = 320;
    (function step(now) {
      var p = Math.min((now - start) / duration, 1);
      pos = from + (target - from) * (1 - Math.pow(1 - p, 3));
      if (p >= 1 && loop) pos = heading = wrap(target); // settle back into 0…count-1 (nothing moves)
      render();
      anim = p < 1 ? requestAnimationFrame(step) : null;
    })(start);
  }

  // Dragging (mouse or finger); a drag that doesn't move is a tap
  var drag = null;
  track.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    heading = pos;
    drag = { x: e.clientX, y: e.clientY, pos: pos, moved: false, lastX: e.clientX, lastT: performance.now(), v: 0, id: e.pointerId };
  });

  track.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) { drag = null; return; } // a vertical swipe: let the page scroll
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
    }
    var now = performance.now();
    drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1); // px per ms
    drag.lastX = e.clientX;
    drag.lastT = now;
    var p = drag.pos - dx / NEXT;
    // not looping: a little resistance past the first and last card
    if (!loop) {
      if (p < 0) p = p / 3;
      if (p > count - 1) p = count - 1 + (p - count + 1) / 3;
    }
    pos = p;
    render();
  });

  var ignoreClickUntil = 0; // the click a browser sends at the end of a drag isn't a tap

  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    track.classList.remove('is-dragging');
    if (!d.moved) return;
    ignoreClickUntil = performance.now() + 300;
    var target = Math.round(pos);
    if (Math.abs(d.v) > 0.4 && target === Math.round(d.pos)) target += d.v < 0 ? 1 : -1; // a flick
    goTo(target);
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // a tap on a side card brings it to the middle; the middle card's "Детайли" link works
  track.addEventListener('click', function (e) {
    if (performance.now() < ignoreClickUntil) { e.preventDefault(); e.stopPropagation(); return; }
    var card = e.target.closest('.trump');
    if (!card) return;
    var i = cards.indexOf(card);
    if (i !== wrap(Math.round(pos))) { e.preventDefault(); goTo(Math.round(pos + distance(i))); }
  }, true);

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.round(heading) - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.round(heading) + 1); }
  });

  window.addEventListener('resize', render);
  measure();
  render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); render(); });
})();
