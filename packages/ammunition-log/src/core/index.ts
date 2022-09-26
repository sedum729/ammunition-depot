enum EnumInfoPrefix {
  Log = '[Ammunition Info]:',
  Warn = '[Ammunition Error]:',
  Error = '[Ammunition Error]:',
}

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
    ctx.registerAbility('log', this.genPrintFun.call(this, EnumInfoPrefix.Log));
    ctx.registerAbility('warn', this.genPrintFun.call(this, EnumInfoPrefix.Warn));
    ctx.registerAbility('Error', this.genPrintFun.call(this, EnumInfoPrefix.Error));
    ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  genPrintFun(prefix: string) {
    return (logInfo: any, logCode: string) => {
      let printInfo = prefix;

      if (logCode) {
        printInfo += ` [${logCode}]`;
      }

      if (logInfo) {
        printInfo += ` ${logInfo}`;
      }

      if (printInfo !== prefix) {
        const curTime = `${new Date}`;

        console.error(printInfo);

        this.setLogHistory({
          logTime: curTime,
          logInfo: printInfo
        });
      }
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