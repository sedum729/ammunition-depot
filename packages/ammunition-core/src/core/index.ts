import { proxyPlugins } from '../plugins';

export interface IAmmunitionCoreConfigs {
  plugins?: Array<any>;
};

export interface IAmmunitionCore {
  init: (config: IAmmunitionCoreConfigs) => void;
  registerPlugin: (plugin: any) => void;
  plugins?: Array<any>;
  [pluginPowerName: string]: any;
}

let __start__ = false;
@proxyPlugins
class AmmunitionCore implements IAmmunitionCore {
  [x: string]: any;

  initConfigs?: IAmmunitionCoreConfigs;

  constructor(configs: IAmmunitionCoreConfigs) {
    if (__start__) {
      return;
    }

    this.initConfigs = configs;

    this.init();

    __start__ = true;
  }

  init() {
    this.parseConfig();
  }

  parseConfig() {
    this.handlePlugins();
  }

  handlePlugins() {
    const plugins = this.initConfigs?.plugins || [];

    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        this.registerPlugin(plugin);
      });
    }
  }

  registerPlugin(plugin: any) {
    this.plugins.push(plugin);
  }
};

export default AmmunitionCore;