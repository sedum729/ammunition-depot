import { error, logType } from 'log';

import { isFunction, isAsyncFunction } from 'utils';

import Runtime from 'runtime';

// {
//   createBrowserHistory,
//   createHashHistory,
//   createMemoryHistory
// }

import history from 'history';

// const history = createMemoryHistory();

console.log('22 history>>>', history);

export type IRouterConfigs = {
  path: string;
  name: string;
  icon: string;
  hidden?: boolean;
  childRoutes?: Array<IRouterConfigs>;
}

type SunFlowConfigsType = {
  routerConfigs: IRouterConfigs | (() => IRouterConfigs);
};

type SunFlowType = {
  config: SunFlowConfigsType;
  name: string;
  prepare: (ctx: any) => void;
  start: (ctx: any) => void;
  init: () => void;
  sunFlowerApp: any;
  routerConfigs: IRouterConfigs | null;
  isSunFlowerAppExist: boolean;
  isRouterConfigsExist: boolean;
};

// 当前是否存在工作流
let isSunFlowExist = false;

class SunFlow implements SunFlowType {

  config: SunFlowConfigsType;

  name = 'SunFlowModule';

  sunFlowerApp = null;

  routerConfigs = null;

  isSunFlowerAppExist = false;

  isRouterConfigsExist = false;

  constructor(sunFlowConfigs?: SunFlowConfigsType) {
    if (isSunFlowExist) {
      return;
    }

    this.proxyWorker();

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

    this.sunFlowerApp.__ = sunFlower;
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

    this.routerConfigs.__ = finallyRouterConfigs;
  }

  /**
   * 代理路由配置以及向日葵能力
   * @date 2022-10-10
   * @returns {any}
   */
  proxyWorker() {
    this.sunFlowerApp = new Proxy({}, {
      set: (target, attr, value) => {

        if (attr === '__') {
          
          if (value) {
            this.isSunFlowerAppExist = true;
          }

          this.sunFlowerApp = value;

          this.listenWorker();
        }

        return value;
      }
    });

    this.routerConfigs = new Proxy({}, {
      set: (target, attr, value) => {
        if (attr === '__') {
          
          if (value) {
            this.isRouterConfigsExist = true;
          }

          this.routerConfigs = value;

          this.listenWorker();
        }

        return value;
      }
    })
  }

  /**
   * 监听路由配置以及向日葵能力是否存在
   * @date 2022-10-10
   * @returns {any}
   */
  listenWorker() {
    if (this.isRouterConfigsExist && this.isSunFlowerAppExist) {
      new Runtime({
        app: this.sunFlowerApp,
        routerConfigs: this.routerConfigs
      });
    }
  }
};

export default SunFlow;