var shell = require('shelljs');
const ora = require('ora');
const { PLATFORM_NAMES_MAP } = require('../constant');

async function build({ mp, env, buildPlatforms, sync }) {
  const spinner = ora('开始编译').start();
  try {
    if (sync) {
      for (let i = 0; i < buildPlatforms.length; i++) {
        spinner.text = `开始编译：${PLATFORM_NAMES_MAP[buildPlatforms[i]]}`;
        await createBuildTask(mp, env, buildPlatforms[i]);
      }
    } else {
      const buildTasks = buildPlatforms.map((platform) => {
        return createBuildTask(mp, env, platform);
      });
      await Promise.all(buildTasks);
    }
    spinner.succeed('编译完成');
  } catch (e) {
    console.error(e);
    spinner.fail('编译失败，请检查代码').stop();
    process.exit();
  }
}

function createBuildTask(mp, env, platform) {
  return new Promise((res) => {
    shell.exec(
      `npx cross-env NODE_ENV=${
        env == 'dev' ? 'development' : 'production'
      } UNI_PLATFORM=${platform} CONFIG=${env} ${
        mp ? `MP=${mp}` : ''
      } vue-cli-service uni-build --minimize`,
      { silent: true, fatal: true },
      function () {
        res();
      }
    );
  });
}

module.exports = {
  build,
};
