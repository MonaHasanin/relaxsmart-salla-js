/* RELAX SMART | STATS NATIVE 2-COLUMN MOBILE ONLY
   SECTION 932031919 — keeps the original Salla cards and numbers.
   IMPORTANT: delete the old RS116 / RS117 JavaScript from Salla first.
   There are NO custom cards, timers running indefinitely, or checkout changes.
*/
(function () {
  "use strict";
  if (window.__RS_NATIVE_STATS_GRID_V120__) return;
  window.__RS_NATIVE_STATS_GRID_V120__ = true;

  var sectionSelector = 'section[component-id="932031919"]';
  var styleId = 'rs-native-stats-mobile-grid-v120';

  /* Only layout: don't override typography, colors or the theme's cards. */
  var shadowCSS =
    '@media (max-width:767px){' +
    ':host .stats-grid{' +
      'display:grid!important;' +
      'grid-template-columns:repeat(2,minmax(0,1fr))!important;' +
      'gap:10px!important;' +
    '}' +
    ':host .stats-grid>.stat-card{' +
      'min-width:0!important;' +
      'max-width:100%!important;' +
      'width:100%!important;' +
      'box-sizing:border-box!important;' +
    '}' +
    '}';

  var lightCSS =
    '@media (max-width:767px){' +
    sectionSelector + ' .stats-grid{' +
      'display:grid!important;' +
      'grid-template-columns:repeat(2,minmax(0,1fr))!important;' +
      'gap:10px!important;' +
    '}' +
    sectionSelector + ' .stats-grid>.stat-card{' +
      'min-width:0!important;' +
      'max-width:100%!important;' +
      'width:100%!important;' +
      'box-sizing:border-box!important;' +
    '}' +
    '}';

  function apply() {
    var section = document.querySelector(sectionSelector);
    if (!section) return false;

    /* Clean up leftover V116/V117 cards, if any were previously injected. */
    section.querySelectorAll('.rs116-stats-mobile, .rs117-stats-panel')
      .forEach(function (el) { el.remove(); });
    section.classList.remove('rs116-stats-ready', 'rs117-ready');
    var oldStyle = document.getElementById('rs117-stats-css');
    if (oldStyle) oldStyle.remove();

    var host = section.querySelector('[component-name="stats-section"]');
    if (!host) return false;

    /* Salla's custom element may render its grid inside Shadow DOM. */
    if (host.shadowRoot) {
      if (!host.shadowRoot.getElementById(styleId)) {
        var style = document.createElement('style');
        style.id = styleId;
        style.textContent = shadowCSS;
        host.shadowRoot.appendChild(style);
      }
      return true;
    }

    /* Fallback for a light-DOM version of the component. */
    if (host.querySelector('.stats-grid')) {
      if (!document.getElementById(styleId)) {
        var lightStyle = document.createElement('style');
        lightStyle.id = styleId;
        lightStyle.textContent = lightCSS;
        document.head.appendChild(lightStyle);
      }
      return true;
    }

    return false;
  }

  function boot() {
    if (apply()) return;

    /* Bounded retry for late component upgrade; never runs forever. */
    var tries = 0;
    var retry = setInterval(function () {
      tries++;
      if (apply() || tries >= 40) clearInterval(retry);
    }, 250);

    /* If Salla lazy-loads this far-down section later, retry on visibility. */
    var section = document.querySelector(sectionSelector);
    if (section && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
        io.disconnect();
        if (apply()) return;
        var n = 0;
        var late = setInterval(function () {
          n++;
          if (apply() || n >= 30) clearInterval(late);
        }, 250);
      }, { rootMargin: '700px' });
      io.observe(section);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
