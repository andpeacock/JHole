var fs = require('fs')
  , version;

exports.getVer = function(callback) {
  fs.readFile('package.json', 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    }
    version = JSON.parse(data).version;
    callback(version);
  });
}