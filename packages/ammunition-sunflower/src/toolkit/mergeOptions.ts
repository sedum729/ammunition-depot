import { cacheOptions } from 'constant';

export function mergeOptions(options: cacheOptions, cacheOptions: cacheOptions) {
  return {
    name: options.name,
    el: options.el || cacheOptions?.el,
    url: options.url || cacheOptions?.url,
    exec: options.exec !== undefined ? options.exec : cacheOptions?.exec,
    replace: options.replaceCode || cacheOptions?.replaceCode,
    fetch: options.fetch || cacheOptions?.fetch,
    props: options.props || cacheOptions?.props,
    sync: options.sync !== undefined ? options.sync : cacheOptions?.sync,
    prefix: options.prefix || cacheOptions?.prefix,
    loading: options.loading || cacheOptions?.loading,
    // 默认 {}
    attrs: options.attrs !== undefined ? options.attrs : cacheOptions?.attrs || {},
    // 默认 true
    fiber: options.fiber !== undefined ? options.fiber : cacheOptions?.fiber !== undefined ? cacheOptions?.fiber : true,
    alive: options.alive !== undefined ? options.alive : cacheOptions?.alive,
    degrade: options.degrade !== undefined ? options.degrade : cacheOptions?.degrade,
    plugins: options.plugins || cacheOptions?.plugins,
    lifecycles: {
      beforeLoad: options.beforeLoad || cacheOptions?.beforeLoad,
      beforeMount: options.beforeMount || cacheOptions?.beforeMount,
      afterMount: options.afterMount || cacheOptions?.afterMount,
      beforeUnmount: options.beforeUnmount || cacheOptions?.beforeUnmount,
      afterUnmount: options.afterUnmount || cacheOptions?.afterUnmount,
      activated: options.activated || cacheOptions?.activated,
      deactivated: options.deactivated || cacheOptions?.deactivated,
      loadError: options.loadError || cacheOptions?.loadError,
    },
  };
}