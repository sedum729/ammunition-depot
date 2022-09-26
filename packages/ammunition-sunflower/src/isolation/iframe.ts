declare global {
  interface Window {
    // 是否存在无界
    __POWERED_BY_WUJIE__?: boolean;
    // 子应用公共加载路径
    __WUJIE_PUBLIC_PATH__: string;
    // 原生的querySelector
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR__: typeof Document.prototype.querySelector;
    // 原生的querySelector
    __WUJIE_RAW_DOCUMENT_QUERY_SELECTOR_ALL__: typeof Document.prototype.querySelectorAll;
    // 原生的window对象
    __WUJIE_RAW_WINDOW__: Window;
    // 子应用沙盒实例
    // __WUJIE: WuJie;
    __sunflower: any;
    // 子应用mount函数
    __WUJIE_MOUNT: () => void;
    // 子应用unmount函数
    __WUJIE_UNMOUNT: () => void;
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
    $wujie: { [key: string]: any };
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

  const proxyLocation = iframeWindow?.__sunflower?.proxyLocation as Location;

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
}