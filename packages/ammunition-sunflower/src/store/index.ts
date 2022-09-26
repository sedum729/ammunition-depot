export interface IStore {
  sandboxCacheMap: Map<any, any>;

  getInstanceById: (appId: string) => any;
}

class Store implements IStore {

  // 存储所有应用实例
  sandboxCacheMap = new Map();

  // 通过id获取应用实例
  getInstanceById(appId: string) {
    const appInstance = this.sandboxCacheMap.get(appId);

    return appInstance?.app;
  }
}

export default new Store();