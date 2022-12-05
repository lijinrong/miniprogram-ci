const ChatBot = require('dingtalk-robot-sender');
const fs = require('fs');
const path = require('path');
const {
  CACHE_PATH,
  PLATFORM_NAMES_MAP,
  NOTIFY_COLOR,
  DEV_PAGE,
} = require('../constant');
const { upload } = require('./tools');
const ora = require('ora');

function defaultNotifyText({
  env,
  description,
  mp,
  platform,
  publishResult,
  url,
  name,
  branchName,
  packageUrl,
  type,
}) {
  return {
    title: `${PLATFORM_NAMES_MAP[platform]}二维码`,
    text: `### **<font color=${NOTIFY_COLOR.PLATFORM[platform]}>${
      PLATFORM_NAMES_MAP[platform]
    }二维码</font>**\n- **小程序：${mp}**\n- **环境: ${env}**${
      description ? `\n- 备注：${description}` : ''
    }\n- 操作人：${name.trim()}\n- 分支：${branchName.trim()}\n- 发布时间：${
      publishResult.publishTime
    }\n- 过期时间：${publishResult.expireTime}\n${
      packageUrl ? `- 代码包：${packageUrl}` : ''
    }${
      type === 'preview'
        ? `\n![image](${url})`
        : `- ${PLATFORM_NAMES_MAP[platform]}开发者后台：${DEV_PAGE[platform]}`
    }`,
  };
}

async function notify({
  description,
  buildPlatforms,
  env,
  mp,
  publishRes,
  userConfig,
  packRes,
  type,
}) {
  const spinner = ora('推送消息中').start();
  console.log = () => {};
  const notifyTasks = buildPlatforms.map((platform) => {
    const publishResult = publishRes.find((item) => {
      return item.platform === platform;
    });
    return realNotify({
      description,
      platform,
      env,
      mp,
      publishResult,
      userConfig,
      packageUrl: packRes && packRes[platform],
      type,
    });
  });
  const res = await Promise.all(notifyTasks);
  spinner.succeed('推送成功').stop();
  return res;
}

async function realNotify({
  description,
  platform,
  env,
  mp,
  publishResult,
  userConfig,
  packageUrl,
  type,
}) {
  const dMessage = new ChatBot({
    baseUrl: 'https://oapi.dingtalk.com/robot/send',
    ...userConfig.dingtalks[platform],
  });
  const resolveNotifyMsg = userConfig.resolveNotifyMsg
    ? userConfig.resolveNotifyMsg
    : defaultNotifyText;
  let url;
  if (type === 'preview') {
    const data = fs.readFileSync(path.join(CACHE_PATH, `${platform}.png`));
    res = await upload({ data, ...userConfig.uploadConfig });
    url = res.url;
  }
  const msg = resolveNotifyMsg({
    description,
    env,
    mp,
    platform,
    publishResult,
    url,
    name: userConfig.name,
    branchName: userConfig.branchName,
    packageUrl,
    type,
  });
  dMessage.markdown(msg.title, msg.text);
}

module.exports = {
  notify,
};
