import Ammunition from 'Ammunition';
import AmmunitionLogPlugin from 'AmmunitionLogPlugin';
import AmmunitionSunflowerPlugin from 'AmmunitionSunflowerPlugin';
import AmmunitionSunflowPlugin from 'AmmunitionSunflowPlugin';

console.log('Ammunition>>', Ammunition);

const routerConfigs = [
  {
    path: '/',
    name: '首页',
    icon: 'xxx.png',
    hidden: false,
    childRoutes: [
      {
        path: '/welcome',
        name: '欢迎页',
        icon: 'xxx.png',
        hidden: false,
      }
    ]
  }
];

const configs = {
  plugins: [
    new AmmunitionLogPlugin(),
    new AmmunitionSunflowerPlugin(),
    new AmmunitionSunflowPlugin({
      routerConfigs: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(routerConfigs);
          }, 1000);
        })
      }
    }),
  ],
};

const app = new Ammunition(configs);

// const log = app.LogModule.log;
// const getLogHistory = app.LogModule.getLogHistory;


// log('111');

// console.log(getLogHistory());

// log('111');

// console.log(getLogHistory());