import CONFIG from '../config.js';
import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';

// 创建事务命名空间
let namespace = cls.createNamespace('my-oauth-sequelize-transaction');
let ds = CONFIG.datasource;
Sequelize.cls = namespace;
var sequelize = new Sequelize(ds.database, ds.username, ds.password, {
    host: ds.host,
    dialect: 'mysql',
    pool: {
        max: ds.pool.max,
        min: ds.pool.min,
        idle: ds.pool.idle
    }
});
export default sequelize;