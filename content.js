/* ==========================================================================
   WhatsApp Privacy Blur - Content Script
   Depends on: selectors/ (loaded first via manifest.json)
   ========================================================================== */

const DEFAULT_SETTINGS = {
  enabled: true,
  blurAmount: 3,
  blurAvatars: true,
  blurNames: true,
  blurPreviews: true,
  blurTextChats: true,
  blurStickers: true,
  blurMediaPreview: true,
  blurMediaGallery: true,
  blurInput: true,
  noTransition: false,
  inputOpacity: 30,
  unblurLastN: false,
  unblurLastNCount: 3,
  privacyMode: 'blur',
};

/* --------------------------------------------------------------------------
   CSS Generator
   Iterates WA_BLUR_RULES from selectors.js and builds a complete stylesheet.
   Hover-reveal selectors are auto-generated — no manual duplication needed.
-------------------------------------------------------------------------- */
function buildCSS(settings) {
  const ROOT = '.wa-privacy-enabled';
  const transition = settings.noTransition
    ? 'none'
    : 'filter 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
  let css = '';

  for (const rule of window.WA_BLUR_RULES) {
    const isActive = settings[rule.key] !== undefined
      ? settings[rule.key]
      : DEFAULT_SETTINGS[rule.key];

    // --- Special: Unblur Override (Injected once manually below loop) ---


    if (!isActive || !rule.targets || rule.targets.length === 0) continue;

    const scope = ROOT;
    const scopedTargets = rule.targets.map(t => `${scope} ${t}:not(.wa-unblur-override):not(.wa-unblur-override *)`);
    const hoverSelectors = scopedTargets.map(t => `${t}:hover`).join(',\n');
    const blurSelectors = scopedTargets.join(',\n');

    // --- Opacity mode (Text Input) ---
    if (rule.property === 'opacity') {
      const opacityTransition = settings.noTransition
        ? 'transition: none !important;'
        : 'transition-property: opacity !important; transition-duration: 0.25s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;';

      const hoverOpacityTransition = settings.noTransition
        ? 'transition-property: opacity !important; transition-duration: 0s !important; transition-delay: 0.1s !important;'
        : 'transition-property: opacity !important; transition-duration: 0.25s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-delay: 0.1s !important;';
        
      css += `
      ${blurSelectors} {
        opacity: var(--wa-input-opacity) !important;
        ${opacityTransition}
      }
      ${hoverSelectors} {
        opacity: 1 !important;
        ${hoverOpacityTransition}
      }`;
      continue;
    }

    // --- Filter/blur mode (everything else) ---
    const isRedacted = settings.privacyMode === 'redacted';
    const isLite = settings.privacyMode === 'lite';
    const isStatic = isRedacted || isLite; // Lite and Redacted both kill JS & transitions

    const multiplier = rule.blurMultiplier || 1;
    const blurValue = multiplier === 1
      ? 'var(--wa-blur-amount)'
      : `calc(var(--wa-blur-amount) * ${multiplier})`;

    const filterTransition = (settings.noTransition || isStatic)
      ? 'transition: none !important;'
      : 'transition-property: filter, color, background-color !important; transition-duration: 0.25s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;';

    const hoverFilterTransition = (settings.noTransition || isStatic)
      ? 'transition: none !important;'
      : 'transition-property: filter, color, background-color !important; transition-duration: 0.25s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;';

    const redactedCSS = `
      filter: brightness(0) !important;
      color: #000 !important;
      background-color: #000 !important;
    `;
    const redactedHoverCSS = `
      filter: none !important;
      color: unset !important;
      background-color: unset !important;
    `;
    const blurCSS = `filter: blur(${blurValue}) !important;`;
    const blurHoverCSS = `filter: none !important;`;

    css += `
    ${blurSelectors} {
      ${isRedacted ? redactedCSS : blurCSS}
      ${filterTransition}
    }
    ${hoverSelectors} {
      ${isRedacted ? redactedHoverCSS : blurHoverCSS}
      ${hoverFilterTransition}
    }`;

    // --- hoverParentTargets: blur a child, unblur when PARENT is hovered ---
    if (rule.hoverParentTargets && rule.hoverParentTargets.length > 0) {
      for (const { hoverParent, child } of rule.hoverParentTargets) {
        const childBlur = `${scope} ${hoverParent}:not(.wa-unblur-override):not(.wa-unblur-override *) ${child}`;
        const childHover = `${scope} ${hoverParent}:hover:not(.wa-unblur-override):not(.wa-unblur-override *) ${child}`;
        css += `
        ${childBlur} {
          ${isRedacted ? redactedCSS : blurCSS}
          ${filterTransition}
        }
        ${childHover} {
          ${isRedacted ? redactedHoverCSS : blurHoverCSS}
          ${hoverFilterTransition}
        }`;
      }
    }

    // --- hoverHasTargets: JS-Based hover unblur logic ---
    if (rule.hoverHasTargets && rule.hoverHasTargets.length > 0) {
      for (const { ancestor, hoverTrigger, child } of rule.hoverHasTargets) {
        const childPart = child ? ` ${child}` : '';
        const baseSelector = `${scope} ${ancestor}:not(.wa-unblur-override):not(.wa-unblur-override *)${childPart}`;
        const hoverSelector = isStatic 
            ? `${scope} ${ancestor}:hover:not(.wa-unblur-override):not(.wa-unblur-override *)${childPart}`
            : `${baseSelector}.wa-js-hover-unblur`;

        css += `
        ${baseSelector}:not(.wa-js-hover-unblur) {
          ${isRedacted ? redactedCSS : blurCSS}
          ${filterTransition}
        }
        ${hoverSelector} {
          ${isRedacted ? redactedHoverCSS : blurHoverCSS}
          ${hoverFilterTransition}
        }`;
      }
    }
  }
  return css;
}

/* --------------------------------------------------------------------------
   Style Injector
   Writes the generated CSS into a single <style> tag in <head>.
   Replaces contents on every settings update — no stale rules accumulate.
-------------------------------------------------------------------------- */
function injectCSS(css) {
  let el = document.getElementById('wa-privacy-blur-styles');
  if (!el) {
    el = document.createElement('style');
    el.id = 'wa-privacy-blur-styles';
    (document.head || document.documentElement).appendChild(el);
  }
  el.textContent = css;
}

/* --------------------------------------------------------------------------
   Apply Settings
   Applies CSS variables, toggles the master class, and rebuilds the stylesheet.
-------------------------------------------------------------------------- */
function applySettings(settings) {
  const root = document.documentElement;

  // 1. CSS custom properties
  const blurPx = settings.blurAmount !== undefined ? settings.blurAmount : DEFAULT_SETTINGS.blurAmount;
  const opacityPct = settings.inputOpacity !== undefined ? settings.inputOpacity : DEFAULT_SETTINGS.inputOpacity;
  root.style.setProperty('--wa-blur-amount', `${blurPx}px`);
  root.style.setProperty('--wa-input-opacity', (opacityPct / 100).toFixed(2));

  // 2. Master privacy class
  const isEnabled = settings.enabled !== undefined ? settings.enabled : DEFAULT_SETTINGS.enabled;
  root.classList.toggle('wa-privacy-enabled', isEnabled);

  // 3. Generate & inject dynamic stylesheet
  injectCSS(isEnabled ? buildCSS(settings) : '');

  // 4. Manage DOM Observer for "Unblur Last N Messages"
  manageUnblurObserver(settings);

  // 5. Update JS hover delegation rules
  updateHoverHasRules(settings);

  // console.log('[Privacy Blur] Applied settings:', settings);
}

// ---------------------------------------------------------------------------
// DOM Polling: Unblur Last N Messages
// ---------------------------------------------------------------------------
let currentUnblurN = 0;
let unblurInterval = null;

function applyUnblurLastN() {
  if (currentUnblurN <= 0) return;
  const messages = document.querySelectorAll(`
    [data-testid="msg-container"],
    [data-id*="grouped-sticker"]
  `);

  // Clean up existing overrides to avoid unnecessary DOM writes
  messages.forEach(el => {
    if (el.classList.contains('wa-unblur-override')) {
      el.classList.remove('wa-unblur-override');
    }
  });

  if (messages.length === 0) return;

  const start = Math.max(0, messages.length - currentUnblurN);
  for (let i = start; i < messages.length; i++) {
    messages[i].classList.add('wa-unblur-override');
  }
}

function manageUnblurObserver(settings) {
  const isEnabled = settings.enabled ?? DEFAULT_SETTINGS.enabled;
  const unblurLastN = settings.unblurLastN ?? DEFAULT_SETTINGS.unblurLastN;
  const unblurLastNCount = settings.unblurLastNCount ?? DEFAULT_SETTINGS.unblurLastNCount;
  const privacyMode = settings.privacyMode || 'blur';

  // We re-enable the ultra-lightweight JS poller for all modes.
  currentUnblurN = (isEnabled && unblurLastN) ? unblurLastNCount : 0;

  if (currentUnblurN > 0) {
    applyUnblurLastN(); // Apply immediately
    if (!unblurInterval) {
      // Refresh every 500ms: lightweight targeted polling instead of a heavy MutationObserver
      unblurInterval = setInterval(applyUnblurLastN, 500);
    }
  } else {
    if (unblurInterval) {
      clearInterval(unblurInterval);
      unblurInterval = null;
    }
    // Cleanup overrides if toggled off
    document.querySelectorAll('.wa-unblur-override').forEach(el => el.classList.remove('wa-unblur-override'));
  }
}

// ---------------------------------------------------------------------------
// JS-Based Hover Delegation for Complex Targets
// Replaces slow CSS :has(:hover) selectors
// ---------------------------------------------------------------------------
let activeHoverHasRules = [];
let currentJsUnblurTargets = new Set();

function updateHoverHasRules(settings) {
  activeHoverHasRules = [];
  const isEnabled = settings.enabled !== undefined ? settings.enabled : DEFAULT_SETTINGS.enabled;
  const privacyMode = settings.privacyMode || 'blur';
  if (!isEnabled || privacyMode !== 'blur') {
    for (const el of currentJsUnblurTargets) el.classList.remove('wa-js-hover-unblur');
    currentJsUnblurTargets.clear();
    return;
  }

  for (const rule of window.WA_BLUR_RULES) {
    const isActive = settings[rule.key] !== undefined ? settings[rule.key] : DEFAULT_SETTINGS[rule.key];
    if (isActive && rule.hoverHasTargets) {
      activeHoverHasRules.push(...rule.hoverHasTargets);
    }
  }
}

document.addEventListener('mouseover', (e) => {
  if (activeHoverHasRules.length === 0) return;

  const newTargets = new Set();

  for (const { ancestor, hoverTrigger, child } of activeHoverHasRules) {
    const triggers = hoverTrigger.split(',').map(t => {
      const trimmed = t.trim();
      return `${ancestor}${trimmed.startsWith('>') ? '' : ' '}${trimmed}`;
    }).join(', ');

    try {
      const triggerEl = e.target.closest(triggers);
      if (triggerEl) {
        const ancestorEl = triggerEl.closest(ancestor);
        if (ancestorEl) {
          if (child) {
            const childSelector = `:scope${child.trim().startsWith('>') ? '' : ' '}${child}`;
            const childEls = ancestorEl.querySelectorAll(childSelector);
            childEls.forEach(el => newTargets.add(el));
          } else {
            newTargets.add(ancestorEl);
          }
        }
      }
    } catch (err) {
      // Ignore dynamically invalid selectors
    }
  }

  for (const el of currentJsUnblurTargets) {
    if (!newTargets.has(el)) el.classList.remove('wa-js-hover-unblur');
  }
  for (const el of newTargets) {
    el.classList.add('wa-js-hover-unblur');
  }

  currentJsUnblurTargets = newTargets;
});

document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget) {
    for (const el of currentJsUnblurTargets) el.classList.remove('wa-js-hover-unblur');
    currentJsUnblurTargets.clear();
  }
});

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

// Load and apply on page start
chrome.storage.local.get(window.WA_DEFAULT_SETTINGS, applySettings);

// 1. Message from popup (immediate, low-latency path)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'updateSettings' && message.settings) {
    applySettings(message.settings);
    sendResponse?.({ success: true });
  }
});

// 2. Storage change (sync path — covers keyboard shortcut + cross-tab changes)
chrome.storage.onChanged.addListener((_changes, areaName) => {
  if (areaName === 'local') {
    chrome.storage.local.get(DEFAULT_SETTINGS, applySettings);
  }
});

// 3. Keyboard shortcut: Alt + / → toggle master shield
window.addEventListener('keydown', (event) => {
  if (event.altKey && (event.key === '/' || event.code === 'Slash')) {
    event.preventDefault();
    chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
      const isEnabled = settings.enabled !== undefined ? settings.enabled : DEFAULT_SETTINGS.enabled;
      chrome.storage.local.set({ enabled: !isEnabled }, () => {
        // console.log(`[Privacy Blur] Shield toggled via Alt+/. New state: ${!isEnabled}`);
      });
    });
  }
});
