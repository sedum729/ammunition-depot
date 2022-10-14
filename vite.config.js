import { defineConfig } from 'vite'

const path = require('path');

const absolutePath = (pathStr) => path.resolve(process.cwd(), pathStr);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: '/index.html',
  },
  resolve: {
    alias: {
      'Ammunition': absolutePath('./packages/ammunition-core/lib/bundle.js'),
      'AmmunitionLogPlugin': absolutePath('./packages/ammunition-log/lib/bundle.js'),
      'AmmunitionSunflowerPlugin': absolutePath('./packages/ammunition-sunflower/lib/bundle.js'),
      'AmmunitionSunflowPlugin': absolutePath('./packages/ammunition-sunflow/lib/bundle.js'),
    }
  }
})
