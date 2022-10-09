import { EnumApplication, EnumMessage, startOptions, cacheOptions, preHeatOptions } from 'constant';

import { SunFlowerApp } from 'isolation';

import { isSupport } from 'toolkit';

import storeManager, { IStore } from 'store';

import { setupEngine, preHeatEngine, startEngine, diversionEngine, shutDownEngine } from 'dashboard';

import { warn } from 'log';

class SunFlower {
  storeManager: IStore = storeManager;

  ctx;

  name = 'SunFlowerModule';

  startApp: (options: startOptions) => Promise<void>;
  setupApp: (options: cacheOptions) => void;
  preloadApp: (preHeatOptions: preHeatOptions) => void;
  destoryApp: (appName: string) => void;

  prepare(ctx) {
    ctx.registerAbility('setupApp', setupEngine);
    ctx.registerAbility('startApp', startEngine);
    ctx.registerAbility('preloadApp', preHeatEngine);
    ctx.registerAbility('destoryApp', shutDownEngine);
  }

  start(ctx) {
    this.ctx = ctx;

    if (!isSupport) {
      warn(EnumMessage.NotSupport);
    }

    /**
     * 中断执行
     * 
     * window.__SUNFLOWER__ 为true说明当前运行环境是子应用
    */
    if (window.__SUNFLOWER__) {
      return;
    }

    this.__init();
  }

  __init() {
    // 劫持路由
    diversionEngine.hrefHijacker();

    // 定义webComponent
    this.defineWebComponent();

    // 注册引擎
    this.setupApp = setupEngine;
    this.startApp = startEngine;
    this.preloadApp = preHeatEngine;
    this.destoryApp = shutDownEngine;
  }

  defineWebComponent() {
    const isDefined = customElements.get(EnumApplication.Name);

    if (!isDefined) {
      customElements.define(EnumApplication.Name, SunFlowerApp);
    }
  }
};

export default SunFlower;