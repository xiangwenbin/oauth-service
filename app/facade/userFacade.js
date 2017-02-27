import { UserService, UserInfoService } from '../service';
import sequelize from '../sequelize/sequelize';

class UserFacade {
    /**
     * 创建用户的同时创建用户信息表
     */
    static createUser(user) {
        return sequelize.transaction((t) => {
           return  UserService.createUser(user).then(async(u) => {
                let _u = u.get({
                    plain: true
                });
                let _ui = user.userInfo || {};
                _ui.userId = _u.id;
                _ui = await UserInfoService.createUserInfo(_ui).then((ui) => {
                    return ui.get({
                        plain: true
                    });
                });
                _u.userInfo = _ui;
                return _u;
            });
        });
    }
}

export default UserFacade;