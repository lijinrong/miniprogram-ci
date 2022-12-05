var shell = require('shelljs');
const ora = require('ora');
var fs = require('fs');
const { CACHE_PATH } = require('../constant');
var archiver = require('archiver');
var path = require('path');
const { upload } = require('../notify/tools');

async function pack({ userConfig, mp, env, buildPlatforms }) {
  const spinner = ora('开始打包上传').start();
  const buildTasks = buildPlatforms.map((platform) => {
    const publishConfig = userConfig.resolvePublishConfig(env, mp, platform);
    return createPackTask(platform, publishConfig.buildPath, userConfig);
  });
  try {
    const packRes = await Promise.all(buildTasks);
    spinner.succeed('打包成功');
    const result = {};
    packRes.forEach((item) => {
      result[item.platform] = item.url;
    });
    return result;
  } catch (e) {
    console.error(e);
    spinner.fail('打包代码失败').stop();
    process.exit();
  }
}

function createPackTask(platform, buildPath, userConfig) {
  return new Promise(async (res, rej) => {
    var output = fs.createWriteStream(path.join(CACHE_PATH, 'package.zip'));
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });
    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', async function () {
      const data = fs.readFileSync(path.join(CACHE_PATH, 'package.zip'));
      const { url } = await upload({
        data,
        ...userConfig.uploadConfig,
      });
      res({ platform, url });
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      rej(err);
    });

    // pipe archive data to the file
    archive.pipe(output);
    archive.directory(buildPath, false);
    archive.finalize();
  });
}

module.exports = {
  pack,
};
