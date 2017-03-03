import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const LoginRouter = router();
import { UserService } from '../service';
/**
 * 注冊
 */
LoginRouter.get('/signup', async(ctx, next) => {
    
    await ctx.render("login", { msg: 'hello world' });
    // ctx.body = "getTest body";
});


export default LoginRouter;