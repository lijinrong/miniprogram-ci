const https = require('https');

function upload({ data, hostname, path }) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname,
      path,
      headers: {
        'Content-Type': 'image/png',
      },
      maxRedirects: 20,
    };

    const req = https.request(options, function (res) {
      const chunks = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function (chunk) {
        const body = Buffer.concat(chunks);
        resolve(JSON.parse(body.toString()));
      });

      res.on('error', function (error) {
        reject(error);
      });
    });

    req.write(data, 'binary');

    req.end();
  });
}

module.exports = {
  upload,
};
