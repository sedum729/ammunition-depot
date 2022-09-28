import store from 'store';

import { startOptions, cacheOptions } from 'constant';

const startEngine = (options: startOptions) => {
  const cacheOptions: cacheOptions = store.getOptionsById(options?.name);

  
  // 应用实例 (被缓存)
  const instance = store.getInstanceById(options?.name);
};

export default startEngine;