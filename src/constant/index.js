const path = require('path');

const USER_CONFIG_PATH = path.join(process.cwd(), '.ci-config.js');
const ACCOUNT_CONFIG_PATH = path.join(
  __dirname,
  '../../.accountConfig/index.json'
);
const PLATFORM_VALUE = {
  weixin: 'mp-weixin',
  toutiao: 'mp-toutiao',
  kuaishou: 'mp-kuaishou',
};
const PUBILSH_TYPE = {
  体验版: 1,
  正式版: 2,
};
const PLATFORM_NAMES_MAP = {
  [PLATFORM_VALUE.weixin]: '微信',
  [PLATFORM_VALUE.toutiao]: '头条',
  [PLATFORM_VALUE.kuaishou]: '快手',
};
const CACHE_PATH = path.join(__dirname, '../../.cache/');

const ENV_NAME_MAP = {
  dev: '测试',
  prod: '正式',
};

const BUILD_PATH_MAP = {
  dev: 'dev',
  prod: 'build',
};

const NOTIFY_COLOR = {
  PLATFORM: {
    [PLATFORM_VALUE.weixin]: '#3FC160',
    [PLATFORM_VALUE.toutiao]: '#3D86FF',
    [PLATFORM_VALUE.kuaishou]: '#F87838',
  },
};

const DEV_PAGE = {
  [PLATFORM_VALUE.weixin]: 'https://mp.weixin.qq.com',
  [PLATFORM_VALUE.toutiao]: 'https://microapp.bytedance.com',
  [PLATFORM_VALUE.kuaishou]: 'https://mp.kuaishou.com/project/version',
};

module.exports = {
  USER_CONFIG_PATH,
  ACCOUNT_CONFIG_PATH,
  PLATFORM_NAMES_MAP,
  PLATFORM_VALUE,
  BUILD_PATH_MAP,
  CACHE_PATH,
  ENV_NAME_MAP,
  DEV_PAGE,
  NOTIFY_COLOR,
  PUBILSH_TYPE,
};
