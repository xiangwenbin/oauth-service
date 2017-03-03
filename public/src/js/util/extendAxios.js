import axios from 'axios';
// import util from './util';

// let Authorization = util.getUrlQueryParam("token");
let headers = {
    'X-Requested-With': 'XMLHttpRequest'
};
// if(Authorization){
//   headers['Authorization']=`Bearer ${Authorization}`;
// }
var extendAxios = axios.create({
    timeout: 10000,
    headers: headers
});
export default extendAxios;