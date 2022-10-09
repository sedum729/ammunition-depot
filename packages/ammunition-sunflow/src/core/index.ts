class SunFlow {

  config: any;

  name: string = 'SunFlowModule';

  constructor(logConfig?: any) {
    this.config = logConfig;
  }

  prepare(ctx: any) {
    // ctx.registerAbility('log', this.log.bind(this));
    // ctx.registerAbility('warn', this.warn.bind(this));
    // ctx.registerAbility('error', this.error.bind(this));
    // ctx.registerAbility('getLogHistory', this.getLogHistory.bind(this));
  }

  start(ctx: any) {
    
  }
};

export default SunFlow;