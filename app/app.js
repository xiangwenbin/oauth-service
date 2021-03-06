/**
 * 服务启动入口
 * convert 包的作用 转换过时的generator中间件到anync中间件，如kao-static,koa-logger 
 */
import CONFIG from './config.js';
import Koa from 'koa';
import convert from 'koa-convert';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import session from "koa2-cookie-session";
import path from 'path';
import { argv } from 'optimist';

import { TestRouter, LoginRouter, OauthRouter, ErrorRouter, UserRouter ,SignUpRouter} from './router';
import koaBody from './filter/koa-body';
import bodyParser from 'body-parser';
import { oauth } from './koa2-oauth';


import log4js from './log4js';
import co from 'co';
import render from 'koa-ejs';
// import nunjuck from 'koa2-nunjucks/lib/index.js';
import nunjucks from 'nunjucks';

const app = new Koa();
const log = log4js.getLogger("DEBUG");

//获取启动入参 node index.js --ip 127.0.0.1
log.debug("argv:", argv);

if (!argv.ip) {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details) {
            //获取本地无线的ip
            if (details.family == 'IPv4' && (dev.toLowerCase() == "wlan")) {
                argv.ip = details.address;
            }
        });
    }
    log.debug("argv.ip", argv.ip);
}

//NODE_ENV dev ,test,production defualt dev

log.debug("NODE_ENV:" + process.env.NODE_ENV);
log.debug("启动目录:" + __dirname);

// import sequelize from './sequelize/sequelize';
// sequelize.authenticate().then(function(err) {
//         console.log('Connection has been established successfully.');
//     }).catch(function(err) {
//         console.log('Unable to connect to the database:', err);
//     });
/**
 * 设置静态文件目录
 * 
 */
log.debug("设置静态文件目录:/public");
app.use(convert(koaStatic('public/static')));



/**
 * 设置回话
 * 
 */
app.use(session({
    key: "SESSIONID", //default "koa:sid" 
    expires: 3, //default 7 
    path: "/" //default "/" 
}));
// path.resolve(__dirname, '../public/template')
/**
 * 设置ejs模版
 */
// log.debug("设置ejs模版");
// render(app, {
//     // root: path.join(__dirname, 'template'),
//     root:path.resolve(__dirname, '../public/template'),
//     layout: false,
//     viewExt: 'ejs',
//     cache: false,
//     debug: true
// });
// app.context.render = co.wrap(app.context.render);



const nj = (config = {}) => {
    let { debug = false, ext = 'html', path = './', njConfig = {} } = config
    let env = nunjucks.configure(path, njConfig)
    return async (ctx, next) => {
        ctx.render = (file, data = {}) => {
            return new Promise((resolve, reject) => {
                env.render(file + '.' + ext, data, (error, result) => {
                    if (error) {
                        if (debug) {
                            console.log(error)
                        }
                        result = error.message
                    }
                    ctx.type = 'text/html; charset=utf-8'
                    ctx.body = result
                    resolve()
                })
            })
        }
        await next()
    };
};

app.use(nj({
    debug: true,
    ext: 'njk',
    path: path.resolve(__dirname, '../public/template'),
    njConfig: {
        watch: false
    }
}))

/**
 * 设置oauth2 
 */
log.debug("设置KoaOAuthServer");
app.oauth = oauth;


/**
 * 异常处理
 * 
 */
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        log.error(err);
        err.status = err.statusCode || err.status || 500;
        if (!ctx.isAjax) {
            ctx.redirect(`/error/${err.status}`);
        } else {

            ctx.body = JSON.stringify({ code: err.status, msg: err.message || '服务器异常' });
        }
    }
});

/**
 * 访问日志 
 * 
 */
// app.use(log4js.connectLogger(log4js.getLogger('access'), { level: log4js.levels.INFO }));
log.debug("设置访问日志");
app.use(convert(logger()));



/**
 * 前置过滤器 
 * 
 */
app.use(async (ctx, next) => {
    console.log("session:", ctx.session);
    await next();
});

/**
 * header处理
 * X-Requested-With 异步接口标示
 */
app.use(async (ctx, next) => {
    // log.debug(ctx.header);
    if (ctx.header["X-Requested-With".toLowerCase()] == "XMLHttpRequest") {
        ctx.isAjax = true;
    }
    await next();
});

/**
 * 使用 自定义koabody中间件 提取body信息
 * 
 */
log.debug("设置request body filter");
app.use(koaBody());

/**
 * 请求路由
 * 
 */
// app.use(bodyParser.text({type: 'application/graphql'}));
log.debug("设置请求路由");

app.use(ErrorRouter.routes());
app.use(TestRouter.routes());
app.use(LoginRouter.routes());
app.use(OauthRouter.routes());
app.use(UserRouter.routes());
app.use(SignUpRouter.routes());


/**
 * 默认404请求返回值
 * 
 */
app.use((ctx) => {

    if (!ctx.isAjax) {
        ctx.redirect(`/error/404`);
    } else {
        ctx.body = JSON.stringify({ code: 404, msg: '404' });
    }

});


app.on('error', (err, ctx) => {
    log.error('服务异常：', err, ctx);
});

app.listen(CONFIG.server.port, () => log.debug(`server started ${CONFIG.server.port}`));

//进程退出事件
process.on('exit', () => {
    log.error("进程终止");
});