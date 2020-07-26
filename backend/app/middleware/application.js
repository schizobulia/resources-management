'use strict';
/**
 * video error
 */
module.exports = (option, app) => {
    return async function (ctx, next) {
        try {
            await next();
        } catch (err) {
            app.emit('error', err, this);
            getErrRes(err, ctx);
        }
    };
};

/**
 * by error code result some info
 * @param {*} code 
 */
function getErrRes(err, ctx) {
    if (err.code === "EPERM") {
        ctx.body = { code: 2, error: 'task is start now' };
    }
    if (err.code === "credentials_required") {
        ctx.body = { code: 2, error: 'No authorization token was found' };
    }
}