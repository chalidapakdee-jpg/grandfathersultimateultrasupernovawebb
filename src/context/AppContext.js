"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  updateCurrentUser,
  deleteCurrentUser,
  addHistoryRecord,
  clearHistory,
} from "@/lib/storage";
import { FONT_SCALES } from "@/lib/constants";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
  }, []);

  useEffect(() => {
    const scale = FONT_SCALES[user?.fontSize || "lg"];
    if (typeof document !== "undefined" && scale) {
      document.documentElement.style.setProperty("--base-font-size", scale.rem);
    }
  }, [user?.fontSize]);

  const login = useCallback((username, password) => {
    const res = loginUser(username, password);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const register = useCallback((username, password) => {
    const res = registerUser(username, password);
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateUser = useCallback((updater) => {
    const next = updateCurrentUser(updater);
    setUser(next);
    return next;
  }, []);

  const deleteAccount = useCallback(() => {
    deleteCurrentUser();
    setUser(null);
  }, []);

  const recordSession = useCallback((record) => {
    const next = addHistoryRecord(record);
    setUser(next);
    return next;
  }, []);

  const wipeHistory = useCallback(() => {
    const next = clearHistory();
    setUser(next);
    return next;
  }, []);

  const spendCoins = useCallback(
    (amount, categoryKey, optionId) => {
      return updateUser((u) => {
        if (u.coins < amount) return {};
        if (u.inventory.includes(optionId)) return {};
        return {
          coins: u.coins - amount,
          inventory: [...u.inventory, optionId],
        };
      });
    },
    [updateUser]
  );

  const equipItem = useCallback(
    (categoryKey, optionId) => {
      return updateUser((u) => ({ avatar: { ...u.avatar, [categoryKey]: optionId } }));
    },
    [updateUser]
  );

  const value = {
    user,
    ready,
    isAuthed: !!user,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    recordSession,
    wipeHistory,
    spendCoins,
    equipItem,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
