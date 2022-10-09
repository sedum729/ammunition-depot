import {
  rawCreateElement,
  rawCreateTextNode,
  documentProxyProperties,
  isCallable,
  locationHrefSet,
  getTargetValue,
  checkProxyFunction
} from 'toolkit';

import { patchElementEffect } from 'isolation';

/**
 * 代理 window document location
 * @date 2022-10-09
 * @param {any} iframe:HTMLIFrameElement
 * @param {any} urlElement:HTMLAnchorElement
 * @param {any} mainHostPath:string
 * @param {any} appHostPath:string
 * @returns {any}
 */
export const proxySandbox = (
  iframe: HTMLIFrameElement,
  urlElement: HTMLAnchorElement,
  mainHostPath: string,
  appHostPath: string
): {
  proxyWindow: Window;
  proxyDocument: Object;
  proxyLocation: Object;
} => {
  const proxyWindow = new Proxy(iframe.contentWindow, {
    get: (target: Window, p: PropertyKey) => {
      if (p === 'location') {
        return target.__SUNFLOWER__.proxyLocation;
      }

      if (p === 'self' || p === 'window') {
        return target.__SUNFLOWER__.proxy;
      }

      if (p === '__SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR__' || p === '__SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR_ALL__') {
        return target[p];
      }

      return getTargetValue(target, p);
    },

    set: (target: Window, p: PropertyKey, value: any) => {
      checkProxyFunction(value);
      target[p] = value;
      return true;
    },

    has: (target: Window, p: PropertyKey) => p in target,
  });

  const proxyDocument = new Proxy({}, {
    get: function(_fakeDocument, propKey) {
      const document = window.document;
      const shadowRoot = iframe.contentWindow.__SUNFLOWER__.shadowRoot;

      if (propKey === 'createElement' || propKey === 'createTextNode') {
        return new Proxy(document[propKey], {
          apply(createElement, _ctx, args) {
            const element = createElement.apply(iframe.contentDocument, args);
            patchElementEffect(element, iframe.contentWindow);
            return element;
          }
        });
      }

      if (propKey === "documentURI" || propKey === "URL") {
        return (iframe.contentWindow.__SUNFLOWER__.proxyLocation as Location).href;
      }

      if (
        propKey === "getElementsByTagName" ||
        propKey === "getElementsByClassName" ||
        propKey === "getElementsByName"
      ) {
        return new Proxy(shadowRoot.querySelectorAll, {
          apply(querySelectorAll, _ctx, args) {
            let arg = args[0];
            if (propKey === "getElementsByTagName" && arg === "script") {
              return iframe.contentDocument.scripts;
            }
            if (propKey === "getElementsByClassName") arg = "." + arg;
            if (propKey === "getElementsByName") arg = `[name="${arg}"]`;
            return querySelectorAll.call(shadowRoot, arg);
          },
        });
      }
      if (propKey === "getElementById") {
        return new Proxy(shadowRoot.querySelector, {
          apply(querySelector, _ctx, args) {
            return querySelector.call(shadowRoot, `[id="${args[0]}"]`);
          },
        });
      }
      if (propKey === "querySelector" || propKey === "querySelectorAll") {
        return shadowRoot[propKey].bind(shadowRoot);
      }
      if (propKey === "documentElement" || propKey === "scrollingElement") return shadowRoot.firstElementChild;
      if (propKey === "forms") return shadowRoot.querySelectorAll("form");
      if (propKey === "images") return shadowRoot.querySelectorAll("img");
      if (propKey === "links") return shadowRoot.querySelectorAll("a");
      const { ownerProperties, shadowProperties, shadowMethods, documentProperties, documentMethods } =
        documentProxyProperties;
      if (ownerProperties.concat(shadowProperties).includes(propKey.toString())) {
        if (propKey === "activeElement" && shadowRoot.activeElement === null) return shadowRoot.body;
        return shadowRoot[propKey];
      }
      if (shadowMethods.includes(propKey.toString())) {
        return getTargetValue(shadowRoot, propKey) ?? getTargetValue(document, propKey);
      }
      // from window.document
      if (documentProperties.includes(propKey.toString())) {
        return document[propKey];
      }
      if (documentMethods.includes(propKey.toString())) {
        return getTargetValue(document, propKey);
      }
    }
  });

  const proxyLocation = new Proxy(
    {},
    {
      get: function (_fakeLocation, propKey) {
        const location = iframe.contentWindow.location;
        if (propKey === "host" || propKey === "hostname" || propKey === "protocol" || propKey === "port") {
          return urlElement[propKey];
        }
        if (propKey === "href") {
          return location[propKey].replace(mainHostPath, appHostPath);
        }
        if (propKey === "reload") {
          // warn(WUJIE_TIPS_RELOAD_DISABLED);
          return () => null;
        }
        if (propKey === "replace") {
          return new Proxy(location[propKey], {
            apply(replace, _ctx, args) {
              return replace.call(location, args[0]?.replace(appHostPath, mainHostPath));
            },
          });
        }
        return getTargetValue(location, propKey);
      },
      set: function (_fakeLocation, propKey, value) {
        // 如果是跳转链接的话重开一个iframe
        if (propKey === "href") {
          return locationHrefSet(iframe, value, appHostPath);
        }
        iframe.contentWindow.location[propKey] = value;
        return true;
      },
      ownKeys: function () {
        return Object.keys(iframe.contentWindow.location).filter((key) => key !== "reload");
      },
      getOwnPropertyDescriptor: function (_target, key) {
        return { enumerable: true, configurable: true, value: this[key] };
      },
    }
  );

  return { proxyWindow, proxyDocument, proxyLocation };
};

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