var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var ensurer = require('connect-ensure-login');
var request = require('request')
var jay = require('./createAccount.js')

// Connection URL
var url = 'mongodb://capen:bettingapp@ds133418.mlab.com:33418/bettingapp';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");




// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: 129421860934642,
    clientSecret: 'a06b980200e0265f0918736f18d4e68e',
    callbackURL: 'http://ancient-reef-28636.herokuapp.com/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/Website');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(express.static('public'))
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/about',
  function(req, res) {
    res.render('about', { user: req.user });
  });

app.get('/history', ensurer.ensureLoggedIn(),
  function(req, res) {
    console.log("DISPLAY NAME : " + req.user.displayName)
    var ret = [];
        db.collection('bets').find({
      better: req.user.displayName
    }).toArray(function(err, docs) {
      if (err) {
        console.log(err);
      } else {
                ret = ret.concat(docs);
                console.log("docs: " + JSON.stringify(docs));
                db.collection('bets').find({
                    betee: req.user.displayName
                }).toArray(function(err, docs) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("docs2: " + docs);
                      ret = ret.concat(docs);
                      console.log('bets returned: ' + ret)
                      
                      jay.getBalance(req.user.displayName, function(err, balance) {
                        res.render('history', { user: req.user, bets: ret, balance:balance });
                      })

              }
            });
      }
    });
    
  });

app.get('/login',
  function(req, res){

    res.send('<meta http-equiv="refresh" content="0; url=/" /><script>alert("You\'re not logged in!")</script>');
    //res.end();
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
  	console.log("User is logged in now: " + JSON.stringify(req.user));
  	db.collection('users').find({
  		id: req.user.id
  	}).toArray(function(err, docs) {
  		console.log(docs);
  		if (err) {
  			console.log(err);
  		} else if (docs.length == 0) {
  	    	db.collection('users').insert({
  			id: req.user.id,
  			displayName: req.user.displayName
  			});
  			//Create Bank Account w/ ID, Credit Card Type, nickname: displayname, rewards 0, balance 100, accountnumber ID
  		}
  	});

    res.redirect('/');
  });

app.get('/profile',
  ensurer.ensureLoggedIn(),
  function(req, res){
    //res.render('profile', { user: req.user });
    res.send("User: " + JSON.stringify(req.user));
  });

app.get('/bets', ensurer.ensureLoggedIn(), function(req, res) {

	var bets = [];



	db.collection('bets').find({
		better: req.user.displayName
	}).toArray(function(err, docs) {
		bets.append(docs);
	});

	db.collection('bets').find({
		bettee: req.user.displayName
	}).toArray(function(err, docs) {
		bets.append(docs);
	});

	res.send("Bets: " + JSON.stringify(bets));

});

app.get('/test', function (req, res, next){
 var requestURL = "http://api.reimaginebanking.com/accounts/?key=5fd4a56f088983646d783535f830b417"
 var fbid = "1547012816666319"
  request.get({
    url: requestURL
  }, function(error, response){
    
    var id = "-1";
    var js = JSON.parse(response.body);
    for(var x=0;x<js.length;x++){
      if(js[x].account_number!=null&&js[x].account_number==fbid){
        id=js[x]._id;
      }
    }
    //console.log(id);
   
    var moquestURL = "http://api.reimaginebanking.com/accounts/$id?key=5fd4a56f088983646d783535f830b417"
    var morquestURL = moquestURL.replace("$id", id);
    request.get({
      url: morquestURL
    }, function(error, response){
      console.log(response.body);
    })

   // callback(null, response);


    })
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);
//console.log("i love you aaron and i want to have your bbies!!!");

  //db.close();
});