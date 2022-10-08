import { cacheOptions } from 'constant';
import store from 'store';

export const setAppInstanceCacheWithOptiopns = (appName: string, options: cacheOptions) => {
  const prevCache = store.getInstanceByName(appName);

  let nextCache = options;

  if (prevCache) {
    nextCache = Object.assign({}, prevCache, nextCache);
  }

  store.setInstanceByName(appName, nextCache);
}