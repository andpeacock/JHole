/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , history = require('./routes/history')
  , tracker = require('./routes/tracker')
  , gas = require('./routes/gas')
  , list = require('./routes/list')
  , user = require('./routes/user')
  , gm = require('./models/general')
  , dbModel = require('./models/db');

var app = express();

var ver;
gm.getVer(function(version) {
  ver = version;
});

app.locals({
  title: 'JHole',
  ver: ver
});

var registerPhrase = 'testing';
//dbModel.init();
//mongoose.connect('mongodb://localhost/test'); //local
mongoose.connect('mongodb://nodejitsu:56fd99802c64c6dc6255cf80a80bae99@dharma.mongohq.com:10098/nodejitsudb4207727473'); //deploy
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  cnct = true;
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'testsecret' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// ----- INDEX -----
app.get('/', ensureAuthenticated, function(req, res){
  res.render('index');
});
app.get('/login', function(req, res){
  //console.log("req.user: "+req.user);
  res.render('login', { user: req.user, message: req.session.messages });
});
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/me');
    });
  })(req, res, next);
});
app.post('/register', function(req, res) {
  var rb = req.body
  var infoHold = {
    username: rb.username,
    email: rb.email,
    password: rb.password,
    evename: rb.evename
  }
  function callback() {
    res.redirect("/me");
  }
  if(req.body.phrase === registerPhrase) {
    dbModel.create(dbModel.User, infoHold, callback);
  }
});
app.post('/registerPhrase', function(req, res) {
  registerPhrase = req.body.updatePhrase;
  res.send("Complete");
});
// ----- END INDEX -----

// ----- HISTORY -----
app.get('/history', ensureAuthenticated, history.index); // Initial redner
app.get('/historyTable', ensureAuthenticated, history.render); // Partial table render
app.post('/historyUpdate', ensureAuthenticated, history.update); // Update
// ----- END HISTORY -----

// ----- SHOPPING LIST -----
// app.get('/shopping', list.index);
// app.post('/listUp', list.update);
// ----- END SHOPPING LIST

// ----- GAS TRACKER -----
// app.get('/gas', ensureAuthenticated, gas.index);
// app.post('/gas', ensureAuthenticated, gas.update);
// ----- END GAS TRACKER -----

// ----- TRACKER -----
//app.get('/tracker', tracker.index);
app.get('/trackerDown', ensureAuthenticated, tracker.entry);
app.get('/trackerDelete', ensureAuthenticated, tracker.remove);
app.get('/iid', ensureAuthenticated, tracker.typeahead);
app.get('/trackerTable', ensureAuthenticated, tracker.render);
app.post('/trackerUp', ensureAuthenticated, tracker.create);
// ----- END TRACKER -----

// ----- USER PAGE -----
app.get('/me', ensureAuthenticated, user.index);
app.post('/evename', ensureAuthenticated, user.updateEve);
// ----- END USER PAGE -----

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

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

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
