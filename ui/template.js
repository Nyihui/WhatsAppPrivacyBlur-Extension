/* ==========================================================================
   WhatsApp Privacy Blur - Panel HTML Template
   Exposes: window.WA_PANEL_SHIELD_SVG, window.WA_PANEL_HTML
   Loaded before panel-main.js via manifest.json
   ========================================================================== */

window.WA_PANEL_SHIELD_SVG = `<div class="wa-panel-header-shield-icon" style="-webkit-mask-image: url('${chrome.runtime.getURL('icons/defence_active.png')}'); mask-image: url('${chrome.runtime.getURL('icons/defence_active.png')}'); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; -webkit-mask-size: contain; mask-size: contain; background-color: currentColor; width: 22px; height: 22px; display: inline-block; vertical-align: middle;"></div>`;

/* --------------------------------------------------------------------------
   Helper: build one circular toggle tile
-------------------------------------------------------------------------- */
function _qsTile(id, title, svgContent) {
  return `<label class="qs-tile-wrapper" id="tile-${id}">
    <input type="checkbox" id="${id}" class="qs-native-checkbox" style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;">
    <div class="qs-circle-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgContent}
      </svg>
    </div>
    <span class="qs-tile-label">${title}</span>
  </label>`;
}

window.WA_PANEL_HTML = `<div class="dashboard" id="wa-dashboard">

  <header class="header">
    <div class="logo-area">
      ${window.WA_PANEL_SHIELD_SVG}
      <span class="logo-text">WhatsApp Privacy Blur</span>
      <button class="reset-btn" id="panel-reset-btn" title="Reset all settings to default">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none"
          stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
    </div>
    <div class="header-right">
      <span class="logo-version" id="panel-version"></span>
    </div>
  </header>

  <div class="master-row">
    <div class="card master-card" id="card-master-status">
      <div class="master-card-main">
        <div class="master-label-wrap">
          <span class="master-label">Blur Status</span>
        </div>
        <label class="switch master-switch">
          <input type="checkbox" id="panel-enabled">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="master-card-footer">
        <span class="master-shortcut-desc">Blur Toggle</span>
        <kbd class="qs-kbd">Alt + /</kbd>
      </div>
    </div>

    <div class="card master-card" id="card-master-minimizer">
      <div class="master-card-main">
        <div class="master-label-wrap">
          <span class="master-label">Sidebar Minimizer</span>
        </div>
        <label class="switch master-switch">
          <input type="checkbox" id="panel-toggle-minimizer">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="master-card-footer">
        <span class="master-shortcut-desc">Minimize Toggle</span>
        <kbd class="qs-kbd">Alt + .</kbd>
      </div>
    </div>
  </div>

  <div class="qs-grid">
    ${_qsTile('panel-toggle-avatars', 'Profile Pics',
  '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />')}
    ${_qsTile('panel-toggle-names', 'Names',
    '<rect x="3" y="4" width="18" height="16" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="13" y2="16" />')}
    ${_qsTile('panel-toggle-previews', 'Previews',
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />')}
    ${_qsTile('panel-toggle-text-chats', 'Chat Text',
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="13" y2="13" />')}
    ${_qsTile('panel-toggle-stickers', 'Stickers',
          '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />')}
    ${_qsTile('panel-toggle-media-preview', 'Media',
            '<rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />')}
    ${_qsTile('panel-toggle-media-gallery', 'Gallery',
              '<path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />')}
    ${_qsTile('panel-toggle-unblur-last-n', 'Unblur Recent',
                '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />')}
    ${_qsTile('panel-toggle-input', 'Text Input',
                  '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" />')}
    ${_qsTile('panel-toggle-animation', 'Animation',
                    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />')}
  </div>

  <div class="card qs-drawer-area" id="subControlsDrawer">
    <div class="qs-drawer-header">
      <span class="qs-drawer-header-title">Adjustments</span>
      <div class="mode-pill-toggle">
        <button type="button" class="mode-pill active" id="panel-mode-blur">BLUR</button>
        <button type="button" class="mode-pill" id="panel-mode-redacted">REDACT</button>
      </div>
    </div>

    <div class="drawer-row" id="blurSliderRow">
      <span class="drawer-label">Blur Intensity</span>
      <div class="drawer-slider-wrap">
        <input type="range" id="panel-blur-intensity" min="2" max="20" value="3" class="range-slider">
        <span class="slider-val" id="panel-blur-val">3px</span>
      </div>
    </div>

    <div class="drawer-row disabled" id="drawerRow-unblur">
      <span class="drawer-label">Recent Messages</span>
      <div class="drawer-slider-wrap">
        <input type="range" class="range-slider" id="panel-unblur-last-n-slider" min="1" max="10" value="3" disabled>
        <span class="slider-val" id="panel-unblur-last-n-val">3 msgs</span>
      </div>
    </div>

    <div class="drawer-row" id="drawerRow-input">
      <span class="drawer-label">Input Opacity</span>
      <div class="drawer-slider-wrap">
        <input type="range" class="range-slider" id="panel-input-opacity-slider" min="5" max="95" value="30">
        <span class="slider-val" id="panel-input-opacity-val">30%</span>
      </div>
    </div>

    <div class="drawer-row" id="drawerRow-animation">
      <span class="drawer-label">Hover Animation</span>
      <div class="drawer-slider-wrap">
        <input type="range" class="range-slider" id="panel-animation-duration-slider" min="0.1" max="2.0" step="0.05" value="0.25">
        <span class="slider-val" id="panel-animation-duration-val">0.25s</span>
      </div>
    </div>
  </div>

</div>`;
