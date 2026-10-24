/* ==========================================================================
   WhatsApp Privacy Blur - Sidebar Minimizer Core Script
   ========================================================================== */

(() => {
  window.WAMinimizer = window.WAMinimizer || {};
  window.WAMinimizer.isMinimized = false;
  window.WAMinimizer.isEnabled = true;

  window.WAMinimizer.setEnabled = function (enabled) {
    window.WAMinimizer.isEnabled = enabled;

    if (!enabled) {
      if (window.WAMinimizer.isMinimized) {
        window.WAMinimizer.applyState(false);
      }
      chrome.storage.local.set({ waMinimized: false });
      if (window.WAPanel?.removeMinimizerBtn) {
        window.WAPanel.removeMinimizerBtn();
      }
    } else {
      if (window.WAPanel?.injectMinimizerBtn) {
        window.WAPanel.injectMinimizerBtn();
      }
    }
  };

  const MINIMIZE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M8 1H7a6 6 0 0 0-6 6v10a6 6 0 0 0 6 6h1Z" fill="currentColor"/><path d="M8 2h9a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H8" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M15.5 8.5L12 12l3.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const EXPAND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M8 1H7a6 6 0 0 0-6 6v10a6 6 0 0 0 6 6h1Z" fill="currentColor"/><path d="M8 2h9a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H8" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M13 8.5L16.5 12l-3.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const svgParser = new DOMParser();
  const MINIMIZE_ICON = svgParser.parseFromString(MINIMIZE_SVG, 'image/svg+xml').documentElement;
  const EXPAND_ICON = svgParser.parseFromString(EXPAND_SVG, 'image/svg+xml').documentElement;

  window.WAMinimizer.updateButtonIcon = function (btn, isMinimized) {
    if (!btn) return;
    const target = btn.querySelector('span[aria-hidden="true"]') || btn;
    target.replaceChildren((isMinimized ? EXPAND_ICON : MINIMIZE_ICON).cloneNode(true));
    btn.setAttribute('aria-label', isMinimized ? 'Expand Sidebar' : 'Minimize Sidebar');
  };

  window.WAMinimizer.applyState = function (minimized) {
    window.WAMinimizer.isMinimized = minimized;
    document.documentElement.classList.toggle('wa-chat-minimized', minimized);

    const minBtn = window.WAPanel?.minBtn || document.getElementById('wa-sidebar-toggle-btn');
    if (minBtn) {
      window.WAMinimizer.updateButtonIcon(minBtn, minimized);
    }
  };

  window.WAMinimizer.toggle = function () {
    if (!window.WAMinimizer.isEnabled) return;
    const newState = !window.WAMinimizer.isMinimized;

    chrome.storage.local.set({ waMinimized: newState }, () => {
      window.WAMinimizer.applyState(newState);
    });
  };

  // --- Target Selector Engine (Completely Self-Contained) ---
  const MINIMIZER_TARGETS = [
    'div | has:> header[data-testid="chatlist-header"]:not([tabindex="0"])',
    'div[data-testid="drawer-left"]'
  ];

  function evaluateMinimizerPipeline(pipelineStr) {
    const commands = pipelineStr.split('|').map(s => s.trim());
    const baseSelector = commands.shift();
    let results = [];

    try {
      const initialNodes = document.querySelectorAll(baseSelector);
      initialNodes.forEach(node => {
        let current = node;
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
    } catch (e) { }
    return results;
  }

  function applyMinimizerTargets() {
    MINIMIZER_TARGETS.forEach(targetStr => {
      const elements = evaluateMinimizerPipeline(targetStr);
      elements.forEach(el => {
        if (!el.classList.contains('wa-js-target-minimizer')) {
          el.classList.add('wa-js-target-minimizer');
        }
      });
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  const applyMinimizerTargetsDebounced = debounce(applyMinimizerTargets, 50);

  // --- Initialization ---
  function initMinimizer() {
    chrome.storage.local.get({ waMinimized: false, minimizerEnabled: true }, (data) => {
      window.WAMinimizer.isEnabled = data.minimizerEnabled !== false;
      if (window.WAMinimizer.isEnabled) {
        window.WAMinimizer.applyState(!!data.waMinimized);
      } else {
        window.WAMinimizer.applyState(false);
        if (window.WAPanel?.removeMinimizerBtn) {
          window.WAPanel.removeMinimizerBtn();
        }
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.minimizerEnabled !== undefined) {
        window.WAMinimizer.setEnabled(changes.minimizerEnabled.newValue !== false);
      }
    });

    const targetObserver = new MutationObserver((mutations) => {
      const hasElementChanges = mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0);
      if (hasElementChanges) {
        applyMinimizerTargetsDebounced();
      }
    });
    targetObserver.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
    applyMinimizerTargets();

    // Re-check targets when user navigates
    document.addEventListener('click', () => {
      setTimeout(() => {
        applyMinimizerTargets();
      }, 50);
    });

    // Keyboard shortcut: Alt + . → toggle sidebar
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === '.' || e.code === 'Period')) {
        e.preventDefault();
        window.WAMinimizer.toggle();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMinimizer);
  } else {
    initMinimizer();
  }
})();
