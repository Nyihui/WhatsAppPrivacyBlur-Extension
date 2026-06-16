/* ==========================================================================
   WhatsApp Privacy Blur - Chat Text Selectors
   Rule key: blurTextChats
   ========================================================================== */

window.WA_BLUR_RULES.push({
  key: 'blurTextChats',
  className: 'wa-blur-text',
  label: 'All Messages In Chat',
  property: 'filter',
  blurMultiplier: 1,
  targets: [
    '[data-pre-plain-text]',
    // '[data-testid="msg-container"] div:has( > span[data-testid*="selectable-text"])',
    '[data-testid="msg-container"] div:has( > div > [data-testid="recalled"])',
    '[data-testid="msg-container"] div:has( > div[class*="copyable-text"]):has(p)',
    '[data-testid="msg-container"] div:has( > div[data-testid*="selectable-text"]):has(img)',
    '[data-testid="group-notification-context-card-title"]',
    '[data-testid="group-notification-context-card-subtitle"]',
    '[data-testid="msg-notification-container"] [data-testid*="subtype"]',
    '[class*="copyable-area"] div:has( > [role="button"][aria-label="Close"]) > div:nth-child(2):has(span)',
    '[data-testid="media-caption"]',
    'div:has([data-testid="link-preview-container"]) > span[data-testid="selectable-text"]',
    //  Group Descriptions
    '[data-testid="conversation-subheader"] > div > div > div:nth-child(2)',
    'div:has( > span[data-testid*="group-notification-context-card-description"])',
    'div:has( > span[data-testid*="group-info-drawer-description-title-input-read-only"])',
    //  Story Captions
    '[data-testid="status-player-uie"] span[dir="auto"]:not(button[data-testid="status-player-contact-name"] *):not([class*="html-span"] *)',
  ],
});
