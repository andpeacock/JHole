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
exports.removeList = function() {
  dbModel.List.find({}, function(err, results) {
    if (err) {
      return console.log(err);
    }
    for(var i = 0; i < results.length; i++) {
      results[i].remove();
    }
    console.log("Cleared");
  });
}
exports.readList = function() {
  dbModel.List.find({}, function(err, results) {
    if (err) {
      return console.log(err);
    }
    console.log(results);
  });
}
exports.createList = function() {
  var memberList = [
    "Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet",
    "Joe Poopy", "Lilum Biggum", "Mellifluous Hyperion", "Nova Kairas", "Schaeffer Gaunt",
    "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie",
    "Zencron en Thelles", "807Y6DI897TU"];
  for(var i = 0; i < memberList.length; i++) {
    var l = new dbModel.List({
      person: memberList[i],
      items: []
    });
    l.save(function(err, l) {
      if(err) {
        return console.log(err);
      }
      console.log(l);
    });
  }
  readList();
}