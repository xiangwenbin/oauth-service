// import rp from 'request-promise';
// import _ from 'lodash';
// import Util from '../../util/util';
// import PatientService from '../../service/baseinfo/patientService';
// import SummaryService from '../../service/fallnurse/summaryService';

// /**
//  * 跌倒病人组合服务
//  */
// class FallPatientCompose {
//     constructor(ctx) {
//         this.ctx = ctx;
//         this.patientService = new PatientService(ctx);
//         this.summaryService = new SummaryService(ctx);
//     }
//     //获取跌倒病人概要
//     async getFallPatientSummary(status, unitCode, nursingLevel = "", page = 1, size = 0) {
//         console.log(arguments);
//         let result = {};
//         // Promise.all([PatientService.getPatientListByStatusAndUnitCodeOrNursingLevel(),]);
//         result = await this.patientService.getPatientListByStatusAndUnitCodeOrNursingLevel(status, unitCode, nursingLevel = "", page, size).then(
//             (jsonBody) => {
//                 return jsonBody;
//             }
//         ).catch((error) => {
//             console.log(error);
//             throw error;
//         });
//         let patientList=result.content;
//         // console.log(patientList);
//         if (patientList.length > 0) {
//             let mrnList = [];
//             _.forEach(patientList, function (obj) {
//                 mrnList.push(obj.mrn);
//             });
//             let fallPatientList = await this.summaryService.getSummaryFallPatientById(mrnList).then(
//                 (jsonBody) => {
//                     return jsonBody;
//                 }
//             ).catch((error) => {
//                 // console.log(error);
//                 throw error;
//             });
//             _.forEach(patientList, function (obj,index) {
//                 obj.accessFlag=fallPatientList[index].accessFlag;
//                 obj.accessName=fallPatientList[index].accessName;
//                 obj.reportFlag=fallPatientList[index].reportFlag;
//                 obj.accessLevel=fallPatientList[index].accessLevel;
//             });
//             // console.log(fallPatientList);
//         }
//         return result;
//     }
// }

// export default FallPatientCompose