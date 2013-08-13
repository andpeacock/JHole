var mongoose = require('mongoose');

exports.init = function() {
  mongoose.connect('mongodb://localhost/test'); //local
  //mongoose.connect('mongodb://nodejitsu:56fd99802c64c6dc6255cf80a80bae99@dharma.mongohq.com:10098/nodejitsudb4207727473'); //deploy
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    cnct = true;
  });
};

// ----- SCHEMAS -----
var lootTrackSchema = new mongoose.Schema({
  iid: String,
  currg: Number,
  date: { type: Date, default: Date.now },
  groups: mongoose.Schema.Types.Mixed,
  main: mongoose.Schema.Types.Mixed,
  realVal: Number,
  paidOut: {type: Boolean, default: false},
  excl: {type: Boolean, default: false}
});
var shoppingListSchema = new mongoose.Schema({
  person: String,
  items: [{
    item: String,
    quantity: Number,
    buyer: {type: String, default: "none"},
    cost: {type: Number, default: 0},
    bought: {type: Boolean, default: false},
    paid: {type: Boolean, default: false}
  }]
});
var gasTrackSchema = new mongoose.Schema({
  person: String,
  c320: {type: Number, default: 0},
  c540: {type: Number, default: 0},
  other: {type: Number, default: 0},
  redeemed: {type: Number, default: 0}
});
// ----- END SCHEMAS -----
exports.Loot = mongoose.model('Loot', lootTrackSchema);
exports.List = mongoose.model('List', lootTrackSchema);
exports.Gas  = mongoose.model('Gas', gasTrackSchema);

exports.find = function(schemaName, findData, callback) {
  schemaName.find(findData, function(err, results) {
    if(err) {
      return console.log(err);
    }
    callback(results);
  });
};
exports.update = function(schemaName, findData, updateData, callback) {
  schemaName.update(findData, updateData, function(err, aff) {
    if(err) {
      return console.log(err);
    }
    console.log('affected rows %d', aff);
    callback();
  });
};
exports.remove = function(schemaName, findData, callback) {
  schemaName.remove(findData, function(err) {
    if(err) {
      return console.log(err);
    }
    callback();
  })
};
exports.create = function(schemaName, createData, callback) {
  var sub = new dbModel.schemaName(createData);
  sub.save(function(err, sub) {
    if(err) {
      res.send(500, "That did not work so well");
      return console.log(err);
    }
    callback(sub);
  });
};