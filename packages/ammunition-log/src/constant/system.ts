export enum SystemLog {
  Crash = '0001',
  SunFlow_NoRouterConfigs = '1001', // 未获取到路由配置
  SunFlow_GetRouterConfigsError = '1002', // 获取路由配置函数执行错误
  SunFlow_NotGetSunFlower = '1003', // 工作流中未获取到向日葵
};