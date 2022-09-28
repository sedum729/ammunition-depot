import { ScriptObjectLoader } from './script';

import { StyleObject } from './style';

type eventListenerHook = (
  iframeWindow: Window,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) => void;

export interface plugin {
  /** 处理html的loader */
  htmlLoader?: (code: string) => string;
  /** js排除列表 */
  jsExcludes?: Array<string | RegExp>;
  /** js忽略列表 */
  jsIgnores?: Array<string | RegExp>;
  /** 处理js加载前的loader */
  jsBeforeLoaders?: Array<ScriptObjectLoader>;
  /** 处理js的loader */
  jsLoader?: (code: string, url: string, base: string) => string;
  /** 处理js加载后的loader */
  jsAfterLoaders?: Array<ScriptObjectLoader>;
  /** css排除列表 */
  cssExcludes?: Array<string | RegExp>;
  /** css忽略列表 */
  cssIgnores?: Array<string | RegExp>;
  /** 处理css加载前的loader */
  cssBeforeLoaders?: Array<StyleObject>;
  /** 处理css的loader */
  cssLoader?: (code: string, url: string, base: string) => string;
  /** 处理css加载后的loader */
  cssAfterLoaders?: Array<StyleObject>;
  /** 子应用 window addEventListener 钩子回调 */
  windowAddEventListenerHook?: eventListenerHook;
  /** 子应用 window removeEventListener 钩子回调 */
  windowRemoveEventListenerHook?: eventListenerHook;
  /** 子应用 document addEventListener 钩子回调 */
  documentAddEventListenerHook?: eventListenerHook;
  /** 子应用 document removeEventListener 钩子回调 */
  documentRemoveEventListenerHook?: eventListenerHook;
  /** 用户自定义覆盖子应用 window 属性 */
  windowPropertyOverride?: (iframeWindow: Window) => void;
  /** 用户自定义覆盖子应用 document 属性 */
  documentPropertyOverride?: (iframeWindow: Window) => void;
}