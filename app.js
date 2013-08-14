/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , bcrypt = require('bcrypt')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , history = require('./routes/history')
  , tracker = require('./routes/tracker')
  , gas = require('./routes/gas')
  , list = require('./routes/list')
  , gm = require('./models/general')
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
app.use(express.cookieParser());
app.use(express.session({ secret: 'testsecret' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

dbModel.init();

var ver;
gm.getVer(function(version) {
  ver = version;
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// ----- INDEX -----
app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', {
    title: 'JHole',
    ver: ver
  });
});
app.get('/login', function(req, res){
  console.log("req.user: "+req.user);
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
      return res.redirect('/');
    });
  })(req, res, next);
});
// ----- END INDEX -----

// ----- HISTORY -----
app.get('/history', ensureAuthenticated, history.index); // Initial redner
app.get('/historyTable', history.render); // Partial table render
app.post('/historyUpdate', history.update); // Update
// ----- END HISTORY -----

// ----- SHOPPING LIST -----
app.get('/shopping', list.index);
app.post('/listUp', list.update);
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
