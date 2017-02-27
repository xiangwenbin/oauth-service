import CONFIG from '../config.js';
import Redis from "redis";
import bluebird from 'bluebird';
bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);
let r=CONFIG.redis;
const redisClient = Redis.createClient(r.port,r.host,{password:r.password});
// client.set("string key", "string val", redis.print);
// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset("hash key", {}, redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.expire('string key', 30)
export default redisClient;