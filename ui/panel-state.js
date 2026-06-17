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

  // 1. Horizontal position: Position the panel beside the button (left for RTL, right for LTR)
  //    and apply a 12px directional offset (shift left for RTL, right for LTR).
  let left = isRTL
    ? anchorLeft - panelW - window.WAPanel.PANEL_GAP - 12
    : anchorRight + window.WAPanel.PANEL_GAP + 12;

  //    Clamp the calculated position within the safe screen boundaries (respecting EDGE_MARGIN)
  //    to prevent the panel from overflowing or being cut off on either side.
  left = Math.max(window.WAPanel.EDGE_MARGIN, Math.min(left, vw - panelW - window.WAPanel.EDGE_MARGIN));
  panel.style.left = `${left}px`;
  panel.style.right = '';

  // 2. Vertical position: Align the bottom edge of the panel with the bottom edge of the anchor button.
  const bottom = vh - anchorBottom;
  panel.style.bottom = `${bottom}px`;
  panel.style.top = '';

  // 3. Max height constraint: Limit the panel height from its bottom edge to the top of the screen
  //    (minus the EDGE_MARGIN) or 85% of the viewport height, whichever is smaller, to prevent overflow.
  const maxAvailHeight = anchorBottom - window.WAPanel.EDGE_MARGIN;
  panel.style.maxHeight = `${Math.min(maxAvailHeight, vh * 0.85)}px`;

  // 4. Transform origin: Set the origin to the bottom corner closest to the button
  //    (bottom-right for RTL, bottom-left for LTR) for a clean zoom animation.
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
