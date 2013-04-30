
/**
 * Module dependencies.
 */

var express = require('express')
	, engine = require('ejs-locals')
	, routes = require('./routes')
	, auth = require('./routes/auth')
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
app.get('/tweet/:tweetid', tweet.displayTweet);

//Load profileSidebar with number of tweets, following, followers..
app.post('/loadProfile', user.loadProfile);

//Logged Out User Routes
app.get('/login', auth.login);
app.post('/login/auth', auth.loginAuth);
app.get('/register', auth.register);
app.post('/register/process', auth.registerProcess);
app.get('/logout', requiresLogin, auth.logout);

//Logged In User Routes
app.get('/user/:user/following', requiresLogin, user.following);
app.get('/user/:user/followers', requiresLogin, user.followers);
app.get('/user/:user/favorites', requiresLogin, user.favorites);
app.get('/user/:user/lists', requiresLogin, user.lists); //needed??
app.get('/user/:user/message', requiresLogin, user.sendMessage);
app.get('/user/:user/follower_requests', requiresLogin, user.follower_requests);

app.get('/connect', requiresLogin, user.connect);
app.get('/connect/mentions', requiresLogin, user.mentions);

app.get('/discover', requiresLogin, user.discover);
app.get('/discover/activity', requiresLogin, user.activity);
app.get('/discover/who_to_follow', requiresLogin, user.who_to_follow);
app.get('/discover/find_friends', requiresLogin, user.find_friends);
app.get('/discover/browse_categories', requiresLogin, user.browse_categories);

app.get('/messages', requiresLogin, user.messages);
app.post('/settings', requiresLogin, user.settings);
app.get('/settings', requiresLogin, user.settings);

app.get('/search', requiresLogin, user.search);
app.post('/search/process', requiresLogin, user.searchProcess)

//follow user
app.post('/follow/:id', requiresLogin, user.follow);
//unfollow user
app.post('/unfollow/:id', requiresLogin, user.unfollow);

//Universal User Routes
app.get('/user/:user', user.profile);


var server = http.createServer(app);

// WebSockets/Socket.IO
var io      = require('socket.io', {'log level': 0}).listen(server);
var chatApp = require('./chat');

io.sockets.on('connection', function (socket) {
	chatApp.init(socket);
});


server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode",
              server.address().port, app.settings.env);
});
