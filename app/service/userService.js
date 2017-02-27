import rp from 'request-promise';
import _ from 'lodash';
import { User } from '../sequelize/model';


/**
 * 用户服务
 */
class UserService {

    /**
     * 创建用户
     */
    static createUser(user) {
        return User.create(user, {
            fields: [
                "username", "password", "email", "mobile", "areaCode"
            ],
            attributes: {exclude: ['password']}
        },{

        });
    }

    /**
     * 通过id查找 用户
     */
    static getUserById(id) {
        return User.findById(id,{
            attributes: {exclude: ['password'] }
        });
    }

    /**
     * 通过用户名，密码查找用户
     */
    static getUserByUserNameAndPassword({ username, password }) {
        return User.findOne({
            where: {
                username: username,
                password: password
            }
        });
    }


    /**
     * 通过id 修改用户
     */
    static updateUserById(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            fields: [
                "username", "email", "mobile", "areaCode"
            ]
        });
    }

    /**
     * 修改密码
     */
    static updatePassword(user) {
        return User.update(user, {
            where: {
                id: user.id
            },
            fields: [
                "password"
            ]
        });
    }
}

export default UserService;