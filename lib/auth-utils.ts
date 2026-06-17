/** Normalizes email/phone identifiers before auth API calls. */
export function normalizeAuthIdentifier(identifier: string): string {
  const trimmed = identifier.trim();

  if (/^\+989\d{9}$/.test(trimmed)) {
    return `0${trimmed.slice(3)}`;
  }

  if (/^989\d{9}$/.test(trimmed)) {
    return `0${trimmed.slice(2)}`;
  }

  return trimmed;
}

type JwtPayload = Record<string, unknown>;

/** Decodes a JWT payload without verifying the signature (client-side id extraction). */
export function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json =
      typeof window !== "undefined"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const id = payload.id ?? payload._id ?? payload.userId;
  return id != null ? String(id) : null;
}
