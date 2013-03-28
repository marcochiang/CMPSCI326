
/**
 * Module dependencies.
 */

var express = require('express')
	, engine = require('ejs-locals')
	, routes = require('./routes')
	, user = require('./routes/user')
	, stat = require('./routes/static')
	, http = require('http')
	, path = require('path')
	// TDR: Include flash middleware:
	, flash = require('connect-flash');

var app = express();

function authmw(req, res, next) {
	if (req.session.user === undefined && req.url === '/login/auth') {
		user.auth(req, res, next);
	}
	else if (req.session.user === undefined) {
		user.login(req, res, next);
	}
	else {
		next();
	}
}

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
	//app.use(authmw);
	app.use(flash());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

//Splash Page
app.get('/', routes.index);

//Static Routes
app.get('/about', stat.about);
app.get('/help', stat.help);
app.get('/faq', stat.faq);

//Logged Out User Routes
app.get('/login', user.login);
app.post('/login/auth', user.auth);
app.get('/register', user.register);

//Logged In User Routes
app.get('/users', user.list);
app.get('/following', user.following);
app.get('/followers', user.followers);
app.get('/favorites', user.favorites);
app.get('/follower_requests', user.follower_requests);
app.get('/lists', user.lists); //needed??
app.get('/connect', user.connect);
app.get('/mentions', user.mentions);
app.get('/discover', user.discover);
app.get('/activity', user.activity);
app.get('/find_friends', user.find_friends);
app.get('/browse_categories', user.browse_categories);

//Universal User Routes
app.get('/profile', user.profile);
app.get('/who_to_follow', user.who_to_follow);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});