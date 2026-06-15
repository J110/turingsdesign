/* ============================================================
   Mechanism reveal — a single moving spotlight.
   · only ONE section shows mechanism at any time
   · auto-cascade: spotlight advances to the next section every 5s
   · chip click reseats the spotlight (and pauses auto briefly)
   Driven by data-face + clip-path (see sections.css).
   ============================================================ */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs = [].slice.call(document.querySelectorAll('.layer-sec')).filter(function (s) { return s.querySelector('.mc-face'); });
  if (!secs.length) return;
  var INTERVAL = 5000, PAUSE = 9000, current = -1, timer = null;

  function setFace(sec, f) {
    if ((sec.getAttribute('data-face') || 'play') === f) return;
    sec.setAttribute('data-face', f);
    var chip = sec.querySelector('.flip-chip');
    if (chip) { chip.setAttribute('aria-pressed', f === 'mechanism'); chip.textContent = f === 'mechanism' ? '[ play ]' : '[ mechanism ]'; }
  }
  /* show mechanism on secs[idx] only (idx = -1 → all play) */
  function show(idx) {
    current = idx;
    secs.forEach(function (s, k) { setFace(s, k === idx ? 'mechanism' : 'play'); });
  }
  function schedule(delay) { if (timer) clearTimeout(timer); timer = setTimeout(tick, delay); }
  function tick() { show((current + 1) % secs.length); schedule(INTERVAL); }

  secs.forEach(function (sec, k) {
    var chip = sec.querySelector('.flip-chip');
    if (!chip) return;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', function () {
      show(current === k ? -1 : k);
      if (!RM) schedule(PAUSE);
    });
  });

  var exit = document.querySelector('.exit');
  if (exit) {
    exit.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.addEventListener('scroll', function () { exit.classList.toggle('show', window.scrollY > 700); }, { passive: true });
  }

  if (!RM) schedule(3200);
})();
