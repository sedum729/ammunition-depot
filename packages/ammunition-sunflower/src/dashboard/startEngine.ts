import store from 'store';

import { startOptions } from 'constant';

import {
  mergeOptions,
  importHTML
} from 'toolkit';

import { getPlugins } from 'plugin';

import App from 'core/app';

const successorTask = async (appName: string, options: startOptions) => {
  const isHasCache = store.hasCacheByName(appName);

  if (!isHasCache) return false;

  const appInstance: App = store.getInstanceByName(appName);

  if (!appInstance) return false;

  const cacheOptions = store.getOptionsByName(appName);

  const effectiveOptions = mergeOptions(options, cacheOptions);

  const { plugins, lifecycles, fiber, alive, url, sync, prefix, el, props, fetch, replaceCode } = effectiveOptions;

  appInstance.plugins = getPlugins(plugins);

  appInstance.lifecycles = lifecycles;

  const iframeWindow = appInstance.iframe.contentWindow;

  if (appInstance?.preload) {
    await Promise.resolve(appInstance?.preload);
  }

  if (alive) {
    await appInstance.activeApp({ url, sync, prefix, el, props, alive, fetch, replaceCode });

    if (!appInstance.execFlag) {
      appInstance.lifecycles?.beforeLoad?.(iframeWindow);

      const { getExternalScripts } = await importHTML(url, {
        fetch,
        plugins: appInstance.plugins,
        loadError: appInstance.lifecycles.loadError,
        fiber
      });

      await appInstance.start(getExternalScripts);
    }

    appInstance.lifecycles?.activated?.(iframeWindow);

    return appInstance.destroy;
  }

  if (iframeWindow.__MOUNTER__) {
    appInstance.unmount();
  }

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