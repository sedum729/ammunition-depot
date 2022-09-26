import { IAmmunitionCore } from '../core';

export interface IPluginStart {
  registerAbility: (abName: string, ability: any) => boolean;
}

export interface IPlugin {
  config?: any;
  name: string;
  start: (ctx: IAmmunitionCore) => void;
  __init__?: boolean;
}

interface IPluginManager {
  run: () => void;
}

class PluginManager implements IPluginManager {

  pluginInstance: IPlugin;

  ctx: IAmmunitionCore;

  pluginMap: Map<string, any> = new Map();

  constructor(plugin: IPlugin, ctx: IAmmunitionCore) {
    this.pluginInstance = plugin;

    this.ctx = ctx;

    this.run();
  }

  run() {
    const pluginStart = this.pluginInstance.start;

    if (pluginStart && typeof pluginStart === 'function') {
      const pluginStore = this.registerPluginStore();

      pluginStart.call(this.pluginInstance, {
        registerAbility: this.registerAbility.bind(pluginStore),
        getPluginsAbility: this.getPluginsAbility.bind(this),
      });

      this.pluginInstance.__init__ = true;
    }
  }

  getPluginsAbility(pluginName: string) {
    return this.pluginMap.get(pluginName);
  }

  registerPluginStore() {
    const pluginName = this.pluginInstance.name || '';
  
    if (pluginName) {
      const pluginStore = new Proxy({}, {
        set: (target, attr, value) => {
          return target[attr] = value;
        }
      });

      this.ctx[pluginName] = pluginStore;

      this.pluginMap.set(pluginName, pluginStore);

      return pluginStore;
    }

    return {};
  };

  registerAbility(abName: string, ability: any) {
    if (abName && ability) {
      this[abName] = ability;
    }
  }
};

export default PluginManager;