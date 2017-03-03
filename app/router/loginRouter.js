import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const LoginRouter = router();
import { UserService } from '../service';
import { UserFacade} from '../facade';
import redisClient from "../redis/redis";
import REGULAR from "../const/regular";
/**
 * 登陆页
 */
LoginRouter.get('/login', async(ctx, next) => {
    await ctx.render("login", { msg: 'hello world' });
   
});

/**
 * 表单同步提交登陆验证
 */
LoginRouter.post('/login', async(ctx) => {
    const credentials = ctx.request.body;
    log.debug(`Authenticating ${credentials.username}`);

    let user = await UserService.getUserByUserNameAndPassword(credentials).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    if (!user) {
        log.debug('用戶名密码错误');
        ctx.redirect('/login?valCode=1');
        return;
    }

    let uuid = ctx.cookies.get("session:uuid");
    let uuidCache = await redisClient.hgetallAsync(`session:${uuid}`).then((result) => {
        log.debug(`cache session:${uuid}`, result);
        return result;
    });
    uuidCache.userId = user.id;
    redisClient.hmset(`session:${uuid}`, uuidCache);

    if (uuidCache.client_id) {
        log.debug('Redirecting back to grant dialog');
        ctx.redirect('/oauth/authorize');
        return;
    }

    // ctx.throw("400","clientId is null");
    // If not do whatever you fancy
    ctx.redirect('/');
});

/**
 * 异步登录验证 
 * @param{Object} credentials
 */
LoginRouter.post('/login/verify', async(ctx) => {
    const requestBody = ctx.request.body;
    let username = requestBody.username;
    let credentials = {
        password: requestBody.password
    };
    //用户名校验
    if (REGULAR.MOBILE.test(username)) {
        credentials.mobile = username;
    } else if (REGULAR.EMAIL.test(username)) {
        credentials.email = username;
    } else if (REGULAR.USERNAME.test(username)) {
        credentials.username = username;
    } else {
        return ctx.throw(400, "用户名不合法");
    }

    let user = await UserFacade.getUserByCredentials(credentials).then((result) => {
        return result == null ? null : result.get({
            plain: true
        });
    });
    if (!user) {
        return ctx.throw(400, "用户名密码错误");
    }

    let uuid = ctx.cookies.get("session:uuid");
    let uuidCache = await redisClient.hgetallAsync(`session:${uuid}`).then((result) => {
        return result;
    });
    uuidCache.userId = user.id;
    redisClient.hmset(`session:${uuid}`, uuidCache);
    return ctx.body = JSON.stringify(Util.getSuccJsonResult("succ"));
    
});


export default LoginRouter;