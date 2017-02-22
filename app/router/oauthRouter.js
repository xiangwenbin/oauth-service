import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
// import {oauth} from '../koa2-oauth';
const log = log4js.getLogger('DEBUG');

const OauthRouter = router();

// 授权路由


/**
 *  发起get授权请求
 * 
 *  @param client_id
 *  @param state 
 *  @param response_type 
 *  
 *  @example /oauth/authorize?client_id=someClient&state=xyz&response_type=token
 *  
 */
OauthRouter.get('/oauth/authorize', (ctx,next) => {
    log.debug(ctx.session);
    if(!ctx.session.userId) {
        log.debug('User not authenticated, redirecting to /login');
        ctx.session.query = {
            state:         ctx.request.query.state,
            scope:         ctx.request.query.scope,
            client_id:     ctx.request.query.client_id,
            redirect_uri:  ctx.request.query.redirect_uri,
            response_type: ctx.request.query.response_type
        };

        ctx.redirect('/login');
        return;
    }
    const client = db.clients.find((client) => {
        return client.id === ctx.session.query.client_id;
    });

    if(!client) { ctx.throw(401, 'No such client'); }
    ctx.request.body         = ctx.session.query;
    ctx.request.body.user_id = ctx.session.userId;
    return next();
}, oauth.authorize({
    authenticateHandler: {
        handle: (req, res) => {
            return db.users.find((user) => {
                return user.id === req.body.user_id;
            });
        }
    }
}));

OauthRouter.get('/oauth/info', (ctx, next) => {

  ctx.body = '{"status":"UP"}';
});

export default OauthRouter;