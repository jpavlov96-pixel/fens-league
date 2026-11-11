// The ball video starts from a random point in its spin on every page load.
//
// Starting mid-video is a seek, and seeking needs the server to answer partial ("range")
// requests, which neither the hosting nor serve.py does. So the video is loaded whole (from
// the browser's cache after the first visit) and played from memory, where it can be
// seeked freely. The page's <video> names its two files in data-src-mov (HEVC with alpha,
// for Safari) and data-src-webm (everything else). If the load fails, the ball simply
// plays from its start. The ball fades in once it's at its random point (see the
// "is-ready" rule in styles.css). Load this right after the page's content.

(function () {
  var video = document.querySelector('.sport-header__video');
  if (!video) return;
  var mov = video.getAttribute('data-src-mov');
  var webm = video.getAttribute('data-src-webm');
  var url = mov && video.canPlayType('video/quicktime; codecs="hvc1"') ? mov : webm;

  function ready() { video.classList.add('is-ready'); }

  video.addEventListener('loadedmetadata', function () {
    if (video.seekable.length && isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.random() * video.duration;
      video.addEventListener('seeked', ready, { once: true });
    } else {
      video.addEventListener('loadeddata', ready, { once: true });
    }
  }, { once: true });
  setTimeout(ready, 3000); // never leave the ball hidden

  if (!window.fetch || !window.URL || !URL.createObjectURL) {
    video.src = url;
    return;
  }
  fetch(url)
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.blob();
    })
    .then(function (blob) { video.src = URL.createObjectURL(blob); })
    .catch(function () { video.src = url; }); // plays from the start instead
})();
