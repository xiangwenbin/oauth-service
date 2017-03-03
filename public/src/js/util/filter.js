import Vue from 'vue';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

/**
 * 格式化日期 需以yyyy-MM-dd hh:mm:ss格式传入
 * @param y
 * @param m
 * @param d
 */
// Vue.filter('strDateFormat', (date,type) =>{
//   if(date){
//     date = date.toString();
//     let time = "";
//     if(date.indexOf("-")>-1||date.indexOf(":")>-1){
//       let list = date.split(" ");
//       if(list.length>0){
//         let dates = list[0].split("-");
//         let times=[];
//         if(list[1]){
//           times = list[1].split(":");
//         }

//         let y = parseInt(dates[0]);
//         let m = parseInt(dates[1]-1);
//         let d = parseInt(dates[2]);

//         if(times.length>0){
//           let h = parseInt(times[0]);
//           let min = parseInt(times[1]);
//           let s = parseInt(times[2]);
//           time = new  Date(y,m,d,h,min,s);
//         }else{
//           time = new  Date(y,m,d);
//         }
//       }
//     }else{
//       date = parseInt(date);
//       time = new Date(date);
//     }
//     return time.format(type);
//   }
// });

/**
 * 函数参考
 * http://itbilu.com/nodejs/npm/VkCir3rge.html
 * http://momentjs.com/docs/
 * {{1483592375911 |moment('YYYY-MM-DD HH:mm:ss')}}
 * {{'2017-01-22' |moment('YYYY-MM-DD HH:mm:ss')}}
 * 
 */
Vue.filter('moment', (date, format) => {
    return moment(date).format(format);

});
/**
 * http://numeraljs.com/
 * {{'1000' |numeral('0,0')}}
 * {{'1000' |numeral('0.00')}}
 */
Vue.filter('numeral', (number, format) => {
    if(_.isNil(number)){
        number=0;
    }
    return numeral(number).format(format);

});



