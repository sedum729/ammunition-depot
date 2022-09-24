import path from 'path';

import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const entryPath = path.resolve(process.cwd(), './src/index.ts');
const outputPath = path.resolve(process.cwd(), './lib/bundle.js');
const tsConfigPath = path.resolve(process.cwd(), '../../tsconfig.json');

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
    terser(),
  ],
}
