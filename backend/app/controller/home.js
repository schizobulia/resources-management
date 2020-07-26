'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async login() {
    const { ctx, app } = this;
    const info = ctx.request.body;
    ctx.validate({ username: 'string', password: 'string' }, info);
    if (info.username === '123456' && info.password === 'admin') {
      const token = app.jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 128),
      }, app.config.jwt.secret);
      ctx.body = { code: 1, data: { token: token } };
    } else {
      ctx.body = { code: 0, err: 'username or password is error' };
    }
  }
}

module.exports = HomeController;
