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
