import store from 'store';

import App from 'core/app';

import { preHeatOptions } from 'constant';

import { requestIdleCallback, isMatchSyncQueryById, mergeOptions, processCssLoader, importHTML } from 'toolkit';

const preHeatAction = (preHeatOptions: preHeatOptions) => {
  const prevAppName = preHeatOptions?.name;
  const prevAppInstance = store.getInstanceByName(prevAppName);

  if (prevAppInstance || isMatchSyncQueryById(prevAppName)) return;

  const cacheOptions = store.getOptionsByName(prevAppName);
  const options = mergeOptions(preHeatOptions, cacheOptions);
  const { name, url, props, alive, replaceCode, fetch, exec, attrs, fiber, degrade, prefix, plugins, lifecycles } =
  options;

  const appInstance = new App({ name, url, attrs, fiber, degrade, plugins, lifecycles });
  if (appInstance.preload) return appInstance.preload;

  const runner = async () => {
    appInstance.lifecycles?.beforeLoad?.(appInstance.iframe.contentWindow);
    const { template, getExternalScripts, getExternalStyleSheets } = await importHTML(url, {
      fetch: fetch || window.fetch,
      plugins: appInstance.plugins,
      loadError: appInstance.lifecycles.loadError,
      fiber,
    });
    const processedHtml = await processCssLoader(appInstance, template, getExternalStyleSheets);
    await appInstance.active({ url, props, prefix, alive, template: processedHtml, fetch, replaceCode });
    if (exec) {
      await appInstance.start(getExternalScripts);
    }
  };
  appInstance.preload = runner();

  return appInstance.preload;
};

const preHeatEngine = (preHeatOptions: preHeatOptions) => {
  requestIdleCallback(preHeatAction.bind(null, preHeatAction));
};

export default preHeatEngine;
