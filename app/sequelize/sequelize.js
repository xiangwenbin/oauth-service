import CONFIG from '../config.js';
import Sequelize from 'sequelize';
var ds=CONFIG.datasource;
var sequelize = new Sequelize(ds.database,ds.username, ds.password, {
  host: ds.host,
  dialect: 'mysql',
  pool: {
    max: ds.pool.max,
    min: ds.pool.min,
    idle: ds.pool.idle
  }
});
export default sequelize;