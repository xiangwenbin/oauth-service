import queryString from 'query-string';
let util = {
    /**
     * 获取查询参数
     */
    getUrlQueryParam (key) {
        let qureryObject = queryString.parse(location.search);
        return qureryObject[key];
    },
    isLogin(){
        return false;
    },
    getUserInfo(){
        return {};
    },
    getUserName(){
        return "";
    }
}
export default util;