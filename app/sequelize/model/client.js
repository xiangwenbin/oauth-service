import Sequelize from 'sequelize';
import sequelize from '../sequelize';
import { MD5 } from "jshashes";
var md5 = new MD5();
var Client = sequelize.define('Client', {
    id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    secret: {
        type: Sequelize.STRING,
        allowNull: false
    },
    grantType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    clientId: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    clientName: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    scope: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    redirectUri: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    validate: {

    },
    timestamps: false,
    freezeTableName: true,
    tableName: 'AccountCenter_Client'
});
export default Client;