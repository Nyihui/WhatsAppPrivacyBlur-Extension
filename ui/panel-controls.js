window.WAPanel = window.WAPanel || {};

window.WAPanel.TOGGLE_MAP = [
  { id: 'panel-toggle-avatars', key: 'blurAvatars' },
  { id: 'panel-toggle-names', key: 'blurNames' },
  { id: 'panel-toggle-previews', key: 'blurPreviews' },
  { id: 'panel-toggle-text-chats', key: 'blurTextChats' },
  { id: 'panel-toggle-stickers', key: 'blurStickers' },
  { id: 'panel-toggle-media-preview', key: 'blurMediaPreview' },
  { id: 'panel-toggle-media-gallery', key: 'blurMediaGallery' },
  { id: 'panel-toggle-input', key: 'blurInput' },
  { id: 'panel-toggle-unblur-last-n', key: 'unblurLastN' },
  { id: 'panel-toggle-animation', key: 'animation' },
];

window.WAPanel.applySettingsToPanel = function (shadow, settings) {
  const dashboard = shadow.getElementById('wa-dashboard');
  if (!dashboard) return;

  const enabled = settings.enabled ?? window.WAPanel.DEFAULT_SETTINGS.enabled;
  window.WAPanel.isEnabled = enabled;
  if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
  shadow.getElementById('panel-enabled').checked = enabled;
  dashboard.classList.toggle('shield-off', !enabled);

  const blurAmount = settings.blurAmount ?? window.WAPanel.DEFAULT_SETTINGS.blurAmount;
  shadow.getElementById('panel-blur-intensity').value = blurAmount;
  shadow.getElementById('panel-blur-val').textContent = `${blurAmount}px`;

  for (const { id, key } of window.WAPanel.TOGGLE_MAP) {
    const el = shadow.getElementById(id);
    if (el) el.checked = settings[key] ?? window.WAPanel.DEFAULT_SETTINGS[key];
  }

  const inputOpacity = settings.inputOpacity ?? window.WAPanel.DEFAULT_SETTINGS.inputOpacity;
  shadow.getElementById('panel-input-opacity-slider').value = inputOpacity;
  shadow.getElementById('panel-input-opacity-val').textContent = `${inputOpacity}%`;
  
  const inputEnabled = settings.blurInput ?? window.WAPanel.DEFAULT_SETTINGS.blurInput;
  const inputPanel = shadow.getElementById('panel-input-opacity-panel');
  const inputText = shadow.querySelector('#row-panel-toggle-input .row-text');
  if (inputPanel && inputText) {
    inputPanel.style.display = inputEnabled ? 'flex' : 'none';
    inputText.style.display = inputEnabled ? 'none' : 'flex';
  }

  const unblurLastNCount = settings.unblurLastNCount ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastNCount;
  const clampedCount = Math.min(10, unblurLastNCount);
  shadow.getElementById('panel-unblur-last-n-slider').value = clampedCount;
  shadow.getElementById('panel-unblur-last-n-val').textContent = clampedCount;
  
  const unblurLastNEnabled = settings.unblurLastN ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastN;
  const unblurPanel = shadow.getElementById('panel-unblur-last-n-panel');
  const unblurText = shadow.querySelector('#row-panel-toggle-unblur-last-n .row-text');
  if (unblurPanel && unblurText) {
    unblurPanel.style.display = unblurLastNEnabled ? 'flex' : 'none';
    unblurText.style.display = unblurLastNEnabled ? 'none' : 'flex';
  }

  const animationDuration = settings.animationDuration ?? window.WAPanel.DEFAULT_SETTINGS.animationDuration;
  shadow.getElementById('panel-animation-duration-slider').value = animationDuration;
  shadow.getElementById('panel-animation-duration-val').textContent = `${animationDuration}s`;
  
  const animationEnabled = settings.animation ?? window.WAPanel.DEFAULT_SETTINGS.animation;
  const animationPanel = shadow.getElementById('panel-animation-duration-panel');
  const animationText = shadow.querySelector('#row-panel-toggle-animation .row-text');
  if (animationPanel && animationText) {
    animationPanel.style.display = animationEnabled ? 'flex' : 'none';
    animationText.style.display = animationEnabled ? 'none' : 'flex';
  }

  const privacyMode = settings.privacyMode || 'blur';
  const modeBlurBtn = shadow.getElementById('panel-mode-blur');
  const modeRedactedBtn = shadow.getElementById('panel-mode-redacted');
  const blurIntensityWrapper = shadow.getElementById('panel-blur-intensity-wrapper');
  const rowUnblur = shadow.getElementById('row-panel-toggle-unblur-last-n');
  const rowAnimation = shadow.getElementById('row-panel-toggle-animation');

  if (modeBlurBtn && modeRedactedBtn && blurIntensityWrapper) {
    [modeBlurBtn, modeRedactedBtn].forEach(btn => {
      btn.style.background = 'transparent';
      btn.style.color = 'var(--md-on-s-var)';
      btn.style.borderColor = 'var(--md-outline)';
    });

    let activeBtn = modeBlurBtn;
    if (privacyMode === 'blur') activeBtn = modeBlurBtn;
    else if (privacyMode === 'redacted') activeBtn = modeRedactedBtn;

    activeBtn.style.background = 'var(--md-primary-dim)';
    activeBtn.style.color = 'var(--md-primary)';
    activeBtn.style.borderColor = 'var(--md-primary)';

    blurIntensityWrapper.style.display = (privacyMode === 'redacted') ? 'none' : 'block';

    if (rowUnblur) rowUnblur.style.display = 'flex';
    if (rowAnimation) rowAnimation.style.display = 'flex';
  }
};
