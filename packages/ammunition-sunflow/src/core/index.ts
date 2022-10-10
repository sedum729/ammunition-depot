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
  sunFlowerApp: any;
};

// 当前是否存在工作流
let isSunFlowExist = false;

class SunFlow implements SunFlowType {

  config: SunFlowConfigsType;

  name = 'SunFlowModule';

  sunFlowerApp = {};

  constructor(sunFlowConfigs?: SunFlowConfigsType) {
    if (isSunFlowExist) {
      return;
    }

    this.config = sunFlowConfigs;

    this.init();

    isSunFlowExist = true;      
  }

  prepare(ctx: any) {
    // ctx.registerAbility('log', this.log.bind(this));
    // ctx.registerAbility('warn', this.warn.bind(this));
    // ctx.registerAbility('error', this.error.bind(this));
    // ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  start(ctx: any) {
    const sunFlower = ctx.getPluginsAbility('SunFlowerModule');

    if (!(sunFlower && Object.keys(sunFlower).length)) {
      error(`Sunflower initialization failed. Error code: ${logType.SystemLog.SunFlow_NotGetSunFlower}`);
      return;
    }

    this.sunFlowerApp = sunFlower;
  }

  init() {
    this.parseRouterConfigs();
  }

  /**
   * 解析路由配置
   * @date 2022-10-10
   * @returns {any}
   */
  async parseRouterConfigs() {
    const routerConfigs = this.config?.routerConfigs;

    let finallyRouterConfigs = routerConfigs;

    if (!routerConfigs) {
      error(`If no route configuration is obtained, the system stops working. Error code: ${logType.SystemLog.SunFlow_NoRouterConfigs}`);
      return;
    }

    if (isFunction(routerConfigs)) {
      try {
        finallyRouterConfigs = (routerConfigs as Function)();
      } catch (errMsg) {
        error(`Failed to get route configuration. Error code: ${logType.SystemLog.SunFlow_GetRouterConfigsError}`)
      }
    }

    if (isAsyncFunction) {
      try {
        finallyRouterConfigs = await (routerConfigs as Function)();
      } catch (errMsg) {
        error(`Failed to get route configuration. Error code: ${logType.SystemLog.SunFlow_GetRouterConfigsError}`)
      }
    }
  }
};

export default SunFlow;