class Log {

  config: any;

  constructor(logConfig?: any) {
    this.config = logConfig;
  }

  start(ctx: any) {
    console.log('获取到参数>>', ctx, this.config);
  }
};

export default Log;