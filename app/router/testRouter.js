import router from 'koa-router';
import Util from '../util/util';
const TestRouter = router();
/**
 * 公共路由
 */
TestRouter.get('/getTest', async (ctx, next) => {
  await ctx.render("test", {msg:'hello world'});
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