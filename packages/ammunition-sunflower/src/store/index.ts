import { cacheOptions } from 'constant';

import App from 'core/app';

type TypeSandboxCacheMap = Map<String, {
  app?: App;
  options?: cacheOptions;
}>;

export interface IStore {
  sandboxCacheMap: TypeSandboxCacheMap;

  getInstanceById: (appId: string) => any;
}

class Store implements IStore {

  // 存储所有应用实例
  sandboxCacheMap = new Map();

  // 通过id获取应用实例
  getInstanceById(appId: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appId);

    return appInstanceInfoField?.app || {};
  }

  getOptionsById(appId: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appId);

    return appInstanceInfoField?.options || {};
  }
}

export default new Store();