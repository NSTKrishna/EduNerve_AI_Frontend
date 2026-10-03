/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, TOKEN_KEY, authAPI, setSessionExpiredHandler, tokenAPI } from "../lib/api";

const PROFILE_CACHE_KEY = "cachedProfile";

const storage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode etc. - the session just won't survive a reload */
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

const readCachedProfile = () => {
  try {
    return JSON.parse(storage.get(PROFILE_CACHE_KEY));
  } catch {
    return null;
  }
};

const LearnerContext = createContext(null);

export function LearnerProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((next) => {
    setUserState(next);
    if (next) storage.set(PROFILE_CACHE_KEY, JSON.stringify(next));
    else storage.remove(PROFILE_CACHE_KEY);
  }, []);

  const logout = useCallback(() => {
    storage.remove(TOKEN_KEY);
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    setSessionExpiredHandler(logout);
    return () => setSessionExpiredHandler(null);
  }, [logout]);

  // Restore the session on page load.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!storage.get(TOKEN_KEY)) {
        setLoading(false);
        return;
      }
      try {
        const { user: profile } = await authAPI.getProfile();
        if (!cancelled) setUser(profile);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 0) {
          // Server unreachable: keep the user signed in with the last known profile.
          const cached = readCachedProfile();
          if (cached) setUserState(cached);
          else storage.remove(TOKEN_KEY);
        } else {
          logout(); // 401 (handled globally) or the account no longer exists
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restore();
    return () => {
      cancelled = true;
    };
  }, [logout, setUser]);

  const startSession = useCallback(
    ({ user: profile, token }) => {
      storage.set(TOKEN_KEY, token);
      setUser(profile);
    },
    [setUser],
  );

  // Auth actions resolve to { success, error } so forms can show the message without try/catch.
  const login = useCallback(
    async (email, password) => {
      try {
        startSession(await authAPI.login({ email, password }));
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [startSession],
  );

  const signup = useCallback(
    async ({ name, email, password }) => {
      try {
        startSession(await authAPI.register({ name, email, password }));
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [startSession],
  );

  const updateProfile = useCallback(
    async (changes) => {
      const { user: updated } = await authAPI.updateProfile(changes);
      setUser(updated);
      return updated;
    },
    [setUser],
  );

  const refreshUser = useCallback(async () => {
    try {
      const { user: profile } = await authAPI.getProfile();
      setUser(profile);
    } catch {
      /* a stale profile is fine; session expiry is handled globally */
    }
  }, [setUser]);

  /** Apply a balance we already know (e.g. from /start-interview) without another request. */
  const setTokens = useCallback(
    (tokens) => setUserState((prev) => (prev ? { ...prev, tokens } : prev)),
    [],
  );

  const refreshTokens = useCallback(async () => {
    try {
      const { tokensRemaining } = await tokenAPI.getBalance();
      setTokens(tokensRemaining);
    } catch {
      /* the chip keeps showing the last known balance */
    }
  }, [setTokens]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      tokens: user ? user.tokens : null,
      login,
      signup,
      logout,
      updateProfile,
      refreshUser,
      setTokens,
      refreshTokens,
    }),
    [user, loading, login, signup, logout, updateProfile, refreshUser, setTokens, refreshTokens],
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) throw new Error("useLearner must be used within LearnerProvider");
  return context;
}
