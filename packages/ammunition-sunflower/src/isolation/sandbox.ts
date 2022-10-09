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
};