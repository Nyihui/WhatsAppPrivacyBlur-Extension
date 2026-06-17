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
    const clb = document.getElementById(window.WAPanel.CLB_ID);
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
      const row = shadow.getElementById(`row-${id}`);
      if (row) {
        const panel = row.querySelector('.inline-slider-container');
        const text = row.querySelector('.row-text');
        if (panel && text) {
          panel.style.display = this.checked ? 'flex' : 'none';
          text.style.display = this.checked ? 'none' : 'flex';
        }
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

  blurSlider.addEventListener('input', function () {
    blurValEl.textContent = `${this.value}px`;
    chrome.storage.local.set({ blurAmount: parseInt(this.value, 10) });
  });

  opacitySlider.addEventListener('input', function () {
    opacityValEl.textContent = `${this.value}%`;
    chrome.storage.local.set({ inputOpacity: parseInt(this.value, 10) });
  });

  unblurLastNSlider.addEventListener('input', function () {
    let val = parseInt(this.value, 10);
    if (val > 10) val = 10;
    unblurLastNValEl.textContent = val;
    chrome.storage.local.set({ unblurLastNCount: val });
  });

  if (animSlider && animValEl) {
    animSlider.addEventListener('input', function () {
      animValEl.textContent = `${this.value}s`;
      chrome.storage.local.set({ animationDuration: parseFloat(this.value) });
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
      const clb = document.getElementById(window.WAPanel.CLB_ID);
      const rect = clb ? clb.getBoundingClientRect() : null;
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
    if (window.WAPanel.isOpen && window.WAPanel.currentAnchorRect) window.WAPanel.positionPanel(panel, window.WAPanel.currentAnchorRect);
  });

  window.WAPanel.syncThemeAndColor(host); 
  new MutationObserver(() => window.WAPanel.syncThemeAndColor(host))
    .observe(document.body, { attributeFilter: ['class'] });

  setInterval(() => {
    if (!document.getElementById(window.WAPanel.CLB_ID)) window.WAPanel.injectChatlistBtn(panel, shadow);
  }, 2000);
  window.WAPanel.injectChatlistBtn(panel, shadow);
};

if (document.body) {
  window.WAPanel.mount();
} else {
  document.addEventListener('DOMContentLoaded', window.WAPanel.mount);
}
