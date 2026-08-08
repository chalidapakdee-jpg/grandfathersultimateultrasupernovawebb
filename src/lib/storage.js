"use client";

/**
 * Front-end-only "database".
 * Everything lives in localStorage under one key. There is no server, so
 * this data does NOT sync between devices — see README.md for what a
 * real backend would need to add for true cross-device login.
 */

const DB_KEY = "gfusw_db_v1";

const STARTER_AVATAR = {
  body: "body_tan",
  head: "head_round",
  hair: "hair_silver",
  face: "face_smile",
  outfit: "outfit_matcha_shirt",
  accessory: "accessory_none",
};

function emptyDB() {
  return { users: [], currentUserId: null };
}

export function getDB() {
  if (typeof window === "undefined") return emptyDB();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return emptyDB();
    const parsed = JSON.parse(raw);
    if (!parsed.users) return emptyDB();
    return parsed;
  } catch (e) {
    return emptyDB();
  }
}

export function saveDB(db) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function findUserByUsername(db, username) {
  const uname = username.trim().toLowerCase();
  return db.users.find((u) => u.username.toLowerCase() === uname) || null;
}

export function registerUser(username, password) {
  const db = getDB();
  if (!username.trim() || !password) {
    return { ok: false, error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน" };
  }
  if (findUserByUsername(db, username)) {
    return { ok: false, error: "มีชื่อผู้ใช้นี้อยู่แล้ว กรุณาเลือกชื่ออื่น" };
  }
  const user = {
    id: makeId("u"),
    username: username.trim(),
    password, // demo only — see README security note
    fontSize: "lg",
    totalPoints: 0,
    coins: 0,
    history: [],
    avatar: { ...STARTER_AVATAR },
    inventory: Object.values(STARTER_AVATAR),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  db.currentUserId = user.id;
  saveDB(db);
  return { ok: true, user };
}

export function loginUser(username, password) {
  const db = getDB();
  const user = findUserByUsername(db, username);
  if (!user || user.password !== password) {
    return { ok: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  }
  db.currentUserId = user.id;
  saveDB(db);
  return { ok: true, user };
}

export function logoutUser() {
  const db = getDB();
  db.currentUserId = null;
  saveDB(db);
}

export function getCurrentUser() {
  const db = getDB();
  if (!db.currentUserId) return null;
  return db.users.find((u) => u.id === db.currentUserId) || null;
}

/** updater: (user) => partialChanges (object merged onto user) */
export function updateCurrentUser(updater) {
  const db = getDB();
  const idx = db.users.findIndex((u) => u.id === db.currentUserId);
  if (idx === -1) return null;
  const current = db.users[idx];
  const changes = typeof updater === "function" ? updater(current) : updater;
  const next = { ...current, ...changes };
  db.users[idx] = next;
  saveDB(db);
  return next;
}

export function deleteCurrentUser() {
  const db = getDB();
  db.users = db.users.filter((u) => u.id !== db.currentUserId);
  db.currentUserId = null;
  saveDB(db);
}

export function addHistoryRecord(record) {
  return updateCurrentUser((user) => {
    const entry = {
      id: makeId("h"),
      date: new Date().toISOString(),
      ...record,
    };
    return {
      history: [entry, ...user.history],
      totalPoints: Math.min(3000000, user.totalPoints + record.pointsEarned),
      coins: user.coins + record.pointsEarned,
    };
  });
}

export function clearHistory() {
  return updateCurrentUser(() => ({ history: [] }));
}

export function getAllUsersForLeaderboard() {
  const db = getDB();
  return db.users.map((u) => ({ id: u.id, username: u.username, totalPoints: u.totalPoints, avatar: u.avatar }));
}
