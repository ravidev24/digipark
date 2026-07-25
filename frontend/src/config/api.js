const API_BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5001").replace(/\/$/, "");

export const API_URL = process.env.REACT_APP_API_URL || `${API_BASE}/api/parking`;
export const AUTH_URL = process.env.REACT_APP_AUTH_URL || `${API_BASE}/api/auth`;

export const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
