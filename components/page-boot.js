// Loaded in the <head> of every page, before the first paint.
//
// The ball's bounce intro (and the content's entry with it) plays only when you come into
// the product from outside it: from another site (the main Sport or Casino pages), a
// bookmark, a typed address or a new tab. Moving between the product's own pages (the tab
// bar, the header's "Fens League", the logo, back/forward) shows the page straight away.
// "From inside" means the previous page (document.referrer) is on this same site, apart
// from the landing page (index.html), which stands in for the rest of the site. A reload
// keeps the original referrer, so it behaves the same.
//
// When the intro will play, this hides the top section until it starts, so the finished
// page never flashes before it. Skipped with reduced motion.

(function () {
  var fromInside = false;
  try {
    var ref = document.referrer && new URL(document.referrer);
    // the landing page (index.html, the site's root) stands in for the rest of the site
    // (Sport, Casino…): coming from there is coming from outside the product
    fromInside = !!ref && ref.origin === window.location.origin && !/^\/(index(\.html)?)?$/.test(ref.pathname);
  } catch (e) { /* no usable referrer: treated as coming from outside */ }
  window.cameFromProduct = fromInside;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fromInside && !reduced) {
    document.documentElement.classList.add('intro-pending');
  }

  // From inside the product the ball and title slide in (page-motion.js). Hide them from the
  // first frame until that starts, so the page is never drawn with them already in place
  // and then snapped off screen; a timer shows them if the slide never starts.
  if (fromInside && !reduced) {
    var root = document.documentElement;
    root.classList.add('arrive-pending');
    setTimeout(function () { root.classList.remove('arrive-pending'); }, 1500);
  }
})();
