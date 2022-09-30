import { plugin } from 'constant';

import { effectiveLoadersType } from 'toolkit';

// 判断 url 是否符合loader的规则
export function isMatchUrl(url: string, effectLoaders: plugin[effectiveLoadersType]): boolean {
  return effectLoaders.some((loader) => (typeof loader === "string" ? url === loader : loader.test(url)));
}