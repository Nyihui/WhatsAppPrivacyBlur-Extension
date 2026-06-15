/* ==========================================================================
   WhatsApp Privacy Blur - Media Gallery Selectors
   Rule key: blurMediaGallery
   ========================================================================== */

window.WA_BLUR_RULES.push({
  key: 'blurMediaGallery',
  className: 'wa-blur-media-gallery',
  label: 'Media Gallery',
  property: 'filter',
  blurMultiplier: 5,
  targets: [
    //  Conversation Media
    '[data-testid="media-video"]',
    '[data-testid="media-zoomable"]',
    '[data-testid="media-gif"]',
    '[data-testid="drawer-middle"] [data-animate-attach-media="true"] > div > div > div',
  ],
  hoverHasTargets: [
    {
      ancestor: 'div:has( > div > div > button[data-testid="webtp-powered-by"])',
      hoverTrigger: '> img',
      child: ''
    },
    //  Story Media + Submit Media — unblur only when a specific trigger is hovered (not the blurred element itself)
    {
      ancestor: '[data-testid="status-player-uie"]',
      hoverTrigger: '[style*="position: absolute"]',
      child: '> div > button > div[data-testid="status-video"]',
    },
    {
      ancestor: '[data-testid="drawer-middle"]',
      hoverTrigger: '[data-testid="media-editor-canvas"]',
      child: 'div:has( > [data-testid="media-editor-canvas"])',
    }
  ],
});
