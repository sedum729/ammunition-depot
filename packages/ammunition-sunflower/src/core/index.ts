import { EnumApplication } from '../constant';

import { SunFlowerApp } from '../isolation';

import { isSupport } from '../toolkit';

import storeManager, { IStore } from '../store';

class SunFlower {
  storeManager: IStore = storeManager;

  ctx;

  name = 'sunflower';

  prepare(ctx) {
    
  }

  start(ctx) {
    this.ctx = ctx;

    if (!isSupport) {
      return;
    }

    this.getPrinter();

    this.init();
  }

  init() {
    this.defineWebComponent();
  }

  getPrinter() {
    const LogModule = this.ctx.getPluginsAbility('LogModule');
    console.log('this.ctx>>>>', LogModule);
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