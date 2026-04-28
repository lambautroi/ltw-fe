import { getToken, clearAuth } from "./authStorage";

/**
 * Lấy base URL API (CRA: REACT_APP_API_URL).
 */
function getBaseUrl() {
  let BASE_URL = process.env.REACT_APP_API_URL;
  if (!BASE_URL) {
    if (window.location.hostname.includes("csb.app")) {
      BASE_URL = "https://hnzt3m-3000.csb.app";
    } else {
      BASE_URL = "http://localhost:3000";
    }
  }
  return BASE_URL.replace(/\/$/, "");
}

/** Sự kiện khi upload ảnh thành công (listener ở UserPhotos). */
export const PHOTO_LIST_CHANGED = "photoSharing:photosChanged";

export function getApiBaseUrl() {
  return getBaseUrl();
}

/** URL tải ảnh qua backend (GET /images/:file trên cùng API base). */
export function imageUrlForFileName(fileName) {
  if (!fileName) return "";
  return getBaseUrl() + "/images/" + encodeURIComponent(fileName);
}

/**
 * POST /photos/new — multipart field "photo".
 * @returns {Promise<object>} đối tượng Photo đã tạo
 */
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
    throw new Error("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
  }
  const contentType = response.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const msg =
      typeof data === "object" && data !== null && data.error
        ? data.error
        : "Tải ảnh thất bại.";
    throw new Error(msg);
  }
  return data;
}

/**
 * Gọi API (mặc định GET). Gửi Bearer token trừ khi skipAuth: true.
 *
 * @param {string} url  Đường dẫn tương đối, ví dụ "/user/list"
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object} [options.body]  Object sẽ được JSON.stringify
 * @param {boolean} [options.skipAuth]  Không gửi token (dùng cho /admin/login, /admin/register)
 */
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
    throw new Error("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
  }

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const msg =
      typeof data === "object" && data !== null && data.error
        ? data.error
        : "Lỗi API: " + response.status + " " + response.statusText;
    throw new Error(msg);
  }

  return data;
}

export default fetchModel;
