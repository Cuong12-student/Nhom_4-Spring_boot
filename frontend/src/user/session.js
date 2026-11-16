const SESSION_KEY = "hiensach.customer";

export function getSessionUser() {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored);
    return typeof user.username === "string" && user.username ? user : null;
  } catch (error) {
    console.error("Không thể đọc thông tin phiên đăng nhập:", error);
    return null;
  }
}

export function setSessionUser(user) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("session-updated"));
}

export function clearSessionUser() {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("session-updated"));
}
export async function validateSession() {
  const user = getSessionUser();

  if (!user?.token) {
    clearSessionUser();
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.status === 401) {
      clearSessionUser();
      return false;
    }

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Không thể kiểm tra phiên đăng nhập:", error);
    return false;
  }
}
