# BidBuddy

A small Chrome + Firefox (Manifest V3) extension that flags when someone you
know is bidding on a [JustBid](https://www.justbid.com) item.

## Install

- **Chrome:** [Chrome Web Store](https://chromewebstore.google.com/detail/dmdfkdjekmhaabpfldiffflfhkapngpn)
- **Firefox:** [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/bidbuddy/)

## How it works

On an item page (`https://www.justbid.com/item/...`) it:

- Shows a **red warning badge** at the top of the item when a bidder in the
  bid history matches your friends list.
- Replaces that bidder's masked ID in the bid history with the friend's
  **name** (marked with a `?`, because it is only a possible match).
- Reads its friends list from a configurable **options page**.

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

## Limitations

JustBid never sends the full bidder ID to the browser, instead it shows it
**only in masked form** — for example `12**9*`. There is no hidden attribute,
JSON, or network payload with the real ID; the rows are rendered server-side
already masked.

A masked ID is not guaranteed unique — depending on the omitted numbers,
two different real users could show the same masked value. The mask **does** seem
to be deterministic.

## Development

See [DEVELOPERS.md](DEVELOPERS.md) for more information on developing this plugin.

## License

Licensed under the GNU Affero General Public License v3.0 (`AGPL-3.0-or-later`).
See [LICENSE](LICENSE) for the full text.

You may use, modify, and redistribute this code, including commercially, as long
as you keep it under the AGPL: anyone you distribute it to — or who interacts
with a modified version over a network — must be able to get the complete
corresponding source. It cannot be folded into closed-source software.
