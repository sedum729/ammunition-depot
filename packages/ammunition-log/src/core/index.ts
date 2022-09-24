class Log {
  private app: any;

  constructor(logConfig?: any) {
    console.log('logConfig>>', logConfig);
  }

  start() {
    console.log(this.app)
  }
};

export default Log;