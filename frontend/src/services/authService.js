const API_URL = "http://localhost:8081/api/auth";

export const register = async (data) => {
  console.log("Register gửi lên backend:", data);

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const message = await response.text();

  if (!response.ok) {
    throw new Error(message || "Đăng ký thất bại");
  }

  return message;
};

export const login = async (data) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Đăng nhập thất bại");
  }

  return result;
};
