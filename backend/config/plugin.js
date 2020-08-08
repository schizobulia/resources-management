'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate',
  },

  cors: {
    enable: true,
    package: 'egg-cors',
  },

  jwt: {
    enable: true,
    package: "egg-jwt"
  },

  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  }
};
