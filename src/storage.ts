import { CacheStorage, StorageKeys } from '@budgeet/shared';

export const cacheClient: CacheStorage = {
  async getItem<T>(key: StorageKeys) {
    const item = sessionStorage.getItem(key);

    if (item) {
      try {
        return JSON.parse(atob(item)) as T;
      } catch (e) {}
    }

    return undefined;
  },

  async setItem<T>(key: StorageKeys, item: T) {
    sessionStorage.setItem(key, btoa(JSON.stringify(item)));
  },

  async clearItem(key: StorageKeys) {
    sessionStorage.removeItem(key);
  },
};
