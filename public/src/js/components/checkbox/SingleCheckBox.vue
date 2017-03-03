<template>
    <div class="f-cb u-single-checkbox" >
        <template v-for="item in items">
            
            <label class="f-cb f-fl">{{item.name}}<input :disabled="disabled" style="float:right;margin-top:2px;" type="checkbox" :checked="item.value==checkValue" @click="onItemClick($event,item.value)" /></label>
           
        </template>
    </div>
</template>

<script>
/**
    单选复选框
    @example
    <my-singleCheckBox :items="items" v-model="value" :disabled="boolean"></my-singleCheckBox>
 */
    export default {
        name: 'my-singleCheckBox',
        props:['items','value','disabled'],
        data () {
            
            return {
                checkValue: this.value
            }
        },
        watch:{
            value:function(newValue){

            }
        },
        methods:{
            onItemClick:function($event,value){
                if(this.checkValue==value){
                   value="";
                }
                this.checkValue=value;
                this.$emit('input', value)
                // $event.preventDefault();
            }
        },
        mounted:function(){
        
        }
    };
</script>

<style lang="scss" scoped>
	.u-single-checkbox{
        line-height:17px;
        label{
            margin-right:10px;
            input{margin-left:5px;}
        }
    }
</style>