const fs = require('fs');

function create(str) {
  var path = [];
  var arr = str.split('/');
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    path.push(arr[i]);
    var filename = path.join('/');
    if (!filename) {
      continue;
    }
    // 判断这个文件或文件夹是否存在
    var bln = fs.existsSync(filename);
    if (bln == false) {
      if (i < len - 1) {
        // 一定是文件夹
        fs.mkdirSync(filename);
      } else {
        // 判断是文件还是文件夹
        if (arr[i].indexOf('.') > 0) {
          // 如果是文件
          fs.writeFileSync(filename);
        } else {
          // 如果是文件夹
          fs.mkdirSync(filename);
        }
      }
    }
  }
}

module.exports = {
  create,
};
