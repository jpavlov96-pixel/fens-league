// The ball's bounce intro, introBounceRefined(), for the pages with a .page-hero block
// (Прогнози, Класиране); the lobby has its own fuller version in lobby.html, which has
// the full notes. The ball drops from above the screen and bounces three times into its
// spot, stretching before and squashing on each landing, its shadow growing as it comes
// down, each landing kicking its spin and sending a gold ring along the ground. The title
// and subtitle come in with the landings, the tab bar after them; the first landing jolts
// the block. It plays on every load, and a tap skips to the end. Load it at the end of
// <body>, after components/tab-nav.js.

(function () {
  var bounceTimers = [];
  var section = document.querySelector('.page-hero');
  var ballFrame = document.querySelector('.sport-header__ball');
  var ballVideo = document.querySelector('.sport-header__video');
  var ballShadow = document.querySelector('.sport-header__shadow');
  var ballImage = document.querySelector('.sport-header__image');
  if (!section || !ballVideo) return;

  // The subtitle's gold number ("4т.", "#53") counts up from 0, the way the lobby's points
  // count between Сезон and Полусезон: fast at first, settling on the value. It starts once
  // the subtitle has finished coming in (the intro's, or the slide-in from another page of
  // the product, see page-motion.js). The real number is in the markup, so it just shows
  // without scripts or motion.
  var counters = Array.prototype.slice.call(document.querySelectorAll('.page-hero .count-up'));
  var countMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // each number keeps its final width while it counts, so the rest of the line stays put
  if (countMotion) counters.forEach(function (el) {
    el.style.display = 'inline-block';
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.style.textAlign = 'right';
    el.textContent = padCount(0, el);
  });

  // while counting, the number keeps the final value's digit count: #53 runs 00, 01 … 53
  function padCount(n, el) {
    var digits = String(parseInt(el.getAttribute('data-count'), 10) || 0).length;
    var text = String(n);
    while (text.length < digits) text = '0' + text;
    return text;
  }

  // once whatever brings the subtitle in has finished
  function countAfterSubtitle() {
    var subtitle = document.querySelector('.page-hero__subtitle');
    var entering = subtitle ? subtitle.getAnimations() : [];
    if (!entering.length) return countUp(0);
    Promise.all(entering.map(function (a) { return a.finished; }))
      .then(function () { countUp(0); }, function () { countUp(0); });
  }

  var counted = false;
  function countUp(delay) {
    if (!countMotion || counted) return;
    counted = true;
    counters.forEach(function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10) || 0;
      setTimeout(function () {
        var duration = 600;
        var start = performance.now();
        (function step(now) {
          var p = Math.min((now - start) / duration, 1);
          el.textContent = padCount(Math.round(to * (1 - Math.pow(1 - p, 3))), el);
          if (p < 1) requestAnimationFrame(step);
        })(start);
      }, delay);
    });
  }

  function introBounceRefined() {
    bounceTimers.forEach(clearTimeout);
    bounceTimers = [];
    var waitTime = 100;
    var bounces = [{ height: 36, time: 380 }, { height: 12, time: 230 }, { height: 4, time: 130 }];
    var squash = [0.18, 0.10, 0.06, 0.03];
    var stretch = [0.10, 0.06, 0.03, 0];
    var spinKick = [1, 0.6, 0.3, 0.15];
    var ringScale = [2.4, 1.9, 1.5, 1.25];
    var stretchTime = 70;
    var squashTime = 100;

    var imageBox = ballImage.getBoundingClientRect();
    var ballBox = ballVideo.getBoundingClientRect();
    var radius = ballBox.width / 2;
    var ballLeft = ballBox.left - imageBox.left;
    var groundY = ballBox.bottom - imageBox.top;

    var startY = -ballBox.bottom - 10;
    var fallTime = 450;
    var fallCurve = 3;
    var fromLeft = 110;

    var landings = [waitTime + fallTime];
    bounces.forEach(function (b) { landings.push(landings[landings.length - 1] + b.time); });
    var bounceTime = landings[landings.length - 1] + squashTime;

    function heightAt(ms) {
      if (ms < waitTime) return startY;
      if (ms < landings[0]) {
        var p = (ms - waitTime) / fallTime;
        return startY * (1 - Math.pow(p, fallCurve));
      }
      for (var i = 0; i < bounces.length; i++) {
        if (ms < landings[i + 1]) {
          var q = (ms - landings[i]) / bounces[i].time;
          return -bounces[i].height * (1 - Math.pow(2 * q - 1, 2));
        }
      }
      return 0;
    }

    function xAt(ms) {
      var u = Math.min(Math.max((ms - waitTime) / (bounceTime - waitTime), 0), 1);
      return -fromLeft * Math.pow(1 - u, 2.5);
    }

    function shapeAt(ms) {
      for (var i = 0; i < landings.length; i++) {
        var since = ms - landings[i];
        if (since >= 0 && since < squashTime) return squash[i] * Math.sin(Math.PI * since / squashTime);
        if (since >= -stretchTime && since < 0) return -stretch[i] * (1 + since / stretchTime);
      }
      return 0;
    }

    ballFrame.style.overflow = 'visible';
    section.style.zIndex = '1';
    bounceTimers.push(setTimeout(function () { ballFrame.style.overflow = ''; section.style.zIndex = ''; }, bounceTime));

    var ballFrames = [];
    var shadowFrames = [];
    for (var ms = 0; ms <= bounceTime; ms += 10) {
      var y = heightAt(ms);
      var d = shapeAt(ms);
      ballFrames.push({
        transform: 'translate(' + xAt(ms) + 'px, ' + (y + radius * d) + 'px) scale(' + (1 + d) + ', ' + (1 - d) + ')',
        offset: ms / bounceTime
      });
      var near = Math.min(Math.max(1 - -y / 200, 0), 1);
      shadowFrames.push({
        transform: 'translateX(' + (xAt(ms) + Math.min(-y * 0.3, 40)) + 'px) scale(' + (0.4 + 0.6 * near) + ', 1)',
        opacity: 0.1 + 0.9 * near,
        offset: ms / bounceTime
      });
    }
    ballFrames[ballFrames.length - 1].offset = 1;
    shadowFrames[shadowFrames.length - 1].offset = 1;
    ballFrame.animate(ballFrames, { duration: bounceTime, fill: 'backwards' });
    ballShadow.animate(shadowFrames, { duration: bounceTime, fill: 'backwards' });

    landings.forEach(function (at, i) {
      var ring = document.createElement('div');
      ring.className = 'intro-temp';
      var ringHeight = radius * 2 * 0.28;
      ring.style.cssText = 'position: absolute; left: ' + ballLeft + 'px; top: ' + (groundY - ringHeight / 2) + 'px; ' +
        'width: ' + radius * 2 + 'px; height: ' + ringHeight + 'px; border: 1px solid #f5d584; ' +
        'border-radius: 50%; opacity: 0; pointer-events: none;';
      ballImage.insertBefore(ring, ballFrame);
      ring.animate([
        { transform: 'translateX(' + xAt(at) + 'px) scale(0.6)', opacity: 0.4 },
        { transform: 'translateX(' + xAt(at) + 'px) scale(' + ringScale[i] + ')', opacity: 0 }
      ], { duration: 700, delay: at, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' })
        .onfinish = function () { ring.remove(); };
    });

    section.animate([
      { transform: 'none' },
      { transform: 'translateY(2px)', offset: 0.25 },
      { transform: 'translateY(-1px)', offset: 0.6 },
      { transform: 'none' }
    ], { duration: 180, delay: landings[0] });

    var spinStart = performance.now();
    var spinTimer = setInterval(function () {
      var t = performance.now() - spinStart;
      var rate = 1;
      landings.forEach(function (at, i) {
        if (t > at) rate += spinKick[i] * Math.exp(-(t - at) / 300);
      });
      ballVideo.playbackRate = rate;
      if (t > bounceTime + 1500) { clearInterval(spinTimer); ballVideo.playbackRate = 1; }
    }, 50);
    bounceTimers.push(spinTimer);

    function bringIn(selector, delay) {
      document.querySelector(selector).animate([
        { opacity: 0, transform: 'translateY(-8px) scale(0.97)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 450, delay: delay, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' });
    }
    bringIn('.page-hero__title', landings[0]);
    bringIn('.page-hero__subtitle', landings[1]);
    countAfterSubtitle();
    // the tab bar rises in last, unless you came from another tab (then it stays put)
    var nav = document.querySelector('.tab-nav');
    if (nav && !window.tabNavArrived) nav.animate([
      { opacity: 0, transform: 'translateY(24px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 450, delay: landings[3] + 100, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' });
  }

  var introStarted = false;

  function startIntro() {
    if (introStarted) return;
    introStarted = true;
    document.documentElement.classList.remove('intro-pending');
    section.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    introBounceRefined();
    document.addEventListener('pointerdown', skipIntro, { once: true });
  }

  function skipIntro() {
    document.getAnimations().forEach(function (a) {
      if (a.effect.getComputedTiming().iterations === 1) a.finish();
    });
    document.querySelectorAll('.intro-temp').forEach(function (el) { el.remove(); });
    ballFrame.style.overflow = '';
    section.style.zIndex = '';
    ballVideo.playbackRate = 1;
  }

  if (document.documentElement.classList.contains('intro-pending')) {
    // wait for the ball's video to be at its starting point (components/ball-video.js)
    if (window.ballReady) window.ballReady.then(startIntro);
    else if (ballVideo.readyState >= 3) startIntro();
    else ballVideo.addEventListener('canplay', startIntro, { once: true });
    setTimeout(startIntro, 2500);
  } else {
    // no intro: after the slide-in from another page (page-motion.js), or straight away
    (window.pageArrival || Promise.resolve()).then(countAfterSubtitle);
  }
})();
