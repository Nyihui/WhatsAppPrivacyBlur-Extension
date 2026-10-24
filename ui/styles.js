/* ==========================================================================
   WhatsApp Privacy Blur - Panel Styles  (Material Design / WhatsApp theme)
   Exposes: window.WA_PANEL_STYLES
   ========================================================================== */

window.WA_PANEL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ---------------------------------------------------------------- TOKENS */
  :host {
    /* Dark (WhatsApp dark) — default */
    --md-bg:           #111b21;
    --md-surface:      #202c33;
    --md-surface-var:  #2a3942;
    --md-on-surface:   #e9edef;
    --md-on-s-var:     #8696a0;
    --md-outline:      rgba(255,255,255,0.09);
    --md-outline-var:  rgba(255,255,255,0.04);
    --md-primary:      #21C063;
    --md-primary-dim:  #103529;
    --md-error:        #f28b82;
    --md-error-dim:    rgba(242,139,130,0.12);
    --md-elev:         0 4px 16px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.25);
    --md-radius:       8px;
    --icon-active:     #FAFAFA;
    --icon-inactive:   rgba(255, 255, 255, 0.6);
    --switch-active:   #0A0A0A;
    --tile-icon-active: var(--WDS-content-on-accent, var(--switch-active, #0A0A0A));

    --radius-panel:    16px;
    --radius-card:     12px;
    --radius-btn:      6px;
    --card-gap:        10px;
    --tile-size:       40px;
    --tile-icon-size:  19px;

    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483647;
    font-family: 'Roboto', system-ui, sans-serif;
  }

  /* Light (WhatsApp light) */
  :host([data-theme="light"]) {
    --md-bg:           #f0f2f5;
    --md-surface:      #ffffff;
    --md-surface-var:  #f5f6f6;
    --md-on-surface:   #111b21;
    --md-on-s-var:     rgba(0, 0, 0, 0.6);
    --md-outline:      rgba(0,0,0,0.10);
    --md-outline-var:  rgba(0,0,0,0.05);
    --md-primary:      #1DAA61;
    --md-primary-dim:  #D9FDD3;
    --md-error:        #b3261e;
    --md-error-dim:    rgba(179,38,30,0.08);
    --md-elev:         0 4px 16px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08);
    --icon-active:     #0A0A0A;
    --icon-inactive:   rgba(0, 0, 0, 0.6);
    --switch-active:   #ffffff;
    --tile-icon-active: var(--WDS-content-on-accent, var(--switch-active, #ffffff));
  }

  /* ----------------------------------------------------------------- PANEL */
  #wa-panel {
    pointer-events: none;
    visibility: hidden;
    position: fixed;
    width: 440px;
    max-width: calc(100vw - 32px);
    max-height: 85vh;
    background: var(--md-bg);
    border: 1px solid var(--md-outline);
    border-radius: var(--radius-panel);
    box-shadow: var(--md-elev);
    padding: 14px 16px 16px;
    overflow-y: auto;
    overflow-x: hidden;
    opacity: 0;
    transform: none;
    transition:
      opacity .2s cubic-bezier(.2,0,0,1),
      visibility 0s linear .2s;
    scrollbar-width: thin;
    scrollbar-color: var(--md-outline) transparent;
  }
  #wa-panel::-webkit-scrollbar       { width: 3px; }
  #wa-panel::-webkit-scrollbar-track { background: transparent; }
  #wa-panel::-webkit-scrollbar-thumb { background: var(--md-outline); border-radius: 3px; }

  #wa-panel.open {
    pointer-events: auto;
    visibility: visible;
    opacity: 1;
    transform: none;
    transition:
      opacity .2s cubic-bezier(.2,0,0,1),
      visibility 0s linear 0s;
  }

  /* -------------------------------------------------------------- DASHBOARD */
  .dashboard {
    padding: 0;
    display: flex;
    flex-direction: column;
    color: var(--md-on-surface);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: var(--card-gap);
    padding-bottom: 12px;
    border-bottom: 1px solid var(--md-outline);
  }
  .logo-area {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo-area svg { display: block; flex-shrink: 0; }
  .logo-text    { font-size: 14px; font-weight: 500; color: var(--md-on-surface); letter-spacing: .1px; line-height: 1; }
  .header-right { display: flex; align-items: center; gap: 6px; }
  .reset-btn {
    background: transparent; border: none; padding: 4px; border-radius: 4px;
    color: var(--md-on-s-var); cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s; margin-right: 2px;
  }
  .reset-btn:hover { background: rgba(0, 168, 132, 0.1); color: var(--md-primary); }
  .reset-btn:active { background: rgba(0, 168, 132, 0.2); }
  .logo-version { font-size: 12px; color: var(--md-on-s-var); line-height: 1; flex-shrink: 0; }

  /* -----------------------------------------------------------------  CARDS */
  .card {
    background: var(--md-surface);
    border: 1px solid var(--md-outline);
    border-radius: var(--radius-card);
    overflow: hidden;
  }

  /* Master & Minimizer Row */
  .master-row {
    display: flex;
    gap: 10px;
    margin-bottom: var(--card-gap);
  }

  .master-card {
    flex: 1 1 50%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--md-primary-dim);
    border: 1px solid rgba(33, 192, 99, 0.25);
    border-radius: var(--radius-card);
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .dashboard.shield-off #card-master-status,
  #card-master-minimizer.minimizer-off {
    background: var(--md-error-dim);
    border-color: rgba(234, 67, 53, 0.25);
  }

  .master-card-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    height: 38px;
    box-sizing: border-box;
  }

  .master-label-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .master-label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--md-on-surface);
  }

  .master-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px 5px;
    border-top: 1px solid rgba(33, 192, 99, 0.18);
    font-size: 10.5px;
    color: var(--md-on-s-var);
    background: rgba(0, 0, 0, 0.04);
  }

  .dashboard.shield-off #card-master-status .master-card-footer,
  #card-master-minimizer.minimizer-off .master-card-footer {
    border-top-color: rgba(242, 139, 130, 0.2);
  }

  .master-shortcut-desc {
    font-size: 10.5px;
    color: var(--md-on-s-var);
  }

  .qs-kbd {
    background: var(--md-surface-var);
    border: 1px solid var(--md-outline);
    padding: 2px 7px;
    border-radius: var(--radius-btn);
    font-family: inherit;
    font-size: 10.5px;
    font-weight: 600;
    color: var(--md-on-surface);
    line-height: 1.2;
  }

  /* Compact Mode Pill (Embedded in adjustments drawer header) */
  .mode-pill-toggle {
    display: inline-flex;
    align-items: center;
    background: var(--md-surface-var);
    border: 1px solid var(--md-outline);
    border-radius: 20px;
    padding: 2px;
    gap: 2px;
    box-sizing: border-box;
  }

  .mode-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    width: 50px;
    height: 18px;
    border-radius: 10px;
    font-size: 10.5px;
    font-weight: 500;
    color: var(--md-on-s-var);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    line-height: 1;
    box-sizing: border-box;
    text-align: center;
    white-space: nowrap;
  }

  .mode-pill.active {
    background: var(--md-primary);
    color: var(--tile-icon-active);
  }

  .mode-pill:hover:not(.active) {
    color: var(--md-on-surface);
  }

  /* Drawer Area & Adjustments Section */
  .qs-drawer-area {
    background: var(--md-surface);
    border: 1px solid var(--md-outline);
    border-radius: var(--radius-card);
    padding: 10px 12px;
    margin-bottom: var(--card-gap);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .qs-drawer-area:last-child {
    margin-bottom: 0;
  }

  .qs-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .qs-drawer-header-title {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--md-on-s-var);
  }

  .drawer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transition: opacity 0.2s ease;
  }

  .drawer-row.disabled {
    opacity: 0.38;
  }

  .drawer-row.disabled .drawer-label {
    color: var(--md-on-s-var);
  }

  .drawer-row.disabled .slider-val {
    color: var(--md-on-s-var);
    background: var(--md-surface-var);
  }

  .drawer-row.disabled .range-slider {
    cursor: not-allowed;
  }

  .drawer-row.disabled .range-slider::-webkit-slider-thumb {
    cursor: not-allowed;
    background: var(--md-on-s-var);
    transform: none;
  }

  .drawer-row.disabled .range-slider::-moz-range-thumb {
    cursor: not-allowed;
    background: var(--md-on-s-var);
    transform: none;
  }

  .drawer-label {
    font-size: 11.5px;
    font-weight: 500;
    color: var(--md-on-surface);
    width: 105px;
    flex: 0 0 105px;
    white-space: nowrap;
  }

  .drawer-slider-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .drawer-slider-wrap .range-slider {
    flex: 1;
    min-width: 0;
    margin: 0;
  }

  .slider-val {
    font-size: 11px;
    font-weight: 500;
    color: var(--md-primary);
    background: var(--md-primary-dim);
    padding: 0 4px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-btn);
    width: 50px;
    flex: 0 0 50px;
    box-sizing: border-box;
    text-align: center;
  }

  /* -------------------------------------------------------- MATERIAL SWITCH */
  .switch { position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0; }
  .switch input { opacity: 0; width: 0; height: 0; }

  .slider {
    position: absolute; cursor: pointer; inset: 0;
    background: var(--md-surface-var);
    border: 2px solid var(--md-on-s-var);
    transition: .2s cubic-bezier(.2,0,0,1);
  }
  .slider::before {
    position: absolute; content: "";
    width: 10px; height: 10px; left: 3px; bottom: 3px;
    background: var(--md-on-s-var);
    transition: .2s cubic-bezier(.2,0,0,1);
  }
  input:checked + .slider { background: var(--md-primary); border-color: var(--md-primary); }
  input:checked + .slider::before {
    transform: translateX(16px);
    background: var(--WDS-content-on-accent, var(--switch-active));
    width: 14px; height: 14px; left: 1px; bottom: 1px;
  }
  .slider.round                { border-radius: 34px; }
  .slider.round::before        { border-radius: 50%; }
  .master-switch input:not(:checked) + .slider { background: var(--md-surface-var); border-color: var(--md-error); }
  .master-switch input:not(:checked) + .slider::before { background: var(--md-error); }

  /* Hover animations: expand inner circle (knob) width by 2px */
  .switch:hover .slider::before {
    width: 12px;
  }
  .switch:hover input:checked + .slider::before {
    width: 16px;
    transform: translateX(14px);
  }

  /* ---------------------------------------------------------- RANGE SLIDER */
  .range-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--md-outline);
    outline: none;
    margin: 0;
    display: block;
    cursor: pointer;
  }
  .range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--md-primary);
    border: none;
    cursor: pointer;
    transition: transform 0.1s ease, background-color 0.15s ease;
  }
  .range-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
  .range-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--md-primary);
    border: none;
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  .range-slider::-moz-range-thumb:hover { transform: scale(1.15); }

  /* ------------------------------ QUICK SETTINGS CIRCLE TILES (5x2 GRID) */
  .qs-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 20px;
    column-gap: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: var(--card-gap);
  }

  .qs-tile-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .qs-circle-btn {
    width: var(--tile-size, 40px);
    height: var(--tile-size, 40px);
    border-radius: 50%;
    border: 1px solid var(--md-outline);
    background: var(--md-surface-var);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--md-on-s-var);
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  }

  .qs-tile-wrapper:hover .qs-circle-btn {
    background: var(--md-surface-var);
    color: var(--md-on-surface);
  }

  .qs-circle-btn:active {
    opacity: 0.85;
  }

  .qs-tile-wrapper:has(input:checked) .qs-circle-btn,
  .qs-tile-wrapper.active .qs-circle-btn {
    background: var(--md-primary);
    border-color: var(--md-primary);
    color: var(--tile-icon-active);
  }

  .qs-tile-wrapper:has(input:checked) .qs-circle-btn svg,
  .qs-tile-wrapper.active .qs-circle-btn svg {
    stroke: var(--tile-icon-active);
  }

  .qs-circle-btn svg {
    width: var(--tile-icon-size, 19px);
    height: var(--tile-icon-size, 19px);
    pointer-events: none;
    stroke: currentColor;
  }

  .qs-tile-label {
    font-size: 11px;
    font-weight: 400;
    color: var(--md-on-surface);
    line-height: 1.15;
    text-align: center;
    max-width: 72px;
    word-break: break-word;
    cursor: pointer;
    user-select: none;
  }

  /* ---------------------------------------------------- SHIELD-OFF DIM STATE */
  .dashboard.shield-off .qs-grid,
  .dashboard.shield-off .qs-drawer-area,
  .dashboard.shield-off .mode-toggle-card {
    opacity: 0.38;
    pointer-events: none;
    filter: grayscale(40%);
  }

`;


