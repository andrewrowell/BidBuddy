# JustBid Enhanced

A small Chrome + Firefox (Manifest V3) extension that flags when someone you
know is bidding on a [JustBid](https://www.justbid.com) item.

On an item page (`https://www.justbid.com/item/...`) it:

- Shows a **red warning badge** at the top of the item when a bidder in the
  bid history matches your friends list.
- Replaces that bidder's masked ID in the bid history with the friend's
  **name** (marked with a `?`, because it is only a possible match).
- Reads its friends list from a configurable **options page**.

## JustBid only shows partial bidder IDs

JustBid never sends the full bidder ID to the browser, instead it shows it
**only in masked form** — for example `12**9*`. There is no hidden attribute,
JSON, or network payload with the real ID; the rows are rendered server-side
already masked.

A masked ID is not guaranteed unique — depending on the omitted numbers,
two different real users could show the same masked value. The mask **does** seem
to be deterministic.

## Configuring your friends list

Open the extension's options (see below), then add rows of:

| Bidder ID (masked) | Name |
| ------------------ | ---- |
| `12**9*`           | Alex |

Enter the ID as it appears in a JustBid bid history. Click **Save**. Open item
pages update live when you save.

**Matching uses `*` as a single-character wildcard on either side.** So an entry
can be the masked value (`12**9*`), the full ID if you happen to know it
(`123495`), or any compatible mask — they all match as long as the lengths line
up. That also means it keeps working if JustBid changes how much of the ID it
masks.

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
4. Use **Extensions → JustBid Enhanced → Preferences** (or the toolbar icon) to
   edit the friends list.

A temporary add-on is removed when Firefox restarts. For a permanent install the
extension needs to be signed by Mozilla (`web-ext sign` / AMO).

## Files

- `manifest.json` — MV3 manifest, cross-browser.
- `content.js` — scans the bid history, renames matches, shows the badge.
- `content.css` — badge and name styles.
- `options.html` / `options.js` — the friends-list editor.

## Limitations / ideas for later

- Matching is masked-ID based. I don't know if there is a way to get the full ID,
  it might be possible to set up a service where users can opt-in to share their
  item bids with eachother, but that would be a **much** larger project.
- Only checks the bids on the item page. Doesn't show in search lists.
- Use `chrome.storage.sync`, so the list syncs with your browser
  profile.
