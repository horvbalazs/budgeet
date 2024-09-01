import { CacheStorage, StorageKeys } from '@budgeet/shared';

export const cacheClient: CacheStorage = {
  getItem<T>(key: StorageKeys) {
    const item = sessionStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(atob(item)) as T;
      } catch (e) {}
    }

    return undefined;
  },

  setItem<T>(key: StorageKeys, item: T) {
    sessionStorage.setItem(key, btoa(JSON.stringify(item)));
  },

  clearItem(key: StorageKeys) {
    sessionStorage.removeItem(key);
  },
};
