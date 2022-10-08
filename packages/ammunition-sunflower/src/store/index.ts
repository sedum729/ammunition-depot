import { cacheOptions } from 'constant';

import App from 'core/app';

type TypeSandboxCacheMap = Map<String, {
  app?: App;
  options?: cacheOptions;
}>;

export interface IStore {
  sandboxCacheMap: TypeSandboxCacheMap;

  scriptCache: any;

  styleCache: any;

  embedHTMLCache: any;

  getInstanceByName: (appName: string) => App;

  hasCacheByName: (appName: string) => boolean;

  getOptionsByName: (appName: string) => cacheOptions;
}

export class Store implements IStore {

  // 存储所有应用实例
  sandboxCacheMap = new Map();

  scriptCache = {};

  styleCache = {};

  embedHTMLCache = {};

  hasCacheByName(appName: string) {
    return this.sandboxCacheMap.has(appName);
  }

  getInstanceByName(appName: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appName);

    return appInstanceInfoField?.app || {};
  }

  setInstanceByName(appName: string, values: any) {
    this.sandboxCacheMap.set(appName, values);
  }

  getOptionsByName(appName: string) {
    const appInstanceInfoField = this.sandboxCacheMap.get(appName);

    return appInstanceInfoField?.options || {};
  }

  setEmbedHTMLCache(url: string, cacheData) {
    this.embedHTMLCache[url] = cacheData;
  }
}

export default new Store();