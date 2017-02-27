import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';

import { UserService, ClientService } from '../service';
import { UserFacade } from '../facade';
import redisClient from "../redis/redis";

const TestRouter = router();
const log = log4js.getLogger('DEBUG');

/**
 * unit 测试路由
 */
TestRouter.get('/getTest', async(ctx, next) => {


    await ctx.render("test", { msg: 'hello world' });
    // ctx.body = "getTest body";
});

TestRouter.get('/test/user/:id', async(ctx, next) => {

    var result = await UserService.getUserById(ctx.params.id).then((user) => {
        return user == null ? null : user.get({
            plain: true
        });
    });
    ctx.body = result ? result : "null";
});
TestRouter.put('/test/user/', async(ctx, next) => {
    var user = ctx.request.body;
    console.log(user);
    var result = await UserService.createUser(user).then((user) => {
        return user;
    });

    ctx.body = result ? result : "null";
});
TestRouter.put('/test/user2/', async(ctx, next) => {
    var user = ctx.request.body;
    console.log(user);
    var result = await UserFacade.createUser(user).then((user) => {
        return user;
    });
    ctx.body = result ? result : "null";
});
TestRouter.post('/test/user/', async(ctx, next) => {
    var user = ctx.request.body;
    console.log(user);
    var result = await UserService.updateUserById(user).then((user) => {
        return user;
    });

    ctx.body = result ? result : "null";
});

TestRouter.put('/test/client/', async(ctx, next) => {
    var client = ctx.request.body;
    console.log(client);
    var result = await ClientService.createClient(client).then((client) => {
        return client;
    });
    ctx.body = result ? result : "null";
});
TestRouter.get('/test/client/:id', async(ctx, next) => {
    var result = await redisClient.hgetallAsync(`client:${ctx.params.id}`).then((r)=>{
        return r;
    });
    console.log(`client:${ctx.params.id}`,result);
    if (!result) {
        result = await ClientService.getClientById(ctx.params.id).then((client) => {
            return client == null ? null : client.get({
                plain: true
            });
        });
        redisClient.hmset(`client:${ctx.params.id}`,result);
        console.log(`client:${ctx.params.id}`,result);
    }
    ctx.body = result ? result : "null";
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