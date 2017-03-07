<template>
    <div class="m-login">
      <div class="">
        <el-form class="demo-ruleForm card-box loginform" :model="ruleForm" :rules="rules" ref="ruleForm" 
          label-position="left" label-width="0px">
          <h3 class="title">用户登录</h3>
          <el-form-item class="username" prop="username">
            <input ref="nameIpt" type="text" v-model="ruleForm.username" placeholder="请输入您的手机号"
              @keydown.enter="onEnterHandler('name')" @blur="onBlurHandler('name')" />
          </el-form-item>
          <el-form-item class="password" prop="password">
            <input ref="pwdIpt" type="password" v-model="ruleForm.password" placeholder="请输入密码"
              @keydown.enter="onEnterHandler('pwd')" @blur="onBlurHandler('pwd')" />
          </el-form-item>
          <el-form-item class="repwd">
            <a class="lnk" href="/resetPassword?t=1">忘记密码？</a>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="info" @click.native.prevent="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import Const from '../../const';
  import Utils from '../../util/util';
  import Request from '../../util/request';


  export default {
    props:['options'],
    data() {
      var validator = (rule, value, callback) => {
        if (value.replace(/\s*/g, "").length === 0)
          return callback(rule.empty);
        if (rule.field === "username") {
          if (!Const.PATTERN.mobile.test(value))
            return callback("手机号码不正确，请输入正确的手机号码");
        }
        callback();
      };
      return {
        ruleForm: {
          username: Utils.getUrlQueryParam("u") || "",
          password: ""
        },
        rules: {
          username: [{validator: validator, empty: "用户手机号码不能为空"}],
          password: [{validator: validator, empty: "登录密码不能为空"}]
        }
      };
    },
    mounted: function () {
      if (this.ruleForm.username)
        this.$refs.pwdIpt.focus();
      else
        this.$refs.nameIpt.focus();
    },
    methods: {
      // 登录提交
      handleSubmit (e) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            Request.post('/login/verify', {
              username: this.ruleForm.username,
              password: this.ruleForm.password
            }).then((result)=>{
                if (result.code == 200) {
                    window.location.href = Utils.getUrlQueryParam('redirect') || "/oauth/authorize";
                }
                else {
                    this.$message({message: (result.msg || "登录错误!"), type: "error", duration: 2000});
                }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 回车事件
      onEnterHandler (e) {
        this.handleSubmit();
      },
      // 验证
      onBlurHandler (field) {
        this.$refs.ruleForm.validateField(field == "name" ? "username" : "password");
      }
    }
  }
</script>

<style lang="scss">
.g-bd{
    display: table;
   .m-login {
      width:100%;
      display: table-cell;
      
      vertical-align: middle;
    > div{
      
      .loginform {
          width: 400px;
          margin:30px auto;
          border: 1px solid #efeff5;
          background-color: #fff;
          padding: 30px 25px 50px;
          box-sizing: border-box;
          .title {
            color: #46aff3;
            font-size: 26px;
            font-weight: normal;
            text-align: center;
            margin-bottom: 40px;
          }
          .el-form-item {
            margin-bottom: 35px;
            .el-form-item__content {
              input {
                width: 100%;
                height: 50px;
                font-size: 18px;
                border: 1px solid #e5e5e5;
                border-radius: 2px;
                box-sizing: border-box;
                padding-left: 50px;
              }
              &:before {
                content: "";
                position: absolute;
                width: 32px;
                height: 32px;
                top: 8px;
                left: 8px;
                background-repeat: no-repeat;
              }
            }
            &.username .el-form-item__content:before {
              background-image: url(/images/icons_auth.png);
              background-position: 0px -1px;
            }
            &.password .el-form-item__content:before {
              background-image: url(/images/icons_auth.png);
              background-position: 0px -33px;
            }
            &:last-child {
              margin-bottom: 0px;
            }
          }
          .repwd {
            margin-top: -35px;
            text-align: right;
          }
          .submit .el-button {
            width: 100%;
            height: 60px;
            font-size: 20px;
            letter-spacing: 10px;
            border-radius: 2px;
          }
        }
    }
    
  }
}
 
</style>
