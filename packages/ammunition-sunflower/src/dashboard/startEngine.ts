import { isFunction } from 'toolkit';

import store from 'store';

import { startOptions, cacheOptions } from 'constant';

import {
  mergeOptions,
  importHTML,
  processCssLoader
} from 'toolkit';

import { getPlugins } from 'plugin';

import App from 'core/app';

const successorTask = async (appName: string, options: startOptions, effectiveOptions: cacheOptions) => {
  const isHasCache = store.hasCacheByName(appName);

  if (!isHasCache) return false;

  const appInstance: App = store.getInstanceByName(appName);

  if (!appInstance) return false;

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
  } else if (iframeWindow.__MOUNTER__ && isFunction(iframeWindow.__MOUNTER__)) {
    appInstance.unmount();

    await appInstance.activeApp({ url, sync, prefix, el, props, alive, fetch, replaceCode });

    appInstance.lifecycles.beforeMount(iframeWindow);

    iframeWindow.__MOUNTER__();

    appInstance.lifecycles.afterMount(iframeWindow);

    appInstance.mountFlag = true;

    appInstance.rebuildStyleSheets();

    return appInstance.destroy;
  } else {
    appInstance.destroy(); 
  }

  return false;
};

const trailblazerTask = async (appName: string, options: startOptions, effectiveOptions: cacheOptions) => {
  const { name, url, attrs, fiber, degrade, plugins, lifecycles, sync, prefix, el, props, alive, replaceCode } = effectiveOptions;

  const nextAppInstance = new App({ name, url, attrs, fiber, degrade, plugins, lifecycles });

  const nextIframeWindow = nextAppInstance.iframe.contentWindow;

  nextAppInstance.lifecycles?.beforeLoad?.(nextIframeWindow);

  const { template, getExternalScripts, getExternalStyleSheets } = await importHTML(url, {
    fetch: fetch || window.fetch,
    plugins: nextAppInstance.plugins,
    loadError: nextAppInstance.lifecycles.loadError,
    fiber,
  });

  const processedHtml = await processCssLoader(nextAppInstance, template, getExternalStyleSheets);
  await nextAppInstance.active({ url, sync, prefix, template: processedHtml, el, props, alive, fetch, replaceCode });
  await nextAppInstance.start(getExternalScripts);
  return nextAppInstance.destroy;
};

const startEngine = async (options: startOptions) => {

  const appName = options?.name;

  const cacheOptions = store.getOptionsByName(appName);

  const effectiveOptions = mergeOptions(options, cacheOptions);

  const taskRes = await successorTask(appName, options, effectiveOptions);

  if (taskRes === false) {
    trailblazerTask(appName, options, effectiveOptions);
  }
};

export default startEngine;