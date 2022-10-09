/**
 * location href 的set劫持操作
 */
export const locationHrefSet = (iframe: HTMLIFrameElement, value: string, appHostPath: string): boolean => {
  const { shadowRoot, id, degrade, document } = iframe.contentWindow.__SUNFLOWER__;
  let url = value;
  if (!/^http/.test(url)) {
    let hrefElement = anchorElementGenerator(url);
    url = appHostPath + hrefElement.pathname + hrefElement.search + hrefElement.hash;
    hrefElement = null;
  }
  iframe.contentWindow.__WUJIE.hrefFlag = true;
  if (degrade) {
    const iframeBody = rawDocumentQuerySelector.call(iframe.contentDocument, "body");
    renderElementToContainer(document.firstElementChild, iframeBody);
    renderIframeReplaceApp(window.decodeURIComponent(url), getDegradeIframe(id).parentElement);
  } else renderIframeReplaceApp(url, shadowRoot.host.parentElement);
  pushUrlToWindow(id, url);
  return true;
}