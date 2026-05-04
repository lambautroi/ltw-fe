import { getToken, clearAuth } from "./authStorage";

export const PHOTO_LIST_CHANGED = "photoSharing:photosChanged";

function getBaseUrl() {
  let BASE_URL = process.env.REACT_APP_API_URL;
  if (!BASE_URL) {
    BASE_URL = "http://localhost:3001";
  }
  return BASE_URL.replace(/\/$/, "");
}

export function getApiBaseUrl() {
  return getBaseUrl();
}

export function imageUrlForFileName(fileName) {
  if (!fileName) return "";
  return getBaseUrl() + "/images/" + encodeURIComponent(fileName);
}

export async function uploadPhoto(file) {
  const BASE_URL = getBaseUrl();
  const token = getToken();
  const fd = new FormData();
  fd.append("photo", file);
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(BASE_URL + "/photos/new", {
    method: "POST",
    headers,
    body: fd,
  });
  if (response.status === 401) {
    clearAuth();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
    throw new Error("Phien dang nhap het han.");
  }
  const contentType = response.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const msg =
      typeof data === "object" && data !== null && data.error
        ? data.error
        : "Tai anh that bai.";
    throw new Error(msg);
  }
  return data;
}

async function fetchModel(url, options = {}) {
  const { method = "GET", body, skipAuth = false } = options;
  const BASE_URL = getBaseUrl();
  const fullUrl = BASE_URL + url;

  const headers = { Accept: "application/json" };
  if (body !== undefined && method !== "GET") {
    headers["Content-Type"] = "application/json";
  }
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = "Bearer " + token;
    }
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !skipAuth) {
    clearAuth();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
    throw new Error("Phien dang nhap het han.");
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const msg =
      typeof data === "object" && data !== null && data.error
        ? data.error
        : "Loi API: " + response.status;
    throw new Error(msg);
  }

  return data;
}

export default fetchModel;
