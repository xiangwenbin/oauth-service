import rp from 'request-promise';
import _ from 'lodash';
import {User} from '../sequelize/model';


/**
 * 用户服务
 */
class UserService {

    static getUserById(id) {
        return User.findById(id);
    }

    static updateUser(user) {
        if(user.id&&user.id>0){
            
        }
        return User.findById(id);
    }
}

export default UserService