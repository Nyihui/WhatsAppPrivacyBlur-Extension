window.WAPanel = window.WAPanel || {};

window.WAPanel.PANEL_GAP = 8;
window.WAPanel.EDGE_MARGIN = 12;

window.WAPanel.positionPanel = function (panel, anchorRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const anchorBottom = anchorRect.bottom;
  const anchorLeft = anchorRect.left;
  const anchorRight = anchorRect.right;

  const isRTL = window.WAPanel.checkRTL();

  const panelW = panel.offsetWidth || 540;

  // 1. Horizontal position: beside the icon
  let left = isRTL
    ? anchorLeft - panelW - window.WAPanel.PANEL_GAP
    : anchorRight + window.WAPanel.PANEL_GAP;

  left = Math.max(window.WAPanel.EDGE_MARGIN, Math.min(left, vw - panelW - window.WAPanel.EDGE_MARGIN));
  panel.style.left = `calc(${left}px + 12px)`;
  panel.style.right = '';

  // 2. Vertical position: align bottom of panel with bottom of button
  const bottom = vh - anchorBottom;
  panel.style.bottom = `${bottom}px`;
  panel.style.top = '';

  // 3. Max height: from bottom of panel to top of screen
  const maxAvailHeight = anchorBottom - window.WAPanel.EDGE_MARGIN;
  panel.style.maxHeight = `${Math.min(maxAvailHeight, vh * 0.85)}px`;

  // 4. Transform origin: bottom corner closest to the button
  panel.style.transformOrigin = isRTL ? 'bottom right' : 'bottom left';
};

window.WAPanel.isOpen = false;
window.WAPanel.currentAnchorRect = null;

window.WAPanel.openPanel = function (panel, anchorRect, shadow) {
  window.WAPanel.currentAnchorRect = anchorRect || window.WAPanel.currentAnchorRect;
  if (!window.WAPanel.currentAnchorRect) return;
  window.WAPanel.isOpen = true;
  window.WAPanel.positionPanel(panel, window.WAPanel.currentAnchorRect);
  panel.classList.add('open');
  if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
  chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, (s) => window.WAPanel.applySettingsToPanel(shadow, s));
};

window.WAPanel.closePanel = function (panel) {
  window.WAPanel.isOpen = false;
  panel.classList.remove('open');
  if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
};

window.WAPanel.togglePanel = function (panel, anchorRect, shadow) {
  window.WAPanel.isOpen ? window.WAPanel.closePanel(panel) : window.WAPanel.openPanel(panel, anchorRect, shadow);
};
