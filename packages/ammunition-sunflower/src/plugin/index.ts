import { plugin } from 'constant';

import { getAbsolutePath } from 'toolkit';

/**
 * 转换子应用css内的相对地址成绝对地址
 */
const cssRelativePathResolve = (code: string, src: string, base: string) => {
  const baseUrl = src ? getAbsolutePath(src, base) : base;

  const urlReg = /(url\((?!['"]?(?:data):)['"]?)([^'")]*)(['"]?\))/g;

  return code.replace(urlReg, (_m, pre, url, post) => {
    const absoluteUrl = getAbsolutePath(url, baseUrl);
    return pre + absoluteUrl + post;
  });
}

const defaultPlugin = {
  cssLoader: cssRelativePathResolve
};

const defaultPlugins: Array<plugin> = [defaultPlugin];

export const getPlugins = (plugins: Array<plugin> = []): Array<plugin> => defaultPlugins.concat(plugins);