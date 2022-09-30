import { plugin } from 'constant';

import { isArray } from 'toolkit';

export type effectiveLoadersType = "jsExcludes" | "cssExcludes" | "jsIgnores" | "cssIgnores";

export const getEffectiveLoadersFromPlugins = (plugins: Array<plugin>, loaderType: effectiveLoadersType): plugin[effectiveLoadersType] => {
  const isValidPlugin = plugins && isArray(plugins) && plugins.length;

  if (!isValidPlugin) return [];

  return plugins
    .map(plugin => plugin[loaderType])
    .filter(loaders => loaders?.length)
    .reduce((prevLoaders, curLoaders) => prevLoaders.concat(curLoaders), [])
};