import '../scss/base.scss';
import '../scss/module.scss';
import '../scss/unit.scss';
import 'element-ui/lib/theme-default/index.css';
import '../scss/element.scss';
import "babel-polyfill";
import Vue from 'vue';
import ElementUI from 'element-ui';
import "./util/filter";
import _ from 'lodash';
Vue.use(ElementUI);
//全局混合
Vue.mixin({
    methods:{
        //求和函数
        sum(list){
            return _.sumBy(list,this.parseNumber);
        },
        parseNumber(value){
            let num=value;
            if(!value){
                num=0;
            }else if(value&&isNaN(new Number(value))){
                num=0;
            }
            return new Number(num);
        }
    }
})
export default class BaseModule{
    options={};
    constructor(){
        console.log('constructor');
    }
    
    init(...vueConfigs){
       _.each(vueConfigs,(item)=>{
       new Vue(item);
       });
    }
}