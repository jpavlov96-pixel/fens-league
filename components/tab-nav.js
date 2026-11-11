// Bottom tab bar (Figma "Frame 181", 299:9412), shared by every page that has it.
// Markup and styles: the <nav class="tab-nav"> block and the "bottom tab bar" section of
// styles.css. The page marks its own tab with "is-active".
//
// Tapping a tab moves the active pill under it. A tab that links to another page slides
// the pill first and then opens the page; that page starts the pill under the tab you
// came from and slides it home, and skips the bar's own entrance in its intro
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

  // Arriving from another tab's page: start the pill where it was, then slide it here
  var active = nav.querySelector('.tab-nav__item.is-active') || items[0];
  var from = null;
  try {
    from = sessionStorage.getItem(STORE);
    sessionStorage.removeItem(STORE);
  } catch (e) { /* storage blocked: no slide, the pill just starts in place */ }
  window.tabNavArrived = from !== null;
  var fromItem = from !== null ? items[parseInt(from, 10)] : null;
  if (fromItem && fromItem !== active) {
    pill.style.transition = 'none';
    place(fromItem);
    void pill.offsetWidth; // lay out the start position, so the move below slides from it
    pill.style.transition = '';
    place(active);
  } else {
    place(active);
  }

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
      setTimeout(function () { window.location.href = href; }, 220); // let the pill move first
    });
  });
})();
