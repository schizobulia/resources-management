/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595248998987_3044';

  // add your middleware config here
  config.middleware = ['application'];

  config.jwt = {
    secret: "123456admin"
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: false
    },
    domainWhiteList: ['*']
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    origin: '*',
  };

  config.multipart = {
    mode: 'stream',
    fileExtensions: ['']
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
