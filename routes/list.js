var dbModel = require('../models/db')
  , moment = require('moment');

exports.index = function(req, res) {
  var owed = {};
  var hold = [];
  function callback(results) {
    // for(var i = 0; i < results.length; i++) {
    //   for(var j = 0; j < results[i].items.length; j++) {
    //     if(results[i].items[j].bought == true && results[i].items[j].paid == false) {
    //       owed[results[i].items[j].buyer] += results[i].items[j].cost;
    //     }
    //   }
    // }
    for(var i = 0; i < results.length; i++) {
      if(results[i].items.length || results[i].person == req.user.evename) {
        hold.push(results[i]);
      }
    }
    res.render('shopping', {
      data: hold
    });
  }
  dbModel.find(dbModel.List, {}, callback);
};

exports.entry = function(req, res) {
  var d = req.body;
  var updateData = {
    item: req.body.item,
    quantity: req.body.quantity
  };
  function callback() {
    console.log("Worked");
    res.send("Update successful");
  }
  dbModel.update(dbModel.List, {person: req.user.evename}, {$push: {items: {item: req.body.item, quantity: req.body.quantity}}}, callback);
};

exports.remove = function(req, res) {
  function callback() {
    console.log("Pulled entry");
    res.send("pull worked");
  }
  dbModel.update(dbModel.List, {person: req.user.evename}, {$pull: {items: {item: req.body.item}}}, callback);
};

exports.update = function(req, res) {
  dbModel.List.find({person: req.user.evename, 'items.item': req.body.item}, {'items.$': req.body.item}, function(err, results) {
    if(err) {
      return console.log(err);
    }
    console.log(results);
  });
}