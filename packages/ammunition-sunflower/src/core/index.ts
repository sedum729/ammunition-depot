import { EnumApplication } from '../constant';

import { SunFlowerApp } from '../isolation';

import { isSupport } from '../toolkit';

import storeManager, { IStore } from '../store';

class SunFlower {
  storeManager: IStore = storeManager;

  ctx;

  name = 'SunflowerModule';

  prepare(ctx) {
    
  }

  start(ctx) {
    this.ctx = ctx;

    if (!isSupport) {
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