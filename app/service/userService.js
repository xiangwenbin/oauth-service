import rp from 'request-promise';
import _ from 'lodash';
import { User } from '../sequelize/model';


/**
 * 用户服务
 */
class UserService {

    static getUserById(id) {
        return User.findById(id);
    }

    static createUser(user) {
        return User.create(user, {
            logging: true
        });
    }

    static updateUser(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            logging: true
        });
    }
}

export default UserService