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

<div class="stats-grid">
          <!--?lit$662756805$--><!---->
            <div class="stat-card with-border" style="--card-bg: #FFFFFF;">
              <!--?lit$662756805$-->
                <div class="icon-wrapper">
                  <i class="sicon-users"></i>
                </div>
              
              <div class="stat-value-container">
                <span class="stat-value"><!--?lit$662756805$-->2000</span>
                <!--?lit$662756805$--><span class="stat-suffix"><!--?lit$662756805$-->K+</span>
              </div>
              <div class="stat-label"><!--?lit$662756805$-->عدد المنتجات المباعة</div>
            </div>
          <!----><!---->
            <div class="stat-card with-border" style="--card-bg: #FFFFFF;">
              <!--?lit$662756805$-->
                <div class="icon-wrapper">
                  <i class="sicon-package"></i>
                </div>
              
              <div class="stat-value-container">
                <span class="stat-value"><!--?lit$662756805$-->100</span>
                <!--?lit$662756805$--><span class="stat-suffix"><!--?lit$662756805$-->%</span>
              </div>
              <div class="stat-label"><!--?lit$662756805$-->من العملاء راضون عن الخدمة</div>
            </div>
          <!----><!---->
            <div class="stat-card with-border" style="--card-bg: #FFFFFF;">
              <!--?lit$662756805$-->
                <div class="icon-wrapper">
                  <i class="sicon-star"></i>
                </div>
              
              <div class="stat-value-container">
                <span class="stat-value"><!--?lit$662756805$-->25000</span>
                <!--?lit$662756805$-->
              </div>
              <div class="stat-label"><!--?lit$662756805$-->زائر يوميًا</div>
            </div>
          <!----><!---->
            <div class="stat-card with-border" style="--card-bg: #FFFFFF;">
              <!--?lit$662756805$-->
                <div class="icon-wrapper">
                  <i class="sicon-award"></i>
                </div>
              
              <div class="stat-value-container">
                <span class="stat-value"><!--?lit$662756805$-->8000</span>
                <!--?lit$662756805$--><span class="stat-suffix"><!--?lit$662756805$-->+</span>
              </div>
              <div class="stat-label"><!--?lit$662756805$-->طلب مكتمل</div>
            </div>
          <!---->
        </div>
