##  Node版本
- ^v6.2.2


## 安装本地环境
- npm intall -g node-dev nodedev babel babel-cli

## 项目初始化
- npm intall 

## 开发环境启动
- babel-node app/index.js 或 node index.js 或 nodedev index.js 或 node-dev --debug index.js
- node index.js --ip 本地ip

## 生成环境 不需要打包
- //babel app --out-dir dist 

## 依赖包说明
- transform-strict-mode （由于很多 ES 特性需要 严格模式才能打开， 添加这个插件就会自动在所有文件上添加 'use strict';）
- transform-es2015-modules-commonjs （将 ES6 模块标准 转换成 Node.js 用的 CMD 模块标准）
- transform-es2015-spread （支持 ES6 的 spread 操作符）
- transform-es2015-destructuring （支持 赋值解构）
- transform-es2015-parameters （支持默认参数， 参数解构， 以及其他参数）

## node app服务 目录结构说明 
	app   nodejs  根目录

         -compose 组合服务

		 -const  常量目录
		
		 -filter 过滤器 koa中间件存放目录
		
         -koa2-oauth oauth2 koa 中间件

		 -sequelize  orm框架目录
            -model  orm dto 数据模型
		
		 -router 路由 客户端调用的异步接口目录
		
		 -service 基础服务

		 -template 客户端页面模版文件目录

		 -util 公共类
		

		 

## 一些命名规范
- 所有js文件首字母小写
- js中导出的对象 即export Object  首字母必须大写
- 使用import 导入包的时候，如果导出包为类 变量名为首字母大写，如果导出的包为函数，则首字母小写
例
<pre>
<code>
import Koa from 'koa';
import convert from 'koa-convert';
</code>
</pre>

## 接口规范
- 接口一律返回 json格式
<pre>
<code>
{
	code:200,//请求状态码
	data:[]||{},//数据 可以是数组，可以是对象
	msg:"",// 提示信息
	ext:null //扩展信息
}
</code>
</pre>

## 资料
- request-promise https://www.npmjs.com/package/request-promise
- Sequelize 中文API文档 https://itbilu.com/nodejs/npm/V1PExztfb.html