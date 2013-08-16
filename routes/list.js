var dbModel = require('../models/db')
  , moment = require('moment');

exports.index = function(req, res) {
  var owed = {};
  function callback(results) {
    for(var i = 0; i < results.length; i++) {
      for(var j = 0; j < results[i].items.length; j++) {
        if(results[i].items[j].bought == true && results[i].items[j].paid == false) {
          owed[results[i].items[j].buyer] += results[i].items[j].cost;
        }
      }
    }
    res.render('shopping', {
      data: results
    });
  }
  dbModel.find(dbModel.List, {}, callback);
};

exports.update = function(req, res) {
  var d = req.body;
  console.log(d.arr);
  function callback() {
    console.log('affected rows %d', aff);
    res.send("Update Successful");
  }
  //dbModel.update(dbModel.List, {'person': d.person}, updateData, callback);
};