import PluginManager, { IPlugin } from "./pluginManager";

const runPlugins = function(plugins: IPlugin) {
  if (plugins && Array.isArray(plugins) && plugins.length) {

    const needExecPlugins = plugins.filter(plugin => !plugin.__init__);

    needExecPlugins.forEach(plugin => {
      new PluginManager(plugin, this);
    });
  }
};

export default runPlugins;