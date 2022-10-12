import { IRouterConfigs } from 'core';

import History, { EHistoryMode } from '../router';

const memoryHistory = new History(EHistoryMode.Memory);
const browerHistory = new History(EHistoryMode.Brower);

browerHistory.push('xxxx');

console.log('memoryHistory>>', memoryHistory);

console.log('browerHistory>>', browerHistory);

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