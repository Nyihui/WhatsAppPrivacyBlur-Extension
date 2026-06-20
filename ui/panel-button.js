window.WAPanel = window.WAPanel || {};

window.WAPanel.CLB_ID = 'wa-privacy-clb';



window.WAPanel.updateCLBIcon = function (element, isActive) {
  const iconUrl = chrome.runtime.getURL(isActive ? 'icons/defence_active.png' : 'icons/defence_inactive.png');
  let maskDiv = element.querySelector('.wa-privacy-mask-icon');
  if (!maskDiv) {
    maskDiv = document.createElement('div');
    maskDiv.className = 'wa-privacy-mask-icon';
    element.appendChild(maskDiv);
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
  const header = document.querySelector('[data-testid="chatlist-header"]');
  if (!header) return null;

  const meTab = header.querySelector('[data-testid="navbar-item-me-tab-photo"]');
  if (meTab) {
    let meWrapper = meTab.parentElement?.parentElement?.parentElement?.parentElement;
    if (meWrapper && meWrapper.previousElementSibling) {
      const mediaWrapper = meWrapper.previousElementSibling;
      const navContainer = meWrapper.parentElement;
      const mediaBtn = mediaWrapper.querySelector('button');
      if (mediaBtn) return { mediaWrapper, navContainer, mediaBtn };
    }
  }

  const bottomGroup = header.querySelector('div[style*="flex-grow: 0"]');
  if (bottomGroup && bottomGroup.firstElementChild) {
    const navContainer = bottomGroup.firstElementChild;
    const mediaWrapper = navContainer.firstElementChild;
    const mediaBtn = mediaWrapper ? mediaWrapper.querySelector('button') : null;
    if (mediaWrapper && mediaBtn) return { mediaWrapper, navContainer, mediaBtn };
  }

  return null;
};

window.WAPanel.getCLBColor = function () {
  const anchor = window.WAPanel.getMediaAnchor();
  if (anchor && anchor.mediaBtn) return getComputedStyle(anchor.mediaBtn).color;
  return document.body.classList.contains('dark') ? '#aebac1' : '#54656f';
};

window.WAPanel.positionCLBBtn = function (clbBtn, placeholder) {
  const btn = clbBtn || window.WAPanel.clbBtn;
  if (!btn) return;

  const target = placeholder || document.getElementById('wa-privacy-clb-placeholder');
  if (!target) {
    if (btn.style.display !== 'none') btn.style.display = 'none';
    return;
  }

  const rect = target.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    if (btn.style.display !== 'none') btn.style.display = 'none';
    return;
  }

  const topStr = `${rect.top}px`;
  const leftStr = `${rect.left}px`;
  const widthStr = `${rect.width}px`;
  const heightStr = `${rect.height}px`;

  if (btn.style.top !== topStr || btn.style.left !== leftStr || btn.style.display !== 'flex') {
    btn.style.display = 'flex';
    btn.style.top = topStr;
    btn.style.left = leftStr;
    btn.style.width = widthStr;
    btn.style.height = heightStr;
  }
};

window.WAPanel.injectChatlistBtn = function (panel, shadow) {
  if (document.getElementById('wa-privacy-clb-placeholder')) return;

  const anchor = window.WAPanel.getMediaAnchor();
  if (!anchor) return;
  const { mediaWrapper, navContainer } = anchor;

  // 1. Get or create the button inside the shadow DOM
  let clbBtn = shadow.getElementById(window.WAPanel.CLB_ID);
  if (!clbBtn) {
    clbBtn = document.createElement('button');
    clbBtn.id = window.WAPanel.CLB_ID;
    clbBtn.type = 'button';
    clbBtn.setAttribute('aria-label', 'WhatsApp Privacy Blur');

    let tooltip = document.getElementById('wa-privacy-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'wa-privacy-tooltip';
      tooltip.textContent = 'WhatsApp Privacy Blur';
      tooltip.style.cssText = [
        'position:fixed',
        'padding:4px 8px',
        'border-radius:4px',
        'font-size:0.75rem',
        'line-height:1rem',
        'font-weight:400',
        'white-space:nowrap',
        'pointer-events:none',
        'z-index:2147483647',
        'opacity:0',
        'display:flex',
        'align-items:center',
        'transform:translateY(-50%) scale(1)',
        'transform-origin:left center',
        'transition:transform 0 cubic-bezier(0, 0, 0.2, 1), opacity 0 cubic-bezier(0, 0, 0.2, 1)',
        'font-family:inherit'
      ].join(';');
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
        tooltip.style.transformOrigin = 'right center';
      } else {
        tooltip.style.right = 'auto';
        tooltip.style.left = `${rect.right + 5}px`;
        tooltip.style.transformOrigin = 'left center';
      }

      if (isDark) {
        tooltip.style.background = '#EEEEEE';
        tooltip.style.color = '#0A0A0A';
        tooltip.style.boxShadow = '0 0 20px rgba(0,0,0,0.2), 0 1px rgba(0,0,0,0.04)';
      } else {
        tooltip.style.background = 'var(--WDS-surface-inverse, #EEEEEE)';
        tooltip.style.color = 'var(--WDS-content-inverse, #0A0A0A)';
        tooltip.style.boxShadow = '0 0 20px rgba(0,0,0,0.2), 0 1px rgba(0,0,0,0.04)';
      }
      tooltip.style.transform = 'translateY(-50%) scale(1)';
      tooltip.style.opacity = '1';
    });

    clbBtn.addEventListener('mouseleave', () => {
      tooltip.style.transform = 'translateY(-50%) scale(0.95)';
      tooltip.style.opacity = '0';
    });

    clbBtn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });

    clbBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const placeholder = document.getElementById('wa-privacy-clb-placeholder');
      const rect = placeholder ? placeholder.getBoundingClientRect() : clbBtn.getBoundingClientRect();
      window.WAPanel.togglePanel(panel, rect, shadow);
    });

    shadow.appendChild(clbBtn);
    window.WAPanel.clbBtn = clbBtn;
  }

  // 2. Create and inject placeholder in WhatsApp sidebar
  const clbPlaceholder = document.createElement('div');
  clbPlaceholder.id = 'wa-privacy-clb-placeholder';
  clbPlaceholder.style.cssText = 'display:flex;align-items:center;justify-content:center;width:40px;height:40px;flex-shrink:0;';
  navContainer.insertBefore(clbPlaceholder, mediaWrapper);

  // 3. Immediately position button over the placeholder
  window.WAPanel.positionCLBBtn(clbBtn, clbPlaceholder);

  const isActive = window.WAPanel.isEnabled !== undefined ? window.WAPanel.isEnabled : true;
  window.WAPanel.updateCLBIcon(clbBtn, isActive);
  window.WAPanel.updateCLBGlow();
};
