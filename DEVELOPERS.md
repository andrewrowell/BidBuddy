## Load it in Chrome (unpacked)

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.
4. Open the extension's **Details → Extension options** (or click the toolbar
   icon) to edit the friends list.

## Load it in Firefox (temporary add-on)

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file in this folder.
4. Use **Extensions → BidBuddy → Preferences** (or the toolbar icon) to
   edit the friends list.

A temporary add-on is removed when Firefox restarts. For a permanent install the
extension needs to be signed by Mozilla (`web-ext sign` / AMO).

## Files

- `manifest.json` — MV3 manifest, cross-browser.
- `content.js` — scans the bid history, renames matches, shows the badge.
- `content.css` — badge and name styles.
- `storage.js` — shared persistent storage (sync, with local fallback).
- `options.html` / `options.js` — the friends-list editor.
- `LICENSE` — full GNU AGPL v3 text.
- `icons/` — the BidBuddy icons (16/32/48/128, plus 512 for store listings).
- `PRIVACY.md` — privacy policy. `STORE.md` — store submission notes.
- `package.json` / `web-ext-config.mjs` — lint/build/sign with Mozilla's
  `web-ext`. `store/` holds listing assets (screenshots) and is not packaged.

## Publishing

See `STORE.md` for the store listing copy, packaging, and signing steps. In
short: `npm install` then `npm run build` produces the upload zip (Chrome Web
Store), and `npm run sign:firefox` produces a signed `.xpi` (Firefox).

## Limitations / ideas for later

- Matching is masked-ID based. I don't know if there is a way to get the full ID,
  it might be possible to set up a service where users can opt-in to share their
  item bids with eachother, but that would be a **much** larger project.
- Only checks the bids on the item page. Doesn't show in search lists.
- Use `chrome.storage.sync`, so the list syncs with your browser
  profile.