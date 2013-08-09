
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , moment = require('moment');

var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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
// ----- END SCHEMAS -----

// ----- MODELS -----
var Loot = mongoose.model('Loot', lootTrackSchema);
var List = mongoose.model('List', shoppingListSchema);
// ----- END MODELS -----

var cnct = false;
var ver;
var memberList = ["Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet",
                  "Joe Poopy", "Lilum Biggum", "Melliflous Hyperion", "Nova Kairas", "Schaeffer Gaunt",
                  "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie",
                  "Zencron en Thelles", "807Y6DI897TU"];

fs.readFile('package.json', 'utf8', function(err, data) {
  if(err) {
    return console.log(err);
  }
  ver = JSON.parse(data).version;
});

mongoose.connect('mongodb://localhost/test'); //local
//mongoose.connect('mongodb://nodejitsu:56fd99802c64c6dc6255cf80a80bae99@dharma.mongohq.com:10098/nodejitsudb4207727473'); //deploy
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  cnct = true;
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ----- INDEX -----
/* ----- Load index page ----- */
app.get('/', function(req, res){
  res.render('index', {
    title: 'JHole',
    ver: ver
  });
});
// ----- END INDEX -----

// ----- PAYOUT -----
// Page load
app.get('/history', function(req, res) {
  var d = [];
  Loot.find({}, function(err, results) {
    if(err) {
      return console.log(err);
    }
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
    res.render('history', {
      title: 'History',
      data: d,
      moment: moment,
      ver: ver
    });
  });
});

// Update entry
app.post('/historyUpdate', function(req, res) {
  var d = req.body;
  var updateData = {
    paidOut: d.paid,
    realVal: d.realVal,
    excl: d.excl
  };
  Loot.update({'iid': d.iid}, updateData, function(err, aff) {
    if(err) {
      return console.log(err);
    }
    console.log('affected rows %d', aff);
    res.send("Update Successful");
  });
});

/* ----- PARTIAL RENDER CALLS ----- */
// History table render
app.get('/historyTable', function(req, res) {
  var d = [];
  Loot.find({}, function(err, results) {
    if(err) {
      return console.log(err);
    }
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
    app.render('_historytbody', { data: d }, function(err, html){
      res.send(html);
    });
  });
});

// Tracker table render
app.get('/trackerTable', function(req, res) {
  app.render('_trackertable', {members: memberList}, function(err, html) {
    if(err) {
      return console.log(err);
    }
    res.send(html);
  });
});
/* ----- END PARTIAL CALLS ----- */

// ----- END PAYOUT -----

// ----- SHOPPING LIST -----
app.get('/shopping', function(req, res){
  var owed = {};
  List.find({}, function(err, results) {
    if(err) {
      console.log("error");
      return console.log(err);;
    }
    for(var i = 0; i < results.length; i++) {
      for(var j = 0; j < results[i].items.length; j++) {
        if(results[i].items[j].bought == true && results[i].items[j].paid == false) {
          owed[results[i].items[j].buyer] += results[i].items[j].cost;
        }
      }
    }
    res.render('shopping', {
      title: 'JHole',
      ver: ver,
      data: results
    });
  });
});

app.post('/listUp', function(req, res) {
  var d = req.body;
  console.log(d.arr);
  // List.update({'person': d.person}, updateData, function(err, aff) {
  //   if(err) {
  //     return console.log(err);
  //   }
  //   console.log('affected rows %d', aff);
  //   res.send("Update Successful");
  // });
  res.send("Got");
});
// ----- END SHOPPING LIST

// ----- TRACKER -----
/* ----- Load tracker page ----- */
app.get('/tracker', function(req, res) {
  var arr = [];
  Loot.find({}, function(err, results) {
    if(err) {
      console.log("error");
      console.log(err);
      return;
    }
    for(var i = 0; i < results.length; i++) {
      arr.push({iid: results[i].iid, date: results[i].date});
    }
    res.render('tracker', {
      title: 'Tracker',
      data: arr,
      moment: moment,
      ver: ver
    });
  });
});

/* ----- Export data ----- */
app.post('/trackerUp', function(req, res) {
  console.log(req.body);
  var d = req.body;
  
  var sub = new Loot({
    iid: d.iid,
    currg: d.currg,
    groups: d.groups,
    main: d.main,
    realVal: d.vals.real
  });
  sub.save(function(err, sub) {
    if(err) {
      res.send(500, "That did not work so well");
      return;
    }
    res.send("Complete");
    return;
  });
});

/* ----- Import data ----- */
app.get('/trackerDown', function(req, res) {
  Loot.find({'iid': req.query.iid}, function(err, results) {
    if(err) {
      console.log(err);
      res.send("Error");
      return;
    }
    res.send(results);
    return;
  });
});

/* ----- Delete entry ----- */
app.get('/trackerDelete', function(req, res) {
  console.log("Called");
  Loot.remove({'iid': req.query.iid }, function(err) {
    if (err) {
      return console.log(err);
    }
    res.send("Success");
    return;
  });
})

/* ----- Send list for typeahead ----- */
app.get('/iid', function(req, res) {
  var hs = [];
  Loot.find({}, function(err, results) {
    if(err) {
      return console.log(err);
    }
    for(var i = 0; i < results.length; i++) {
      hs.push({value: results[i].iid, date: moment(results[i].date).format("MM/DD"), tokens:[results[i].iid, moment(results[i].date).format("MM/DD")]});
    }
    res.json(hs);
    return;
  });
});
// ----- END TRACKER -----

// ----- QUERY TEST -----

// Loot.find({}, function(err, results) {
//   if(err) {
//     console.log("error");
//     console.log(err);
//     return;
//   }
//   console.log(results);
// });
// List.find({}, function(err, results) {
//   if(err) {
//     console.log("error");
//     return console.log(err);;
//   }
//   console.log(results);
// });
/*
Loot.find({ 'iid': 'c$h2%' }, function(err, results) {
  if(err) {
    console.log("error");
    console.log(err);
    return;
  }
  console.log(results);
});
*/
// ----- END QUERY TEST -----

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
