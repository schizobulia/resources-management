// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: '/public/',
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/index',
        },
        {
          path: '/video',
          component: '../pages/video',
        },
        {
          path: '/users/login',
          component: '../pages/users/login',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: false,
        dynamicImport: false,
        title: 'view',
        dll: false,
        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],
};

