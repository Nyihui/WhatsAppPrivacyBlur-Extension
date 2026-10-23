window.WAPanel = window.WAPanel || {};

window.WAPanel.CLB_ID = 'wa-privacy-clb';

window.WAPanel.updateCLBIcon = function (element, isActive) {
  if (!element) return;
  const iconUrl = chrome.runtime.getURL(isActive ? 'icons/defence_active.png' : 'icons/defence_inactive.png');
  let target = element.querySelector('span[aria-hidden="true"]') || element;
  let maskDiv = target.querySelector('.wa-privacy-mask-icon');
  if (!maskDiv) {
    maskDiv = document.createElement('div');
    maskDiv.className = 'wa-privacy-mask-icon';
    target.appendChild(maskDiv);
  }
  maskDiv.style.width = '24px';
  maskDiv.style.height = '24px';
  maskDiv.style.display = 'block';
  maskDiv.style.webkitMaskImage = `url("${iconUrl}")`;
  maskDiv.style.maskImage = `url("${iconUrl}")`;
  maskDiv.style.webkitMaskRepeat = 'no-repeat';
  maskDiv.style.maskRepeat = 'no-repeat';
  maskDiv.style.webkitMaskPosition = 'center';
  maskDiv.style.maskPosition = 'center';
  maskDiv.style.webkitMaskSize = 'contain';
  maskDiv.style.maskSize = 'contain';
  maskDiv.style.backgroundColor = 'currentColor';
};

window.WAPanel.updateCLBGlow = function () {
  const clb = window.WAPanel.clbBtn;
  if (!clb) return;
  const isDark = document.body.classList.contains('dark');
  const fallbackInactive = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';

  // Determine active state from settings.enabled (stored on window.WAPanel.isEnabled)
  // Default to true if not initialized yet
  const isActive = window.WAPanel.isEnabled !== undefined ? window.WAPanel.isEnabled : true;

  window.WAPanel.updateCLBIcon(clb, isActive);
  clb.style.color = `var(--WDS-content-deemphasized, ${fallbackInactive})`;
};

window.WAPanel.getMediaAnchor = function () {
  let navContainer = document.querySelector('div[data-testid="navbar-footer-section"]');
  if (!navContainer) return null;

  // Dive down level by level through single-child wrappers until we reach the container with multiple items
  while (navContainer && navContainer.children.length === 1 && !navContainer.querySelector(':scope > button')) {
    navContainer = navContainer.firstElementChild;
  }
  if (!navContainer) return null;

  // The first native item wrapper holding a button (skipping our injected button wrapper if already present)
  const mediaWrapper = Array.from(navContainer.children).find((c) => {
    return c.id !== 'wa-privacy-btn-wrapper' && c.querySelector('button');
  });
  if (!mediaWrapper) return null;

  const mediaBtn = mediaWrapper.querySelector('button');
  if (!mediaBtn) return null;

  return { mediaWrapper, navContainer, mediaBtn };
};

window.WAPanel.getCLBColor = function () {
  const anchor = window.WAPanel.getMediaAnchor();
  if (anchor && anchor.mediaBtn) return getComputedStyle(anchor.mediaBtn).color;
  return document.body.classList.contains('dark') ? '#aebac1' : '#54656f';
};

window.WAPanel.positionCLBBtn = function () {};

window.WAPanel.injectChatlistBtn = function (panel, shadow) {
  if (document.getElementById('wa-privacy-btn-wrapper')) return;

  const anchor = window.WAPanel.getMediaAnchor();
  if (!anchor) return;
  const { mediaWrapper, navContainer } = anchor;

  // 1. Clone the Media button wrapper to inherit WhatsApp's exact layout & styles without hardcoded classes
  const customWrapper = mediaWrapper.cloneNode(true);
  customWrapper.id = 'wa-privacy-btn-wrapper';

  const clbBtn = customWrapper.querySelector('button');
  if (!clbBtn) return;

  clbBtn.id = window.WAPanel.CLB_ID;
  clbBtn.type = 'button';
  clbBtn.setAttribute('aria-label', 'WhatsApp Privacy Blur');
  clbBtn.removeAttribute('data-navbar-item-index');
  clbBtn.setAttribute('data-navbar-item-selected', 'false');

  // 2. Clear cloned SVG icon and prepare icon container
  const iconSpan = clbBtn.querySelector('span[aria-hidden="true"]') || clbBtn.querySelector('svg')?.parentElement;
  if (iconSpan) {
    iconSpan.innerHTML = '';
  }

  // 3. Tooltip setup
  let tooltip = document.getElementById('wa-privacy-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'wa-privacy-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.style.cssText = [
      'position:fixed',
      'display:flex',
      'align-items:center',
      'min-height:24px',
      'max-width:200px',
      'padding:3px 8px',
      'border-radius:4px',
      'font-size:12px',
      'line-height:14px',
      'font-weight:400',
      'letter-spacing:-0.0137em',
      'white-space:nowrap',
      'pointer-events:none',
      'z-index:2147483647',
      'opacity:0',
      'transform:translateY(-50%)',
      'transition:opacity 0.1s cubic-bezier(0, 0, 1, 1)',
      'font-family:Roboto Variable, Roboto, Helvetica Neue, Helvetica, sans-serif'
    ].join(';');

    const textSpan = document.createElement('span');
    textSpan.textContent = 'WhatsApp Privacy Blur';
    tooltip.appendChild(textSpan);
    document.body.appendChild(tooltip);
  }

  clbBtn.addEventListener('mouseenter', () => {
    const isDark = document.body.classList.contains('dark');
    const isRTL = window.WAPanel.checkRTL();

    const rect = clbBtn.getBoundingClientRect();
    tooltip.style.top = `${rect.top + rect.height / 2}px`;
    if (isRTL) {
      tooltip.style.left = 'auto';
      tooltip.style.right = `${window.innerWidth - rect.left + 5}px`;
    } else {
      tooltip.style.right = 'auto';
      tooltip.style.left = `${rect.right + 5}px`;
    }

    if (isDark) {
      tooltip.style.background = 'var(--WDS-surface-inverse, #EEEEEE)';
      tooltip.style.color = 'var(--WDS-content-inverse, #0A0A0A)';
    } else {
      tooltip.style.background = 'var(--WDS-surface-inverse, #242626)';
      tooltip.style.color = 'var(--WDS-content-inverse, #FAFAFA)';
    }
    tooltip.style.boxShadow = '0 0 20px #0003, 0 1px #0000000a';
    tooltip.style.opacity = '1';
  });

  clbBtn.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });

  clbBtn.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  clbBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = clbBtn.getBoundingClientRect();
    window.WAPanel.togglePanel(panel, rect, shadow);
  });

  // 4. Inject cloned button wrapper into WhatsApp navbar right before Media
  navContainer.insertBefore(customWrapper, mediaWrapper);
  window.WAPanel.clbBtn = clbBtn;

  // 5. Update icon state
  const isActive = window.WAPanel.isEnabled !== undefined ? window.WAPanel.isEnabled : true;
  window.WAPanel.updateCLBIcon(clbBtn, isActive);
  window.WAPanel.updateCLBGlow();
};
