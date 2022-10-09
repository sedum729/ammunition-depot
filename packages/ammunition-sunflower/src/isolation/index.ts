import { EnumPrivateAttr } from '../constant';

import storeManager from '../store';

import { patchElementEffect } from './iframe';

export * from './shadow';

export * from './iframe';

export * from './sandbox';

export class SunFlowerApp extends HTMLElement {
  connectedCallback(): void {
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });

      const appId = this.getAttribute(EnumPrivateAttr.DataId);

      const sandbox = storeManager.getInstanceByName(appId);

      patchElementEffect(shadowRoot, sandbox.iframe.contentWindow);

      sandbox.shadowRoot = shadowRoot;
    };
  }

  disconnectedCallback(): void {
    const appId = this.getAttribute(EnumPrivateAttr.DataId);

    const sandbox = storeManager.getInstanceByName(appId);

    sandbox?.unmount();
  }
}