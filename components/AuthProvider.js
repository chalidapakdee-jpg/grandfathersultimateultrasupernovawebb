"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getUsers,
  saveUsers,
  getSession,
  setSession,
  clearSession,
  deleteUserData,
} from "@/lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = getSession();
    if (existing) setCurrentUser(existing);
    setLoading(false);
  }, []);

  const register = useCallback((username, password) => {
    const clean = username.trim();
    if (!clean || !password) {
      return { ok: false, error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
    }
    const users = getUsers();
    if (users[clean]) {
      return { ok: false, error: "มีชื่อผู้ใช้นี้อยู่แล้ว" };
    }
    users[clean] = password;
    saveUsers(users);
    setSession(clean);
    setCurrentUser(clean);
    return { ok: true };
  }, []);

  const login = useCallback((username, password) => {
    const clean = username.trim();
    const users = getUsers();
    if (!users[clean] || users[clean] !== password) {
      return { ok: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }
    setSession(clean);
    setCurrentUser(clean);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const deleteAccount = useCallback(() => {
    if (!currentUser) return;
    const users = getUsers();
    delete users[currentUser];
    saveUsers(users);
    deleteUserData(currentUser);
    clearSession();
    setCurrentUser(null);
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, register, login, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
