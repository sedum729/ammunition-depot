import store from 'store';

import { renderElementToContainer, renderIframeReplaceApp, getDegradeIframe, cleanChildElement } from 'isolation';

import { anchorElementGenerator, getAnchorElementQueryMap, isArray, rawDocumentQuerySelector, rawDecodeURIComponent, genIframe } from 'toolkit';

const popStateAlternate = () => {
  window.addEventListener('popstate', () => {
    const urlObject = anchorElementGenerator(window.location.href);
    const queryMap = getAnchorElementQueryMap(urlObject);
    const appInstanceNameList = Object.keys(queryMap);

    console.log('queryMap>>>', urlObject);

    if (appInstanceNameList && isArray(appInstanceNameList) && appInstanceNameList.length) {
      const appInstanceList = [];

      appInstanceNameList.forEach((appInstanceName: string) => {
        const appInstance = store.getInstanceByName(appInstanceName);

        if (appInstance) {
          appInstanceList.push(appInstance);
        }
      });

      if (appInstanceList && appInstanceList.length) {
        appInstanceList.forEach(appInstance => {
          const appInstanceUrl = queryMap[appInstance.id] || '';

          const iframeBody = rawDocumentQuerySelector.call(appInstance.iframe.contentDocument, 'body');

          if (appInstanceUrl?.startsWith('http')) {
            if (appInstance?.degrade) {
              // 降级
              renderElementToContainer(appInstance.document.firstElementChild, iframeBody);
              renderIframeReplaceApp(rawDecodeURIComponent(appInstanceUrl), getDegradeIframe(appInstance.id).parentElement);
            } else {
              // 替换
              renderIframeReplaceApp(window.decodeURIComponent(appInstanceUrl), appInstance.shadowRoot.host.parentElement);
            }
          } else if (appInstance?.hrefFlag) {
            if (appInstance?.degrade) {
              const iframe = genIframe({
                id: appInstance.id
              });

              renderElementToContainer(iframe, appInstance.el);
              cleanChildElement(iframe.contentDocument);
              // patchEventTimeStamp(iframe.contentWindow, appInstance.iframe.contentWindow);

              iframe.contentWindow.onunload = () => {
                appInstance.unmount();
              };

              iframe.contentDocument.appendChild(iframeBody.firstElementChild);
              appInstance.document = iframe.contentDocument;
            } else {
              renderElementToContainer(appInstance.shadowRoot.host, appInstance.el);
            }
          }

          appInstance.hrefFlag = true;
        });
      }
    }
  });
};

// window.history.pushState
// window.history.replaceState;
const pushStateAlternate = () => {};

const replaceStateAlternate = () => {};

const hrefHijacker = () => {
  popStateAlternate();
  pushStateAlternate();
  replaceStateAlternate();
};

export const diversionEngine = {
  hrefHijacker
};