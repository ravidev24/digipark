export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api/parking";
export const AUTH_URL = process.env.REACT_APP_AUTH_URL || "http://localhost:5001/api/auth";

export const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
