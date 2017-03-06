import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const SignUpRouter = router();
import { UserService,SMSService } from '../service';
/**
 * 注冊
 */
SignUpRouter.get('/signup', async(ctx, next) => {
    await ctx.render("pages/signup", { msg: 'hello world' });
   
});

/**
 * 注册请求
 */
SignUpRouter.post('/signup/mobile', async(ctx, next) => {
    let body=ctx.request.body;
    console.log(body);
    return ctx.body = JSON.stringify(Util.getSuccJsonResult("succ"));
   
});

/**
 * 发送验证码
 */
SignUpRouter.get('/signup/sendCode/:mobile', async(ctx, next) => {
    let mobile=ctx.params.mobile;
    console.log(mobile);
    let result=await SMSService.sendCode(mobile).then((result)=>{
        console.log(result);
        return result;
    });
    return ctx.body = JSON.stringify(result);
   
});
/**
 * 注冊协议
 */
SignUpRouter.get('/introduce/portocal', async(ctx, next) => {
    await ctx.render("pages/portocal", { msg: 'hello world' });
   
});



export default SignUpRouter;