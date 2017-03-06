import rp from 'request-promise';
import _ from 'lodash';
import Util from '../util/util';
import CONFIG from '../config.js';
const SMS=CONFIG.smsservice;
let baseUrl=`http://${SMS.host}:${SMS.port}`;
/**
 * 短信服务
 */
class SMSService {
    /**
     * 手机号注册 验证码发送
     * @param {String} mobile 
     */
    static sendCode(mobile) {
        let options = Util.getDefaultHeads();
         _.assign(options,{
            json: true,
            uri:`${baseUrl}/sendCode/signup/${mobile}`
        })
       
        return rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        )
    }

    /**
     * 
     * 验证码验证
     * @param {String} mobile 
     * @param {String} code 
     */
    static valCode(mobile,code) {
        let options = Util.getDefaultHeads();
         _.assign(options,{
            json: true,
            uri:`${baseUrl}/check/${mobile}/${code}`
        })
        return rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        );
    }
}
export default SMSService;