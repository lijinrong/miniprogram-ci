const path = require('path');
const ora = require('ora');

async function publish(
  { mp, env, userConfig, version, description, buildPlatforms, accountConfig },
  type = 'preview'
) {
  const spinner = ora('开始发布').start();
  const tasks = buildPlatforms.map((platform) => {
    const publishConfig = userConfig.resolvePublishConfig(env, mp, platform);
    return createTask(
      {
        platform,
        version,
        description,
        publishConfig,
        accountConfig,
      },
      type
    );
  });

  const res = await Promise.all(tasks);
  spinner.succeed('发布完成').stop();
  return res;
}

async function createTask(
  { platform, version, description, publishConfig, accountConfig },
  type
) {
  let task = require(path.join(__dirname, platform)).preview;
  if (type === 'publish') {
    task = require(path.join(__dirname, platform)).publish;
  }
  const res = await task(publishConfig, accountConfig, version, description);
  return res;
}

module.exports = { publish };
