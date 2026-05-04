import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchModel from "../lib/fetchModelData";
import { clearAuth, getStoredUser, getToken, setStoredUser, setToken } from "../lib/authStorage";

const AuthContext = createContext(null);

function persistSession(data) {
  if (!data.token) {
    throw new Error("Phan hoi khong co token.");
  }
  setToken(data.token);
  setStoredUser(data.user || null);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());

  const login = useCallback(
    async function (login_name, password) {
      const data = await fetchModel("/admin/login", {
        method: "POST",
        body: { login_name, password },
        skipAuth: true,
      });
      persistSession(data);
      setTokenState(data.token);
      setUser(data.user || null);
      navigate("/", { replace: true });
    },
    [navigate]
  );

  const register = useCallback(
    async function (payload) {
      const data = await fetchModel("/user", {
        method: "POST",
        body: payload,
        skipAuth: true,
      });
      persistSession(data);
      setTokenState(data.token);
      setUser(data.user || null);
      navigate("/", { replace: true });
    },
    [navigate]
  );

  const logout = useCallback(
    async function () {
      try {
        await fetchModel("/admin/logout", { method: "POST" });
      } catch (_) {}
      clearAuth();
      setTokenState(null);
      setUser(null);
      navigate("/login", { replace: true });
    },
    [navigate]
  );

  const value = useMemo(
    function () {
      return { token, user, login, register, logout, isAuthenticated: Boolean(token) };
    },
    [token, user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth phai dung ben trong AuthProvider");
  }
  return ctx;
}
