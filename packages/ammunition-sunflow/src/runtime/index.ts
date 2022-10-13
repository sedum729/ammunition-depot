import { IRouterConfigs } from 'core';

import History, { EHistoryMode } from '../router';

const memoryHistory = new History(EHistoryMode.Memory);
const browerHistory = new History(EHistoryMode.Brower);

browerHistory.push('xxxx');

console.log('memoryHistory>>', memoryHistory);

console.log('browerHistory>>', browerHistory);

/**
 * 1. 使用 browerHistory 或者 hashHistory 做路由跳转，并监听
 * 2. 监听到路由的变化时需要做的事情？
 *  - 1. 需要根据当前路由查找到传入路由配置的信息
 *  - 2. 对前一个路由进行卸载操作
 *  - 3. 对当前匹配到的路由进行装载操作
 * 
 * 3. 需要搞明白 iframe + web component 如何处理内容加载 js隔离 css 隔离
 *  - 1. 重写 sunflower
 * 
 * 4. 如何给 iframe 注入当前插件的能力
*/

type TypeRunTime = {
  app: any;
  routerConfigs: IRouterConfigs
};

class Runtime implements TypeRunTime {
  app = null;

  routerConfigs = null;

  constructor({ app, routerConfigs }) {
    this.app = app;
    this.routerConfigs = routerConfigs;
  }


};

export default Runtime;