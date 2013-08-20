var dbModel = require('../models/db')
  , moment = require('moment');

/*
 * GET users listing
 * /me
 */

exports.index = function(req, res) {
  if(req.user.evename) {
    function callback(results, user) {
      var total = 0;
      var user = req.user.evename;
      if(results[0].main[user]) {
        for(var i = 0; i < results.length; i++) {
          total += parseInt(results[i].main[user].total);
        }
      }
      if(req.user.admin) {
        function cb(results) {
          var ul = []
          for(var j = 0; j < results.length; j++) {
            ul.push({user: results[j].username, email: results[j].email, eve: results[j].evename, admin: results[j].admin});
          }
          res.render('user', {
            total: total,
            memberList: ul
          });
        }
        dbModel.find(dbModel.User, {}, cb);
      }
      else {
        res.render('user', {
          total: total
        });
      }
    }
    dbModel.find(dbModel.Loot, {'paidOut': false}, callback);
  }
  else {
    res.render('user', {
      total: null
    });
  }
};

/*
 * POST user's evename
 * /evename
 */

exports.updateEve = function(req, res) {
  function callback() {
    res.redirect('/me');
  }
  dbModel.update(dbModel.User, {'username': req.user.username}, {'evename': req.body.evename}, callback);
}

/*
 * POST delete username
 */

exports.removeUser = function(req, res) {
  function callback() {
    res.send("Success");
  }
  dbModel.remove(dbModel.User, {'username': req.body.username}, callback);
}

/*
 * POST edit user
 */

exports.editUser = function(req, res) {
  function callback() {
    console.log("Worked?");
    res.send("Success");
  }
  var udata = {
    username: req.body.username,
    email: req.body.email,
    evename: req.body.evename
  };
  dbModel.update(dbModel.User, {'username': req.body.inituser}, udata, callback);
}