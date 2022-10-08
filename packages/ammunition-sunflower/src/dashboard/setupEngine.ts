import { cacheOptions } from 'constant';

import { setAppInstanceCacheWithOptiopns } from 'toolkit';

const setupEngine = (options: cacheOptions) => {

  const appName = options?.name;

  if (appName) {
    setAppInstanceCacheWithOptiopns(appName, options);
  }
};

export default setupEngine;
