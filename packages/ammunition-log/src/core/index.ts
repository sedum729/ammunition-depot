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

  prepare(ctx: any) {
    ctx.registerAbility('log', this.log.bind(this));
    ctx.registerAbility('warn', this.warn.bind(this));
    ctx.registerAbility('error', this.error.bind(this));
    ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  start(ctx: any) {
    
  }

  log() {
    return this.genPrintFun.call(this, EnumInfoPrefix.Log, 'log');
  }

  warn() {
    return this.genPrintFun.call(this, EnumInfoPrefix.Warn, 'warn');
  }

  error() {
    return this.genPrintFun.call(this, EnumInfoPrefix.Error, 'error');
  }

  genPrintFun(prefix: string, printName: string) {
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

        console[printName || 'log'](printInfo);

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