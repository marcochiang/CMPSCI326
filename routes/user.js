// # User.js
// This is the routes module for accessing the dynamic views
// and elements of the app.

/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');
var userlib = require('../lib/users/user.js');

// Displays list of users:
exports.list = function(req, res) {
	var display = userlib.list();
	res.render('users/usersList', {title: 'User List', nav: 'me', func: 'me', user: user, data: display});
};


//Profile Render helper function
var profileRender = function(req, res, fn) {
	
	var requestedUser;
    var display = '';
    var followButton = '';
	var self = false;
	var func;
	var nav = '';
	var username = req.params.user;
	
	//Lookup User
	userlib.lookup(username, function(error, user) {
		if (error) {
			console.log(error);
		}
		//User exists
		else {
			requestedUser = user;
			//User is logged in
			if (req.session.user !== undefined) {
				//User is viewing their own profile
				if (user.username == req.session.user.username) {
					console.log('displaying your own profile');
					self = true;
					nav = 'me';
				}
				//User is viewing other profile
				else {
					//Get follow/unfollow button
					userlib.profileButton(req.session.user, user.username, function(error, button) {
						if (error) {
							console.log(error);
						}
						else {
							followButton = button;
						}
					});
				}
			}
			switch(fn) {
				case 1:
				func = 'profile';
				display = actions.getTweets(user);
				break;
				case 2:
				func = 'following';
				display = userlib.getFollowing(user, false);
				break;
				case 3:
				func = 'followers';
				display = actions.getFollowers(user);
				break;
				case 4:
				func = 'favorites';
				display = actions.getFavorites(user);
				break;
				case 5:
				func = 'requests';
				display = actions.getFollowerRequests(user);
				break;
				case 6:
				func = 'lists';
				display = actions.getLists(user);
				break;
				default:
				func = 'profile';
				display = actions.getTweets(user);
			}
		}
	});

	res.render('users/profile', {title: username, func: func, nav: nav, data: display, self: self, user: requestedUser, button: followButton});
	
};


// ## Profile View
// Renders the profile view:
exports.profile = function(req, res) {

	profileRender(req, res, 1);
	
};


// Renders the users that the current user is following:
exports.following = function(req, res) {

	profileRender(req, res, 2);
	
};


// Renders the followers of the current user:
exports.followers = function(req, res) {
	
	profileRender(req, res, 3);
	
};

// Renders the current user's favorited tweets:
exports.favorites = function(req, res) {

	profileRender(req, res, 4);
	
};

// Renders the current user's follower requests:
exports.follower_requests = function(req, res) {
	
	profileRender(req, res, 5);
	
};

// Renders the current user's lists:
exports.lists = function(req, res) {

	profileRender(req, res, 6);
	
};


// ## Connect View

// Renders the connect view:
exports.connect = function(req, res) {

	var display = actions.getInteractions(req.session.user);
	res.render('users/active/connect', {title: 'Connect', func: 'connect', nav: 'connect', data: display});
	
};

// Renders tweets that the current user has been mentioned in:
exports.mentions = function(req, res) {

	var display = actions.getMentions(req.session.user);
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
			res.redirect('/discover/who_to_follow');
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
			res.redirect('/user/'+user.username+'/following');
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

	res.render('users/active/settings', {title: 'Settings', func: 'settings', nav: 'settings'});
	
};
