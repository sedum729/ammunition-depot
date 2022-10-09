import { renderElementToContainer } from './shadow';

import { rawQuerySelector, genIframe } from 'toolkit';

import { EnumPrivateAttr } from 'constant';

import App from 'core/app';

declare global {
  interface Window {
    // 是否存在向日葵
    __SUNFLOWER_EXIST__?: boolean;
    // 子应用公共加载路径
    __SUNFLOWER_PUBLIC_PATH__: string;
    // 原生的querySelector
    __SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR__: typeof Document.prototype.querySelector;
    // 原生的querySelector
    __SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR_ALL__: typeof Document.prototype.querySelectorAll;
    // 原生的window对象
    __SUNFLOWER_RAW_WINDOW__: Window;
    // 子应用沙盒实例
    __SUNFLOWER__: App;
    // 子应用mount函数
    __SUNFLOWER_MOUNT: () => void;
    // 子应用unmount函数
    __SUNFLOWER_UNMOUNT: () => void;
    // document type
    Document: typeof Document;
    // img type
    HTMLImageElement: typeof HTMLImageElement;
    // node type
    Node: typeof Node;
    // element type
    Element: typeof Element;
    // htmlElement typeof
    HTMLElement: typeof HTMLElement;
    // anchor type
    HTMLAnchorElement: typeof HTMLAnchorElement;
    // source type
    HTMLSourceElement: typeof HTMLSourceElement;
    // link type
    HTMLLinkElement: typeof HTMLLinkElement;
    // script type
    HTMLScriptElement: typeof HTMLScriptElement;
    EventTarget: typeof EventTarget;
    Event: typeof Event;
    ShadowRoot: typeof ShadowRoot;
    // 注入对象
    $SUNFLOWER: { [key: string]: any };
  }
  interface HTMLHeadElement {
    _cacheListeners: Map<string, EventListenerOrEventListenerObject[]>;
  }
  interface HTMLBodyElement {
    _cacheListeners: Map<string, EventListenerOrEventListenerObject[]>;
  }
}

export function patchElementEffect(
  element: (HTMLElement | Node | ShadowRoot) & { __patched?: boolean },
  iframeWindow: Window
): void {

  if (element.__patched) return;

  const proxyLocation = iframeWindow?.__SUNFLOWER__?.proxyLocation as Location;

  const baseURI = `${proxyLocation?.protocol}//${proxyLocation?.host}${proxyLocation?.pathname}`;

  Object.defineProperties(element, {
    baseURI: {
      configurable: true,
      get: () => baseURI,
      set: undefined,
    },
    ownerDocument: {
      configurable: true,
      get: () => iframeWindow.document,
    },
    __patched: { get: () => true },
  });
};

export const renderIframeReplaceApp = (src: string, element: HTMLElement) => {
  const iframe = genIframe({ src });
  renderElementToContainer(iframe, element)
};

export const getDegradeIframe = (id: string): HTMLIFrameElement => rawQuerySelector(`iframe[${EnumPrivateAttr.DataId}="${id}"]`);

function patchIframeVariable(iframeWindow: Window, appHostPath: string): void {
  iframeWindow.__SUNFLOWER_PUBLIC_PATH__ = appHostPath + "/";
  iframeWindow.$SUNFLOWER = iframeWindow.__SUNFLOWER__.provide;
  iframeWindow.__SUNFLOWER_RAW_WINDOW__ = iframeWindow;
  iframeWindow.__SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR__ = iframeWindow.Document.prototype.querySelector;
  iframeWindow.__SUNFLOWER_RAW_DOCUMENT_QUERY_SELECTOR_ALL__ = iframeWindow.Document.prototype.querySelectorAll;
}

/**
 * 对iframe的history的pushState和replaceState进行修改
 * 将从location劫持后的数据修改回来，防止跨域错误
 * 同步路由到主应用
 * @param iframeWindow
 * @param appHostPath 子应用的 host path
 * @param mainHostPath 主应用的 host path
 */
 function patchIframeHistory(iframeWindow: Window, appHostPath: string, mainHostPath: string): void {
  const history = iframeWindow.history;
  const rawHistoryPushState = history.pushState;
  const rawHistoryReplaceState = history.replaceState;
  history.pushState = function (data: any, title: string, url?: string): void {
    const baseUrl =
      mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
    const mainUrl = getAbsolutePath(url?.replace(appHostPath, ""), baseUrl);
    const ignoreFlag = url === undefined;

    rawHistoryPushState.call(history, data, title, ignoreFlag ? undefined : mainUrl);
    if (ignoreFlag) return;
    updateBase(iframeWindow, appHostPath, mainHostPath);
    syncUrlToWindow(iframeWindow);
  };
  history.replaceState = function (data: any, title: string, url?: string): void {
    const baseUrl =
      mainHostPath + iframeWindow.location.pathname + iframeWindow.location.search + iframeWindow.location.hash;
    const mainUrl = getAbsolutePath(url?.replace(appHostPath, ""), baseUrl);
    const ignoreFlag = url === undefined;

    rawHistoryReplaceState.call(history, data, title, ignoreFlag ? undefined : mainUrl);
    if (ignoreFlag) return;
    updateBase(iframeWindow, appHostPath, mainHostPath);
    syncUrlToWindow(iframeWindow);
  };
}

/**
 * 修改window对象的事件监听，只有路由事件采用iframe的事件
 */
 function patchIframeEvents(iframeWindow: Window) {
  iframeWindow.addEventListener = function addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    // 运行插件钩子函数
    execHooks(iframeWindow.__WUJIE.plugins, "windowAddEventListenerHook", iframeWindow, type, listener, options);

    if (appWindowAddEventListenerEvents.includes(type)) {
      return rawAddEventListener.call(iframeWindow, type, listener, options);
    }
    // 在子应用嵌套场景使用window.window获取真实window
    rawAddEventListener.call(window.__WUJIE_RAW_WINDOW__ || window, type, listener, options);
  };

  iframeWindow.removeEventListener = function removeEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    // 运行插件钩子函数
    execHooks(iframeWindow.__WUJIE.plugins, "windowRemoveEventListenerHook", iframeWindow, type, listener, options);

    if (appWindowAddEventListenerEvents.includes(type)) {
      return rawRemoveEventListener.call(iframeWindow, type, listener, options);
    }
    rawRemoveEventListener.call(window.__WUJIE_RAW_WINDOW__ || window, type, listener, options);
  };
}

/**
 * 记录节点的监听事件
 */
 function recordEventListeners(iframeWindow: Window) {
  const sandbox = iframeWindow.__WUJIE;
  iframeWindow.EventTarget.prototype.addEventListener = function (
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    // 添加事件缓存
    const elementListenerList = sandbox.elementEventCacheMap.get(this);
    if (elementListenerList) {
      if (!elementListenerList.find((listener) => listener.handler === handler)) {
        elementListenerList.push({ type, handler, options });
      }
    } else sandbox.elementEventCacheMap.set(this, [{ type, handler, options }]);
    return rawAddEventListener.call(this, type, handler, options);
  };

  iframeWindow.EventTarget.prototype.removeEventListener = function (
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    // 清除缓存
    const elementListenerList = sandbox.elementEventCacheMap.get(this);
    if (elementListenerList) {
      const index = elementListenerList?.findIndex((ele) => ele.handler === handler);
      elementListenerList.splice(index, 1);
    }
    if (!elementListenerList?.length) {
      sandbox.elementEventCacheMap.delete(this);
    }
    return rawRemoveEventListener.call(this, type, handler, options);
  };
}

/**
 * 子应用前进后退，同步路由到主应用
 * @param iframeWindow
 */
 export function syncIframeUrlToWindow(iframeWindow: Window): void {
  iframeWindow.addEventListener("hashchange", () => syncUrlToWindow(iframeWindow));
  iframeWindow.addEventListener("popstate", () => {
    syncUrlToWindow(iframeWindow);
  });
}

/**
 * js沙箱
 * 创建和主应用同源的iframe，路径携带了子路由的路由信息
 * iframe必须禁止加载html，防止进入主应用的路由逻辑
 */
export const iframeGenerator = (
  appInstance: App,
  attrs: { [key: string]: any },
  mainHostPath: string,
  appHostPath: string,
  appRoutePath: string
): HTMLIFrameElement => {
  const iframe = window.document.createElement("iframe");

  const url = mainHostPath + appRoutePath;

  const attrsMerge = { src: mainHostPath, ...attrs, style: "display: none", name: appInstance.id };

  Object.keys(attrsMerge).forEach((key) => iframe.setAttribute(key, attrsMerge[key]));

  window.document.body.appendChild(iframe);

  const iframeWindow = iframe.contentWindow;

  iframeWindow.__SUNFLOWER__ = appInstance;

  patchIframeVariable(iframeWindow, appHostPath);
  patchIframeHistory(iframeWindow, appHostPath, mainHostPath);
  patchIframeEvents(iframeWindow);
  if (iframeWindow.__SUNFLOWER__.degrade) recordEventListeners(iframeWindow);
  syncIframeUrlToWindow(iframeWindow);
  return iframe;
};