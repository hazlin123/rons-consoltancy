export const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, init);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
