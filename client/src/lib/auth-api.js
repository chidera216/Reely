const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function authRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong.");

    error.status = response.status;
    error.field = data.field;

    throw error;
  }

  return data;
}
