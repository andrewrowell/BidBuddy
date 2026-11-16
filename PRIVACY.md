# BidBuddy — Privacy Policy

_Last updated: 2026-11-16_

BidBuddy is a browser extension that labels bidders on JustBid item pages when
their (masked) bidder ID matches a list of people you configure.

## What data the extension stores

- **Your friends list** — the bidder IDs and names you type into the extension's
  options page, plus one on/off preference (auto-expand bid history).

That is the only data the extension stores.

## Where it is stored

- The list is saved with the browser's extension storage API
  (`storage.sync`, falling back to `storage.local`). It lives in your own
  browser profile. If you are signed into your browser (Chrome Sync / Firefox
  Account), the browser may sync it across your devices — this is handled by the
  browser, not by us.

## What is NOT collected

- BidBuddy has **no servers** and no analytics. It does not send your friends
  list, your browsing, the pages you visit, or any other data to the developer
  or to any third party.
- It does not read or transmit JustBid account information. On a JustBid item
  page it only reads the publicly shown, already-masked bidder IDs in order to
  compare them to your list, in your browser.

## Permissions

- **storage** — to save your friends list and preference.
- **Host access to `https://www.justbid.com/item/*`** — so the extension can run
  on JustBid item pages to add the badge and labels. It runs on no other sites.

## Your control

- Edit or clear the list anytime from the extension's options page. Removing the
  extension deletes its local data; data already synced by your browser is
  removed through your browser's sync controls.

## Contact

Questions: open an issue on the project's repository.

_BidBuddy is an independent tool and is not affiliated with, endorsed by, or
sponsored by JustBid._
