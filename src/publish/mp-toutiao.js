const tma = require('tt-ide-cli');
const path = require('path');
const dayjs = require('dayjs');
const { CACHE_PATH, PLATFORM_VALUE } = require('../constant');

async function preview(publishConfig, accountConfig) {
  try {
    await tma.loginByEmail({
      email: accountConfig.ttEmail,
      password: accountConfig.ttPass,
    });
    const res = await tma.preview({
      project: {
        path: publishConfig.buildPath, // 项目地址
      },
      page: {
        path: '', // 小程序打开页面
        query: '', // 小程序打开 query
        scene: '', // 小程序打开场景值
        launchFrom: '', // 小程序打开场景（未知可填空字符串）
        location: '', // 小程序打开位置（未知可填空字符串）
      },
      qrcode: {
        format: 'imageFile', // imageSVG | imageFile | null | terminal
        // imageSVG 用于产出二维码 SVG
        // imageFile 用于将二维码存储到某个路径
        // terminal 用于将二维码在控制台输出
        // null 则不产出二维码
        output: path.join(CACHE_PATH, 'mp-toutiao.png'),
        options: {
          small: false, // 使用小二维码，主要用于 terminal
        },
      },
      cache: true, // 是否使用缓存
    });
    return {
      url: res.shortUrl,
      originSchema: res.originSchema,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      expireTime: dayjs().add(25, 'm').format('YYYY-MM-DD HH:mm:ss'),
      platform: PLATFORM_VALUE.toutiao,
    };
  } catch (e) {
    console.error('头条小程序发布失败', e);
    process.exit();
  }
}

async function publish(publishConfig, accountConfig, version, desc) {
  try {
    await tma.loginByEmail({
      email: accountConfig.ttEmail,
      password: accountConfig.ttPass,
    });
    const res = await tma.upload({
      project: {
        path: publishConfig.buildPath, // 项目地址
      },
      page: {
        path: '', // 小程序打开页面
        query: '', // 小程序打开 query
        scene: '', // 小程序打开场景值
        launchFrom: '', // 小程序打开场景（未知可填空字符串）
        location: '', // 小程序打开位置（未知可填空字符串）
      },
      qrcode: {
        format: 'imageFile', // imageSVG | imageFile | null | terminal
        // imageSVG 用于产出二维码 SVG
        // imageFile 用于将二维码存储到某个路径
        // terminal 用于将二维码在控制台输出
        // null 则不产出二维码
        output: path.join(CACHE_PATH, 'mp-toutiao.png'),
        options: {
          small: false, // 使用小二维码，主要用于 terminal
        },
      },
      version,
      changeLog: desc,
      needUploadSourcemap: true,
    });
    return {
      url: res.shortUrl,
      originSchema: res.originSchema,
      publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      expireTime: dayjs().add(25, 'm').format('YYYY-MM-DD HH:mm:ss'),
      platform: PLATFORM_VALUE.toutiao,
    };
  } catch (e) {
    console.error('头条小程序发布失败', e);
    process.exit();
  }
}

module.exports = { preview, publish };
