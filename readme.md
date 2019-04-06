[TOC]

# vue-cli-fast-mock应用

## 使用说明

### 基础

> 1. 在 `vue-cli` 创建的项目目录下 创建 `mock` 文件夹
>
> 2. 在 `vue.config.js` 中引入 `vue-cli-fast-mock`
>
> 	```
> 	const before = require("vue-cli-fast-mock");
> 	module.exports = {
> 	  lintOnSave: false,
> 	  publicPath: "projectName",
> 	  devServer: {
> 	    before,
> 	  }
> 	};
> 	```

```
. //项目目录 vue-cli 构建的项目目录
├── dist	// 打包文件
├── mock	// 我们自己创建的 mock 文件 用来存放自己定义的api
├── public	// 静态资源
├── src		// 源码
├── tests	// 测试套件
├── README.md
├── babel.config.js
├── jest.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
└── vue.config.js
```

### 配置

`hjson` 中的配置参考 `接口配置` 

基础路径配置创建在 `config.json` 中的 `baseUrl` 属性。本项目的 `mock` 文件夹为示例

## mock 创建api目录结构

```
mock // mock 文件夹下
├── api1 //自由创建api咯
│   ├── redis
│   │   ├── order
│   │   │   └── query.get.json	# api-url:/redis/order/query
│   │   └── query.post.json		# api-url:/redis/query
│   └── service
│       ├── login.post.json		# api-url:/service/logiin
│       └── upload.json			# api-url:/service/upload
├── api2
└── config.json	# 配置mock所需
```

## 配置一个新接口

​	直接在`mock` 目录下创建接口的访问目录嵌套。例如：

> 要创建一个  `/wsz/test/login` 的接口，请求方式为 `post` 
>
> 操作：
>
>    	1. 在 `mock` 文件夹下创建  `wsz/test` 文件夹
>    	2. 在 `mock/wsz/test/` 目录下创建  `login.hjson` 文件
>    	3. 在 `login.hjson` 文件中写接口数据格式（采用mock方式随机生成数据，请阅读mockjs官方文档）
>
> 注：文件名采用 `接口名.hjson` 来配置，默认 `post` 请求

## 接口配置（目前只考虑到完成情况以及请求方式设定）

| key    | value       | 默认  | 备注                                                        |
| ------ | ----------- | ----- | ----------------------------------------------------------- |
| method | post \| get | post  | 请求方式                                                    |
| done   | Boolean     | false | 后端接口是否完成（`false` 时走`mock`接口）                  |
| temp   | Boolean     | true  | false: 使用当前文件内容作为返回值。<br />true: 使用默认模板 |

在内加各类注释的能力由 `hjson` 来提供

```json
// method: get
// done: true

/* 
入参注释：
{
	userId:"xxxxxx"  // 用户ID
}

 */
{
  # 用户模块
  user:{
    checkStatus:"@date", // 审核结果（通过或是不通过）、
    auditOpinion:"@date", // 审核意见
    checkOpr:"@date", // 审核人员帐号
    checkID:"@date", // 审核人员ID
    checkLel:"@date", // 审核级别
    checkTime:"@date" // 审核时间
  },
  # 码表
  mb:{
    state:{
      00:"ssss"
    },
    code:{
      "333":"kkkk"
    }
  }
}
```

