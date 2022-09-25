import { IAmmunitionCore } from '../core';

export interface IPlugin {
  start: (ctx: IAmmunitionCore) => void;
  __init__?: boolean;
}

interface IPluginManager {
  run: () => void;
}

class PluginManager implements IPluginManager {

  pluginInstance: IPlugin;

  ctx: IAmmunitionCore;

  constructor(plugin: IPlugin, ctx: IAmmunitionCore) {
    this.pluginInstance = plugin;
    this.ctx = ctx;

    this.run();
  }

  run() {
    const startTask = this.pluginInstance.start;

    if (startTask && typeof startTask === 'function') {

      startTask.call(this.pluginInstance, this.ctx);

      this.pluginInstance.__init__ = true;
    }
  }
};

export default PluginManager;