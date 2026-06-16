/* ==========================================================================
   WhatsApp Privacy Blur - Name Selectors
   Rule key: blurNames
   ========================================================================== */

window.WA_BLUR_RULES.push({
  key: 'blurNames',
  className: 'wa-blur-names',
  label: "Group / User's Name",
  property: 'filter',
  blurMultiplier: 1,
  targets: [

    // EXPERIMENTAL
    '[role="gridcell"] [data-testid="cell-frame-title"]',

    //  Main Chat List Sidebar
    // -- '[data-testid="message-yourself-row"] [data-testid="cell-frame-title"]',
    // -- '[data-testid*="list-item-"] [data-testid="cell-frame-container"] [data-testid="cell-frame-title"]',
    //  Me Tab Drawer Sidebar
    '[data-testid="me-tab-drawer"] [data-testid="drawer-title-body"]',
    'div:has( > [data-testid="pushname-section"]) > div:nth-child(2) > div > div:first-child',
    'div:has( > [data-testid="phone"]) > div',
    //  Status Sidebar
    // -- '[data-testid="status-row-cell"] [data-testid="cell-frame-title"]',
    //  Status Player
    '[data-testid="status-player-contact-name"]',
    //  Channel Sidebar
    '[data-testid="newsletter-recommended-item"] > [data-testid="cell-frame-container"] > div > div:nth-child(2) > div:first-child',
    //  Conversation Panel - Header
    '[data-testid="conversation-info-header"] > div:first-child',
    '[data-testid="conversation-info-header"] [data-testid="chat-subtitle"]:has(span)',
    //  Conversation Panel - Messages
    '[data-testid="msg-container"] div:has( > span[data-testid="author"])',
    '[data-testid="vcard-msg"] > div:nth-child(2)',
    'div[role="button"]:has( > [data-testid="chat-msg-symbol"] [data-testid="person-refreshed-outline-thin"])',
    //  Right Sidebar - Chat Info Drawer
    'div:has( > div > span > div > div > span[data-testid*="contact-info-subtitle"])',
    'div:has( > span[data-testid="group-info-drawer-subject-input-read-only selectable-text"])',
    //  Right Sidebar - Group Participants Info
    // -- '[data-testid="group-info-participants-section"] [id="pane-side"] [role="listitem"] [data-testid="cell-frame-container"] > div:nth-child(2) [data-testid="cell-frame-title"]',
    '[data-testid="group-info-participants-section"] [role="listitem"] [data-testid="cell-frame-container"] > div:nth-child(2) [data-testid="cell-frame-secondary"] > div:nth-child(2)',
    //  Right Sidebar - Common Group
    // -- 'div:has([data-testid="section-common-groups"]) [data-testid="cell-frame-container"] [data-testid="cell-frame-title"]',
    'div:has( > [data-testid="section-common-groups"]) [data-testid="cell-frame-container"] [data-testid="cell-frame-secondary"]',
    //  Right Sidebar - Links Gallery Messages
    '[data-testid="link-gallery-msg"] > div:first-child > div:first-child > span[dir="auto"]',
    // //  Popup Members
    // -- '[data-testid="popup-contents"] [data-testid="contacts-modal"] [role="listitem"] [data-testid="cell-frame-container"] [data-testid="cell-frame-title"]',
    '[data-testid="contacts-modal"] [role="listitem"] [data-testid="cell-frame-container"] [data-testid="cell-frame-secondary"] > div:nth-child(2)',
    //  Profile Picture Overlay
    // -- '[class*="overlay"] [data-testid="cell-frame-container"] [data-testid="cell-frame-title"]',
  ],
});
