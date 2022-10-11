import path from 'path';

import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import alias from '@rollup/plugin-alias';

const entryPath = path.resolve(process.cwd(), './src/index.ts');
const outputPath = path.resolve(process.cwd(), './lib/bundle.js');
const tsConfigPath = path.resolve(process.cwd(), '../../tsconfig.json');

const corePath = path.resolve(process.cwd(), './src/core');
const logPath = path.resolve(process.cwd(), './src/log');
const utilsPath = path.resolve(process.cwd(), './src/utils');
const runtimePath = path.resolve(process.cwd(), './src/runtime');
const routerPath = path.resolve(process.cwd(), './src/router');

export default {
  input: entryPath, // 入口文件
  output: {
    file: outputPath, // 出口文件
    name: 'bundle', // 出口文件
    format: 'es', // 输出的模块语法格式 umd/es/cjs
    globals: {
      lodash: 'lodash',
    },
  },
  plugins: [
    typescript({
      check: false,
      tsconfig: tsConfigPath,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.ts', '.js'],
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    }),
    alias({
      entries: [
        { find: 'core', replacement: corePath },
        { find: 'log', replacement: logPath },
        { find: 'utils', replacement: utilsPath },
        { find: 'runtime', replacement: runtimePath },
        { find: 'router', replacement: routerPath },
      ]
    }),
    terser(),
  ],
}
