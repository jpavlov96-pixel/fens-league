/* Card effects for the prediction sheet's "Избери Коз" (the user's choice, 2026-11-16, from
   demos/card-fx.html):
   - A2c "Дъги": gold current along the middle card's edge, jumping in small arcs between two
     points like a Tesla coil, and every couple of seconds a bigger arc across a corner with a
     flare. One SVG, moved onto whichever card is in the middle.
   - the slam on "Приложи Коз": the card rises and leans back, holds a beat, drops and lands,
     then settles (one 720ms timeline); on the landing a decaying shake, a warm glow, two gold
     rings, sparks and a vibration (Android). No sound (the user's request).
   - the middle card trembles a tiny bit with the current: each arc nudges it ~0.6px, a corner
     flare ~1.4px (the CSS "translate" property, so the carousel's own transform is untouched).

   window.CardFx.attach(cardEl)  puts the current on that card (starts it if needed)
   window.CardFx.stop()          stops it and takes it off
   window.CardFx.slam(cardEl, stageEl, done)  plays the slam; done() once the card has settled
*/
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var W = 179, H = 269, C = 12; // the picker's middle card; its frame has cut corners
  var D = 'M' + C + ',0 H' + (W - C) + ' L' + W + ',' + C + ' V' + (H - C) + ' L' + (W - C) + ',' + H +
    ' H' + C + ' L0,' + (H - C) + ' V' + C + ' Z';
  var CX = W / 2, CY = H / 2;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var svg = null, arcs = null, glow = null, timers = [], running = false;

  function build() {
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'card-fx');
    svg.setAttribute('viewBox', '-14 -14 ' + (W + 28) + ' ' + (H + 28));
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<defs>' +
        // the line pushed about by noise; the seed changes ~14 times a second
        '<filter id="cfx-volt" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence id="cfx-noise" type="turbulence" baseFrequency="0.045" numOctaves="2" seed="1" result="n"/>' +
          '<feDisplacementMap id="cfx-disp" in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter>' +
        '<filter id="cfx-volt2" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feTurbulence id="cfx-noise2" type="turbulence" baseFrequency="0.09" numOctaves="1" seed="7" result="n"/>' +
          '<feDisplacementMap id="cfx-disp2" in="SourceGraphic" in2="n" scale="5" xChannelSelector="G" yChannelSelector="R"/>' +
        '</filter>' +
        '<filter id="cfx-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>' +
        '<filter id="cfx-soft" x="-30%" y="-30%" width="160%" height="160%">' +
          '<feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
      '</defs>' +
      '<path class="card-fx__glow" d="' + D + '" fill="none" stroke="#f5d584" stroke-width="8" opacity="0.6" filter="url(#cfx-blur)"/>' +
      '<path d="' + D + '" fill="none" stroke="#f5d584" stroke-width="2.6" filter="url(#cfx-volt)"/>' +
      '<path d="' + D + '" fill="none" stroke="#ffe7a8" stroke-width="1.6" filter="url(#cfx-volt2)" opacity="0.8"/>' +
      '<path d="' + D + '" fill="none" stroke="#ffffff" stroke-width="0.9" filter="url(#cfx-volt)"/>' +
      '<g class="card-fx__arcs"></g>';
    arcs = svg.querySelector('.card-fx__arcs');
    glow = svg.querySelector('.card-fx__glow');
  }

  var probe = document.createElementNS(NS, 'path');
  probe.setAttribute('d', D);
  var EDGE = 0;
  function edgePoint(t) {
    if (!EDGE) EDGE = probe.getTotalLength() || 880;
    return probe.getPointAtLength((((t % 1) + 1) % 1) * EDGE);
  }
  function outward(p) {
    var dx = p.x - CX, dy = p.y - CY, d = Math.sqrt(dx * dx + dy * dy) || 1;
    return [dx / d, dy / d];
  }

  // a bolt: a glowing gold stroke with a white core
  function bolt(pts, life, width) {
    var d = pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
    [['card-fx__arc-glow', 1], ['card-fx__arc', width]].forEach(function (k) {
      var el = document.createElementNS(NS, 'polyline');
      el.setAttribute('class', k[0]);
      el.setAttribute('points', d);
      if (k[0] === 'card-fx__arc') el.style.strokeWidth = String(1.3 * k[1]);
      arcs.appendChild(el);
      el.animate([{ opacity: 1 }, { opacity: 0.85, offset: 0.35 }, { opacity: 0 }],
        { duration: life, easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)' }).onfinish = function () { el.remove(); };
    });
  }

  // the edge flares for a moment, with a hot spot
  function flare(p) {
    glow.animate([{ opacity: 1, strokeWidth: '11px' }, { opacity: 0.6, strokeWidth: '8px' }], { duration: 260, easing: 'ease-out' });
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', 'card-fx__hot');
    c.setAttribute('cx', p.x);
    c.setAttribute('cy', p.y);
    c.setAttribute('r', '5');
    arcs.appendChild(c);
    c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-out' }).onfinish = function () { c.remove(); };
  }

  // the card trembles with the current: a short nudge (translate, apart from the carousel's
  // transform), strength in px
  function tremble(px) {
    var card = svg && svg.parentNode;
    if (!card || !card.animate || card.classList.contains('is-slammed')) return;
    var a = Math.random() * Math.PI * 2, x = Math.cos(a) * px, y = Math.sin(a) * px;
    card.animate([
      { translate: '0 0' },
      { translate: x.toFixed(2) + 'px ' + y.toFixed(2) + 'px', offset: 0.3 },
      { translate: (-x * 0.5).toFixed(2) + 'px ' + (-y * 0.5).toFixed(2) + 'px', offset: 0.65 },
      { translate: '0 0' }
    ], { duration: 140, easing: 'ease-out' });
  }

  // an arc between two points of the edge, bowing outward
  function edgeArc(t, span, life) {
    var a = edgePoint(t), b = edgePoint(t + span), o = outward(edgePoint(t + span / 2));
    var bow = 8 + Math.random() * 6, pts = [], steps = 7;
    for (var i = 0; i <= steps; i++) {
      var k = i / steps;
      var x = a.x + (b.x - a.x) * k + o[0] * bow * Math.sin(Math.PI * k);
      var y = a.y + (b.y - a.y) * k + o[1] * bow * Math.sin(Math.PI * k);
      if (i && i < steps) { x += (Math.random() - 0.5) * 5; y += (Math.random() - 0.5) * 5; }
      pts.push([x, y]);
    }
    bolt(pts, life, 1.1);
  }

  // strikes at uneven intervals
  function every(min, max, fn) {
    var id = setTimeout(function () {
      var i = timers.indexOf(id);
      if (i >= 0) timers.splice(i, 1);
      if (!running) return;
      fn();
      every(min, max, fn);
    }, min + Math.random() * (max - min));
    timers.push(id);
  }

  function start() {
    running = true;
    var n1 = svg.querySelector('#cfx-noise'), n2 = svg.querySelector('#cfx-noise2');
    var d1 = svg.querySelector('#cfx-disp'), d2 = svg.querySelector('#cfx-disp2');
    var cur = 7;
    // the flicker eases toward a new strength; redrawn ~14 times a second (not every frame:
    // the filter is expensive)
    timers.push(setInterval(function () {
      n1.setAttribute('seed', String(Math.floor(Math.random() * 1000)));
      n2.setAttribute('seed', String(Math.floor(Math.random() * 1000)));
      cur += ((6 + Math.random() * 4) * 0.9 - cur) * 0.5;
      d1.setAttribute('scale', cur.toFixed(2));
      d2.setAttribute('scale', (cur * 0.7).toFixed(2));
    }, 70));
    every(120, 380, function () { edgeArc(Math.random(), 0.02 + Math.random() * 0.03, 170); tremble(0.6); });
    var CORNERS = [0.01, 0.27, 0.5, 0.77];
    every(1400, 2600, function () {
      var c = CORNERS[Math.floor(Math.random() * 4)];
      edgeArc(c - 0.04, 0.09, 260);
      flare(edgePoint(c + 0.005));
      tremble(1.4);
    });
  }

  function attach(card) {
    if (!card || reduced) return;
    if (!svg) build();
    if (svg.parentNode !== card) card.appendChild(svg);
    if (!running) start();
  }

  function stop() {
    running = false;
    timers.forEach(function (t) { clearInterval(t); clearTimeout(t); });
    timers = [];
    if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
    if (arcs) arcs.innerHTML = '';
  }

  // ---------- the slam ----------
  function burst(stage, x, y) {
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('span');
      s.className = 'card-fx-spark';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      stage.appendChild(s);
      var a = -Math.PI * (0.05 + Math.random() * 0.9); // up and sideways, off the table
      var d = 50 + Math.random() * 80, tx = Math.cos(a) * d, ty = Math.sin(a) * d;
      s.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + tx * 0.7 + 'px,' + ty * 0.8 + 'px) scale(0.8)', opacity: 0.9, offset: 0.5 },
        { transform: 'translate(' + tx + 'px,' + (ty * 0.6 + 18) + 'px) scale(0.2)', opacity: 0 }
      ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' }).onfinish = s.remove.bind(s);
    }
  }

  var LAND = 430, TOTAL = 720, HANDOFF = 580;
  function slam(card, stage, done) {
    if (reduced || !card.animate) { done(); return; }
    var k = function (ms) { return ms / TOTAL; };
    var base = card.style.transform; // the carousel's own place and size for the card
    card.classList.add('is-slammed');
    function tf(t) { return base + ' ' + t; }
    card.animate([
      { transform: tf('translateY(0) scale(1) rotateX(0deg)'), filter: 'brightness(1)', easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: tf('translateY(-22px) scale(1.1) rotateX(12deg)'), filter: 'brightness(1.2)', offset: k(300), easing: 'linear' },
      { transform: tf('translateY(-24px) scale(1.11) rotateX(13deg)'), filter: 'brightness(1.22)', offset: k(340), easing: 'cubic-bezier(0.55, 0, 0.9, 0.5)' },
      { transform: tf('translateY(4px) scale(0.97, 0.95) rotateX(0deg)'), filter: 'brightness(1.35)', offset: k(LAND), easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
      { transform: tf('translateY(-2px) scale(1.012, 1.01)'), filter: 'brightness(1.1)', offset: k(560), easing: 'cubic-bezier(0.4, 0, 0.3, 1)' },
      { transform: tf('translateY(0) scale(1) rotateX(0deg)'), filter: 'brightness(1)' }
    ], { duration: TOTAL }).onfinish = function () { card.classList.remove('is-slammed'); };
    // the page moves on as the card settles (580ms, after the little bounce), not after the
    // last 140ms of easing: waiting for the very end felt like a lag (the user's request). A
    // timer, so it also happens when the animation is held up (a hidden page pauses it)
    var finished = false;
    setTimeout(function () {
      if (finished) return;
      finished = true;
      done();
    }, HANDOFF);

    setTimeout(function () {
      // a decaying shake: three swings, each smaller
      stage.animate([
        { transform: 'translate(0, 0)' },
        { transform: 'translate(0, 5px)', offset: 0.18 },
        { transform: 'translate(-2px, -3px)', offset: 0.4 },
        { transform: 'translate(1px, 1.5px)', offset: 0.65 },
        { transform: 'translate(0, 0)' }
      ], { duration: 380, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' });
      var flash = document.createElement('span');
      flash.className = 'card-fx-flash';
      stage.appendChild(flash);
      flash.animate([{ opacity: 0 }, { opacity: 0.22, offset: 0.2 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' })
        .onfinish = flash.remove.bind(flash);
      var r = card.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var x = r.left - sr.left + r.width / 2, y = r.top - sr.top + r.height * 0.88;
      [0, 90].forEach(function (delay, i) {
        var ring = document.createElement('span');
        ring.className = 'card-fx-ring';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
        stage.appendChild(ring);
        ring.animate([
          { transform: 'scale(0.5) scaleY(0.32)', opacity: i ? 0.5 : 0.9 },
          { transform: 'scale(' + (i ? 4.2 : 5.8) + ') scaleY(0.32)', opacity: 0 }
        ], { duration: 820, delay: delay, easing: 'cubic-bezier(0.15, 0.6, 0.25, 1)', fill: 'backwards' })
          .onfinish = ring.remove.bind(ring);
      });
      burst(stage, x, y);
      if (navigator.vibrate) navigator.vibrate([25, 30, 60]);
    }, LAND);
  }

  window.CardFx = { attach: attach, stop: stop, slam: slam };
})();
