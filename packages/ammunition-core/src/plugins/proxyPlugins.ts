import { IPlugin } from "./pluginManager";

import runPlugins from "./runPlugins";

type IproxyPlugins = (targetClass: any) => void;

const proxyPlugins: IproxyPlugins = function(targetClass) {

  const plugins = [];

  targetClass.prototype.plugins = new Proxy(plugins, {
    set: (target: IPlugin | any, attr, value) => {

      runPlugins.call(targetClass.prototype, target);

      return target[attr] = value;
    }
  });
};

export default proxyPlugins