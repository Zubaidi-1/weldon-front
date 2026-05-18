"use client";

import { apiFetch } from "@/config/api";
import { useAuth } from "@/Context/auth/authContext";

export const useApi = () => {
  const { accessToken, setAccessToken } = useAuth();

  return (url: string, options?: RequestInit) =>
    apiFetch(url, accessToken, setAccessToken, options);
};
