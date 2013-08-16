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
      for(var i = 0; i < results.length; i++) {
        total += parseInt(results[i].main[user].total);
      }
      res.render('user', {
        total: total
      });
    }
    dbModel.find(dbModel.Loot, {'paidOut': false}, callback);
  }
  else {
    res.render('user', {
      total: null
    });
  }
};
exports.updateEve = function(req, res) {
  function callback() {
    res.redirect('/me');
  }
  dbModel.update(dbModel.User, {'username': req.user.username}, {'evename': req.body.evename}, callback);
}