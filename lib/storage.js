// -----------------------------------------------------------------------
// Everything in this file talks to localStorage. This app is front-end
// only, so accounts and progress live in the browser that created them.
//
// Every function here is intentionally small and named after what it
// does, not how it does it -- so that swapping localStorage for a real
// API (e.g. so a person's account really does follow them between an
// iPhone and an Android phone) later means rewriting this one file,
// not the rest of the app. See README.md for notes on that upgrade.
// -----------------------------------------------------------------------

const USERS_KEY = "gf_users";
const SESSION_KEY = "gf_session";
const USERDATA_PREFIX = "gf_userdata_";

const isBrowser = () => typeof window !== "undefined";

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// ---- Accounts (mock only - plain text, demo purposes) ------------------

export function getUsers() {
  if (!isBrowser()) return {};
  return safeParse(window.localStorage.getItem(USERS_KEY), {});
}

export function saveUsers(users) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSession(username) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_KEY, username);
}

export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
}

// ---- Per-user app data ---------------------------------------------------

export function defaultUserData() {
  return {
    points: 0,
    history: [], // { id, dateISO, durationSec, points, paused }
    settings: {
      fontSize: "medium", // small | medium | large | xlarge
    },
    profile: {
      skin: 0,
      hair: 0,
      face: 0,
      outfit: 0,
      accessory: 0,
    },
    ownedItems: [
      "skin-0",
      "hair-0",
      "face-0",
      "outfit-0",
      "accessory-0",
    ],
  };
}

export function getUserData(username) {
  if (!isBrowser() || !username) return defaultUserData();
  const raw = window.localStorage.getItem(USERDATA_PREFIX + username);
  const data = safeParse(raw, null);
  if (!data) return defaultUserData();
  // Merge with defaults so new fields introduced later don't break old saves
  const defaults = defaultUserData();
  return {
    ...defaults,
    ...data,
    settings: { ...defaults.settings, ...(data.settings || {}) },
    profile: { ...defaults.profile, ...(data.profile || {}) },
  };
}

export function saveUserData(username, data) {
  if (!isBrowser() || !username) return;
  window.localStorage.setItem(USERDATA_PREFIX + username, JSON.stringify(data));
}

export function deleteUserData(username) {
  if (!isBrowser() || !username) return;
  window.localStorage.removeItem(USERDATA_PREFIX + username);
}
