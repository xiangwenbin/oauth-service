import _ from 'lodash';
import CONFIG from '../config.js';
import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
import { oauth } from '../koa2-oauth';
import redisClient from "../redis/redis";
import { UserService, ClientService } from '../service';

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
 *  @example /oauth/authorize?client_id=someClient&state=xyz&response_type=code
 *  
 */
OauthRouter.get('/oauth/authorize', async(ctx, next) => {
    
    //验证缓存里是否存在用户认证信息
    let uuid = ctx.cookies.get("session:uuid");
    let uuidCache = uuid ? await redisClient.hgetallAsync(`session:${uuid}`).then((result) => {
        log.debug(`cache session:${uuid}`, result);
        return result;
    }) : null;
    if (!(uuidCache && uuidCache.userId)) {
        log.debug('User not authenticated, redirecting to /login');
        let query = {
            state: ctx.request.query.state||'',
            scope: ctx.request.query.scope||'',
            client_id: ctx.request.query.client_id,
            redirect_uri: ctx.request.query.redirect_uri||'',
            response_type: ctx.request.query.response_type
        };
        uuid = Util.generateUUID();
        log.debug(`generateUUID:`, uuid);
        // ctx.cookies.set("session:uuid", uuid, {domain: CONFIG.domain});
        ctx.cookies.set("session:uuid", uuid);
        // _.merge({}, query)
        redisClient.hmset(`session:${uuid}`, _.merge({}, query));
        ctx.redirect('/login');
        return;
    }

    ctx.request.body = uuidCache;
    return next();
}, oauth.authorize({
    authenticateHandler: {
        handle: async(req, res) => {

            let user = await UserService.getUserById(req.body.userId).then((result) => {
                return result == null ? null : result.get({
                    plain: true
                });
            });
            return user;
        }
    }
}));

/**
 * 
 * 通过授权码获取访问token
 * Content-type application/x-www-form-urlencoded
 * @param  client_id
 * @param  client_secret
 * @param  grant_type authorization_code
 * @param  code
 * @param  scope all
 */
OauthRouter.post('/oauth/token', oauth.token(),(ctx, next)=>{
    return ;
});

OauthRouter.get('/oauth/info', (ctx, next) => {

    ctx.body = '{"status":"UP"}';
});

export default OauthRouter;