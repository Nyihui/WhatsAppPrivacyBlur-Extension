/* ==========================================================================
   WhatsApp Privacy Blur - Panel HTML Template
   Exposes: window.WA_PANEL_SHIELD_SVG, window.WA_PANEL_HTML
   Loaded before panel-main.js via manifest.json
   ========================================================================== */

window.WA_PANEL_SHIELD_SVG = `<div class="wa-panel-header-shield-icon" style="-webkit-mask-image: url('${chrome.runtime.getURL('icons/defence_active.png')}'); mask-image: url('${chrome.runtime.getURL('icons/defence_active.png')}'); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; -webkit-mask-size: contain; mask-size: contain; background-color: currentColor; width: 22px; height: 22px; display: inline-block; vertical-align: middle;"></div>`;

/* --------------------------------------------------------------------------
   Helper: build one toggle row
   <span class="row-desc">${desc}</span>
-------------------------------------------------------------------------- */
function _panelRow(id, title, desc, svgPath) {
  return `<div class="control-row" id="row-${id}">
    <div class="icon-box">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${svgPath}
      </svg>
    </div>
    <div class="row-text">
      <span class="row-title">${title}</span>
    </div>
    <label class="switch row-switch">
      <input type="checkbox" id="${id}">
      <span class="slider round"></span>
    </label>
  </div>`;
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

  <div class="master-group">
    <div class="master-row">
      <div class="card master-card">
        <span class="master-label">Status</span>
        <label class="switch master-switch">
          <input type="checkbox" id="panel-enabled">
          <span class="slider round"></span>
        </label>
      </div>
      <div class="card slider-card" id="panel-blur-intensity-wrapper">
        <div class="slider-header">
          <span class="slider-title">Blur Intensity</span>
          <span class="slider-val" id="panel-blur-val">3px</span>
        </div>
        <input type="range" id="panel-blur-intensity" min="2" max="20" value="3" class="range-slider">
      </div>
    </div>
    <div class="shortcut-badge barnacle-badge">
      <div class="shortcut-left">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <line x1="6" y1="8" x2="6.01" y2="8"/><line x1="10" y1="8" x2="10.01" y2="8"/>
          <line x1="14" y1="8" x2="14.01" y2="8"/><line x1="18" y1="8" x2="18.01" y2="8"/>
          <line x1="6" y1="12" x2="6.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/>
          <rect x="7" y="15" width="10" height="2" rx="0.5"/><line x1="10" y1="12" x2="14" y2="12"/>
        </svg>
        <span class="shortcut-text">Quick Toggle</span>
      </div>
      <kbd class="keybind">Alt + /</kbd>
    </div>
  </div>

  <div class="card slider-card">
    <div class="mode-toggle-group" style="display: flex; gap: 12px; padding: 10px 12px;">
      <button type="button" class="mode-btn active" id="panel-mode-blur" style="flex:1; padding: 8px; border-radius: 6px; background: var(--md-primary-dim); color: var(--md-primary); border: 1px solid var(--md-primary); cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: all 0.2s;">Blur</button>
      <button type="button" class="mode-btn" id="panel-mode-redacted" style="flex:1; padding: 8px; border-radius: 6px; background: transparent; color: var(--md-on-s-var); border: 1px solid var(--md-outline); cursor: pointer; font-size: 0.8rem; font-weight: 500; transition: all 0.2s;">Redacted</button>
    </div>
  </div>
</span>

  <div class="card section-card">
    <div class="section-title">Blur Targets</div>
    <div class="blur-targets-grid">

      <div class="blur-column">

    ${_panelRow('panel-toggle-avatars', 'Profile Pictures', 'Avatars, status, contact photos',
  '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>')}

    ${_panelRow('panel-toggle-names', 'Names &amp; Group Titles', 'Contact names, numbers, author labels',
    '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/>')}

    ${_panelRow('panel-toggle-previews', 'Message Previews', 'Last message in chat sidebar',
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')}

    ${_panelRow('panel-toggle-text-chats', 'Message Texts & Descriptions', 'Text bubbles, captions, system notes',
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="13" y2="13"/>')}

    <div class="control-row control-row--expandable" id="row-panel-toggle-unblur-last-n">
      <div class="icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <div class="row-text">
        <span class="row-title">Unblur Recent Messages</span>
      </div>
      <div class="inline-slider-container" id="panel-unblur-last-n-panel" style="display:none">
        <input type="range" id="panel-unblur-last-n-slider" min="1" max="10" value="3" class="inline-range-slider">
        <span class="inline-slider-val" id="panel-unblur-last-n-val">3</span>
      </div>
      <label class="switch row-switch">
        <input type="checkbox" id="panel-toggle-unblur-last-n">
        <span class="slider round"></span>
      </label>
    </div>

      </div> <!-- End left blur-column -->

      <div class="blur-column">

    ${_panelRow('panel-toggle-stickers', 'Stickers', 'Sticker bubbles in chat',
          '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>')}

    ${_panelRow('panel-toggle-media-preview', 'Media Preview', 'Images, videos, docs, link previews',
            '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>')}

    ${_panelRow('panel-toggle-media-gallery', 'Media Gallery', 'Full-screen viewer &amp; gallery canvas',
              '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>')}

    <div class="control-row control-row--expandable" id="row-panel-toggle-input">
      <div class="icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"/>
        </svg>
      </div>
      <div class="row-text">
        <span class="row-title">Text Input</span>
      </div>
      <div class="inline-slider-container" id="panel-input-opacity-panel" style="display:none">
        <input type="range" id="panel-input-opacity-slider" min="5" max="95" value="30" class="inline-range-slider">
        <span class="inline-slider-val" id="panel-input-opacity-val">30%</span>
      </div>
      <label class="switch row-switch">
        <input type="checkbox" id="panel-toggle-input">
        <span class="slider round"></span>
      </label>
    </div>

    <div class="control-row control-row--expandable" id="row-panel-toggle-animation">
      <div class="icon-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <div class="row-text">
        <span class="row-title">Animation</span>
      </div>
      <div class="inline-slider-container" id="panel-animation-duration-panel" style="display:none">
        <input type="range" id="panel-animation-duration-slider" min="0.1" max="2.0" step="0.05" value="0.25" class="inline-range-slider">
        <span class="inline-slider-val" id="panel-animation-duration-val">0.25s</span>
      </div>
      <label class="switch row-switch">
        <input type="checkbox" id="panel-toggle-animation">
        <span class="slider round"></span>
      </label>
    </div>

      </div> <!-- End right blur-column -->

    </div> <!-- End blur-targets-grid -->
  </div>

</div>`;
