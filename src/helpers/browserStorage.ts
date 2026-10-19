export const createSafeStorage = (storage: () => Storage) => {
  const memory = new Map<string, string | null>();
  const pending = new Set<string>();
  return {
    getItem(key: string): string | null {
      if (pending.has(key)) return memory.get(key) ?? null;
      try {
        return storage().getItem(key);
      } catch {
        return memory.get(key) ?? null;
      }
    },
    setItem(key: string, value: string): void {
      memory.set(key, value);
      try {
        storage().setItem(key, value);
        pending.delete(key);
      } catch {
        pending.add(key);
      }
    },
    removeItem(key: string): void {
      memory.set(key, null);
      try {
        storage().removeItem(key);
        pending.delete(key);
      } catch {
        pending.add(key);
      }
    },
  };
};

export const safeLocalStorage = createSafeStorage(() => window.localStorage);
export const safeSessionStorage = createSafeStorage(() => window.sessionStorage);
