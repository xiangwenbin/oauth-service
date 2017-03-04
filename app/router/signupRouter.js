import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const SignUpRouter = router();
import { UserService } from '../service';
/**
 * 注冊
 */
SignUpRouter.get('/signup', async(ctx, next) => {
    await ctx.render("pages/signup", { msg: 'hello world' });
   
});

/**
 * 注冊协议
 */
SignUpRouter.get('/introduce/portocal', async(ctx, next) => {
    await ctx.render("pages/portocal", { msg: 'hello world' });
   
});



export default SignUpRouter;