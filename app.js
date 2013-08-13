
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , history = require('./routes/history')
  , tracker = require('./routes/tracker')
  , gas = require('./routes/gas')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , gm = require('./models/general')
  , moment = require('moment');

var mongoose = require('mongoose')
  , dbModel = require('./models/db');

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

// ----- MODELS -----
var Loot = dbModel.Loot;
var List = dbModel.List;
var Gas  = dbModel.Gas;
// ----- END MODELS -----

var cnct = false;
var ver;
var memberList = ["Ageudum", "Akrim Stenra",  "Andrew Jester", "Brutus King", "Cardavet",
                  "Joe Poopy", "Lilum Biggum", "Melliflous Hyperion", "Nova Kairas", "Schaeffer Gaunt",
                  "Silas Mieyli", "Simmons Hakoke", "Sinya Todako", "Tennigan Haldeye", "Yuri Lebbie",
                  "Zencron en Thelles", "807Y6DI897TU"];
dbModel.init();
gm.getVer(function(version) {
  ver = version;
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

// ----- HISTORY -----
app.get('/history', history.index); // Initial redner
app.get('/historyTable', history.render); // Partial table render
app.post('/historyUpdate', history.update); // Update
// ----- END HISTORY -----

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

// ----- GAS TRACKER -----
app.get('/gas', gas.index);
app.post('/gas', gas.update);
// ----- END GAS TRACKER -----

// ----- TRACKER -----
app.get('/tracker', tracker.index);
app.get('/trackerDown', tracker.entry);
app.get('/trackerDelete', tracker.remove);
app.get('/iid', tracker.typeahead);
app.get('/trackerTable', tracker.render);
app.post('/trackerUp', tracker.create);
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

// ----- DB Setup loops -----
/*
 * Gas DB setup
for(var i = 0; i < memberList.length; i++) {
  var g = new Gas({
    person: memberList[i],
    c320: 0,
    c540: 0,
    other: 0,
    redeemed: 0
  });
  g.save(function(err, g) {
    if(err) {
      return console.log(err);
    }
    console.log(g);
  });
}
*/
/*
 * Gas DB reset
Gas.find({}, function(err, results) {
  if (err) {
    return console.log(err);
  }
  for(var i = 0; i < results.length; i++) {
    results[i].remove();
  } 
});
*/
// ----- END Setup loops -----

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
