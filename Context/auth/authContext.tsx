"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const authTokenChangeEvent = "auth-token-change";

const subscribeToAuthToken = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(authTokenChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(authTokenChangeEvent, callback);
  };
};

const getAccessTokenSnapshot = () => window.localStorage.getItem("accessToken");
const getServerAccessTokenSnapshot = () => null;
const getReadySnapshot = () => true;
const getServerReadySnapshot = () => false;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useSyncExternalStore(
    subscribeToAuthToken,
    getAccessTokenSnapshot,
    getServerAccessTokenSnapshot,
  );
  const isReady = useSyncExternalStore(
    subscribeToAuthToken,
    getReadySnapshot,
    getServerReadySnapshot,
  );

  const setAccessToken = (token: string | null) => {
    if (token) {
      window.localStorage.setItem("accessToken", token);
    } else {
      window.localStorage.removeItem("accessToken");
    }
    window.dispatchEvent(new Event(authTokenChangeEvent));
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
