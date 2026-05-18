export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const getApiUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const getAssetUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return getApiUrl(path);
};

export const apiFetch = async (
  url: string,
  accessToken: string | null,
  setAccessToken: (t: string | null) => void,
  options: RequestInit = {},
): Promise<unknown> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
    credentials: "include",
  });

  if (res.status === 401 && !url.includes("/auth/refresh")) {
    const refreshRes = await fetch(getApiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      setAccessToken(null);
      window.location.href = "/login";
      throw new Error("Session expired");
    }

    const data = await refreshRes.json();
    setAccessToken(data.accessToken);

    return apiFetch(url, data.accessToken, setAccessToken, options);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      status: res.status,
      message: data?.message,
      data,
    };
  }

  return data;
};
