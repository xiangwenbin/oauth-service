import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';

const ErrorRouter = router();
const log = log4js.getLogger('DEBUG');

/**
 * 错误页面
 */
ErrorRouter.get('/error/:error', async(ctx, next) => {
    let message=ctx.request.body||'';
    ctx.body = ctx.params.error;
    await ctx.render(`pages/error/${ctx.params.error}`, { message: message});
});



export default ErrorRouter;