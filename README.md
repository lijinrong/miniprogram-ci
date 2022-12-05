# 介绍

ik-miniprogram-ci 是小程序打包、预览、上传工具，目前支持头条小程序、快手小程序、微信小程序。

## 注意事项

使用 ci 工具前需准备：

1、头条开发者账号绑定邮箱

2、快手和微信需生成上传代码密钥

3、项目根目录创建.ci-config.js 配置文件

## 安装

npm i ik-miniprogram-ci -D

## 使用

预览并发送钉钉群：miniprogram-ci preview

上传代码：miniprogram-ci publish

## .ci-config.js 配置说明

完整配置示例

```javascript
module.exports = {
  // 环境列表
  env: ['dev', 'prod'],
  // 小程序列表
  mp: ['guazi'],
  // 平台列表
  platforms: ['mp-weixin', 'mp-toutiao', 'mp-kuaishou'],
  // 二维码上传地址
  uploadConfig: {
    hostname: 'upload.xizhihk.com',
    path: '/upload/image?sufix=png',
  },
  // 钉钉通知配置
  dingtalks: {
    'mp-weixin': {
      secret:
        'xxx', // 钉钉机器人密钥
      accessToken:
        'xxx', // 钉钉机器人accessToken
    },
    'mp-toutiao': {
      secret:
        'xxx', // 钉钉机器人密钥
      accessToken:
        'xxx', // 钉钉机器人accessToken
    },
    'mp-kuaishou': {
      secret:
        'xxx', // 钉钉机器人密钥
      accessToken:
        'xxx', // 钉钉机器人accessToken
    },
  },
  /**
   * 获取发布配置
   * @param {环境} env
   * @param {小程序} mp
   * @param {平台} platform
   * @returns publishConfig
   * {
   *    appid: 小程序appid
   *    buildPath: 构建产物位置
   *    privateKeyPath: 微信或快手privateKey的位置，需要管理员在开发者平台生成
   * }
   */
  resolvePublishConfig(env, mp, platform) {
    return {
    	appid: 小程序appid
     	buildPath: 构建产物位置
      privateKeyPath: 微信或快手privateKey的位置，需要管理员在开发者平台生成
    };
  },
  // 自定义钉钉通知消息
  resolveNotifyMsg({
    env,
    description,
    mp,
    platform,
    publishResult,
    url,
    name,
    branchName,
  }) {
    return {
      title: 'xxx',
      text: 'xxx',
    };
  },
};
```

## 特殊配置项说明

#### resolvePublishConfig

获取发布配置

##### 回调参数

| 参数     | 说明   |
| -------- | ------ |
| env      | 环境   |
| mp       | 小程序 |
| platform | 平台   |

##### 函数返回值

函数必须返回一个对象，该对象包含以下字段

| 字段           | 说明                                                     |
| -------------- | -------------------------------------------------------- |
| appid          | 小程序 appid                                             |
| buildPath      | 构建产物位置                                             |
| privateKeyPath | 微信或快手 privateKey 的位置，需要管理员在开发者平台生成 |

#### resolveNotifyMsg

自定义钉钉通知消息

##### 回调参数

函数接受参数为一个对象，该对象有以下字段

| 字段          | 说明                                                             |
| ------------- | ---------------------------------------------------------------- |
| env           | 环境                                                             |
| mp            | 小程序                                                           |
| platform      | 平台                                                             |
| description   | 用户在在命令行输入的描述                                         |
| url           | 二维码图片地址                                                   |
| publishResult | 发布结果对象，包含字段为 publishTime：String, expireTime: String |
| name          | 操作人                                                           |
| branchName    | 分支名                                                           |

##### 函数返回值

函数必须返回一个对象，该对象包含以下字段

| 字段  | 说明                          |
| ----- | ----------------------------- |
| title | 钉钉消息标题                  |
| text  | 钉钉消息内容，格式为 markdown |
