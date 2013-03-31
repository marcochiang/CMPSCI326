// # User.js
// This is the routes module for accessing the dynamic views
// and elements of the app.

/*
 * GET users listing.
 */
var fs = require('fs');

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');
var userlib = require('../lib/users/user.js');

// User object
var user = actions.getUser('marco');

// Displays list of users:
exports.list = function(req, res){
	var display = userlib.list();
	res.render('users/usersList', {title: 'User List', func: 'me', data: display});
};

// Renders the login view
exports.login = function(req, res){
	// Grab any messages being sent to use from redirect.
	var authmessage = req.flash('auth') || '';
	var redir = req.query.redir || '';

	// TDR: redirect if logged in:
	var user  = req.session.user;

	// TDR: If the user is already logged in - we redirect to the
	// main application view. We must check both that the `userid`
	// and the `online[userid]` are undefined. The reason is that
	// the cookie may still be stored on the client even if the
	// server has been restarted.
	//if (user !== undefined && online[user.uid] !== undefined) {
	if (user !== undefined){
		res.redirect('/');
	}
	else {
		// Render the login view if this is a new login.
		res.render('users/login', {title: 'Login', func: 'login', message: authmessage});
		//res.render('users/login', {title: 'Login', func: 'login', message: authmessage, redir: req.query.redir});
	}
};

// ## auth
// Performs **basic** user authentication.
exports.auth = function(req, res) {
	// TDR: redirect if logged in:
	//var user = req.session.user;

	// Pull the values from the form.
	var username = req.body.user;
	var password = req.body.pass;
	// Perform the user lookup.
	userlib.lookup(username, password, function(error, user) {
		if (error) {
			// If there is an error we "flash" a message to the
			// redirected route `/user/login`.
			req.flash('auth', error);
			//res.redirect('/login?redir='+req.body.redir);
			res.redirect('/login');
		}
		else {
			req.session.user = user;
			// Store the user in our in memory database.
			//online[user.uid] = user;
			// Redirect to main.
			res.redirect('/');
			//res.redirect(req.body.redir || '/');
		}
	});

};

// ## logout
// Deletes user info & session - then redirects to login.
exports.logout = function(req, res) {
	var user = req.session.user;

	delete req.session.user;
	res.redirect('/login');
};

// Renders the register view
exports.register = function(req, res) {
	var user  = req.session.user;

	if (user !== undefined){
		res.redirect('/');
	}

	var authmessage = req.flash('auth') || '';
	res.render('users/register', {title: 'Register', func: 'register', message: authmessage});
};

exports.registerProcess = function(req, res){
	// Pull the values from the form.
	var email1 = req.body.email1;
	var email2 = req.body.email2;
	var username = req.body.user;
	var password = req.body.pass;
	userlib.createUser(email1, email2, username, password, function(error, user) {
		if (error) {
			// If there is an error we "flash" a message to the
			// redirected route `/user/login`.
			req.flash('auth', error);
			res.redirect('/register');
		}
		else{
			req.session.user = user;
			// Store the user in our in memory database.
			//online[user.uid] = user;
			// Redirect to main.
			res.redirect('/');
		}
	});
};

// ## Hard Coded user routes

exports.showUserMarco = function(req, res){
	//var display = actions.getTweets(user);
	var display = "Marco";
 	res.render('users/showUser', {title: 'User', func: 'me', data: display});
};

exports.showUserJeff = function(req, res){
	//var display = actions.getTweets(user);
	var display = "Jeff";
 	res.render('users/showUser', {title: 'User', func: 'me', data: display});
};

exports.showUserMatt = function(req, res){
	//var display = actions.getTweets(user);
	var display = "Matt";
 	res.render('users/showUser', {title: 'User', func: 'me', data: display});
};

exports.showUserJon = function(req, res){
	//var display = actions.getTweets(user);
	var display = "Jon";
 	res.render('users/showUser', {title: 'User', func: 'me', data: display});
};

// ## Profile View

// Renders the profile view:
exports.profile = function(req, res){
	var display = actions.getTweets(user);
 	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the users that the current user is following:
exports.following = function(req, res){
	var display = actions.getFollowing(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
}

// Renders the followers of the current user:
exports.followers = function(req, res){
	var display = actions.getFollowers(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the current user's favorited tweets:
exports.favorites = function(req, res){
	var display = actions.getFavorites(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the current user's follower requests:
exports.follower_requests = function(req, res){
	var display = actions.getFollowerRequests(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the current user's lists:
exports.lists = function(req, res){
	var display = actions.getLists(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// ## Connect View

// Renders the connect view:
exports.connect = function(req, res){
	var display = actions.getInteractions(user);
	res.render('users/connect', {title: 'Connect', func: 'connect', data: display});
};

// Renders tweets that the current user has been mentioned in:
exports.mentions = function(req, res){
	var display = actions.getMentions(user);
	res.render('users/connect', {title: 'Connect', func: 'connect', data: display});
};

// ## Discover View

// Renders the discover view:
exports.discover = function(req, res){
	var display = "<h3>Tweets</h3></br>Tweets will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the current user's activity:
exports.activity = function(req, res){
	var display = "<h3>Activity</h3></br>Activity will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders who to follow suggestions for the current user:
exports.who_to_follow = function(req, res){
	//var display = "<h3>Who To Follow</h3></br>Who to follow functionality will go here..";
	var display = fs.readFileSync('views/users/who_to_follow.ejs', 'utf8');
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the find friends functionality for the current user:
exports.find_friends = function(req, res){
	var display = "<h3>Find Friends</h3></br>Find friends functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the browse categories functionality for the current user:
exports.browse_categories = function(req, res){
	var display = "<h3>Browse Categories</h3></br>Browse categories functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};
