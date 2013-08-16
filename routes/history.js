var dbModel = require('../models/db')
  , moment = require('moment');

var tabelRender = function(callback) {
  var d = [];
  function innc(results) {
    for(var i = 0; i < results.length; i++) {
      var et = 0;
      for (key in results[i].groups) {
        et += parseInt(results[i].groups[key]['estTotal']);
      }
      d.push({
        iid: results[i].iid,
        date: moment(results[i].date).format("MM/DD"),
        estTotal: et,
        realVal: results[i].realVal,
        paid: (results[i].paidOut) ? results[i].paidOut : false,
        excl: (results[i].excl) ? results[i].excl : false
      });
    }
    callback(d);
  }
  dbModel.find(dbModel.Loot, {}, innc);
};

/*
 * GET history data and table.
 * /history
 */

exports.index = function(req, res) {
  console.log(req.user);
  tabelRender(function (d) {
    res.render('history', {
      data: d,
      moment: moment,
      admin: true
      //admin: req.user.admin
    });
  });
};

/*
 * GET history partial table.
 * /historyTable
 */

exports.render = function(req, res) {
  tabelRender(function (d) {
    req.app.render('_historytbody', { data: d }, function(err, html){
      res.send(html);
    });
  });
};

/*
 * POST history updated data.
 * /historyUpdate
 */

exports.update = function(req, res) {
  var d = req.body;
  var updateData = {
    paidOut: d.paid,
    realVal: d.realVal,
    excl: d.excl
  };
  function callback() {
    res.send("Update Successful");
  }
  dbModel.update(dbModel.Loot, {'iid': d.iid}, updateData, callback);
};