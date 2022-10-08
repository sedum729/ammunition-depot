import App from 'core/app';

import { StyleResultList, compose, getCurRoutePath, getEmbedHTML } from 'toolkit';

/**
 * 处理css-loader
 */
export async function processCssLoader(
  sandbox: App,
  template: string,
  getExternalStyleSheets: () => StyleResultList
): Promise<string> {
  const curUrl = getCurRoutePath(sandbox.proxyLocation);
  /** css-loader */
  const composeCssLoader = compose(sandbox.plugins.map((plugin) => plugin.cssLoader));
  const processedCssList: StyleResultList = getExternalStyleSheets().map(({ src, ignore, contentPromise }) => ({
    src,
    ignore,
    contentPromise: contentPromise.then((content) => composeCssLoader(content, src, curUrl)),
  }));
  const embedHTML = await getEmbedHTML(template, processedCssList);
  return sandbox.replaceCode ? sandbox.replaceCode(embedHTML) : embedHTML;
}