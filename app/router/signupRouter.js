import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const SignUpRouter = router();
import { UserService, SMSService } from '../service';
import { UserFacade } from '../facade';

/**
 * 注冊
 */
SignUpRouter.get('/signup', async(ctx, next) => {
    await ctx.render("pages/signup", { msg: 'hello world' });

});

/**
 * 手机号注册请求
 */
SignUpRouter.post('/signup/mobile', async(ctx, next) => {
    let { mobile, password, code, nickname } = ctx.request.body;
    // console.log(body);

    console.log(mobile, password, code, nickname);
    //校验手机号唯一性
    let user = await UserService.getUserByMobile(mobile).then((result) => {
        if (!result) {
            return result;
        } else {
            ctx.throw(400, "该手机号已经被注册");
        }
    });
    console.log("user:", user);
    //校验验证码
    let smsResult = await SMSService.valCode(mobile, code).then((result) => {
        console.log(result);
        if (result.code == 200) {
            return true;
        } else {
            ctx.throw(result.code, result.msg);
        }
    }).catch((error)=>{
       console.log("error:", error);
    });
 
    user = {
        mobile: mobile,
        password: password,
        userInfo: {
            nickname: nickname
        }
    };

    user = await UserFacade.createUser(user).then((result) => {
        return result;
    });
    return ctx.body = JSON.stringify(Util.getSuccJsonResult(user));

});

/**
 * 发送验证码
 */
SignUpRouter.get('/signup/sendCode/:mobile', async(ctx, next) => {
    let mobile = ctx.params.mobile;
    console.log(mobile);
    let result = await SMSService.sendCode(mobile).then((result) => {
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