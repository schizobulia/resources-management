'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/v1/login', controller.home.login);


  //about video api
  router.get('/api/v1/video', app.jwt, controller.video.index);
  router.post('/api/v1/video/conversion', app.jwt, controller.video.conversion);
  router.get('/api/v1/video/task', app.jwt, controller.video.tasks);
};