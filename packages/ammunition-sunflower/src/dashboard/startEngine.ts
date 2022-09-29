import store from 'store';

import { startOptions, cacheOptions } from 'constant';

import { mergeOptions } from 'toolkit';

import App from 'core/app';

const successorTask = async (appName: string, options: startOptions) => {
  const isHasCache = store.hasCacheByName(appName);

  if (!isHasCache) return false;

  const appInstance: App = store.getInstanceByName(appName);

  if (!appInstance) return false;

  const cacheOptions = store.getOptionsByName(appName);

  const effectiveOptions: cacheOptions = mergeOptions(options, cacheOptions);

  const { plugins } = effectiveOptions;

  // appInstance.plugins = 

  return true;
};

const trailblazerTask = (appName: string, options: startOptions) => {
  
};

const startEngine = (options: startOptions) => {

  const appName = options?.name;

  successorTask(appName, options);

  trailblazerTask(appName, options);

};

export default startEngine;