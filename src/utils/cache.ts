const store = new Map<string, { data: any; expiry: number }>();

export function getCached<T>(key: string, ttlMs: number): T | null {
  const entry = store.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data as T;
  store.delete(key);
  return null;
}

export function setCache(key: string, data: any, ttlMs: number) {
  store.set(key, { data, expiry: Date.now() + ttlMs });
}

export function clearCache(prefix?: string) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
