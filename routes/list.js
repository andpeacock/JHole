var dbModel = require('../models/db')
  , moment = require('moment');

exports.index = function(req, res) {
  var hold = [];
  function callback(results) {
    for(var i = 0; i < results.length; i++) {
      if(results[i].items.length) {
        var bOwedEmpty = true;
        var owed = [];
        var spsave = [];
        for(var j = 0; j < results[i].items.length; j++) {
          if(results[i].items[j].bought && !results[i].items[j].paid) {
            bOwedEmpty = false;
            owed.push({buyer: results[i].items[j].buyer, item: results[i].items[j].item, cost: results[i].items[j].cost});
            spsave.push(j);
          }
        }
        if(!bOwedEmpty) {
          for (var k = spsave.length -1; k >= 0; k--) {
            results[i].items.splice(spsave[k],1);
          }
          results[i]['owed'] = owed;
        }
        hold.push(results[i]);
      }
      else if(results[i].person == req.user.evename) {
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
  var p = (req.user.admin) ? req.body.person : req.user.evename
  dbModel.update(dbModel.List, {person: p}, {$pull: {'items': {'item': req.body.item}}}, callback);
};

exports.paid = function(req, res) {
  function callback() {
    console.log("Pulled entry");
    res.send("pull worked");
  }
  dbModel.update(dbModel.List, {person: req.body.person}, {$pull: {'items': {'item': req.body.item}}}, callback);
};

exports.update = function(req, res) {
  var udata = {
    bought: true,
    cost: req.body.cost,
    buyer: req.user.evename
  };
  function callback() {
    console.log("It worked");
    res.send("Update worked");
  }
  dbModel.update(dbModel.List, {person: req.body.person, 'items.item': req.body.item}, {'$set': {
    'items.$.bought': udata.bought,
    'items.$.cost': udata.cost,
    'items.$.buyer': udata.buyer
  }}, callback);
};
// dbModel.List.update({person: 'Andrew Jester', 'items.item': 'test'}, {'$set': {
//   'items.$.quantity': 10,
//   'items.$.cost': 0
// }}, function(err) {
//   if(err) {
//     return console.log(err);
//   }
//   console.log("Worked");
// });
// dbModel.List.find({person: 'Andrew Jester', 'items.item': 'test'}, {'items.$': 'test'}, function(err, results) {
//     if(err) {
//       return console.log(err);
//     }
//     console.log(results);
//   });
// dbModel.List.find({person: 'Andrew Jester'}, function(err, results) {
//   console.log(results);
// });
// dbModel.List.find({person: 'Yuri Lebbie'}, function(err, results) {
//   console.log(results);
// });