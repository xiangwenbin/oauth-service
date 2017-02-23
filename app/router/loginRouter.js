import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const LoginRouter = router();
import { UserService } from '../service';
/**
 * 登陆路由
 */
LoginRouter.get('/login', async(ctx, next) => {
    var result = await UserService.getUserById(1).then((user) => {
        return user == null ? null : user.get({
            plain: true
        })
    });
    log.debug(result);
    await ctx.render("login", { msg: 'hello world' });
    // ctx.body = "getTest body";
});
/**
 * 登陆验证
 */
LoginRouter.post('/login', (ctx) => {
    const creds = ctx.request.body;
    log.debug(`Authenticating ${creds.username}`);

    const user = db.users.find((user) => {
        return user.username === creds.username &&
            user.password === creds.password;
    });

    if (!user) {
        log.debug('Invalid credentials');
        ctx.redirect('/login?valCode=1');
        return;
    }

    log.debug(`Success!`);
    ctx.session.userId = user.id;

    // If we were sent here from grant page, redirect back
    if (ctx.session.hasOwnProperty('query')) {
        log.debug('Redirecting back to grant dialog');
        ctx.redirect('/oauth/authorize');
        return;
    }

    // If not do whatever you fancy
    ctx.redirect('/');
});

LoginRouter.get('/login/info', (ctx, next) => {
    ctx.body = '{"status":"UP"}';
});

export default LoginRouter;