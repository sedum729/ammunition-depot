import { cacheOptions } from 'constant';

import App from 'core/app';

type TypeSandboxCacheMap = Map<String, {
  app?: App;
  options?: cacheOptions;
}>;

export interface IStore {
  sandboxCacheMap: TypeSandboxCacheMap;

  getInstanceByName: (appName: string) => App;

  hasCacheByName: (appName: string) => boolean;

  getOptionsByName: (appName: string) => cacheOptions;
}

class Store implements IStore {

  // 存储所有应用实例
  sandboxCacheMap = new Map();

  hasCacheByName(appName: string) {
    return this.sandboxCacheMap.has(appName);
  }

  getInstanceByName(appName: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appName);

    return appInstanceInfoField?.app || {};
  }

  getOptionsByName(appName: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appName);

    return appInstanceInfoField?.options || {};
  }
}

export default new Store();