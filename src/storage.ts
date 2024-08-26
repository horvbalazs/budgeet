export enum StorageKeys {
  USER = 'user',
  CHART_PREFERENCES = 'chart_prefs',
  UPLOAD_OPTIONS = 'upload_options',
}

export function setItem(key: StorageKeys, item: object) {
  sessionStorage.setItem(key, btoa(JSON.stringify(item)));
}

export function getItem<T>(key: StorageKeys): T | undefined {
  const item = sessionStorage.getItem(key);

  if (item) {
    try {
      return JSON.parse(atob(item));
    } catch (e) {}
  }

  return undefined;
}

export function removeItem(key: StorageKeys) {
  sessionStorage.removeItem(key);
}
