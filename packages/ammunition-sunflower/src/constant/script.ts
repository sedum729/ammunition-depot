export interface ScriptObjectLoader {
  /** 脚本地址，内联为空 */
  src?: string;
  /** 脚本是否为module模块 */
  module?: boolean;
  /** 脚本是否为async执行 */
  async?: boolean;
  /** 脚本是否设置crossorigin */
  crossorigin?: boolean;
  /** 脚本crossorigin的类型 */
  crossoriginType?: "anonymous" | "use-credentials" | "";
  /** 内联script的代码 */
  content?: string;
  /** 执行回调钩子 */
  callback?: (appWindow: Window) => any;
}