import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);
const AUTH_KEY = "tw-auth";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch (e) {
    return null;
  }
}

function saveUser(user) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    // ignore
  }
}

function clearUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: "login" });

  const openAuthModal = useCallback((tab) => {
    setAuthModal({ isOpen: true, tab: tab || "login" });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal((s) => ({ ...s, isOpen: false }));
  }, []);

  const setAuthTab = useCallback((tab) => {
    setAuthModal((s) => ({ ...s, tab }));
  }, []);

  const login = useCallback((nextUser) => {
    setUser(nextUser);
    saveUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthModalOpen: authModal.isOpen,
        authModalTab: authModal.tab,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
