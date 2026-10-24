# Changelog

## v3.0.0
- Redesigned the privacy panel with a Quick Settings circular tile grid and master status cards.
- Added dedicated adjustments drawer with privacy mode switcher (Blur vs. Redact) and fine-tuning sliders.
- Added sidebar minimizer feature with smooth collapse/expand animation and `Alt + .` toggle shortcut.
- Added sidebar minimizer toggle button to the WhatsApp Web navigation bar.
- Fixed the tooltip to match native styling.

## v2.4.13
- Adjusted the custom hovering tooltip to match with the default tooltip in WhatsApp Web.
- Adjusted the custom button injection mechanism.
- Fixed the unblurred elements for a slight miliseconds after they're created in the viewport.

## v2.4.12
- Fixed the locator for button injection in WhatsApp Web.
- Adjusted the locator for the default profile picture in group conversation chats.

## v2.4.11
- Fixed the locator for the self-profile picture on sidebar and profile drawer.
- Fixed the locator for the profile pictures on the right sidebar.
- Fixed the locator for username and phone number on the profile drawer.

## v2.4.10
- Fixed the blur effect on profile pictures with a story ring.
- Fixed the locator for the self-profile picture picker.
- Added blur support for profile pictures in the Calls tab drawer.

## v2.4.9
- Added blur support for Community profile pictures.
- Added blur support for Community names in the chat list.
- Added blur support for the Business account notification card.
- Added transparency support for the search input bar.
- Update `README.md`.

## v2.4.8
- Performance improvements.
- Added blur support for pinned messages.
- Added blur support for pinned notification messages.
- Added blur support for starred message sender information.
- Added blur support for username.
- Added blur support for the Report and Block Contact buttons.
- Added blur support for the "Group created by" text.
- Added bidirectional support to the locator converter script.

## v2.4.7
- Fixed blur for self-profile add status image.
- Added blur support for reactions detail panel.

## v2.4.6
- Added blur support for recent contact's name.
- Performance improvements.

## v2.4.5
- Set the button to always stay on top of the WhatsApp DOM.
- Updated the icon.

## v2.4.4
- Adjusted the toggle hover animation.
- Fixed an issue where message bubbles containing quoted voice messages were mistakenly blurred.
- Changed the behavior of how quoted messages are blurred.
- Fixed the locator for default group pictures in the 'group-notification-context-card'.

## v2.4.3
### Locator Update
- Updated the locator for the profile picture fullscreen overlay.
- Restored the blur effect for contact vCards and voice note avatars.
- Fixed locator for the GIF fullscreen player.

### Adjustment
- Removed blur effects from default contact and default group pictures, as they are placeholder images.
- Removed the button injection function and merged it into the existing MutationObserver.
- Fixed linter issues.
- Cleaned up locator files by removing redundant locators.
- Updated the CSS converter.

## v2.4.2
- Updated the panel position for RTL users.
- Fixed excessive blur on stories.

## v2.4.1
- Tidied up the code to improve maintainability.
- Reduced the listener duration when showing the latest messages.
- Updated the text input locator.
- Rearranged the panel layout.
- Updated tooltip color.

## v2.4.0
- Major revamp, removed `:has` locator, the main culprit behind the lagging.
- Removed "Blur Lite" since it just removed the animations.