import rp from 'request-promise';
import _ from 'lodash';
import Util from '../../util/util';


/**
 * 科室或病区服务
 */
class UnitService {

    // 通过行政单元编码查询科室或病区
    // @param {
    //     unitCode (string, optional): 行政单元编码
    // }
    // @return {
    // }
    static async getUnitByUnitCode( unitCode) {
        let result = {};
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getJsonHeads();
         _.assign(options,{
            uri:`${baseUrl}/unit/${unitCode}`
        })
       
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });
        return result;
    }

    // 获取所有科室或病区
    // @return {
    // }
    static async getAllUnitList() {
        let result = {};
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getJsonHeads();
         _.assign(options,{
            uri:`${baseUrl}/units/`
        })
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });
        return result;
    }
}

export default BedService