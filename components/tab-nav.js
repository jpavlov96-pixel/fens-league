// Bottom tab bar (Figma "Frame 181", 299:9412), shared by every page that has it.
// Markup and styles: the <nav class="tab-nav"> block and the "bottom tab bar" section of
// styles.css. The page marks its own tab with "is-active".
//
// Tapping a tab moves the active pill under it. A tab that links to another page slides
// the pill (and the page's ball and title off screen, see page-motion.js) and then opens
// it; there the pill is already under its tab (it moved on the page you left, so it
// doesn't slide again), and the bar's own entrance in the intro is skipped
// (window.tabNavArrived is true then).

(function () {
  var nav = document.querySelector('.tab-nav');
  if (!nav) return;
  var pill = nav.querySelector('.tab-nav__active');
  var items = Array.prototype.slice.call(nav.querySelectorAll('.tab-nav__item'));
  var STORE = 'tabNavFrom';

  function place(item) {
    pill.style.left = item.offsetLeft + 'px';
    pill.style.width = item.offsetWidth + 'px';
  }

  function setActive(item) {
    items.forEach(function (other) {
      other.classList.toggle('is-active', other === item);
      if (other === item) other.setAttribute('aria-current', 'page');
      else other.removeAttribute('aria-current');
    });
    place(item);
  }

  // The pill starts under this page's tab, without sliding: when you came from another tab,
  // it already slid there on the page you left
  var active = nav.querySelector('.tab-nav__item.is-active') || items[0];
  var from = null;
  try {
    from = sessionStorage.getItem(STORE);
    sessionStorage.removeItem(STORE);
  } catch (e) { /* storage blocked */ }
  window.tabNavArrived = from !== null;
  pill.style.transition = 'none';
  place(active);
  void pill.offsetWidth; // lay it out in place before the slide is switched back on
  pill.style.transition = '';

  // Coming back to this page from the browser's back/forward cache, its tab was handed
  // over as it was left: put it back
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) setActive(active);
  });

  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('is-active')) return;
      var current = nav.querySelector('.tab-nav__item.is-active');
      setActive(item);
      var href = item.getAttribute('href');
      if (href.charAt(0) === '#') return; // no page for this tab yet
      try { sessionStorage.setItem(STORE, String(items.indexOf(current))); } catch (err) { /* no slide on arrival */ }
      // the ball and title slide off (components/page-motion.js) while the pill moves, then go
      // The next page opens once both are over: the pill's slide is a little longer than
      // the page's, and cut short it would finish with a small jump on the next page
      var waiting = 2;
      var gone = false;
      var step = function () {
        waiting -= 1;
        if (waiting > 0 || gone) return;
        gone = true;
        window.location.href = href;
      };
      var pillDone = false;
      var pillStep = function () {
        if (pillDone) return;
        pillDone = true;
        step();
      };
      pill.addEventListener('transitionend', function (ev) {
        if (ev.propertyName === 'left') pillStep();
      });
      setTimeout(pillStep, 360); // the slide is 320ms; also covers no slide at all (reduced motion)
      if (window.pageMotionLeave) window.pageMotionLeave(step);
      else setTimeout(step, 220);
    });
  });
})();
