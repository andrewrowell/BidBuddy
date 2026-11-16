// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Andrew Rowell
//
// BidBuddy - shared persistent storage
//
// Loaded in BOTH the content script and the options page so they read/write the
// same store.
//
// Primary store is storage.sync: it survives extension updates AND syncs across
// devices when the browser is signed in (Chrome Sync / Firefox Account). Firefox
// requires the gecko id in the manifest for storage.sync to work, which is set.
//
// If storage.sync is unavailable or errors on a given browser, we fall back to
// storage.local, which still survives updates (it just does not sync across
// devices). That way the friends list is never silently lost.

(function () {
  "use strict";

  // Prefer the `browser` namespace where present (Firefox); fall back to
  // `chrome` (Chrome/Edge, and Firefox's compat alias).
  const ns =
    typeof browser !== "undefined" && browser.storage ? browser : chrome;
  const storage = ns.storage;

  function syncAvailable() {
    try {
      return !!(storage && storage.sync);
    } catch (e) {
      return false;
    }
  }

  function lastError() {
    try {
      return (ns.runtime && ns.runtime.lastError) || null;
    } catch (e) {
      return null;
    }
  }

  function readArea(area, keys) {
    return new Promise((resolve) => {
      if (!area) {
        resolve(null);
        return;
      }
      try {
        area.get(keys, (res) => resolve(lastError() ? null : res || {}));
      } catch (e) {
        resolve(null);
      }
    });
  }

  function writeArea(area, obj) {
    return new Promise((resolve) => {
      if (!area) {
        resolve();
        return;
      }
      try {
        area.set(obj, () => resolve());
      } catch (e) {
        resolve();
      }
    });
  }

  // Read local (the always-written mirror) and overlay sync (the cross-device
  // source of truth) on top. This keeps data consistent even if a sync write
  // once failed: whatever is in local still shows, and sync wins where present.
  function get(keys) {
    const sync = syncAvailable() ? storage.sync : null;
    return Promise.all([readArea(storage.local, keys), readArea(sync, keys)]).then(
      ([loc, syn]) => Object.assign({}, loc || {}, syn || {})
    );
  }

  // Always write local (durable on-device, survives updates) and also sync when
  // available (cross-device). Mirroring to both means a value is never stranded
  // in an area the reader does not consult.
  function set(obj) {
    const sync = syncAvailable() ? storage.sync : null;
    return Promise.all([writeArea(storage.local, obj), writeArea(sync, obj)]).then(
      () => true
    );
  }

  const target = typeof self !== "undefined" ? self : window;
  target.JBEStorage = { get, set };
})();
