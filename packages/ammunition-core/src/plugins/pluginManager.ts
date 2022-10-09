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

class PluginManager implements IPluginManager {

  pluginInstance: IPlugin;

  ctx: IAmmunitionCore;

  pluginStore;

  constructor(plugin: IPlugin, ctx: IAmmunitionCore) {
    
    this.pluginInstance = plugin;

    this.pluginInstance.__init__ = true;

    this.ctx = ctx;

    this.run();
  }

  run() {
    this.registerPluginStore();

    this.performPrepare();
    
    this.performStart();
  }
  
  // 执行准备钩子
  performPrepare() {
    const pluginPrepare = this.pluginInstance.prepare;

    if (isFunction(pluginPrepare)) {
      pluginPrepare.call(this.pluginInstance, {
        registerAbility: this.registerAbility.bind(this.pluginStore),
      });
    }
  }

  // 执行启动钩子
  async performStart() {
    await Promise.resolve();

    const pluginStart = this.pluginInstance.start;

    if (isFunction(pluginStart)) {
      pluginStart.call(this.pluginInstance, {
        getPluginsAbility: this.getPluginsAbility.bind(this.ctx),
      });
    }
  }

  registerPluginStore() {
    const pluginName = this.pluginInstance.name || 'DefaultModule';

    if (pluginName) {
      this.ctx[pluginName] = new Proxy({}, {
        set: (target, attr, value) => {
          return target[attr] = value;
        }
      });

      this.pluginStore = this.ctx[pluginName];
    }
  };

  registerAbility(abName: string, ability: any) {
    if (abName && ability) {
      this[abName] = ability;
    }
  };

  getPluginsAbility(pluginName: string) {
    return this[pluginName];
  };
};

export default PluginManager;