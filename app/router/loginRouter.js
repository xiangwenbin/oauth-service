import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const LoginRouter = router();
import { UserService } from '../service';
import redisClient from "../redis/redis";

/**
 * 登陆路由
 */
LoginRouter.get('/login', async(ctx, next) => {

    await ctx.render("login", { msg: 'hello world' });
    // ctx.body = "getTest body";
});
/**
 * 登陆验证
 */
LoginRouter.post('/login', async(ctx) => {
    const creds = ctx.request.body;
    log.debug(`Authenticating ${creds.username}`);

    // const user = db.users.find((user) => {
    //     return user.username === creds.username &&
    //         user.password === creds.password;
    // });
    let user = await UserService.getUserByUserNameAndPassword(creds).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    if (!user) {
        log.debug('Invalid credentials');
        ctx.redirect('/login?valCode=1');
        return;
    }



    log.debug(`Success!`);

    let uuid = ctx.cookies.get("session:uuid");
    let uuidCache = await redisClient.hgetallAsync(`session:${uuid}`).then((result) => {
        log.debug(`cache session:${uuid}`,result);
        return result;
    });
    uuidCache.userId = user.id;
    redisClient.hmset(`session:${uuid}`, uuidCache);
    // ctx.session.userId = user.id;

    // If we were sent here from grant page, redirect back
    if (uuidCache.client_id) {
        log.debug('Redirecting back to grant dialog');
        ctx.redirect('/oauth/authorize');
        return;
    }

    // ctx.throw("400","clientId is null");
    // If not do whatever you fancy
    ctx.redirect('/');
});

LoginRouter.get('/login/info', (ctx, next) => {
    ctx.body = '{"status":"UP"}';
});

export default LoginRouter;