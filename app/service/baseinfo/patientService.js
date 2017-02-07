import rp from 'request-promise';
import _ from 'lodash';
import Util from '../../util/util';


/**
 * 病人服务
 */
class PatientService {
    constructor(ctx){
        this.ctx=ctx;
    }
    //取所有住院病人
    static async getAllpatient() {
        let result = [];
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getdefaultOptions();

        _.assign(options, {
            uri: `${baseUrl}/inpatients`
        })
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });

        console.log("result:", result);
        return result;
    }

    //通过住院号取单个病人
    static async getPatientByMrn(mrn) {
        let result = {};
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getdefaultOptions();
        _.assign(options, {
            uri: `${baseUrl}/patient/${mrn}`
        })
        // options.uri = `${baseUrl}/patient/${mrn}`;
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });
        return result;
    }
    // 姓名和住院号模糊查询,入院时间排序
    // @params {
    //     name (string,optional): 模糊姓名 yyyy-MM-dd hh:mm:ss,
    //     mrn (string,optional): 模糊住院号 yyyy-MM-dd hh:mm:ss
    //     page (string,required): 页数 0,
    //     size (string,required): 分页大小 1,
    // }
    // @return {
    //     content:[
    //         {}
    //     ],
    //     "first": true,
    //     "last": true,
    //     "number": 0,
    //     "numberOfElements": 0,
    //     "size": 0,
    //     "sort": {},
    //     "totalElements": 0,
    //     "totalPages": 0
    // }
    static async getPatientListByNameOrMrnOrderByAdmissionTime(name, mrn, page=0, size=1000) {
        
        let result = [];
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let options = Util.getdefaultOptions();
        _.assign(options, {
            uri: `${baseUrl}/inpatients/search/page`,
            qs: {
                name: name,
                mrn: mrn,
                page: page,
                size: size
            }
        })
        // options.uri = `${baseUrl}/patient/${mrn}`;
        result = await rp(options).then(
            (jsonBody) => {
                return jsonBody;
            }
        ).catch((error) => {
            throw error;
        });
        return result;
    }
    // 通过入院时间查询病人，列表按照出院时间排序
    // @params {
    //     status (string,optional) :住院状态 in/out/empty(all),
    //     beginTime (string,required): 开始时间 yyyy-MM-dd hh:mm:ss,
    //     endTime (string,required): 结束时间 yyyy-MM-dd hh:mm:ss,
    //     mrns (string,optional): 住院号 yyyy-MM-dd hh:mm:ss,
    //     unitCode (string,optional): 操作单元代码 yyyy-MM-dd hh:mm:ss,
    //     nameLike (string,optional): 模糊姓名 yyyy-MM-dd hh:mm:ss,
    //     mrnLike (string,optional): 模糊住院号 yyyy-MM-dd hh:mm:ss
    // }
    static async getPatientListByAdmissionTime(condition) {
        let result = [];
        if (condition.beginTime && condition.endTime) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/admittime`,
                qs: queryCondition
            })
            // options.uri = `${baseUrl}/patient/${mrn}`;
            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }

    // 通过出院时间查询病人，列表按照出院时间排序
    // @params {
    //     status (string,optional) :住院状态 in/out/empty(all),
    //     beginTime (string,required): 开始时间 yyyy-MM-dd hh:mm:ss,
    //     endTime (string,required): 结束时间 yyyy-MM-dd hh:mm:ss,
    //     mrns (string,optional): 住院号 yyyy-MM-dd hh:mm:ss,
    //     unitCode (string,optional): 操作单元代码 yyyy-MM-dd hh:mm:ss,
    //     nameLike (string,optional): 模糊姓名 yyyy-MM-dd hh:mm:ss,
    //     mrnLike (string,optional): 模糊住院号 yyyy-MM-dd hh:mm:ss
    // }
    static async getPatientListByDischargeTime(condition) {
        let result = [];
        if (condition.beginTime && condition.endTime) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/dischargetime`,
                qs: condition
            })

            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }
    // 通过床号、姓名、科室查询病人
    // @params {
    //     stringLike (string,required) :模糊关键词,
    //     size (int,required): 数量
    // }
    // @return {
    //   "title": "患者",
    //   "resultList": [
    //     {
    //       "context": "测试单元2 11床 病人11",
    //       "url": "http://127.0.0.1:8889/"
    //     }
    //   ],
    //   "keyList": [
    //     "11"
    //   ]
    // }
    static async getPatientListByStringLike(stringLike, size) {
        let result = {};
        if (stringLike && size) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/querylike`,
                qs: {
                    stringLike: stringLike,
                    size: size
                }
            });
            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }

    // 通过住院号取病人,默认根据传入的 mrn list 顺序排序
    // @params {
    //     mrns (Array[string],required) :住院号列表 [m-001,m-002],
    // }
    static async getPatientListByMrns(mrns) {
        let result = [];
        if (mrns && mrns.length > 0) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/sorted/input`,
                qs: {
                    mrns: mrns.join(",")
                }
            });
            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }


    // 通过住院号取病人,按床位号排序
    // @params {
    //     mrns (Array[string],required) :住院号列表 [m-001,m-002],
    // }
    static async getPatientListByMrnsOrderByBedNo(mrns) {
        let result = [];
        if (mrns && mrns.length > 0) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/sorted`,
                qs: {
                    mrns: mrns.join(",")
                }
            });
            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }

    // 通过操作单元代码，状态，护理等级,取病人 可分页，
    // @params {
    //      status (string,required) :状态码in/out,
    //      unitCode (string,required) :操作单元代码,
    //      nursingLevel (Array[string],optional) :护理等级 any/EMPTY(all),
    //      page (int,optional) :页数0,
    //      size (int,optional) :分页大小 0 表示不分页
    // }
    // GET /patients/{status}/{unitCode}/sortbed/page

    getPatientListByStatusAndUnitCodeOrNursingLevel(status, unitCode, nursingLevel, page, size) {
        page = page || 0;
        size = size || 0;
        let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
        let uri = size == 0 ? `${baseUrl}/patients/${status}/${unitCode}/sortbed` : `${baseUrl}/patients/${status}/${unitCode}/sortbed/page`;
      
        let options = Util.getdefaultOptions(this.ctx);
        _.assign(options, {
            uri:uri,
            qs: {
                nursingLevel: nursingLevel,
                page:page,
                size:size
            }
        });
        return rp(options);
    }

    // 通过床号、科室,取病人
    // @params {
    //      unitCode (string,required) :操作单元代码,
    //      beds (Array[string],optional) :床号列表,
    // }
    static async getPatientListByBedNoAndUnitCode(unitCode, beds) {
        let result = [];
        if (unitCode) {
            let baseUrl = Util.getBaseUrlByServiceName("baseinfo");
            let options = Util.getdefaultOptions();
            _.assign(options, {
                uri: `${baseUrl}/patients/${unitCode}/beds`,
                qs: {
                    beds: beds.join(",")
                }
            });
            result = await rp(options).then(
                (jsonBody) => {
                    return jsonBody;
                }
            ).catch((error) => {
                throw error;
            });
        }
        return result;
    }

}

export default PatientService