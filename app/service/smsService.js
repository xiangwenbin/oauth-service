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
    // static baseUrl=`:/${SMS.host}:${SMS.port}`;
    static sendCode(mobile) {
        let options = Util.getDefaultHeads();
         _.assign(options,{
            uri:`${baseUrl}/sendCode/${mobile}`
        })
       
        return rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        )
    }
}
export default SMSService;