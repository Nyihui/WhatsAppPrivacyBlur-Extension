window.WAPanel = window.WAPanel || {};

window.WAPanel.checkRTL = function() {
  return document.documentElement.dir === 'rtl' ||
    document.body?.dir === 'rtl' ||
    (document.body && window.getComputedStyle(document.body).direction === 'rtl') ||
    window.getComputedStyle(document.documentElement).direction === 'rtl';
};

window.WAPanel.syncTheme = function(host) {
  const isDark = document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');
  if (host) host.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

window.WAPanel.syncThemeAndColor = function(host) {
  const isDark = document.body.classList.contains('dark');
  if (host) host.dataset.theme = isDark ? 'dark' : 'light';
  chrome.storage.local.set({ waTheme: isDark ? 'dark' : 'light' });
  if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
};
