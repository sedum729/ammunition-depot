import {
  isArray, compose, getEffectiveLoadersFromPlugins, defaultGetPublicPath,
  processTpl, ScriptObject, requestIdleCallback, ScriptBaseObject, fetchAssets,
  StyleObject, getInlineCode, isMatchUrl
} from 'toolkit';

import store from 'store';

import { loadErrorHandler } from 'constant';

import { plugin } from 'constant';

interface IImportHTMLOptions {
  fetch?: typeof window.fetch;
  fiber?: boolean;
  plugins: Array<plugin>;
  loadError: loadErrorHandler;
};

const rawFetch = window.fetch.bind(window);

const defaultHtmlLoader = tpl => tpl;

export type ScriptResultList = (ScriptBaseObject & { contentPromise: Promise<string> })[];
export type StyleResultList = { src: string; contentPromise: Promise<string>; ignore?: boolean }[];

const isInlineCode = (code) => code.startsWith("<");

export function getExternalScripts(
  scripts: ScriptObject[],
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = rawFetch,
  loadError: loadErrorHandler,
  fiber: boolean
): ScriptResultList {
  // module should be requested in iframe
  return scripts.map((script) => {
    const { src, async, defer, module, ignore } = script;
    let contentPromise = null;
    // async
    if ((async || defer) && src && !module) {
      contentPromise = new Promise((resolve, reject) =>
        fiber
          ? requestIdleCallback(() => fetchAssets(src, store.scriptCache, fetch, false, loadError).then(resolve, reject))
          : fetchAssets(src, store.scriptCache, fetch, false, loadError).then(resolve, reject)
      );
      // module || ignore
    } else if ((module && src) || ignore) {
      contentPromise = Promise.resolve("");
      // inline
    } else if (!src) {
      contentPromise = Promise.resolve(script.content);
      // outline
    } else {
      contentPromise = fetchAssets(src, store.scriptCache, fetch, false, loadError);
    }
    return { ...script, contentPromise };
  });
};

export function getExternalStyleSheets(
  styles: StyleObject[],
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = rawFetch,
  loadError: loadErrorHandler
): StyleResultList {
  return styles.map(({ src, content, ignore }) => {
    // 内联
    if (content) {
      return { src: "", contentPromise: Promise.resolve(content) };
    } else if (isInlineCode(src)) {
      // if it is inline style
      return { src: "", contentPromise: Promise.resolve(getInlineCode(src)) };
    } else {
      // external styles
      return {
        src,
        ignore,
        contentPromise: ignore ? Promise.resolve("") : fetchAssets(src, store.styleCache, fetch, true, loadError),
      };
    }
  });
};

const getHtmlParseResult = ({
  fetch,
  loadError,
  url,
  htmlLoader,
  getPublicPath,
  jsExcludes,
  cssExcludes,
  jsIgnores,
  cssIgnores,
  fiber
}) => {
  fetch(url)
    .then(
      (response) => response.text(),
      (error) => {
        loadError?.(url, error);
        return Promise.reject(error);
      }
    )
    .then(
      (html) => {
        const assetPublicPath = getPublicPath(url);

        const { template, scripts, styles } = processTpl(htmlLoader(html), assetPublicPath);

        return {
          template,
          assetPublicPath,
          getExternalScripts: () => {
            return getExternalScripts(
              scripts
                .filter((script) => !script.src || !isMatchUrl(script.src, jsExcludes))
                .map((script) => ({ ...script, ignore: script.src && isMatchUrl(script.src, jsIgnores) })),
              fetch,
              loadError,
              fiber
            );
          },
          getExternalStyleSheets: () => {
            return getExternalStyleSheets(
              styles
                .filter((style) => !style.src || !isMatchUrl(style.src, cssExcludes))
                .map((style) => ({ ...style, ignore: style.src && isMatchUrl(style.src, cssIgnores) })),
              fetch,
              loadError
            );
          },
        };
      }
    )
};

export const importHTML = (url: string, options: IImportHTMLOptions): any => {
  const fetch = options?.fetch ?? rawFetch;
  const fiber = options?.fiber ?? true;

  const { plugins, loadError } = options;

  const isValidPlugins = plugins && isArray(plugins) && plugins.length;

  const htmlLoader = isValidPlugins ? compose(plugins.map(plugin => plugin.htmlLoader)) : defaultHtmlLoader;

  const jsExcludes = getEffectiveLoadersFromPlugins(plugins, "jsExcludes");
  const cssExcludes = getEffectiveLoadersFromPlugins(plugins, "cssExcludes");
  const jsIgnores = getEffectiveLoadersFromPlugins(plugins, "jsIgnores");
  const cssIgnores = getEffectiveLoadersFromPlugins(plugins, "cssIgnores");

  const getPublicPath = defaultGetPublicPath;

  const result = getHtmlParseResult({
    fetch,
    loadError,
    url,
    htmlLoader,
    getPublicPath,
    jsExcludes,
    cssExcludes,
    jsIgnores,
    cssIgnores,
    fiber
  });

  const isHasHtmlLoader = options?.plugins.some((plugin) => plugin.htmlLoader);

  if (isHasHtmlLoader) return result;

  const embedHTMLCache = store.embedHTMLCache;

  if (embedHTMLCache) return embedHTMLCache;

  store.setEmbedHTMLCache(url, result);

  return result;
};