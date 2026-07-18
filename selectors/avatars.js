/* ==========================================================================
   WhatsApp Privacy Blur - Avatar Selectors
   Rule key: blurAvatars
   ========================================================================== */

window.WA_BLUR_RULES.push(
  {
    key: 'blurAvatars',
    className: 'wa-blur-avatars',
    label: 'Profile Pictures',
    property: 'filter',
    blurMultiplier: 1,
    targets: [
      //  Main Chat List Sidebar
      '[data-testid="navbar-item-me-tab-photo"] | closest:button',
      '[data-testid*="list-item-"] [data-testid="message-yourself-row"] > div:first-child img',
      '[data-testid*="list-item-"] [data-testid="cell-frame-container"] > div:first-child img',
      //  Commented because it's the same as the anonymous photo
      // '[data-testid="default-contact-refreshed"] | closest:div',
      // '[data-testid="default-group-refreshed"] | closest:div',

      //  Recent Search
      '[data-testid="recent-search-item"] > div:first-child | not-has:[data-testid="default-contact-refreshed"] | not-has:[data-testid="default-group-refreshed"]',

      //  Me Tab Drawer Sidebar
      '[data-testid="me-tab-drawer"] [data-testid="menu-controller-focus-receiver"] img[src*="https://media"]',
      '[data-testid="profile-drawer"] img[src*="https://media"]',

      //  Status Sidebar
      '[data-testid="status-tab-drawer"] [data-testid="status-header-add-status"] img[src*="https://media"]',
      //  Update 02-07-2026 || Self-Profile status locator
      '[data-testid="status-header"] div | has:> img',

      //  Status Player
      '[data-testid="status-player-uie"] img[src*="https"]:not([data-testid="sticker-item"] *, [data-testid="status-emoji-bar"] *, [style*="position: absolute"] *)',

      //  Conversation Panel - Header
      '[data-testid="conversation-header"] > div:first-child > div:first-child | not-has:[data-testid="default-contact-refreshed"] | not-has:[data-testid="default-group-refreshed"]',
      '[data-testid="conversation-header"] [data-testid="subgroup-switcher-button"] div | has:> div > img',

      //  Conversation Panel - Messages
      '[data-testid="group-chat-profile-picture"]',
      '[data-testid="group-notification-context-card-photo"]',
      '[data-testid="conversation-panel-messages"] [data-testid="vcard-msg"] img',
      'div | has:> div > div > div > [data-testid="ptt-status"] | find:> div:first-child',

      //  Conversation Panel - Reactions
      'div:has( > [data-testid="reaction-count-header"]) > div:last-child [data-testid*="list-item-"] [data-testid="reactions-details-cell-me"] > div:first-child div | has:> img',
      'div:has( > [data-testid="reaction-count-header"]) > div:last-child [data-testid*="list-item-"] [data-testid="reactions-details-cell-not-me"] > div:first-child div | has:> img',

      //  Right Sidebar - Chat Info Drawer
      '[data-testid="chat-info-drawer"] > :nth-child(2) [class*="html-span"] | has:img',
      // '[data-testid="chat-info-drawer"] [tabindex="-1"] > button[data-testid="group-pic-picker"] | up:2',
      '[data-testid="chat-info-drawer"] div | has:> [tabindex="-1"] > button[data-testid="group-pic-picker"] | not-has:[data-testid="default-group-refreshed"] *',

      //  Right Sidebar - Group's Media/Docs/Links
      '[data-testid="link-gallery-msg"] > div:first-child > div:first-child > div:first-child',

      //  Media Viewer
      '[data-testid="media-viewer-modal"] [data-testid="cell-frame-container"] img',

      //  Profile Picture Fullscreen Overlay
      '[class*="overlay"] [data-testid="cell-frame-container"] img',
      //  Update 18-06-2026 || x1akjpcp = background-color: rgba(var(--WDS-background-wash-plain-RGB),.96);
      '[class*="x1akjpcp"] [data-testid="cell-frame-container"] img',
    ],
  },
  {
    key: 'blurAvatars',
    className: 'wa-blur-avatars',
    label: 'Profile Pictures',
    property: 'filter',
    blurMultiplier: 5,
    targets: [
      '[class*="overlay"] [dir="ltr"] img | closest:div',
      '[class*="overlay"] [dir="rtl"] img | closest:div',
      //  Update 18-06-2026 || x1akjpcp = background-color: rgba(var(--WDS-background-wash-plain-RGB),.96);
      '[class*="x1akjpcp"] [dir="ltr"] img | closest:div',
      '[class*="x1akjpcp"] [dir="rtl"] img | closest:div',
    ],
  }
);
