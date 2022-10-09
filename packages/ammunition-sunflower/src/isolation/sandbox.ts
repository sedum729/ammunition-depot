import {
  rawCreateElement,
  rawCreateTextNode,
  documentProxyProperties,
  isCallable,
  locationHrefSet
} from 'toolkit';

import { patchElementEffect } from 'isolation';

export const proxySandbox = () => {};

/**
 * 代理 document、location 
 * @date 2022-10-09
 * @param {any} iframe:HTMLIFrameElement
 * @param {any} urlElement:HTMLAnchorElement
 * @param {any} mainHostPath:string
 * @param {any} appHostPath:string
 * @returns {any}
 */
export const degradeSandbox = (
  iframe: HTMLIFrameElement,
  urlElement: HTMLAnchorElement,
  mainHostPath: string,
  appHostPath: string
): {
  proxyDocument: Object;
  proxyLocation: Object;
} => {
  const proxyDocument = {};
  const appInstance = iframe?.contentWindow?.__SUNFLOWER__;

  Object.defineProperties(proxyDocument, {
    createElement: {
      get: () => {
        return function(...args) {
          const element = rawCreateElement.apply(iframe.contentDocument, args);

          patchElementEffect(element, iframe.contentWindow);

          return element;
        }
      },
    },
    createTextNode: {
      get: () => {
        return function(...args) {
          const element = rawCreateTextNode.apply(iframe.contentDocument, args);

          patchElementEffect(element, iframe.contentWindow);

          return element;
        }
      },
    },
    documentURI: {
      get: () => (appInstance.proxyLocation as Location).href,
    },
    URL: {
      get: () => (appInstance.proxyLocation as Location).href,
    },
    getElementsByTagName: {
      get: () => {
        return function(...args) {
          const tagName = args[0];

          if (tagName === 'script') {
            return iframe.contentDocument.scripts as any;
          }
          
          return appInstance.document.getElementsByTagName(tagName) as any;
        }
      }
    },
  });

  const {
    modifyLocalProperties,
    modifyProperties,
    ownerProperties,
    shadowProperties,
    shadowMethods,
    documentProperties,
    documentMethods,
  } = documentProxyProperties;

  modifyProperties
    .filter((key) => !modifyLocalProperties.includes(key))
    .concat(ownerProperties, shadowProperties, shadowMethods, documentProperties, documentMethods)
    .forEach((key) => {
      Object.defineProperty(proxyDocument, key, {
        get: () =>
          isCallable(appInstance.document[key]) ? appInstance.document[key].bind(appInstance.document) : appInstance.document[key],
      });
    });

  const proxyLocation = {};
  const location = iframe.contentWindow.location;
  const locationKeys = Object.keys(location);
  const constantKey = ["host", "hostname", "port", "protocol", "port"];

  constantKey.forEach((key) => {
    proxyLocation[key] = urlElement[key];
  });
  Object.defineProperties(proxyLocation, {
    href: {
      get: () => location.href.replace(mainHostPath, appHostPath),
      set: (value) => {
        locationHrefSet(iframe, value, appHostPath);
      },
    },
    reload: {
      get() {
        // warn(WUJIE_TIPS_RELOAD_DISABLED);
        return () => null;
      },
    },
  });
  locationKeys
    .filter((key) => !constantKey.concat(["href", "reload"]).includes(key))
    .forEach((key) => {
      Object.defineProperty(proxyLocation, key, {
        get: () => (isCallable(location[key]) ? location[key].bind(location) : location[key]),
      });
    });

  return { proxyDocument, proxyLocation };
};