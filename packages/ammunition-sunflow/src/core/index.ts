import { error, logType } from 'log';

import { isFunction, isAsyncFunction } from 'utils';

type routerConfigs = {
  path: string;
  name: string;
  icon: string;
  hidden?: boolean;
  childRoutes?: Array<routerConfigs>;
}

type SunFlowConfigsType = {
  routerConfigs: routerConfigs | (() => routerConfigs);
};

type SunFlowType = {
  config: SunFlowConfigsType;
  name: string;
  prepare: (ctx: any) => void;
  start: (ctx: any) => void;
  init: () => void;
};

// 当前是否存在工作流
let isSunFlowExist = false;

class SunFlow implements SunFlowType {

  config: SunFlowConfigsType;

  name = 'SunFlowModule';

  constructor(sunFlowConfigs?: SunFlowConfigsType) {
    if (!isSunFlowExist) {
      this.config = sunFlowConfigs;

      this.init();

      isSunFlowExist = true;      
    }
  }

  prepare(ctx: any) {
    // ctx.registerAbility('log', this.log.bind(this));
    // ctx.registerAbility('warn', this.warn.bind(this));
    // ctx.registerAbility('error', this.error.bind(this));
    // ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  start(ctx: any) {
  }

  init() {
    this.parseRouterConfigs();
  }

  async parseRouterConfigs() {
    const routerConfigs = this.config?.routerConfigs;

    let finallyRouterConfigs = routerConfigs;

    if (!routerConfigs) {
      error(`If no route configuration is obtained, the system stops working. Error code: ${logType.SystemLog.SunFlow_NoRouterConfigs}`);
      return;
    }

    if (isFunction(routerConfigs)) {
      finallyRouterConfigs = (routerConfigs as Function)();
    }

    if (isAsyncFunction) {
      finallyRouterConfigs = await (routerConfigs as Function)();
    }
  }
};

export default SunFlow;