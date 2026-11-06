import { getSessionUser } from "../user/session";

const API_URL = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/admin`;

export async function adminRequest(path, options = {}) {
  const session = getSessionUser();
  if (!session?.token || session.role !== "ADMIN") {
    throw new Error("Vui lòng đăng nhập bằng tài khoản Admin.");
  }

  const headers = {
    Authorization: `Bearer ${session.token}`,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await response.text();
  let result = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = text;
    }
  }

  if (!response.ok) {
    const message = typeof result === "string" ? result : result?.detail ?? result?.message;
    throw new Error(message || `Yêu cầu thất bại (${response.status}).`);
  }

  return result;
}

export async function logoutAdminSession() {
  const session = getSessionUser();
  if (!session?.token) return;
  await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ""}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.token}` },
  });
}
