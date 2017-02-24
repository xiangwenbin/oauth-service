import router from 'koa-router';
import Util from '../util/util';
import { UserService } from '../service';
const TestRouter = router();
/**
 * unit 测试路由
 */
TestRouter.get('/getTest', async(ctx, next) => {
    var result = await UserService.getUserById(1).then((user) => {
        return user == null ? null : user.get({
            plain: true
        })
    });
    log.debug(result);

    await ctx.render("test", { msg: 'hello world' });
    // ctx.body = "getTest body";
});
TestRouter.get('/mservice/:serviceName', (ctx, next) => {
    ctx.body = serviceName;
});
TestRouter.get('/info', (ctx, next) => {
    console.log(ctx.oauth);
    ctx.body = '{"status":"UP"}';
});

// TestRouter.get('/token', app.oauth.grant());

export default TestRouter;