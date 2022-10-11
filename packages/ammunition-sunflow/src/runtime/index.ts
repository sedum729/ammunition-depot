import { IRouterConfigs } from 'core';

console.log('history>>', history);

type TypeRunTime = {
  app: any;
  routerConfigs: IRouterConfigs
};

class Runtime implements TypeRunTime {
  app = null;

  routerConfigs = null;

  constructor(props) {
    console.log('>>>', props);
  }
};

export default Runtime;