import { EnumApplication, EnumMessage } from 'constant';

import { SunFlowerApp } from 'isolation';

import { isSupport } from 'toolkit';

import storeManager, { IStore } from 'store';

import { warn } from 'log';

class SunFlower {
  storeManager: IStore = storeManager;

  ctx;

  name = 'SunflowerModule';

  prepare(ctx) {
    
  }

  start(ctx) {
    this.ctx = ctx;

    if (!isSupport) {
      warn(EnumMessage.NotSupport);
      return;
    }

    this.init();
  }

  init() {
    this.defineWebComponent();
  }

  // 定义webComponent
  defineWebComponent() {
    const isDefined = customElements.get(EnumApplication.Name);

    if (!isDefined) {
      customElements.define(EnumApplication.Name, SunFlowerApp);
    }
  }
};

export default SunFlower;