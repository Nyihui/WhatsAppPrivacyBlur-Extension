/* ==========================================================================
   WhatsApp Privacy Blur - Content Script
   Depends on: selectors/ (loaded first via manifest.json)
   ========================================================================== */

window.WAPanel = window.WAPanel || {};
window.WAPanel.DEFAULT_SETTINGS = {
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
  animation: true,
  animationDuration: 0.25,
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
  const hasAnimation = settings.animation !== undefined ? settings.animation : window.WAPanel.DEFAULT_SETTINGS.animation;
  const duration = settings.animationDuration !== undefined ? settings.animationDuration : window.WAPanel.DEFAULT_SETTINGS.animationDuration;
  let css = '';

  window.WA_BLUR_RULES.forEach((rule, ruleIndex) => {
    const isActive = settings[rule.key] !== undefined
      ? settings[rule.key]
      : window.WAPanel.DEFAULT_SETTINGS[rule.key];

    // --- Special: Unblur Override (Injected once manually below loop) ---


    if (!isActive) return;
    const hasTargets = rule.targets && rule.targets.length > 0;
    const hasHoverTargets = rule.hoverHasTargets && rule.hoverHasTargets.length > 0;
    if (!hasTargets && !hasHoverTargets) return;

    const scope = ROOT;
    const pureTargets = [];
    if (rule.targets) {
      rule.targets.forEach((t, index) => {
        if (typeof t === 'string' && t.includes('|')) {
          pureTargets.push(`.wa-js-target-${rule.key}-${ruleIndex}-${index}`);
        } else if (typeof t === 'string') {
          pureTargets.push(t);
        }
      });
    }

    if (rule.hoverHasTargets) {
      rule.hoverHasTargets.forEach((hht, index) => {
        pureTargets.push(`.wa-js-target-${rule.key}-hht-${ruleIndex}-${index}`);
      });
    }

    if (pureTargets.length === 0) return;

    const scopedTargets = pureTargets.map(t => `${scope} ${t}:not(.wa-unblur-override):not(.wa-unblur-override *)`);
    const hoverSelectors = scopedTargets.map(t => `${t}:hover`).join(',\n');
    const blurSelectors = scopedTargets.join(',\n');
    const overrideSelectors = pureTargets.map(t => `${scope} ${t}.wa-unblur-override, ${scope} .wa-unblur-override ${t}`).join(',\n');

    // --- Opacity mode (Text Input) ---
    if (rule.property === 'opacity') {
      const opacityTransition = !hasAnimation
        ? 'transition: none !important;'
        : `transition-property: opacity !important; transition-duration: ${duration}s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;`;

      const hoverOpacityTransition = !hasAnimation
        ? 'transition-property: opacity !important; transition-duration: 0s !important; transition-delay: 0.1s !important;'
        : `transition-property: opacity !important; transition-duration: ${duration}s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-delay: 0.1s !important;`;

      css += `
      ${blurSelectors} {
        opacity: var(--wa-input-opacity) !important;
        ${opacityTransition}
      }
      ${hoverSelectors},
      ${overrideSelectors} {
        opacity: 1 !important;
        ${hoverOpacityTransition}
      }`;
      return;
    }

    // --- Filter/blur mode (everything else) ---
    const isRedacted = settings.privacyMode === 'redacted';

    const multiplier = rule.blurMultiplier || 1;
    const blurValue = multiplier === 1
      ? 'var(--wa-blur-amount)'
      : `calc(var(--wa-blur-amount) * ${multiplier})`;

    const filterTransition = !hasAnimation
      ? 'transition: none !important;'
      : `transition-property: filter, color, background-color !important; transition-duration: ${duration}s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;`;

    const hoverFilterTransition = !hasAnimation
      ? 'transition: none !important;'
      : `transition-property: filter, color, background-color !important; transition-duration: ${duration}s !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;`;

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
    ${hoverSelectors},
    ${overrideSelectors} {
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

    // Removed JS hover unblur logic from here. It was deleted earlier.
  });
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
  if (settings.unblurLastNCount !== undefined && settings.unblurLastNCount > 10) {
    settings.unblurLastNCount = 10;
    chrome.storage.local.set({ unblurLastNCount: 10 });
  }
  currentSettings = settings;
  const root = document.documentElement;

  // 1. CSS custom properties
  const blurPx = settings.blurAmount !== undefined ? settings.blurAmount : window.WAPanel.DEFAULT_SETTINGS.blurAmount;
  const opacityPct = settings.inputOpacity !== undefined ? settings.inputOpacity : window.WAPanel.DEFAULT_SETTINGS.inputOpacity;
  root.style.setProperty('--wa-blur-amount', `${blurPx}px`);
  root.style.setProperty('--wa-input-opacity', (opacityPct / 100).toFixed(2));

  // 2. Master privacy class
  const isEnabled = settings.enabled !== undefined ? settings.enabled : window.WAPanel.DEFAULT_SETTINGS.enabled;
  root.classList.toggle('wa-privacy-enabled', isEnabled);

  // 3. Generate & inject dynamic stylesheet
  injectCSS(isEnabled ? buildCSS(settings) : '');

  // 4. Manage DOM Observer for "Unblur Last N Messages"
  manageUnblurObserver(settings);

  // console.log('[Privacy Blur] Applied settings:', settings);
}

// ---------------------------------------------------------------------------
// DOM Polling: Unblur Last N Messages & JS Pipeline Targets
// ---------------------------------------------------------------------------
let currentUnblurN = 0;
let domObserver = null;
let currentSettings = window.WAPanel.DEFAULT_SETTINGS;

function applyUnblurLastN() {
  if (currentUnblurN <= 0) {
    const overrides = document.querySelectorAll('.wa-unblur-override');
    overrides.forEach(el => {
      el.classList.remove('wa-unblur-override');
    });
    return;
  }
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

function evaluatePipeline(targetStr) {
  if (typeof targetStr !== 'string' || !targetStr.includes('|')) return [];
  const parts = targetStr.split('|').map(s => s.trim());
  const triggerSelector = parts[0];
  const commands = parts.slice(1);
  let results = [];

  try {
    const elements = document.querySelectorAll(triggerSelector);
    elements.forEach(el => {
      let current = el;
      let isValid = true;
      let finalTargets = [current];

      for (const cmd of commands) {
        if (!current || !isValid) break;

        const colonIdx = cmd.indexOf(':');
        const action = colonIdx > -1 ? cmd.substring(0, colonIdx).trim() : cmd.trim();
        const value = colonIdx > -1 ? cmd.substring(colonIdx + 1).trim() : '';

        if (action === 'closest') {
          current = current.closest(value);
          finalTargets = [current];
        } else if (action === 'up') {
          const steps = parseInt(value) || 1;
          for (let i = 0; i < steps; i++) {
            if (current) current = current.parentElement;
          }
          finalTargets = [current];
        } else if (action === 'find') {
          let queryValue = value;
          if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
          finalTargets = Array.from(current.querySelectorAll(queryValue));
        } else if (action === 'has') {
          let queryValue = value;
          if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
          if (!current.querySelector(queryValue)) isValid = false;
        } else if (action === 'not-has') {
          let queryValue = value;
          if (queryValue.startsWith('>')) queryValue = `:scope ${queryValue}`;
          if (current.querySelector(queryValue)) isValid = false;
        }
      }

      if (isValid && current && finalTargets.length > 0) {
        results.push(...finalTargets.filter(t => t != null));
      }
    });
  } catch (e) {
    // console.error('Invalid selector pipeline', e);
  }
  return results;
}

function applyJsTargets() {
  const settings = currentSettings;
  const isEnabled = settings.enabled ?? window.WAPanel.DEFAULT_SETTINGS.enabled;
  if (!isEnabled) return;

  window.WA_BLUR_RULES.forEach((rule, ruleIndex) => {
    const isActive = settings[rule.key] !== undefined ? settings[rule.key] : window.WAPanel.DEFAULT_SETTINGS[rule.key];
    if (!isActive) return;

    if (rule.targets) {
      rule.targets.forEach((targetStr, index) => {
        if (typeof targetStr !== 'string' || !targetStr.includes('|')) return;

        const className = `wa-js-target-${rule.key}-${ruleIndex}-${index}`;
        const targets = evaluatePipeline(targetStr);
        targets.forEach(t => {
          if (!t.classList.contains(className)) {
            t.classList.add(className);
          }
        });
      });
    }

    if (rule.hoverHasTargets) {
      rule.hoverHasTargets.forEach((hht, index) => {
        const blurTargets = evaluatePipeline(hht.blurTarget);
        const triggerTargets = evaluatePipeline(hht.hoverTrigger);

        const className = `wa-js-target-${rule.key}-hht-${ruleIndex}-${index}`;

        blurTargets.forEach(t => {
          if (!t.classList.contains(className)) {
            t.classList.add(className);
          }
        });

        triggerTargets.forEach(trigger => {
          if (trigger.dataset.hhtProcessed) return;
          trigger.dataset.hhtProcessed = "true";

          trigger.addEventListener('mouseenter', () => {
            const currentBlurTargets = evaluatePipeline(hht.blurTarget);
            currentBlurTargets.forEach(t => t.classList.add('wa-unblur-override'));
          });

          trigger.addEventListener('mouseleave', () => {
            const currentBlurTargets = evaluatePipeline(hht.blurTarget);
            currentBlurTargets.forEach(t => t.classList.remove('wa-unblur-override'));
          });
        });
      });
    }
  });
}

function applyDomUpdates() {
  applyUnblurLastN();
  applyJsTargets();
}

function scheduleDomUpdates() {
  if (updateTimeout) return; // Already scheduled
  updateTimeout = setTimeout(() => {
    applyDomUpdates();
    updateTimeout = null;
  }, 50);
}

let observer = null;
let updateTimeout = null;

function startObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (let m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
      if (m.type === 'attributes' && m.attributeName === 'class') {
        shouldUpdate = true;
        break;
      }
    }
    if (shouldUpdate) {
      scheduleDomUpdates();
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
}

function manageUnblurObserver(settings) {
  const isEnabled = settings.enabled ?? window.WAPanel.DEFAULT_SETTINGS.enabled;
  const unblurLastN = settings.unblurLastN ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastN;
  const unblurLastNCount = settings.unblurLastNCount ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastNCount;

  currentUnblurN = (isEnabled && unblurLastN) ? unblurLastNCount : 0;

  if (isEnabled) {
    applyDomUpdates();
    startObserver();
  } else {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (updateTimeout) {
      clearTimeout(updateTimeout);
      updateTimeout = null;
    }
    // Cleanup overrides if toggled off
    document.querySelectorAll('.wa-unblur-override').forEach(el => el.classList.remove('wa-unblur-override'));
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

// Load and apply on page start
chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, applySettings);

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
    chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, applySettings);
  }
});

// 3. Keyboard shortcut: Alt + / → toggle master shield
window.addEventListener('keydown', (event) => {
  if (event.altKey && (event.key === '/' || event.code === 'Slash')) {
    event.preventDefault();
    chrome.storage.local.get(window.WAPanel.DEFAULT_SETTINGS, (settings) => {
      const isEnabled = settings.enabled !== undefined ? settings.enabled : window.WAPanel.DEFAULT_SETTINGS.enabled;
      chrome.storage.local.set({ enabled: !isEnabled }, () => {
        // console.log(`[Privacy Blur] Shield toggled via Alt+/. New state: ${!isEnabled}`);
      });
    });
  }
});
