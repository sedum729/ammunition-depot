const rawArgs = process.argv[2]      // 获取包名 
const testFile = process.argv[3]|| ''    // 获取测试文件名
const path = require('path')
let rootDir = path.resolve(__dirname, '../')


rootDir = rootDir + '\\packages\\' + rawArgs // 拼出包的路劲

const jestArgs = [
  '--runInBand',
  '--rootDir', rootDir,  // 传入包路径
  testFile?`${testFile}.spec.js`:'' // 
] // jest 的一些配置

console.log(`\n===> running: jest ${jestArgs.join(' ')}`)

require('jest').run(jestArgs) // 执行