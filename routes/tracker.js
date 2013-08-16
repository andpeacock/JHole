var dbModel = require('../models/db')
  , moment = require('moment');

var memberList = [
  "Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet",
  "Joe Poopy", "Lilum Biggum", "Melliflous Hyperion", "Nova Kairas", "Schaeffer Gaunt",
  "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie",
  "Zencron en Thelles", "807Y6DI897TU"];
/*
 * GET tracker data and table.
 */

exports.index = function(req, res) {
  var arr = [];
  function callback(results) {
    for(var i = 0; i < results.length; i++) {
      arr.push({iid: results[i].iid, date: results[i].date});
    }
    res.render('tracker', {
      data: arr,
      moment: moment
    });
  }
  dbModel.find(dbModel.Loot, {}, callback);
};

/*
 * GET tracker partial table.
 * /trackerTable
 */

exports.render = function(req, res) {
  req.app.render('_trackertable', {members: memberList}, function(err, html) {
    if(err) {
      return console.log(err);
    }
    res.send(html);
  });
};

/*
 * POST new tracker entry.
 * /trackerUp
 */

exports.create = function(req, res) {
  var d = req.body;
  var cData = {
    iid: d.iid,
    currg: d.currg,
    groups: d.groups,
    main: d.main,
    realVal: d.vals.real
  };
  function callback(sub) {
    console.log(sub);
    res.send("Created");
  }
  dbModel.create(dbModel.Loot, cData, callback);
};

/*
 * GET single tracker entry.
 * /trackerDown
 */

exports.entry = function(req, res) {
  function callback(results) {
    var gr = [];
    var mem = [];
    for(g in results[0].groups) {
      gr.push({key: g, ot: results[0].groups[g]});
    }
    for(m in results[0].main) {
      mem.push({key: m, vs: results[0].main[m]});
    }
    req.app.render('_trackerentry', {gr: gr.reverse(), iid: results[0].iid, rv: results[0].realVal, mem: mem.reverse(), user: req.user}, function(err, html) {
      if(err) {
        return console.log(err);
      }
      res.send({html: html, data: results[0]});
    });
  }
  dbModel.find(dbModel.Loot, {'iid': req.query.iid}, callback);
};

/*
 * GET remove single tracker entry.
 * /trackerDelete
 */

exports.remove = function(req, res) {
  function callback() {
    res.send("Removed");
  }
  dbModel.remove(dbModel.Loot, {'iid': req.query.iid}, callback);
};

/*
 * GET tracker typeahead data -- NOT NEEDED.
 */

exports.typeahead = function(req, res) {
  var hs = [];
  function callback(results) {
     for(var i = 0; i < results.length; i++) {
      hs.push({value: results[i].iid, date: moment(results[i].date).format("MM/DD"), tokens:[results[i].iid, moment(results[i].date).format("MM/DD")]});
    }
    res.json(hs);
  }
  dbModel.find(dbModel.Loot, {}, callback);
};
