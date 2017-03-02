import _ from 'lodash';
import CONFIG from '../config.js';
import router from 'koa-router';
import db from '../koa2-oauth/db';
import Util from '../util/util';
import log4js from '../log4js';
import { oauth } from '../koa2-oauth';
import redisClient from "../redis/redis";
import { UserService, ClientService } from '../service';

const log = log4js.getLogger('DEBUG');
const UserRouter = router();

// 用户路由
UserRouter.use(oauth.authenticate());

UserRouter.post('/private/user/',(ctx, next)=>{
     ctx.body = 'xxxx';
     return;
});


export default UserRouter;