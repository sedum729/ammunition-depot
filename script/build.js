const rollup = require('rollup'); // 引入rollup
const terser =require('rollup-plugin-terser').terser // 压缩代码的插件
const commonjs = require('rollup-plugin-commonjs') // rollup默认支持es6的模块系统，需要支持commonjs的话需要这个插件
const babel = require('rollup-plugin-babel') // rollup的babel 插件 
const args = process.argv[2] // 拿到 npm run build packName 中的packName

const projectPath = `./packages/${args}` // 子包所在的路劲

// 输入的文件配置
const inputOptions = {
  input: `${projectPath}/src/index.js`,
  plugins: [
    babel({ // babel文件的设置，会读取根目录的babel.config.js文件配置
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    commonjs(),
    terser()
  ]
};
// 输出的配置
const outputOptions = {
  file:  `${projectPath}/lib/index.js`,
  format: 'esm',  // 引出的方式为es6的方式
  name: `${args}` // 输出可引用名为package的名字
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions); // inputOptions放在这里

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  await bundle.write(outputOptions); // outputOptions放在这里
}

build();