import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { authRequest } from "../lib/auth-api";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Restore the user's session when the app starts.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const data = await authRequest("/me");

        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const isAuthenticated = Boolean(user);

  function requireAuth() {
    setAuthModalOpen(true);
  }

  function closeAuth() {
    setAuthModalOpen(false);
  }

  // Log in through the backend.
  async function login(credentials) {
    const data = await authRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    setUser(data.user);
    setAuthModalOpen(false);

    return data.user;
  }

  // Create an account through the backend.
  async function signup(details) {
    const data = await authRequest("/signup", {
      method: "POST",
      body: JSON.stringify(details),
    });

    setUser(data.user);
    setAuthModalOpen(false);

    return data.user;
  }

  // Log out through the backend and clear frontend state.
  async function logout() {
    try {
      await authRequest("/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
      setAuthModalOpen(false);
    }
  }

  // Update frontend state only.
  // Persistent profile updates will use a separate API endpoint.
  function updateUser(updates) {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      return {
        ...currentUser,
        ...updates,
      };
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        authModalOpen,
        requireAuth,
        closeAuth,
        login,
        signup,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
