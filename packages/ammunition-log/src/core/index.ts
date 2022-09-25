const logInfoPrefix = `Ammunition Error:`;

interface IlogStore {
  [logTime: string]: string
}

const logStore: IlogStore = {};


class Log {

  config: any;

  name: string = 'LogModule';

  constructor(logConfig?: any) {
    this.config = logConfig;
  }

  start(ctx: any) {
    ctx.registerAbility('log', this.log.bind(this));
    ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  log(logInfo: any, logCode: string) {
    Promise.resolve();

    let printInfo = logInfoPrefix;

    if (logCode) {
      printInfo += ` [${logCode}]`;
    }

    if (logInfo) {
      printInfo += ` ${logInfo}`;
    }

    if (printInfo !== logInfoPrefix) {
      const curTime = `${new Date}`;

      console.error(printInfo);

      this.setLogHistory({
        logTime: curTime,
        logInfo: printInfo
      });
    }
  }

  getLogHistory() {
    return logStore;
  }

  setLogHistory({ logTime, logInfo }) {
    logStore[logTime] = logInfo;
  }
};

export default Log;