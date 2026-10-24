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
  { id: 'panel-toggle-minimizer', key: 'minimizerEnabled' },
];

window.WAPanel.applySettingsToPanel = function (shadow, settings) {
  const dashboard = shadow.getElementById('wa-dashboard');
  if (!dashboard) return;

  const enabled = settings.enabled ?? window.WAPanel.DEFAULT_SETTINGS.enabled;
  window.WAPanel.isEnabled = enabled;
  if (window.WAPanel.updateCLBGlow) window.WAPanel.updateCLBGlow();
  const enabledInput = shadow.getElementById('panel-enabled');
  if (enabledInput) enabledInput.checked = enabled;
  dashboard.classList.toggle('shield-off', !enabled);

  const activeEl = shadow.activeElement;

  if (activeEl?.id !== 'panel-blur-intensity') {
    const blurAmount = settings.blurAmount ?? window.WAPanel.DEFAULT_SETTINGS.blurAmount;
    const blurInput = shadow.getElementById('panel-blur-intensity');
    const blurVal = shadow.getElementById('panel-blur-val');
    if (blurInput) blurInput.value = blurAmount;
    if (blurVal) blurVal.textContent = `${blurAmount}px`;
  }

  for (const { id, key } of window.WAPanel.TOGGLE_MAP) {
    const el = shadow.getElementById(id);
    if (el) el.checked = settings[key] ?? window.WAPanel.DEFAULT_SETTINGS[key];
  }

  const minimizerEnabled = settings.minimizerEnabled ?? window.WAPanel.DEFAULT_SETTINGS.minimizerEnabled;
  const cardMinimizer = shadow.getElementById('card-master-minimizer');
  if (cardMinimizer) cardMinimizer.classList.toggle('minimizer-off', !minimizerEnabled);

  if (activeEl?.id !== 'panel-input-opacity-slider') {
    const inputOpacity = settings.inputOpacity ?? window.WAPanel.DEFAULT_SETTINGS.inputOpacity;
    const inputSlider = shadow.getElementById('panel-input-opacity-slider');
    const inputVal = shadow.getElementById('panel-input-opacity-val');
    if (inputSlider) inputSlider.value = inputOpacity;
    if (inputVal) inputVal.textContent = `${inputOpacity}%`;
  }
  
  const inputEnabled = settings.blurInput ?? window.WAPanel.DEFAULT_SETTINGS.blurInput;
  const rowInput = shadow.getElementById('drawerRow-input');
  const sliderInput = shadow.getElementById('panel-input-opacity-slider');
  if (rowInput) rowInput.classList.toggle('disabled', !inputEnabled);
  if (sliderInput) sliderInput.disabled = !inputEnabled;

  if (activeEl?.id !== 'panel-unblur-last-n-slider') {
    const unblurLastNCount = settings.unblurLastNCount ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastNCount;
    const clampedCount = Math.min(10, unblurLastNCount);
    const unblurSlider = shadow.getElementById('panel-unblur-last-n-slider');
    const unblurVal = shadow.getElementById('panel-unblur-last-n-val');
    if (unblurSlider) unblurSlider.value = clampedCount;
    if (unblurVal) unblurVal.textContent = `${clampedCount} msgs`;
  }
  
  const unblurLastNEnabled = settings.unblurLastN ?? window.WAPanel.DEFAULT_SETTINGS.unblurLastN;
  const rowUnblur = shadow.getElementById('drawerRow-unblur');
  const sliderUnblur = shadow.getElementById('panel-unblur-last-n-slider');
  if (rowUnblur) rowUnblur.classList.toggle('disabled', !unblurLastNEnabled);
  if (sliderUnblur) sliderUnblur.disabled = !unblurLastNEnabled;

  if (activeEl?.id !== 'panel-animation-duration-slider') {
    const animationDuration = settings.animationDuration ?? window.WAPanel.DEFAULT_SETTINGS.animationDuration;
    const animSlider = shadow.getElementById('panel-animation-duration-slider');
    const animVal = shadow.getElementById('panel-animation-duration-val');
    if (animSlider) animSlider.value = animationDuration;
    if (animVal) animVal.textContent = `${animationDuration}s`;
  }
  
  const animationEnabled = settings.animation ?? window.WAPanel.DEFAULT_SETTINGS.animation;
  const rowAnimation = shadow.getElementById('drawerRow-animation');
  const sliderAnim = shadow.getElementById('panel-animation-duration-slider');
  if (rowAnimation) rowAnimation.classList.toggle('disabled', !animationEnabled);
  if (sliderAnim) sliderAnim.disabled = !animationEnabled;

  const privacyMode = settings.privacyMode || 'blur';
  const modeBlurBtn = shadow.getElementById('panel-mode-blur');
  const modeRedactedBtn = shadow.getElementById('panel-mode-redacted');
  const blurSliderRow = shadow.getElementById('blurSliderRow');
  const blurIntensityInput = shadow.getElementById('panel-blur-intensity');

  if (modeBlurBtn && modeRedactedBtn) {
    modeBlurBtn.classList.toggle('active', privacyMode === 'blur');
    modeRedactedBtn.classList.toggle('active', privacyMode === 'redacted');
  }

  const isRedacted = (privacyMode === 'redacted');
  if (blurSliderRow) blurSliderRow.classList.toggle('disabled', isRedacted);
  if (blurIntensityInput) blurIntensityInput.disabled = isRedacted;
};
