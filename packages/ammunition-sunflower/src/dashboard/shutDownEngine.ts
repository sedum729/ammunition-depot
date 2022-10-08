import { isFunction } from 'toolkit';

import store from 'store';

const shutDownEngine = (appName: string): void => {
  const appInstance = store.getInstanceByName(appName);

  if (appInstance && appInstance.destroy && isFunction(appInstance.destroy)) {
    appInstance.destroy();
  }
};

export default shutDownEngine;