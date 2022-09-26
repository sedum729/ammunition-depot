import { EnumApplication } from '../constant';

import { SunFlowerApp } from '../isolation';

import { isSupport } from '../toolkit';

import storeManager, { IStore } from '../store';

class SunFlower {
  storeManager: IStore = storeManager;

  ctx;

  start(ctx) {
    this.ctx = ctx;

    this.getPrinter();

    if (!isSupport) {
      return;
    }

    this.init();
  }

  init() {
    this.defineWebComponent();
  }

  getPrinter() {
    const allFn = this.ctx.getPluginsAbility('LogModule');
    console.log('this.ctx>>>>', this.ctx);
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