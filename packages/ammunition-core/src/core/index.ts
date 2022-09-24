import { PluginManager } from '../plugins';

export interface IAmmunitionCoreConfigs {
  plugins?: Array<any>;
};

interface IAmmunitionCore {
  __start__: boolean;
  init: (config: IAmmunitionCoreConfigs) => void;
  registerPlugin: (plugin: any) => void;
}

class AmmunitionCore implements IAmmunitionCore {
  __start__ = false;

  plugins: Array<any> = [];

  initConfigs?: IAmmunitionCoreConfigs;

  constructor(configs: IAmmunitionCoreConfigs) {
    if (this.__start__) {
      return;
    }

    this.plugins = [];
    this.initConfigs = configs;

    this.init();

    this.__start__ = true;
  }

  init() {
    this.parseConfig();
  }

  parseConfig() {
    const plugins = this.initConfigs?.plugins || [];

    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        this.registerPlugin(plugin);
      });
    }

    this.runPlugins();
  }

  registerPlugin(plugin: any) {
    this.plugins.push(plugin);
  }

  async runPlugins() {
    await Promise.resolve();

    const plugins = this.plugins;

    if (plugins && Array.isArray(plugins) && plugins.length) {

      const needExecPlugins = plugins.filter(plugin => !plugin.__init__);

      needExecPlugins.forEach(plugin => new PluginManager(plugin));
    }
  }
};

export default AmmunitionCore;