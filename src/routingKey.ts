const STORAGE_KEY = 'looply-routing-key';
let memoryKey: string | undefined;
export function getRoutingKey(): string {
  if (memoryKey !== undefined) return memoryKey;
  try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
}
export function setRoutingKey(value: string): boolean {
  const key = value.trim();
  if (key && !/^[\x21-\x7E]{10,4096}$/.test(key)) throw Error('Plak de volledige API-sleutel, zonder spaties (10–4096 tekens).');
  memoryKey = key;
  try { if (key) sessionStorage.setItem(STORAGE_KEY, key); else sessionStorage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
export function routingHeaders(key = getRoutingKey()): Record<string, string> {
  return { 'Content-Type': 'application/json', ...(key ? { 'X-ORS-API-Key': key } : {}) };
}
