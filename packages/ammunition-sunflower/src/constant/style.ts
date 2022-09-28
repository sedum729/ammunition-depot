/** 样式对象 */
export interface StyleObject {
  /** 样式地址， 内联为空 */
  src?: string;
  /** 样式代码 */
  content?: string;
  /** 忽略，子应用自行请求 */
  ignore?: boolean;
}