// Loaded in the <head> of every page, before the first paint.
//
// The ball's bounce intro (and the content's entry with it) plays only when you come into
// the product from outside it: from another site (the main Sport or Casino pages), a
// bookmark, a typed address or a new tab. Moving between the product's own pages (the tab
// bar, the header's "Fens League", the logo, back/forward) shows the page straight away.
// "From inside" means the previous page (document.referrer) is on this same site, which
// only hosts the product. A reload keeps the original referrer, so it behaves the same.
//
// When the intro will play, this hides the top section until it starts, so the finished
// page never flashes before it. Skipped with reduced motion.

(function () {
  var fromInside = false;
  try {
    fromInside = !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch (e) { /* no usable referrer: treated as coming from outside */ }
  window.cameFromProduct = fromInside;

  if (!fromInside && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('intro-pending');
  }
})();
