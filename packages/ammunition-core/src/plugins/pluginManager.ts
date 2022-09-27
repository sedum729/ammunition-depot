import { IAmmunitionCore } from '../core';

import { isFunction } from 'utils';

export interface IPluginStart {
  registerAbility: (abName: string, ability: any) => boolean;
}

export interface IPlugin {
  config?: any;
  name: string;
  prepare: (ctx: IAmmunitionCore) => void;
  start: (ctx: IAmmunitionCore) => void;
  __init__?: boolean;
}

interface IPluginManager {
  run: () => void;
}

const pluginMap: Map<string, any> = new Map();
class PluginManager implements IPluginManager {

  pluginInstance: IPlugin;

  ctx: IAmmunitionCore;

  constructor(plugin: IPlugin, ctx: IAmmunitionCore) {
    this.pluginInstance = plugin;

    this.ctx = ctx;

    this.run();
  }

  run() {

    this.performPrepare();
    
    this.performStart();
  }
  
  // 执行准备钩子
  performPrepare() {
    const pluginPrepare = this.pluginInstance.prepare;

    if (isFunction(pluginPrepare)) {
      pluginPrepare.call(this.pluginInstance, {
        registerAbility: this.registerAbility.bind(pluginPrepare),
        getPluginsAbility: this.getPluginsAbility.bind(this),
      });
    }
  }

  // 执行启动钩子
  performStart() {
    const pluginStart = this.pluginInstance.start;

    if (isFunction(pluginStart)) {
      pluginStart.call(this.pluginInstance, {
        getPluginsAbility: this.getPluginsAbility.bind(this),
      });

      this.pluginInstance.__init__ = true;
    }
  }

  getPluginsAbility(pluginName: string) {
    return pluginMap.get(pluginName);
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

      pluginMap.set(pluginName, pluginStore);

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