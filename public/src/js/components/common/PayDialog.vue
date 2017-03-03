<template>
	<el-dialog class="u-paydialog" :title="dialogTitle" v-model="showdialog">
		<div class="amount" v-if="isShowAmount">支付<span class="val">10.0</span><span class="unit">元</span></div>

		<div class="paytype" v-if="isPayInit">
			<label class="item weixin">
				<input type="radio" name="paydialog-paytype" value="1" v-model="payType"><span>微信支付</span>
			</label><label class="item alipay">
				<input type="radio" name="paydialog-paytype" value="2" v-model="payType"><span>支付宝支付</span>
			</label>
		</div>

		<div class="pay-weixin" v-if="isPayWithWeixin">
			<div class="qrcode" @click="doSuccessTest"><div ref="qrcode"></div></div>
			<div>打开手机微信“扫一扫”</div>
			<div><button @click="viewState=0">返回</button></div>
		</div>

		<div class="pay-alipay" v-if="isPayWithAlipay">
			<div>暂不支持支付宝支付</div>
			<div><button @click="viewState=0">返回</button></div>
		</div>

		<div class="pay-result" v-if="isPayResult">
			<div v-if="isPaySuccess">
				<div class="status"><img src="/images/pay/success.jpg"></div>
				<div class="desc">点击完成，进入 我的服务 进行申报</div>
			</div>
			<div v-if="isPayError">支付未完成</div>
		</div>

		<div class="paybtns">
			<button v-if="isPayInit" class="btn btn-pay" @click="paybtnHandler">立即支付</button>
			<button v-if="isPaySuccess" class="btn btn-success" @click="successbtnHandler">完成</button>
		</div>
	</el-dialog>
</template>

<script>
	// 这样引入脚本内部会报错，所以请在用到微信支付的页面手动引入
	// import "../../../../lib/qrcode.min.js";

	export default {
		// value(true|false是否显示对话框)
		props: ["value", "amount", "order", "title"],
		data () {
			console.log(this.value);
			return {
				showdialog: !!this.value,
				viewState: 0, // 0-init 1-paying 2-payed
				dialogTitle: this.title || "支付",
				payType: 1,
				payStatus: 0
			};
		},
		computed: {
			isShowAmount () {
				return this.viewState < 2;
			},
			isPayInit () {
				return this.viewState == 0;
			},
			isPayResult () {
				return this.viewState == 2;
			},
			isPaySuccess () {
				return this.viewState == 2 && this.payStatus == 1;
			},
			isPayError () {
				return false;
			},
			isPayWithWeixin () {
				return this.viewState == 1 && this.payType == 1;
			},
			isPayWithAlipay () {
				return this.viewState == 1 && this.payType == 2;
			}
		},
		watch: {
			value (newValue, oldValue) {
				this.showdialog = newValue;
				if (this.showdialog) {
					this.viewState = 0;
					this.payStatus = 0;
					this.payType = 1;
				}
			},
			showdialog (newValue, oldValue) {
				this.$emit("input", newValue);
				return newValue;
			}
		},
		methods: {
			paybtnHandler () {
				this.viewState = 1;
				if (this.payType == 1)
					this.showQrcode("http://www.baidu.com");
			},
			successbtnHandler () {
				this.showdialog = false;
				this.$emit("paysuccess", this.order);
			},
			showQrcode (value) {
				this.$nextTick(() => {
					var target = this.$refs.qrcode;
					new QRCode(target, { text: value, width: 144, height: 144 });
				});
			},
			doSuccessTest () {
				this.viewState = 2;
				this.payStatus = 1;
			}
		}
	}
</script>

<style lang="scss">
	.u-paydialog {
		.el-dialog__header {
			height: 50px;
		    background-color: #243853;
		    padding-top: 17px;
		    box-sizing: border-box;
		    .el-dialog__title {
		    	color: #fff;
    			font-weight: normal;
		    }
		}
		.el-dialog__body {
			min-height: 320px;
			text-align: center;
		}
		.amount {
			color: #696969;
		    font-size: 18px;
		    .val, .unit {
		    	color: #ff830a;
		    }
		    .val {
		    	font-size: 46px;
		    	margin: 0px 5px 0px 20px;
		    }
		}
		.paytype {
			padding: 35px 0px 50px;
			.item {
				display: inline-block;
				padding: 0px 20px;
				input {
					display: none;
				}
				span {
					display: inline-block;
					width: 140px;
					height: 120px;
					font-size: 16px;
					border: 2px solid #eee;
					box-sizing: border-box;
				    background-repeat: no-repeat;
				    background-position: center 5px;
				    padding-top: 70px;
				    cursor: pointer;
				}
				input:checked + span {
					border-color: #7aa3c1;
				}
				&.weixin span {
					background-image: url('/images/pay/weixin.jpg');
				}
				&.alipay span {
					background-image: url('/images/pay/alipay.jpg');
				}
			}
		}
		.pay-weixin {
			font-size: 16px;
			.qrcode {
				width: 144px;
				height: 144px;
				margin: 20px auto;
			}
		}
		.pay-result {
			padding: 50px 0px 20px;
			.desc {
			    color: #999;
				font-size: 16px;
			    margin-top: 40px;
			}
		}
		.paybtns {
			.btn {
				width: 180px;
			    height: 50px;
			    font-size: 20px;
			    color: #fff;
			    background-color: #3faef6;
			    border: 0px;
			    border-radius: 3px;
				outline: none;
			}
		}
	}
</style>
