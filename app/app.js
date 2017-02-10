/**
 * 设置默认环境变量
 */
process.env.NODE_ENV = !process.env.NODE_ENV ? "dev" : process.env.NODE_ENV;

/**
 * 服务启动入口
 * convert 包的作用 转换过时的generator中间件到anync中间件，如kao-static,koa-logger 
 */
import Koa from 'koa';
import convert from 'koa-convert';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import session from "koa2-cookie-session";
import Yaml from 'yaml-config';
import path from 'path';
import { argv } from 'optimist';

import {TestRouter,LoginRouter,OauthRouter } from './router';
import koaBody from './filter/koa-body';
import bodyParser from 'body-parser';
import {oauth,KoaOAuthServer,model} from './koa2-oauth';


import log4js from './log4js';
import co from 'co';
import render from 'koa-ejs';


//获取启动配置参数
global.CONFIG = Yaml.readConfig(path.join(__dirname, 'appliction.yml'), process.env.NODE_ENV);
const app = new Koa();
const log = log4js.getLogger('DEBUG');

//获取启动入参 node index.js --ip 127.0.0.1
console.log("argv:", argv);

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
  console.log("argv.ip",argv.ip);
}

//NODE_ENV dev ,test,production defualt dev

log.debug("NODE_ENV:" + process.env.NODE_ENV);
log.debug("启动目录:" + __dirname);

/**
 * 设置静态文件目录
 * 
 */
log.debug("设置静态文件目录:/public");
app.use(convert(koaStatic('public')));



/**
 * 设置回话
 * 
 */
app.use(session({
  key: "SESSIONID",   //default "koa:sid" 
  expires: 3, //default 7 
  path: "/" //default "/" 
}));

/**
 * 设置ejs模版
 */
log.debug("设置ejs模版");
render(app, {
  root: path.join(__dirname, 'template'),
  layout: false,
  viewExt: 'tpl',
  cache: false,
  debug: true
});
app.context.render = co.wrap(app.context.render);

/**
 * 设置oauth2 
 */
log.debug("设置KoaOAuthServer");
global.oauth = app.oauth = new KoaOAuthServer({
    scope: true, // Alternatively string with required scopes (see verifyScope)
    model: model,
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 3600,   // 1 hour
    refreshTokenLifetime: 604800 // 1 week
});

/**
 * 异常处理
 * 
 */
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    err.status = err.statusCode || err.status || 500;
    // throw err;
    log.debug(err);
    ctx.body = JSON.stringify({ code: err.status, data: JSON.stringify(err) });
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

app.use(TestRouter.routes());
app.use(LoginRouter.routes());
app.use(OauthRouter.routes());

/**
 * 默认404请求返回值
 * 
 */
app.use((ctx) => {
  ctx.body = JSON.stringify({ code: 404, data: 'null' });
});


app.on('error', (err, ctx) => {
  console.error('服务异常：', err, ctx);
});

app.listen(CONFIG.server.port, () => log.debug(`server started ${CONFIG.server.port}`));


//进程退出事件
process.on('exit', () => {
  console.log("进程终止");
});