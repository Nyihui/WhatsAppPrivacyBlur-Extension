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

    //  Me Tab Drawer Sidebar
    '[data-testid="me-tab-drawer"] [data-testid="drawer-title-body"]',
    '[data-testid="pushname-section"] | up:1 | find:> div:nth-child(2) > div > div:first-child',
    '[data-testid="phone"] | up:1 | find:> div',
    //  Status Player
    '[data-testid="status-player-contact-name"]',
    //  Channel Sidebar
    '[data-testid="newsletter-recommended-item"] > [data-testid="cell-frame-container"] > div > div:nth-child(2) > div:first-child',
    //  Conversation Panel - Header
    '[data-testid="conversation-info-header"] > div:first-child',
    '[data-testid="conversation-info-header"] [data-testid="chat-subtitle"] | has:span',
    //  Conversation Panel - Messages
    'span[data-testid="author"] | closest:div',
    '[data-testid="vcard-msg"] > div:nth-child(2)',
    '[data-testid="chat-msg-symbol"] [data-testid="person-refreshed-outline-thin"] | closest:div[role="button"]',
    //  Right Sidebar - Chat Info Drawer
    'span[data-testid*="contact-info-subtitle"] | up:5',
    'span[data-testid="group-info-drawer-subject-input-read-only selectable-text"] | closest:div',
    //  Right Sidebar - Group Participants Info
    '[data-testid="group-info-participants-section"] [role="listitem"] [data-testid="cell-frame-container"] > div:nth-child(2) [data-testid="cell-frame-secondary"] > div:nth-child(2)',
    //  Right Sidebar - Common Group
    '[data-testid="section-common-groups"] | up:1 | find:[data-testid="cell-frame-container"] [data-testid="cell-frame-secondary"]',
    //  Right Sidebar - Links Gallery Messages
    '[data-testid="link-gallery-msg"] > div:first-child > div:first-child > span[dir="auto"]',
    // //  Popup Members
    '[data-testid="contacts-modal"] [role="listitem"] [data-testid="cell-frame-container"] [data-testid="cell-frame-secondary"] > div:nth-child(2)',
  ],
});
