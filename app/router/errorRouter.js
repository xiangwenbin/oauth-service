import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';

const ErrorRouter = router();
const log = log4js.getLogger('DEBUG');

/**
 * 错误页面
 */
ErrorRouter.get('/error/:error', async(ctx, next) => {
    ctx.body = ctx.params.error;
});


// ErrorRouter.get('/token', app.oauth.grant());

export default ErrorRouter;