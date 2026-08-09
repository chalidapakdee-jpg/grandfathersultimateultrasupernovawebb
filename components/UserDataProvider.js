"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getUserData, saveUserData, defaultUserData } from "@/lib/storage";
import { priceFor, itemKey } from "@/lib/avatarItems";

const UserDataContext = createContext(null);

const FONT_SCALES = {
  small: 0.9,
  medium: 1,
  large: 1.2,
  xlarge: 1.45,
};

export function UserDataProvider({ children }) {
  const { currentUser } = useAuth();
  const [data, setData] = useState(defaultUserData());
  const [ready, setReady] = useState(false);

  // Load this account's data whenever who's signed in changes
  useEffect(() => {
    if (currentUser) {
      setData(getUserData(currentUser));
    } else {
      setData(defaultUserData());
    }
    setReady(true);
  }, [currentUser]);

  // Persist on every change
  useEffect(() => {
    if (currentUser && ready) {
      saveUserData(currentUser, data);
    }
  }, [currentUser, data, ready]);

  // Apply the chosen font size app-wide via a CSS variable
  useEffect(() => {
    if (typeof document === "undefined") return;
    const scale = FONT_SCALES[data.settings.fontSize] ?? 1;
    document.documentElement.style.setProperty("--font-scale", String(scale));
  }, [data.settings.fontSize]);

  const addSessionRecord = useCallback((session) => {
    setData((prev) => ({
      ...prev,
      points: prev.points + session.points,
      history: [
        { id: `${Date.now()}`, ...session },
        ...prev.history,
      ].slice(0, 200),
    }));
  }, []);

  const updateSettings = useCallback((partial) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...partial } }));
  }, []);

  const updateProfile = useCallback((categoryKey, optionIndex) => {
    setData((prev) => ({
      ...prev,
      profile: { ...prev.profile, [categoryKey]: optionIndex },
    }));
  }, []);

  const purchaseItem = useCallback((categoryKey, optionIndex) => {
    const key = itemKey(categoryKey, optionIndex);
    const price = priceFor(optionIndex);
    let result = { ok: false, error: "แต้มไม่พอ" };
    setData((prev) => {
      if (prev.ownedItems.includes(key)) {
        result = { ok: true };
        return prev;
      }
      if (prev.points < price) {
        result = { ok: false, error: "แต้มไม่พอ" };
        return prev;
      }
      result = { ok: true };
      return {
        ...prev,
        points: prev.points - price,
        ownedItems: [...prev.ownedItems, key],
      };
    });
    return result;
  }, []);

  const clearHistory = useCallback(() => {
    setData((prev) => ({ ...prev, history: [] }));
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        ...data,
        ready,
        addSessionRecord,
        updateSettings,
        updateProfile,
        purchaseItem,
        clearHistory,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
}
