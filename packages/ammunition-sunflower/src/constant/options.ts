import { plugin } from './plugin';

import { lifecycle, loadErrorHandler } from './lifecycle';

export type basicOptions = {
  /** 应用名称 */
  name: string;
  /** 渲染url */
  url: string;
  /** 替换代码函数 */
  replaceCode?: (code: string) => string;
  /** 自定义fetch */
  fetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** 注入给子应用的属性 */
  props?: { [key: string]: any };
  /** 自定义iframe属性 */
  attrs?: { [key: string]: any };
  /** 子应用采用fiber模式执行 */
  fiber?: boolean;
  /** 子应用保活，state不会丢失 */
  alive?: boolean;
  /** 子应用采用降级iframe方案 */
  degrade?: boolean;
  /** 子应用插件 */
  plugins?: Array<plugin>;
  /** 子应用生命周期 */
  beforeLoad?: lifecycle;
  beforeMount?: lifecycle;
  afterMount?: lifecycle;
  beforeUnmount?: lifecycle;
  afterUnmount?: lifecycle;
  activated?: lifecycle;
  deactivated?: lifecycle;
  loadError?: loadErrorHandler;
};

export type cacheOptions = {
  /** 预执行 */
  exec?: boolean;
  /** 渲染的容器 */
  el?: HTMLElement | string;
  /** 路由同步开关 */
  sync?: boolean;
  /** 子应用短路径替换，路由同步时生效 */
  prefix?: { [key: string]: string };
  /** 子应用加载时loading元素 */
  loading?: HTMLElement;
} & basicOptions;

export type startOptions = {
  /** 渲染的容器 */
  el: HTMLElement | string;
  /**
   * 路由同步开关
   * 如果false，子应用跳转主应用路由无变化，但是主应用的history还是会增加
   * https://html.spec.whatwg.org/multipage/history.html#the-history-interface
   */
  routerSync?: boolean;
  /** 子应用短路径替换，路由同步时生效 */
  prefix?: { [key: string]: string };
  /** 子应用加载时loading元素 */
  loading?: HTMLElement;
} & basicOptions;

export type preHeatOptions = {
  exec?: boolean;
} & basicOptions;