# Store submission notes — BidBuddy

Everything you need to fill in the Chrome Web Store and Firefox AMO listings.
Nothing here is published automatically; these are drafts for you to paste.

## Name

**BidBuddy**

In the description, include: _"Not affiliated with, endorsed by, or sponsored by
JustBid."_ (reduces trademark/affiliation risk since the tool is for JustBid.)

## Short summary (≤132 chars, both stores)

> See at a glance when someone you know is bidding against you on JustBid.

## Full description

> BidBuddy watches the bid history on JustBid item pages and flags bidders you
> know.
>
> • Add people to a private "friends list" (a bidder ID and a name).
> • On an item page, BidBuddy auto-expands the bid history and, if a bidder
>   matches your list, shows a red warning badge and labels that bidder with the
>   name you gave them.
> • Everything stays in your browser. There are no servers and no tracking.
>
> Note on accuracy: JustBid only shows partial (masked) bidder IDs, so a match
> is a *possible* bidder, not a certainty — verify before trusting it.
>
> Not affiliated with, endorsed by, or sponsored by JustBid.

## Category / audience

- Category: Shopping (Chrome) / Shopping (AMO).
- Not directed at children; no mature content.

## Privacy / data use

- Collects no personal data; sends nothing off-device. See `PRIVACY.md`.
- Host the policy somewhere public (e.g. GitHub repo file or GitHub Pages) and
  paste that URL into both stores.
- Chrome "Privacy practices" tab: declare **no** data collected/sold. Justify
  permissions:
  - `storage` — "Saves the user's friends list and one preference."
  - host access `https://www.justbid.com/item/*` — "Runs only on JustBid item
    pages to add the badge and labels."

## Screenshots

- `store/screenshots/chrome.png` — Chrome.
- `store/screenshots/firefox.png` — Firefox.
- Chrome requires 1280x800 or 640x400; crop/pad if needed.

## Icon

- `icons/icon-128.png` (store icon). A 512 version is at `icons/icon-512.png`
  if a larger one is requested.

## Packaging

```bash
npm install          # one-time, installs web-ext
npm run lint         # validate
npm run build        # -> web-ext-artifacts/bidbuddy-<version>.zip
```

- **Chrome Web Store:** upload `web-ext-artifacts/bidbuddy-<version>.zip` in the
  Developer Dashboard (one-time $5 registration). 
- **Firefox AMO:**
  - Listed: upload the same zip at addons.mozilla.org, or
  - Signed build for self-distribution: `npm run sign:firefox` (needs
    `WEB_EXT_API_KEY` / `WEB_EXT_API_SECRET` from your AMO account's API
    credentials), which outputs a signed `.xpi`.

## Known listing decisions to confirm

- `strict_min_version` is 115 for broad Firefox support. The
  `data_collection_permissions` manifest key only applies on Firefox 140+, so
  `web-ext lint` shows two informational warnings about that. To silence them,
  bump `strict_min_version` to `140.0` (drops users on 115–139). Current choice:
  keep 115, keep the "none" data-collection declaration, accept the warnings.
- `browser_specific_settings.gecko.id` is `bidbuddy@local`. Change it before
  first AMO upload if you want a different stable id — it must never change after
  publishing or the add-on is treated as new.
