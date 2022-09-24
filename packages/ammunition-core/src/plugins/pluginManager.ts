interface IPlugin {
  start: () => void;
}

interface IPluginManager {
}

class PluginManager implements IPluginManager {

  pluginInstance: IPlugin;

  constructor(plugin: IPlugin) {
    this.pluginInstance = plugin;
  }
};

export default PluginManager;