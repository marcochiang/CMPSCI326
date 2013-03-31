
/**
 * Module dependencies.
 */

var express = require('express')
	, engine = require('ejs-locals')
	, routes = require('./routes')
	, user = require('./routes/user')
	, stat = require('./routes/static')
	, tweet = require('./routes/tweet')
	, http = require('http')
	, path = require('path')
	// TDR: Include flash middleware:
	, flash = require('connect-flash');

var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views',__dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(flash());
	//use custom middleware to assign session variable that can be called in other pages (i.e. views)
	app.use(function(req, res, next) {
  		res.locals.session = req.session;
  		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

//redirects user to login screen if session not defined
//called from logged-in user route handlers
function requiresLogin(req, res, next){
	if (req.session.user){
		next();
	}
	else{
		//in case we want to redirect the client to their intended URL
		//res.redirect('/login?redir='+req.url);
		res.redirect('/login')
	}
}

//Splash Page
app.get('/', requiresLogin, routes.index);

//Static Routes
app.get('/about', stat.about);
app.get('/help', stat.help);
app.get('/faq', stat.faq);

//Tweet posting
app.get('/', tweet.tweet);
app.post('/post', tweet.post);
app.post('/check', tweet.check);

//Logged Out User Routes
app.get('/login', user.login);
app.post('/login/auth', user.auth);
app.get('/register', user.register);
app.post('/register/process', user.registerProcess);

//Hard Coded User profiles
app.get('/show_user/Marco', requiresLogin, user.showUserMarco);
app.get('/show_user/Jeff', requiresLogin, user.showUserJeff);
app.get('/show_user/Matt', requiresLogin, user.showUserMatt);
app.get('/show_user/Jon', requiresLogin, user.showUserJon);

//Logged In User Routes
app.get('/users', requiresLogin, user.list);
app.get('/following', requiresLogin, user.following);
app.get('/followers', requiresLogin, user.followers);
app.get('/favorites', requiresLogin, user.favorites);
app.get('/follower_requests', requiresLogin, user.follower_requests);
app.get('/lists', requiresLogin, user.lists); //needed??
app.get('/connect', requiresLogin, user.connect);
app.get('/mentions', requiresLogin, user.mentions);
app.get('/discover', requiresLogin, user.discover);
app.get('/activity', requiresLogin, user.activity);
app.get('/find_friends', requiresLogin, user.find_friends);
app.get('/browse_categories', requiresLogin, user.browse_categories);
app.get('/logout', requiresLogin, user.logout);

//Universal User Routes
app.get('/profile', user.profile);
app.get('/who_to_follow', user.who_to_follow);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
