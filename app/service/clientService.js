import rp from 'request-promise';
import _ from 'lodash';
import { Client } from '../sequelize/model';


/**
 * 客户服务
 */
class ClientService {

    /**
     * 创建客户
     */
    static createClient(client) {
        return Client.create(client, {}, {

        });
    }

    /**
     * 通过id查找 客户
     */
    static getClientById(id) {
        return Client.findById(id, {});
    }
}

export default ClientService;