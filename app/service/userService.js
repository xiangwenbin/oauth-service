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

    static getUserByUserNameAndPassword({username,password}) {
        return User.findOne({where:{
            username:username,
            password:password
        }});
    }

    static createUser(user) {
        return User.create(user, {
            fields:[
                "username","password","email","mobile","areaCode"
            ]
            
        });
    }

    static updateUserById(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            fields:[
                "username","email","mobile","areaCode"
            ]
        });
    }
}

export default UserService