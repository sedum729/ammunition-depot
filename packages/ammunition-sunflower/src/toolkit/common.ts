import { cacheOptions } from 'constant';
import store from 'store';

export const setAppInstanceCacheWithOptiopns = (appName: string, options: cacheOptions) => {
  const prevCache = store.getInstanceByName(appName);

  let nextCache = options;

  if (prevCache) {
    nextCache = Object.assign({}, prevCache, nextCache);
  }

  store.setInstanceByName(appName, nextCache);
};

export const rawElementAppendChild = HTMLElement.prototype.appendChild;
export const rawElementRemoveChild = HTMLElement.prototype.removeChild;
export const rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
export const rawBodyInsertBefore = HTMLBodyElement.prototype.insertBefore;
export const rawAddEventListener = EventTarget.prototype.addEventListener;
export const rawRemoveEventListener = EventTarget.prototype.removeEventListener;
export const rawAppendChild = Node.prototype.appendChild;
export const rawDocumentQuerySelector = window.__POWERED_BY_WUJIE__
  ? window.__WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__
  : Document.prototype.querySelector;
export const rawDecodeURIComponent = window.decodeURIComponent;
export const rawQuerySelector = window.document.querySelector;