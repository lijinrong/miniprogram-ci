#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk'); // 带色彩的控制台输出
const { resolveUserConfig, askForUserConfig } = require('./userConfig');
const { build } = require('./build');
const { pack } = require('./package');
const { publish } = require('./publish');
const { notify } = require('./notify');
const { create } = require('./utils/index');
const { PLATFORM_NAMES_MAP, CACHE_PATH, DEV_PAGE } = require('./constant');

const { program } = require('commander');

function createCachePath() {
  create(`${CACHE_PATH}`);
}

async function main(type) {
  // 配置
  const { userConfig, accountConfig } = await resolveUserConfig();
  let { mp, env, version, description, buildPlatforms } = await inquirer.prompt(
    [
      {
        type: 'list',
        name: 'mp',
        message: '请选择小程序',
        choices: userConfig.mp,
        when() {
          return userConfig.mp && userConfig.mp.length > 0;
        },
      },
      {
        type: 'list',
        name: 'env',
        message: '请选择环境',
        choices: userConfig.env,
      },
      {
        type: 'checkbox',
        name: 'buildPlatforms',
        message: '请选择编译平台',
        choices: userConfig.platforms.map((item) => {
          return {
            name: PLATFORM_NAMES_MAP[item],
            value: item,
          };
        }),
        when() {
          return userConfig.platforms.length > 1;
        },
        validate(input) {
          const done = this.async();
          if (input.length) {
            done(null, true);
          } else {
            done('至少选择一个平台!');
          }
          return input.length;
        },
      },
      {
        type: 'input',
        name: 'version',
        message: '请输入项目版本号',
        when() {
          return type === 'publish';
        },
        validate(input) {
          const done = this.async();
          if (input) {
            done(null, true);
          } else {
            done('项目版本号必填！');
          }
          return input.length;
        },
      },

      {
        type: 'input',
        name: 'description',
        message: '请输入项目备注',
        validate(input) {
          const done = this.async();
          if (input || type === 'preview') {
            done(null, true);
          } else {
            done('项目备注必填！');
          }
          return input.length;
        },
      },
    ]
  );

  if (userConfig.platforms.length === 1) {
    buildPlatforms = userConfig.platforms;
  }

  createCachePath();

  // 编译
  await build({ mp, env, buildPlatforms, sync: userConfig.buildSync });

  let packRes = null;
  if (userConfig.needUpload) {
    // 打包并上传
    packRes = await pack({ userConfig, mp, env, buildPlatforms });
  }

  // 发布
  const publishRes = await publish(
    {
      mp,
      env,
      version,
      description,
      userConfig,
      buildPlatforms,
      accountConfig,
    },
    type
  );

  // 上传代码需要自行到开发者平台设置体验码

  await notify({
    version,
    description,
    buildPlatforms,
    env,
    mp,
    publishRes,
    userConfig,
    packRes,
    type,
  });
}

program.addHelpText(
  'before',
  `
  使用ci工具前需准备：
  1、头条开发者账号绑定邮箱
  2、快手和微信需生成上传代码密钥
  3、项目根目录创建.ci-config.js配置文件
`
);

program
  .command('config')
  .description('用户设置')
  .action(() => {
    askForUserConfig();
  });

program
  .command('preview')
  .description('预览码')
  .action(() => {
    main('preview');
  });

program
  .command('publish')
  .description('体验码')
  .action(() => {
    main('publish');
  });

program.parse();
