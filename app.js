
/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , routes = require('./routes')
  , user = require('./routes/user')
  , stat = require('./routes/static')
  , http = require('http')
  , path = require('path');

var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
	app.set('views',__dirname + '/views');
	app.set('view engine', 'ejs'); // so you can render('index')
	
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

//Static Routes
app.get('/about', stat.about);
app.get('/help', stat.help);
app.get('/faq', stat.faq);

//User Routes
app.get('/users', user.list);
app.get('/profile', user.profile);
app.get('/following', user.following);
app.get('/followers', user.followers);
app.get('/favorites', user.favorites);
app.get('/follower_requests', user.follower_requests);
app.get('/lists', user.lists); //needed??
app.get('/connect', user.connect);
app.get('/mentions', user.mentions);
app.get('/discover', user.discover);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
