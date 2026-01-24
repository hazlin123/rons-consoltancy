export type Role = "admin" | "staff" | "reviewer";

const AUTH_KEY = "sp_auth";

export function login(username: string, role: Role = "admin") {
  // store minimal session info in sessionStorage (placeholder)
  const payload = { username, role, createdAt: Date.now() };
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function getSession() {
  const v = sessionStorage.getItem(AUTH_KEY);
  if (!v) return null;
  try {
    return JSON.parse(v) as { username: string; role: Role; createdAt: number };
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getSession() !== null;
}
