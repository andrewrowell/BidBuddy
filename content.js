// JustBid Enhanced - content script
// Scans a JustBid item page's bid history for bidder IDs that match your
// configured friends list, replaces the masked ID with the friend's name, and
// shows a red warning badge at the top of the item when a friend is bidding.
//
// NOTE ON MATCHING: JustBid only ever exposes bidder IDs in MASKED form
// (e.g. "12**9*"). The full numeric ID is never sent to the browser - not in
// the DOM, data attributes, page HTML, or network payloads. The friends list is
// matched against that masked string with "*" treated as a single-character
// wildcard on either side (see wildEqual), so an entry can be the masked value,
// the full id, or any compatible mask. The mask is deterministic per user, so
// it is stable across items; the caveat is that a partial id is not unique, so
// two different real users could collapse to the same value.

(function () {
  "use strict";

  const STORE_KEY = "friends";
  const AUTO_OPEN_KEY = "autoOpen"; // default true
  const NAME_CLASS = "jbe-friend-name";
  const BADGE_ID = "jbe-friend-badge";

  let autoOpenEnabled = true;

  // JBEStorage (storage.js) reads from storage.sync with a storage.local
  // fallback, and returns a promise in both Chrome and Firefox.
  function loadSettings() {
    return JBEStorage.get([STORE_KEY, AUTO_OPEN_KEY]).then((res) => {
      const list = (res && res[STORE_KEY]) || [];
      const auto = !res || res[AUTO_OPEN_KEY] !== false; // default on
      return { friends: Array.isArray(list) ? list : [], autoOpen: auto };
    });
  }

  function buildFriends(list) {
    const out = [];
    for (const f of list) {
      if (!f || !f.id) continue;
      const id = String(f.id).trim();
      const name = String(f.name || "").trim();
      if (id && name) out.push({ id, name });
    }
    return out;
  }

  // A masked bidder ID as JustBid renders it: digits plus at least one "*".
  function isMaskedId(text) {
    return /\*/.test(text) && /^[0-9*]{3,16}$/.test(text);
  }

  // Treat "*" as a single-character wildcard on EITHER side. So a page mask like
  // "36**7*" matches a friend entry that is the full id ("364271"), the same
  // mask, or any compatible mask — and if JustBid changes how much it masks, an
  // entry still matches as long as the lengths line up. Equal length is required
  // (one "*" = exactly one char), which also guards against over-matching.
  function wildEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const ca = a[i];
      const cb = b[i];
      if (ca !== "*" && cb !== "*" && ca !== cb) return false;
    }
    return true;
  }

  // The first friend whose id wild-matches the given bidder text, or null.
  function matchFriend(text) {
    for (const f of friends) {
      if (wildEqual(text, f.id)) return f;
    }
    return null;
  }

  let friends = [];

  // Restore every span we previously renamed back to its original masked ID.
  function restoreAll() {
    document.querySelectorAll("." + NAME_CLASS).forEach((span) => {
      if (span.dataset.jbeOrig) span.textContent = span.dataset.jbeOrig;
      span.classList.remove(NAME_CLASS);
      span.removeAttribute("title");
      delete span.dataset.jbeOrig;
      delete span.dataset.jbeId;
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  // Choose where to place the badge: directly above the Bid History section
  // (full width, next to the evidence), falling back to the item title, then
  // the top of <main>.
  function placeBadge(badge) {
    // Anchor the badge just BEFORE the whole bid-history section. JustBid
    // replaces that section wholesale on every live bid (Turbo stream), so
    // placing the badge outside it keeps it from being wiped each update.
    const section = document.querySelector('[id$="-bidding_history"]');
    if (section && section.parentNode) {
      section.parentNode.insertBefore(badge, section);
      return;
    }
    const acc = document.querySelector('[data-controller~="ui--bid-accordion"]');
    const card = acc && (acc.closest(".st-accordion") || acc.parentNode);
    if (card && card.parentNode) {
      card.parentNode.insertBefore(badge, card);
      return;
    }
    const h1 = document.querySelector("main h1, h1");
    if (h1 && h1.parentNode) {
      h1.parentNode.insertBefore(badge, h1);
      return;
    }
    const host = document.querySelector("main") || document.body;
    host.insertBefore(badge, host.firstChild);
  }

  function updateBadge(found) {
    let badge = document.getElementById(BADGE_ID);

    if (!found.size) {
      if (badge) badge.remove();
      return;
    }

    const names = [...found];
    // Signature of the current set of names. We only rewrite the badge when it
    // changes, otherwise each scan's DOM write would trigger the observer and
    // loop forever.
    const sig = names.slice().sort().join("\u0001");

    if (badge && badge.dataset.jbeSig === sig) return;

    if (!badge) {
      badge = document.createElement("div");
      badge.id = BADGE_ID;
      badge.className = "jbe-badge";
      placeBadge(badge);
    }
    badge.dataset.jbeSig = sig;

    const label =
      names.length === 1
        ? "Someone you know may be bidding on this item"
        : "People you know may be bidding on this item";
    badge.innerHTML =
      '<span class="jbe-badge__icon" aria-hidden="true">⚠</span>' +
      '<span class="jbe-badge__text"><strong>' +
      label +
      "</strong>: " +
      names.map(escapeHtml).join(", ") +
      '. <span class="jbe-badge__verify">JustBid only shows partial bidder IDs, so there is a chance this is another ' +
        'bidder. Check with this person to verify they are bidding on this item.</span>' +
      "</span>";
  }

  function scan() {
    const found = new Set();
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      // Only leaf spans (the mask lives in a span with no child elements).
      if (span.children.length) continue;

      const current = span.textContent.trim();

      // Already renamed by us: re-check it still matches (config may have changed).
      if (span.classList.contains(NAME_CLASS)) {
        const orig = span.dataset.jbeOrig;
        const match = matchFriend(orig);
        if (match) {
          found.add(match.name);
          if (span.textContent !== match.name) span.textContent = match.name; // re-apply if stream reset it
        }
        continue;
      }

      if (!isMaskedId(current)) continue;
      const match = matchFriend(current);
      if (!match) continue;

      span.dataset.jbeOrig = current;
      span.dataset.jbeId = current;
      span.textContent = match.name;
      span.classList.add(NAME_CLASS);
      span.title =
        "JustBid Enhanced: possible match for " +
        match.name +
        " (bidder " +
        current +
        ") — verify, partial IDs are not unique.";
      found.add(match.name);
    }
    updateBadge(found);
  }

  // JustBid loads the bid history lazily: the collapsed header is covered by an
  // invisible <a id="link-overlay" data-turbo-stream> that, when clicked, fetches
  // the rows via Turbo and expands the section. We trigger that same mechanism
  // once per page load so known bidders are checked without the user expanding
  // anything. We only auto-open once, so if the user later collapses it we leave
  // it closed.
  let autoOpened = false;
  function ensureBidHistoryOpen() {
    if (!autoOpenEnabled || autoOpened) return;
    const overlay = document.getElementById("link-overlay");
    if (overlay) {
      autoOpened = true;
      overlay.click();
    }
  }

  // Debounced scan so we don't thrash on every DOM mutation.
  let pending = null;
  function scheduleScan() {
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = null;
      ensureBidHistoryOpen();
      scan();
    });
  }

  function start() {
    ensureBidHistoryOpen();
    scan();
    const observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // React to edits made in the options page without needing a reload. We watch
  // both sync and local since the wrapper may use either.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" && area !== "local") return;
    if (changes[STORE_KEY]) {
      restoreAll();
      friends = buildFriends(changes[STORE_KEY].newValue || []);
      scan();
    }
    if (changes[AUTO_OPEN_KEY]) {
      autoOpenEnabled = changes[AUTO_OPEN_KEY].newValue !== false;
      if (autoOpenEnabled) ensureBidHistoryOpen();
    }
  });

  loadSettings().then((settings) => {
    friends = buildFriends(settings.friends);
    autoOpenEnabled = settings.autoOpen;
    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start, { once: true });
  });
})();
