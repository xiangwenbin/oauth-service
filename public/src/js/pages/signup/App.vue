<template>
  <div class="m-register">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="150px">
      <h3 class="title">用户注册</h3>
      <el-form-item prop="nickname"  label="昵称">
        <el-input type="text" v-model="ruleForm.nickname"  placeholder="请输入您的昵称"></el-input>
      </el-form-item>
      <el-form-item prop="username"  label="手机号">
        <el-input type="text" v-model="ruleForm.username"  placeholder="请输入您的手机号"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入8位及以上非汉字密码"></el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input type="password" v-model="ruleForm.repassword" auto-complete="off" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item class="code" prop="valCode" label="短信校验码">
        <el-col :span="15">
          <el-input v-model="ruleForm.valCode" auto-complete="off" placeholder="校验码为4位数字"></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="8">
          <el-button type="info" @click="onGetValCode" :disabled="valBtnDisabled">{{btnValue}}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item class="proto" prop="prototype" label=" ">
        <el-col :span="2">
          <el-checkbox v-model="ruleForm.prototype"></el-checkbox>
        </el-col>
        <el-col :span="10">
          <a href="/introduce/portocal" target="_blank">《注册协议》</a>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="submit">
      <el-button type="info" @click.native.prevent="handleSubmit">注册</el-button>
    </div>
  </div>
</template>

<script>
  import Const from '../../const';
  import Utils from '../../util/util';
  import Request from '../../util/request';



  export default {
    props: ['options'],
    data () {
      var validator = (rule, value, callback) => {
        if (!value||value.replace(/\s*/g, "").length === 0) {
          return callback(rule.empty);
        }
        else if (rule.field === "username") {
          if (!Const.PATTERN.mobile.test(value))
            return callback("请输入正确的手机号");
        }
        else if (rule.field === "password") {
          if (value.length < 8 || /[\u4e00-\u9fa5]/.test(value))
            return callback("密码必须由8位及以上的非汉字组成");
        }
        else if (rule.field === "repassword") {
          if (value !== this.ruleForm.password)
            return callback("确认密码与登录密码不一致");
        }
        // else if (rule.field === "valCode") {
        //   if (!/\d{4}/.test(value))
        //     return callback("短信验证码必须是4位数字");
        // }
        callback();
      };

      return {
        ruleForm: {
          username: "", password: "", repassword: "", valCode: "", prototype: true
        },
        rules: {
            nickname: [{validator: validator, trigger: "blur", empty: "昵称不能为空"}],
            username: [{validator: validator, trigger: "blur", empty: "登录手机号码不能为空"}],
            password: [{validator: validator, trigger: "blur", empty: "密码不能为空"}],
            repassword: [{validator: validator, trigger: "blur", empty: "确认密码不能为空"}],
            valCode: [{validator: validator, trigger: "blur", empty: "短信验证码不能为空"}]
        },
        btnValue: "获取验证码"
      };
    },
    computed: {
      valBtnDisabled: function () {
        return !(this.btnValue == "获取验证码" || this.btnValue == "重新获取");
      }
    },
    methods: {
      // 获取验证码
      onGetValCode () {
        var mobile = this.ruleForm.username;
        // 验证合法用户名称
        this.$refs.ruleForm.validateField("username", (err) => {
          if (!err) {
            // 发送短信验证码
            Request.get(`/signup/sendCode/${mobile}`, {}).then((result) => {
                if(result.code==200){
                    let countdown = 60; // 倒计时
                    this.btnValue = `${countdown}s后可重新获取`;
                    var timerId = window.setInterval(() => {
                        this.btnValue = `${--countdown}s后可重新获取`;
                        if (countdown <= 0) {
                            window.clearInterval(timerId);
                            this.btnValue = "重新获取";
                        }
                    }, 1000);
                }else{
                    this.$message({message: result.msg, type: "error", duration: 2000});
                }
              
            })
            .catch((e) => {
              this.$message({message: e.msg, type: "error", duration: 2000});
            });
          }
          else {
            this.$message({message: err, type: "error", duration: 2000});
          }
        });
      },

      handleSubmit (ev) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.ruleForm.prototype) {
              var params = {
                    nickname:this.ruleForm.nickname,
                    mobile: this.ruleForm.username, 
                    password: this.ruleForm.password,
                    code: this.ruleForm.valCode
              };
              Request.post("/signup/mobile", params).then((result) => {
                // console.log("=====>", result);
                if (result.code == 200) {
                    this.$message({message: "注册成功", type: "success", duration: 2000, onClose: () => {
                        window.location.href = Utils.getUrlQueryParam("redirect") || "/";
                    }});
                }else {
                    this.$message({message: (result.msg || "登录错误！"), type: "error", duration: 2000});
                }
              })
              .catch((e) => {
                this.$message({message: e.msg, type: "error", duration: 2000});
              });
            }
            else {
              this.$message({message: "请您同意本《注册协议》", type: "error", duration: 2000});
            }
          }
          else {
            this.$message({message: "提交错误，请填写正确信息", type: "error", duration: 2000});
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  .m-register {
    width: 800px;
    border: 1px solid #efeff5;
    background-color: #fff;
    padding: 40px 100px 100px;
    margin: 30px auto 0px;
    box-sizing: border-box;
    .el-form {
      .el-form-item {
        margin-bottom: 35px;
        &:last-child {
          margin-bottom: 0px;
        }
      }
      .el-form-item__label {
        color: #808080;
        font-size: 18px;
        line-height: 28px;
      }
      .title {
        color: #46aff3;
        font-size: 26px;
        font-weight: normal;
        text-align: center;
        margin-bottom: 40px;
      }
      .el-input {
        input {
          height: 50px;
          font-size: 18px;
          border-color: #e5e5e5;
          border-radius: 2px;
          padding-left: 20px;
        }
      }
      .code {
        .el-button {
          width: 100%;
          height: 50px;
          border: 0px;
          background-color: #f1c281;
        }
      }
      .proto {
        margin-top: -25px;
        a {
          color: #46aff3;
          font-size: 16px;
        }
      }
    }
    .submit {
      padding: 30px 100px 10px;
      .el-button {
        width: 100%;
        height: 60px;
        font-size: 20px;
        letter-spacing: 10px;
        border-radius: 2px;
      }
    }
  }
</style>