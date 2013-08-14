var mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

exports.init = function() {
  mongoose.connect('mongodb://localhost/test'); //local
  //mongoose.connect('mongodb://nodejitsu:56fd99802c64c6dc6255cf80a80bae99@dharma.mongohq.com:10098/nodejitsudb4207727473'); //deploy
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    cnct = true;
  });
};

// ----- SCHEMAS -----
var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false}
});
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
var gasTrackSchema = new mongoose.Schema({
  person: String,
  c320: {type: Number, default: 0},
  c540: {type: Number, default: 0},
  other: {type: Number, default: 0},
  redeemed: {type: Number, default: 0}
});
// ----- END SCHEMAS -----

// Bcrypt middleware
userSchema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// ----- MODELS -----
var User = mongoose.model('User', userSchema);
exports.Loot = mongoose.model('Loot', lootTrackSchema);
exports.List = mongoose.model('List', lootTrackSchema);
exports.Gas  = mongoose.model('Gas', gasTrackSchema);
// ----- END MODELS -----

// ---------- LOGIN STUFF ----------

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// ---------- END LOGIN STUFF ----------

exports.find = function(schemaName, findData, callback) {
  schemaName.find(findData, function(err, results) {
    if(err) {
      return console.log(err);
    }
    callback(results);
  });
};
exports.update = function(schemaName, findData, updateData, callback) {
  schemaName.update(findData, updateData, function(err, aff) {
    if(err) {
      return console.log(err);
    }
    console.log('affected rows %d', aff);
    callback();
  });
};
exports.remove = function(schemaName, findData, callback) {
  schemaName.remove(findData, function(err) {
    if(err) {
      return console.log(err);
    }
    callback();
  })
};
exports.create = function(schemaName, createData, callback) {
  var sub = new schemaName(createData);
  sub.save(function(err, sub) {
    if(err) {
      res.send(500, "That did not work so well");
      return console.log(err);
    }
    callback(sub);
  });
};