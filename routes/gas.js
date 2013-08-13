var dbModel = require('../models/db')
  , gm = require('../models/general')
  , moment = require('moment')
  , ver;

gm.getVer(function(version) {
  ver = version;
});

exports.index = function(req, res) {
  function callback(results) {
    res.render('gas', {
      title: 'JHole - Gas Tracker',
      ver: ver,
      data: results
    });
  }
  dbModel.find(dbModel.Gas, {}, callback);
};

exports.update = function(req, res) {
  var d = req.body;
  var updateData = {
    c320: d.c320,
    c540: d.c540,
    other: d.other,
    redeemed: d.redeemed
  };
  function callback() {
    res.send('Update Successful');
  }
  dbModel.update(dbModel.Gas, {'person': d.person}, updateData, callback);
};