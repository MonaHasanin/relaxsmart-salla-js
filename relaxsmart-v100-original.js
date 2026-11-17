/* RELAX SMART V116 — Two-column stats on mobile ONLY
   Paste once AFTER your existing single JS loader in Salla.
   Reads the existing stats configuration: no numbers are invented.
   Preserves native Salla component on desktop.
*/
(function () {
  "use strict";
  if (window.__RS116_STATS__) return;
  window.__RS116_STATS__ = true;

  function render() {
    var section = document.querySelector('section[component-id="932031919"]');
    if (!section) return false;
    if (section.querySelector('.rs116-stats-mobile')) return true;

    var component = section.querySelector('[component-name="stats-section"]');
    if (!component) return false;

    var config;
    try {
      config = JSON.parse(component.getAttribute('config') || '{}');
    } catch (e) {
      console.warn('Relax Smart stats: invalid configuration');
      return true; // Do not hide the original section.
    }
    if (!Array.isArray(config.stats) || !config.stats.length) return false;

    var panel = document.createElement('div');
    panel.className = 'rs116-stats-mobile';
    panel.setAttribute('dir', 'rtl');

    var headingText = config.title || (config.ar && config.ar.title) || '';
    var subtitleText = config.subtitle || (config.ar && config.ar.subtitle) || '';

    if (headingText) {
      var heading = document.createElement('h2');
      heading.className = 'rs116-stats-heading';
      heading.textContent = headingText;
      panel.appendChild(heading);
    }
    if (subtitleText) {
      var subtitle = document.createElement('p');
      subtitle.className = 'rs116-stats-subtitle';
      subtitle.textContent = subtitleText;
      panel.appendChild(subtitle);
    }

    var grid = document.createElement('div');
    grid.className = 'rs116-stats-grid';

    config.stats.forEach(function (stat) {
      if (!stat || stat.__hidden) return;
      var card = document.createElement('div');
      card.className = 'rs116-stat-card';

      if (typeof stat.icon === 'string' && /^sicon-[a-z0-9-]+$/i.test(stat.icon)) {
        var icon = document.createElement('i');
        icon.className = 'rs116-stat-icon ' + stat.icon;
        icon.setAttribute('aria-hidden', 'true');
        card.appendChild(icon);
      }

      var number = document.createElement('strong');
      number.className = 'rs116-stat-number';
      number.textContent = String(stat.value == null ? '' : stat.value) +
        String(stat.suffix == null ? '' : stat.suffix);
      card.appendChild(number);

      var label = document.createElement('span');
      label.className = 'rs116-stat-label';
      label.textContent = String(stat.label || (stat.ar && stat.ar.label) || '');
      card.appendChild(label);

      grid.appendChild(card);
    });

    if (!grid.children.length) return false;
    panel.appendChild(grid);
    component.insertAdjacentElement('afterend', panel);
    section.classList.add('rs116-stats-ready');
    return true;
  }

  // A short bounded retry, no MutationObserver and no continuous polling.
  if (!render()) {
    var attempts = 0;
    var retry = setInterval(function () {
      attempts += 1;
      if (render() || attempts >= 20) clearInterval(retry);
    }, 350);
  }
})();

/*
 RELAX SMART V117
 Mobile Stats 2 x 2 — Self-contained
 Component: 932031919

 No external CSS required.
 No changes to cart, checkout or product pages.
*/

(function () {
  "use strict";

  if (window.__RS117_STATS__) return;
  window.__RS117_STATS__ = true;

  var SECTION_ID = "932031919";
  var SELECTOR =
    'section[component-id="' + SECTION_ID + '"]';

  /* 1. CSS مخصص للقسم فقط */
  var css = `
    ${SELECTOR} > .rs117-stats-panel {
      display: none !important;
    }

    @media (max-width: 767px) {

      ${SELECTOR}.rs117-ready
      > [component-name="stats-section"] {
        display: none !important;
      }

      ${SELECTOR}.rs117-ready
      > .rs117-stats-panel {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px 12px !important;
        margin: 0 auto !important;
        background: #ffffff !important;
        direction: rtl !important;
      }

      ${SELECTOR} .rs117-heading {
        margin: 0 0 7px !important;
        text-align: center !important;
        font-size: 22px !important;
        line-height: 1.4 !important;
        font-weight: 800 !important;
        color: #49301e !important;
      }

      ${SELECTOR} .rs117-subtitle {
        max-width: 340px !important;
        margin: 0 auto 15px !important;
        text-align: center !important;
        font-size: 12px !important;
        line-height: 1.7 !important;
        color: #746459 !important;
      }

      /* كل كارتين في صف واحد */
      ${SELECTOR} .rs117-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        align-items: stretch !important;
      }

      ${SELECTOR} .rs117-card {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
        min-width: 0 !important;
        width: 100% !important;
        min-height: 125px !important;
        margin: 0 !important;
        padding: 13px 7px !important;
        box-sizing: border-box !important;
        border: 1px solid #ead8c8 !important;
        border-radius: 14px !important;
        background: #fffaf5 !important;
        box-shadow: none !important;
        text-align: center !important;
      }

      ${SELECTOR} .rs117-icon {
        display: inline-block !important;
        font-size: 26px !important;
        line-height: 1.2 !important;
        color: #b46b2e !important;
      }

      ${SELECTOR} .rs117-number {
        display: block !important;
        width: 100% !important;
        font-size: clamp(19px, 5vw, 25px) !important;
        line-height: 1.3 !important;
        font-weight: 900 !important;
        color: #b76525 !important;
        text-align: center !important;
        direction: ltr !important;
        unicode-bidi: isolate !important;
        overflow-wrap: anywhere !important;
      }

      ${SELECTOR} .rs117-label {
        display: block !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
        font-weight: 700 !important;
        color: #40352d !important;
        text-align: center !important;
        overflow-wrap: anywhere !important;
      }
    }
  `;

  if (!document.getElementById("rs117-stats-css")) {
    var style = document.createElement("style");
    style.id = "rs117-stats-css";
    style.textContent = css;
    (document.head || document.documentElement)
      .appendChild(style);
  }

  /* 2. إنشاء العناصر من إعدادات سلة */
  function renderStats() {
    var section = document.querySelector(SELECTOR);
    if (!section) return false;

    var component = section.querySelector(
      '[component-name="stats-section"]'
    );

    if (!component) return false;

    var config;

    try {
      config = JSON.parse(
        component.getAttribute("config") || "{}"
      );
    } catch (error) {
      return false;
    }

    if (!Array.isArray(config.stats)) return false;

    var stats = config.stats.filter(function (item) {
      return item && !item.__hidden;
    });

    if (!stats.length) return false;

    /* منع ظهور النسخ القديمة */
    var oldPanel = section.querySelector(
      ".rs116-stats-mobile"
    );

    if (oldPanel) oldPanel.remove();
    section.classList.remove("rs116-stats-ready");

    var existing = section.querySelector(
      ".rs117-stats-panel"
    );

    if (existing) {
      section.classList.add("rs117-ready");
      return true;
    }

    var panel = document.createElement("div");
    panel.className = "rs117-stats-panel";
    panel.setAttribute("dir", "rtl");

    var title =
      (config.ar && config.ar.title) ||
      config.title ||
      "";

    var subtitle =
      (config.ar && config.ar.subtitle) ||
      config.subtitle ||
      "";

    if (title) {
      var h2 = document.createElement("h2");
      h2.className = "rs117-heading";
      h2.textContent = title;
      panel.appendChild(h2);
    }

    if (subtitle) {
      var p = document.createElement("p");
      p.className = "rs117-subtitle";
      p.textContent = subtitle;
      panel.appendChild(p);
    }

    var grid = document.createElement("div");
    grid.className = "rs117-grid";

    stats.forEach(function (stat) {
      var card = document.createElement("div");
      card.className = "rs117-card";

      /* أيقونة الإحصائية */
      if (
        typeof stat.icon === "string" &&
        /^sicon-[a-z0-9-]+$/i.test(stat.icon)
      ) {
        var icon = document.createElement("i");
        icon.className = "rs117-icon " + stat.icon;
        icon.setAttribute("aria-hidden", "true");
        card.appendChild(icon);
      }

      /* القيمة كما هي مسجلة في سلة */
      var number = document.createElement("strong");
      number.className = "rs117-number";

      number.textContent =
        String(stat.value == null ? "" : stat.value) +
        String(stat.suffix == null ? "" : stat.suffix);

      card.appendChild(number);

      /* الوصف */
      var label = document.createElement("span");
      label.className = "rs117-label";

      label.textContent =
        (stat.ar && stat.ar.label) ||
        stat.label ||
        "";

      card.appendChild(label);
      grid.appendChild(card);
    });

    panel.appendChild(grid);

    component.insertAdjacentElement(
      "afterend",
      panel
    );

    section.classList.add("rs117-ready");

    return true;
  }

  /* 3. انتظار القسم لو سلة أضافته متأخرًا */
  function initialize() {
    if (renderStats()) return;

    var attempts = 0;
    var maxAttempts = 80;

    var timer = setInterval(function () {
      attempts++;

      if (
        renderStats() ||
        attempts >= maxAttempts
      ) {
        clearInterval(timer);
      }
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
