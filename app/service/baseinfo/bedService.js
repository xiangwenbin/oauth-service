import rp from 'request-promise';
import _ from 'lodash';
import Util from '../../util/util';


/**
 * 病床服务
 */
class BedService {

    // 通过行政单元编码查询病床信息
    // @param {
    //     unitCode (string, optional): 行政单元编码
    // }
    // @return {
    // bedFlag (string, optional): 病床标示 0: 未使用 1: 已使用 2: 不可用 ,
    // bedNo (string, optional): 病床号 ,
    // unitCode (string, optional): 行政单元编码 ,
    // unitName (string, optional): 行政单元名称
    // }
    static async getBedListByUnitCode( unitCode) {
        let result = {};
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getJsonHeads();
         _.assign(options,{
            uri:`${baseUrl}/beds/${unitCode}`
        })
       
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });

        // console.log("result:", result);
        return result;
    }
}

export default BedService