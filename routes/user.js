// # User.js
// This is the routes module for accessing the dynamic views
// and elements of the app.

/*
 * GET users listing.
 */
//var fs = require('fs');

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');
var userlib = require('../lib/users/user.js');

// User object
var user = actions.getUser('marco'); //we will eventually get rid of this

// Displays list of users:
exports.list = function(req, res) {
	var display = userlib.list();
	res.render('users/usersList', {title: 'User List', nav: 'me', func: 'me', data: display});
};

// Renders the login view
exports.login = function(req, res) {

	// Grab any messages being sent to use from redirect.
	var authmessage = req.flash('auth') || '';
	var redir = req.query.redir || '';
	
	// TDR: redirect if logged in:
	var user  = req.session.user;
	
	// TDR: If the user is already logged in - we redirect to the
	// main application view.
	if (user !== undefined) {
		res.redirect('/');
	}
	else {
		// Render the login view if this is a new login.
		res.render('users/login', {title: 'Login', nav: 'login', func: 'login', message: authmessage});
	}
	
};

// ## auth
// Performs **basic** user authentication.
exports.auth = function(req, res) {
	
	// Pull the values from the form.
	var username = req.body.user;
	var password = req.body.pass;
	// Perform the user lookup.
	userlib.auth(username, password, function(error, user) {
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
	
	delete req.session.user;
	res.redirect('/login');
	
};

// Renders the register view
exports.register = function(req, res) {

	var user  = req.session.user;
	
	if (user !== undefined) { //redirect to home if there is a current session
		res.redirect('/');
	}
	
	// Grab any messages being sent to use from redirect.
	var authmessage = req.flash('auth') || '';
	res.render('users/register', {title: 'Get Started', func: 'register', nav: 'register', message: authmessage});
	
};

exports.registerProcess = function(req, res) {

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

// ## Hard Coded user routes -- Jon's old code

/*exports.followUserMarco = function(req, res){
	//var display = actions.getTweets(user);
	var myid = req.session.user.uid;
	var display = userlib.follow(myid, 2, function(){});
 	res.render('users/profile', {title: 'User', func: 'me', data: display});
};

exports.followUserJeff = function(req, res){
	//var display = actions.getTweets(user);
	var myid = req.session.user.uid;
	var display = userlib.follow(myid, 1, function(){});
 	res.render('users/profile', {title: 'User', func: 'me', data: display});
};

exports.followUserMatt = function(req, res){
	//var display = actions.getTweets(user);
	var myid = req.session.user.uid;
	var display = userlib.follow(myid, 3, function(){});
 	res.render('users/profile', {title: 'User', func: 'me', data: display});
};

exports.followUserJon = function(req, res){
	//var display = actions.getTweets(user);
	var myid = req.session.user.uid;
	var display = userlib.follow(myid, 4, function(){});
 	res.render('users/profile', {title: 'User', func: 'me', data: display});
};*/

// ## Profile View

// Renders the profile view:
exports.profile = function(req, res) {

    var user;
    var display;
    var followButton;

    if (req.session.user !== undefined) { //session exists
    	if (req.params.user == req.session.user.username){ //user is viewing his/her own profile page
    		console.log('displaying your own profile');
    		user = req.session.user;
    		display = actions.getTweets(user);
    		followButton = ''; //viewing your own profile --> no follow/unfollow button
    		res.render('users/profile', {title: 'Profile', func: 'profile', nav: 'me', data: display, self: true, user: user, button: followButton});
    	}
    	else { //user is viewing another user's profile page
    		var username = req.params.user; //get username from URL
    		userlib.lookup(username, function(error, user) { //lookup user
    			if (error) {
    				console.log(error);
	    			req.flash('auth', error);
	    			res.redirect('/login');
	    			//possibly render some generic error page where user is not found??
    			}
    			else {
    				userlib.profileButton(req.session.user, username, function(error, button){ //get follow/unfollow button
	    				if (error) {
	    					console.log(error);
	    					res.redirect('/'); //error page?
	    				}
	    				else {
	    					followButton = button;
	    					display = actions.getTweets(user);//for now
	    					res.render('users/profile', {title: 'Profile', func: 'me', data: display, self: false, user: user, button: followButton});
	    				}
	    			});
    			}
    		});
    	}
    }

    else { //user not logged in
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
			if (error) {
				console.log(error);
    			req.flash('auth', error);
    			res.redirect('/login');
    			//possibly render some generic error page where user is not found??
			}
			else {
				followButton = ''; //not logged in --> don't display follow button
	    		display = actions.getTweets(user);//for now
	    		res.render('users/profile', {title: 'Profile', func: 'profile', nav: '', data: display, self: false, user: user, button: followButton});
			}
    	});
    }
	
};

//helper function that consildate code in functions like exports.following, exports.followers, etc.. 
function renderProfile(req, res, fn) {

	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = fn;
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'renderProfile', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else { //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error){
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button){ //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = fn;
    					res.render('users/profile', {title: 'Profile', func: 'renderProfile', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
}

// Renders the users that the current user is following: -- Jon's old code
/*exports.following = function(req, res){
	var myid = req.session.user.uid;
	var display = userlib.listFollowing(myid, function(){});
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
}*/

// Renders the users that the current user is following:
exports.following = function(req, res) {

	//renderProfile(req, res, actions.getFollowing());
	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = userlib.getFollowing(user, true);
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'following', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else { //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error) {
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button) { //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = userlib.getFollowing(user, false);
    					res.render('users/profile', {title: 'Profile', func: 'following', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
};


// Renders the followers of the current user:
exports.followers = function(req, res) {

	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = actions.getFollowers(user);
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'followers', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else { //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error) {
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button) { //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = actions.getFollowers(user);
    					res.render('users/profile', {title: 'Profile', func: 'followers', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
};

// Renders the current user's favorited tweets:
exports.favorites = function(req, res) {
	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = actions.getFavorites(user);
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'favorites', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else { //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error) {
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button) { //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = actions.getFavorites(user);
    					res.render('users/profile', {title: 'Profile', func: 'favorites', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
};

// Renders the current user's follower requests:
exports.follower_requests = function(req, res) {

	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = actions.getFollowerRequests(user);
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'follower_requests', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else{ //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error){
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button) { //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = actions.getFollowerRequests(user);
    					res.render('users/profile', {title: 'Profile', func: 'follow_requests', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
};

// Renders the current user's lists:
exports.lists = function(req, res) {

	var user;
    var display;
    var followButton;

    if (req.params.user === undefined) { //no :user variable --> user is viewing his/her own profile page
    	console.log('displaying your own profile');
    	user = req.session.user;
    	display = actions.getLists(user);
    	followButton = ''; //viewing your own profile --> no follow/unfollow button
    	res.render('users/profile', {title: 'Profile', func: 'lists', nav: 'me', data: display, self: true, user: user, button: followButton});
    }
    else { //viewing another user's profile page
    	console.log('displaying other users profile page');
    	var username = req.params.user; //get username from URL
    	userlib.lookup(username, function(error, user) { //lookup user
    		if (error) {
    			console.log(error);
	    		req.flash('auth', error);
	    		res.redirect('/login');
	    		//possibly render some generic error page where user is not found??
    		}
    		else {
    			userlib.profileButton(req.session.user, username, function(error, button) { //get follow/unfollow button
    				if (error) {
    					console.log(error);
    					res.redirect('/'); //error page?
    				}
    				else {
    					followButton = button;
    					display = actions.getLists(user);
    					res.render('users/profile', {title: 'Profile', func: 'lists', nav: 'me', data: display, self: false, user: user, button: followButton});
    				}
    			});
    		}
    	});
    }
	
};

// ## Connect View

// Renders the connect view:
exports.connect = function(req, res) {

	var display = actions.getInteractions(user);
	res.render('users/active/connect', {title: 'Connect', func: 'connect', nav: 'connect', data: display});
	
};

// Renders tweets that the current user has been mentioned in:
exports.mentions = function(req, res) {

	var display = actions.getMentions(user);
	res.render('users/active/connect', {title: 'Connect', func: 'mentions', nav: 'connect', data: display});
	
};

// ## Discover View

// Renders the discover view:
exports.discover = function(req, res) {

	var display = "<h3>Tweets</h3></br>Tweets will go here..";
	res.render('users/active/discover', {title: 'Discover', func: 'discover', nav: 'discover', data: display});
	
};

// Renders the current user's activity:
exports.activity = function(req, res) {

	var display = "<h3>Activity</h3></br>Activity will go here..";
	res.render('users/active/discover', {title: 'Discover', func: 'activity', nav: 'discover', data: display});
	
};

// Renders who to follow suggestions for the current user: -- Jon's old code
/*exports.who_to_follow = function(req, res){
	//var display = "<h3>Who To Follow</h3></br>Who to follow functionality will go here..";
	var display = fs.readFileSync('views/users/who_to_follow.ejs', 'utf8');
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};*/

// # Follow user functionality
exports.follow = function(req, res) {

	var id = req.params.id; 
	var user = req.session.user;
	userlib.follow(user, id, function(error) {
		if (error) {
			console.log(error);
			res.redirect('/');
		}
		else {
			res.redirect('/who_to_follow');
		}
	});
	
};

// #Unfollow user functionality
exports.unfollow = function(req, res) {

	var id = req.params.id;
	var user = req.session.user;
	userlib.unfollow(user, id, function(error) {
		if (error){
			console.log(error);
			res.redirect('/');
		}
		else {
			res.redirect('/following');
		}
	});
	
};

// Renders who to follow suggestions for the current user:
exports.who_to_follow = function(req, res) {

	var user = req.session.user;
	var display = userlib.who_to_follow(user);
	res.render('users/active/discover', {title: 'Who to Follow', func: 'who_to_follow', nav: 'discover', data: display});
	
};

// Renders the find friends functionality for the current user:
exports.find_friends = function(req, res) {

	var display = "<h3>Find Friends</h3></br>Find friends functionality will go here..";
	res.render('users/active/discover', {title: 'Find Friends', func: 'find_friends', nav: 'discover', data: display});
	
};

// Renders the browse categories functionality for the current user:
exports.browse_categories = function(req, res) {

	var display = "<h3>Browse Categories</h3></br>Browse categories functionality will go here..";
	res.render('users/active/discover', {title: 'Browse Categories', func: 'browse_categories', nav: 'discover', data: display});
	
};

// Renders the settings page functionality for the current user:
exports.settings = function(req, res) {

	res.render('users/active/settings', {title: 'Settings', func: 'settings', nav: ''});
	
};
