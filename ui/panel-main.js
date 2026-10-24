window.WAPanel = window.WAPanel || {};

window.WAPanel.mount = function() {
  if (document.getElementById('wa-privacy-panel-host')) return;

  const host = document.createElement('div');
  host.id = 'wa-privacy-panel-host';
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
  document.body.appendChild(host);

  window.WAPanel.syncTheme(host);
  const themeObserver = new MutationObserver(() => window.WAPanel.syncTheme(host));
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  const shadow = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = window.WA_PANEL_STYLES;
  shadow.appendChild(styleEl);

  const panel = document.createElement('div');
  panel.id = 'wa-panel';
  window.WAPanel.panel = panel;
  const parser = new DOMParser();
  const doc = parser.parseFromString(window.WA_PANEL_HTML, 'text/html');
  while (doc.body.firstChild) {
    panel.appendChild(doc.body.firstChild);
  }
  shadow.appendChild(panel);

  const versionEl = shadow.getElementById('panel-version');
  if (versionEl) versionEl.textContent = 'v' + chrome.runtime.getManifest().version;

  chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, (s) => window.WAPanel.applySettingsToPanel(shadow, s));

  const panelResizeObserver = new ResizeObserver(() => {
    if (window.WAPanel.isOpen && window.WAPanel.currentAnchorRect) window.WAPanel.positionPanel(panel, window.WAPanel.currentAnchorRect);
  });
  panelResizeObserver.observe(panel);

  window.WA_PANEL_API = { 
    open: (anchorRect) => window.WAPanel.openPanel(panel, anchorRect, shadow), 
    close: () => window.WAPanel.closePanel(panel), 
    toggle: (anchorRect) => window.WAPanel.togglePanel(panel, anchorRect, shadow) 
  };

  document.addEventListener('mousedown', (e) => {
    if (!window.WAPanel.isOpen) return;
    const path = e.composedPath();
    if (path.includes(panel)) return;
    const clb = window.WAPanel.clbBtn;
    if (clb && path.includes(clb)) return;
    window.WAPanel.closePanel(panel);
  });

  shadow.getElementById('panel-enabled').addEventListener('change', function () {
    chrome.storage.local.set({ enabled: this.checked });
    window.WAPanel.isEnabled = this.checked;
    if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
    shadow.getElementById('wa-dashboard').classList.toggle('shield-off', !this.checked);
  });

  for (const { id, key } of window.WAPanel.TOGGLE_MAP) {
    const el = shadow.getElementById(id);
    if (!el) continue;
    el.addEventListener('change', function () {
      chrome.storage.local.set({ [key]: this.checked });
      if (key === 'minimizerEnabled') {
        const cardMinimizer = shadow.getElementById('card-master-minimizer');
        if (cardMinimizer) cardMinimizer.classList.toggle('minimizer-off', !this.checked);
      } else if (key === 'unblurLastN') {
        const row = shadow.getElementById('drawerRow-unblur');
        const slider = shadow.getElementById('panel-unblur-last-n-slider');
        if (row) row.classList.toggle('disabled', !this.checked);
        if (slider) slider.disabled = !this.checked;
      } else if (key === 'blurInput') {
        const row = shadow.getElementById('drawerRow-input');
        const slider = shadow.getElementById('panel-input-opacity-slider');
        if (row) row.classList.toggle('disabled', !this.checked);
        if (slider) slider.disabled = !this.checked;
      } else if (key === 'animation') {
        const row = shadow.getElementById('drawerRow-animation');
        const slider = shadow.getElementById('panel-animation-duration-slider');
        if (row) row.classList.toggle('disabled', !this.checked);
        if (slider) slider.disabled = !this.checked;
      }
    });
  }

  const blurSlider = shadow.getElementById('panel-blur-intensity');
  const blurValEl = shadow.getElementById('panel-blur-val');
  const opacitySlider = shadow.getElementById('panel-input-opacity-slider');
  const opacityValEl = shadow.getElementById('panel-input-opacity-val');
  const unblurLastNSlider = shadow.getElementById('panel-unblur-last-n-slider');
  const unblurLastNValEl = shadow.getElementById('panel-unblur-last-n-val');
  const animSlider = shadow.getElementById('panel-animation-duration-slider');
  const animValEl = shadow.getElementById('panel-animation-duration-val');

  const debounce = (fn, delay = 120) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const saveBlurAmount = debounce((val) => chrome.storage.local.set({ blurAmount: val }));
  const saveInputOpacity = debounce((val) => chrome.storage.local.set({ inputOpacity: val }));
  const saveUnblurLastN = debounce((val) => chrome.storage.local.set({ unblurLastNCount: val }));
  const saveAnimDuration = debounce((val) => chrome.storage.local.set({ animationDuration: val }));

  blurSlider.addEventListener('input', function () {
    const val = parseInt(this.value, 10);
    blurValEl.textContent = `${val}px`;
    document.documentElement.style.setProperty('--wa-blur-amount', `${val}px`);
    saveBlurAmount(val);
  });

  opacitySlider.addEventListener('input', function () {
    const val = parseInt(this.value, 10);
    opacityValEl.textContent = `${val}%`;
    document.documentElement.style.setProperty('--wa-input-opacity', (val / 100).toFixed(2));
    saveInputOpacity(val);
  });

  unblurLastNSlider.addEventListener('input', function () {
    let val = parseInt(this.value, 10);
    if (val > 10) val = 10;
    unblurLastNValEl.textContent = `${val} msgs`;
    saveUnblurLastN(val);
  });

  if (animSlider && animValEl) {
    animSlider.addEventListener('input', function () {
      const val = parseFloat(this.value);
      animValEl.textContent = `${val}s`;
      saveAnimDuration(val);
    });
  }

  const modeBlurBtn = shadow.getElementById('panel-mode-blur');
  const modeRedactedBtn = shadow.getElementById('panel-mode-redacted');
  if (modeBlurBtn && modeRedactedBtn) {
    modeBlurBtn.addEventListener('click', () => {
      chrome.storage.local.set({ privacyMode: 'blur' });
    });
    modeRedactedBtn.addEventListener('click', () => {
      chrome.storage.local.set({ privacyMode: 'redacted' });
    });
  }

  const resetBtn = shadow.getElementById('panel-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chrome.storage.local.set(window.WAPanel.DEFAULT_SETTINGS, () => {
        window.WAPanel.applySettingsToPanel(shadow, window.WAPanel.DEFAULT_SETTINGS);
      });
    });
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'togglePanel') {
      const rect = window.WAPanel.clbBtn ? window.WAPanel.clbBtn.getBoundingClientRect() : null;
      window.WAPanel.togglePanel(panel, rect, shadow);
      return;
    }
    if (message.action === 'updateSettings' && message.settings) {
      window.WAPanel.applySettingsToPanel(shadow, message.settings);
      if (!document.body.contains(host)) document.body.appendChild(host);
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    if (!document.body.contains(host)) document.body.appendChild(host);
    chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, (s) => window.WAPanel.applySettingsToPanel(shadow, s));
  });

  window.addEventListener('resize', () => {
    if (window.WAPanel.isOpen && window.WAPanel.currentAnchorRect) window.WAPanel.positionPanel(panel);
  });

  window.WAPanel.syncThemeAndColor(host); 
  new MutationObserver(() => window.WAPanel.syncThemeAndColor(host))
    .observe(document.body, { attributeFilter: ['class'] });

  // Re-inject sidebar button when WhatsApp re-renders the sidebar,
  // instead of polling with setInterval.
  const sidebarObserver = new MutationObserver(() => {
    if (!document.getElementById('wa-privacy-btn-wrapper')) {
      window.WAPanel.injectChatlistBtn(panel, shadow);
    } else if (window.WAPanel.isOpen) {
      window.WAPanel.positionPanel(panel);
    }
  });

  const startSidebarObserver = () => {
    const header = document.querySelector('[data-testid="chatlist-header"]');
    if (header) {
      sidebarObserver.observe(header, { childList: true, subtree: true });
    } else {
      // Header not yet in DOM — wait for it
      const bodyObs = new MutationObserver(() => {
        const h = document.querySelector('[data-testid="chatlist-header"]');
        if (h) {
          bodyObs.disconnect();
          sidebarObserver.observe(h, { childList: true, subtree: true });
          window.WAPanel.injectChatlistBtn(panel, shadow);
        }
      });
      bodyObs.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  };
  startSidebarObserver();
  window.WAPanel.injectChatlistBtn(panel, shadow);
};

if (document.body) {
  window.WAPanel.mount();
} else {
  document.addEventListener('DOMContentLoaded', window.WAPanel.mount);
}
