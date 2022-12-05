const fs = require('fs');
const ora = require('ora');
const inquirer = require('inquirer');
const { create } = require('../utils/index');
var shell = require('shelljs');

const {
  USER_CONFIG_PATH,
  ACCOUNT_CONFIG_PATH,
  PLATFORM_VALUE,
} = require('../constant');

function getUserName() {
  return new Promise((res) => {
    shell.exec(
      `git config user.name || git config user.email`,
      { silent: true, fatal: true },
      function (_, name) {
        res(name || '未知');
      }
    );
  });
}

function getBranchName() {
  return new Promise((res) => {
    shell.exec(
      `git branch --show-current`,
      { silent: true, fatal: true },
      function (_, name) {
        res(name || '未知');
      }
    );
  });
}

async function resolveUserConfig() {
  const spinner = ora('检查用户配置').start();
  let userConfig, accountConfig;
  if (fs.existsSync(USER_CONFIG_PATH)) {
    userConfig = require(USER_CONFIG_PATH);
  } else {
    spinner.fail('未检测到用户配置，请确保项目根目录已有.ci-config.js').stop();
    process.exit();
  }

  userConfig.name = await getUserName();
  userConfig.branchName = await getBranchName();

  if (fs.existsSync(ACCOUNT_CONFIG_PATH)) {
    accountConfig = require(ACCOUNT_CONFIG_PATH);
  } else if (userConfig.platforms.indexOf(PLATFORM_VALUE.toutiao) > -1) {
    spinner.fail('未检测到用户账号配置');
    accountConfig = await askForUserConfig(userConfig);
  }
  spinner.succeed('读取用户配置');

  return {
    userConfig,
    accountConfig,
  };
}

async function askForUserConfig() {
  const userConfig = require(USER_CONFIG_PATH);
  const accountConfig = await inquirer.prompt([
    {
      type: 'input',
      name: 'ttEmail',
      message: '请输入头条开放平台登录邮箱',
      when() {
        return userConfig.platforms.indexOf(PLATFORM_VALUE.toutiao) > -1;
      },
    },
    {
      type: 'input',
      name: 'ttPass',
      message: '请输入头条开放平台登录密码',
      when() {
        return userConfig.platforms.indexOf(PLATFORM_VALUE.toutiao) > -1;
      },
    },
  ]);
  create(ACCOUNT_CONFIG_PATH);
  fs.writeFileSync(ACCOUNT_CONFIG_PATH, JSON.stringify(accountConfig, null, 2));
  return accountConfig;
}

module.exports = { resolveUserConfig, askForUserConfig };
