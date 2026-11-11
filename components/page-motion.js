// Moving between the product's pages: the ball slides off to the right and the text on the
// left (the big title, its subtitle and, on the lobby, the league / "Как се играе?" row)
// slides off to the left; on the next page they slide back in, so the ball's video
// starting over happens off screen.
//
// Leaving is started by the tab bar (window.pageMotionLeave, see tab-nav.js); arriving
// plays on any page reached from inside the product (window.cameFromProduct, set by
// page-boot.js). Coming in from outside plays the bounce intro instead. Skipped with
// reduced motion. Load it at the end of <body>, before components/tab-nav.js.

(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !!Element.prototype.animate && !reduced;
  var EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
  var EASE_OUT = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
  var LEAVE = 260; // ms
  var ARRIVE = 520; // ms
  var BALL_WAIT = 1000; // ms, the longest the ball waits for its video before sliding in

  function leftBlocks() {
    return Array.prototype.slice.call(document.querySelectorAll('.sport-header__content, .page-hero__title, .page-hero__subtitle'));
  }
  function ball() { return document.querySelector('.sport-header__image'); }

  // how far each has to travel to be just off screen
  function offLeft(el) { return -(el.getBoundingClientRect().right + 10); }
  function offRight(el) { return window.innerWidth - el.getBoundingClientRect().left + 10; }

  var leaving = [];

  // slide everything out, then call done
  window.pageMotionLeave = function (done) {
    if (!canAnimate) return done();
    var b = ball();
    leaving = leftBlocks().map(function (el) {
      return el.animate([{ transform: 'none' }, { transform: 'translateX(' + offLeft(el) + 'px)' }],
        { duration: LEAVE, easing: EASE_IN, fill: 'forwards' });
    });
    if (b) leaving.push(b.animate([{ transform: 'none' }, { transform: 'translateX(' + offRight(b) + 'px)' }],
      { duration: LEAVE, easing: EASE_IN, fill: 'forwards' }));
    setTimeout(done, LEAVE);
  };

  // back to this page from the browser's back/forward cache: it's still slid out, so put it back
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    leaving.forEach(function (a) { a.cancel(); });
    leaving = [];
  });

  // Arriving from another page of the product: slide in, the text a beat apart, the ball
  // last. They're hidden until now (the "arrive-pending" class from page-boot.js) and are
  // revealed in the same moment the slide starts, already off screen. The slide waits for
  // the fonts (at most 0.3s), so the title doesn't change shape while it moves.
  // window.pageArrival resolves when the slide-in is over (the counters wait for it).
  window.pageArrival = new Promise(function (resolve) {
    var root = document.documentElement;
    if (!canAnimate || !window.cameFromProduct) {
      root.classList.remove('arrive-pending');
      return resolve();
    }
    var started = false;
    function start() {
      if (started) return;
      started = true;
      var anims = leftBlocks().map(function (el, i) {
        return el.animate([{ transform: 'translateX(' + offLeft(el) + 'px)' }, { transform: 'none' }],
          { duration: ARRIVE, delay: i * 40, easing: EASE_OUT, fill: 'backwards' });
      });
      // The ball waits off screen until its video is at its starting point (at most
      // BALL_WAIT), so it never slides in empty and fills in afterwards
      var b = ball();
      if (b) {
        var ballIn = b.animate([{ transform: 'translateX(' + offRight(b) + 'px)' }, { transform: 'none' }],
          { duration: ARRIVE, delay: 60, easing: EASE_OUT, fill: 'backwards' });
        ballIn.pause();
        var go = function () { if (ballIn.playState === 'paused') ballIn.play(); };
        (window.ballReady || Promise.resolve()).then(go);
        setTimeout(go, BALL_WAIT);
      }
      root.classList.remove('arrive-pending');
      Promise.all(anims.map(function (a) { return a.finished; })).then(resolve, resolve);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    setTimeout(start, 300);
  });
})();
