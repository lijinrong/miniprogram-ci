const ci = require('miniprogram-ci');
const path = require('path');
const dayjs = require('dayjs');
const { CACHE_PATH, PLATFORM_VALUE } = require('../constant');

async function preview(publishConfig) {
  try {
    const project = new ci.Project({
      appid: publishConfig.appid,
      type: 'miniProgram',
      projectPath: publishConfig.buildPath,
      privateKeyPath: publishConfig.privateKeyPath,
      ignores: ['node_modules/**/*'],
    });
    const previewResult = await ci.preview({
      project,
      desc: '机器人 预览',
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.join(CACHE_PATH, '/mp-weixin.png'),
      onProgressUpdate: () => {},
      setting: {
        minify: true,
        es6: true,
      },
      // pagePath: 'pages/index/index', // 预览页面
      // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
      // scene: 1011, // 场景值
    });
    const expireTime = dayjs().add(25, 'm').format('YYYY-MM-DD HH:mm:ss');
    return {
      platform: PLATFORM_VALUE.weixin,
      expireTime,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...previewResult,
    };
  } catch (e) {
    console.error('微信小程序发布失败', e);
    process.exit();
  }
}

async function publish(publishConfig, _, version, desc) {
  try {
    const project = new ci.Project({
      appid: publishConfig.appid,
      type: 'miniProgram',
      projectPath: publishConfig.buildPath,
      privateKeyPath: publishConfig.privateKeyPath,
      ignores: ['node_modules/**/*'],
    });
    const uploadResult = await ci.upload({
      project,
      version,
      desc,
      setting: {
        minify: true,
        es6: true,
      },
      onProgressUpdate: () => {},
    });
    return {
      platform: PLATFORM_VALUE.weixin,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      ...uploadResult,
    };
  } catch (e) {
    console.error('微信小程序发布失败', e);
    process.exit();
  }
}

module.exports = { preview, publish };
