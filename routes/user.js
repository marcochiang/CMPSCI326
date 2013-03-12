
/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');

// User object
var user = actions.getUser('marco');

// Renders the list (?):
exports.list = function(req, res){
  res.send("respond with a resource");
};

// ## Profile View

// Renders the profile view:
exports.profile = function(req, res){
	var display = actions.getTweets(user);
 	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the following element:
exports.following = function(req, res){
	var display = actions.getFollowing(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
}

// Renders the followers element:
exports.followers = function(req, res){
	var display = actions.getFollowers(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the favorites element:
exports.favorites = function(req, res){
	var display = actions.getFavorites(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the follower_requests element:
exports.follower_requests = function(req, res){
	var display = actions.getFollowerRequests(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

// Renders the lists element:
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

// Renders the mentions element:
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

// Renders the activity element:
exports.activity = function(req, res){
	var display = "<h3>Activity</h3></br>Activity will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the who_to_follow element:
exports.who_to_follow = function(req, res){
	var display = "<h3>Who To Follow</h3></br>Who to follow functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the find_friends element:
exports.find_friends = function(req, res){
	var display = "<h3>Find Friends</h3></br>Find friends functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

// Renders the discover element:
exports.browse_categories = function(req, res){
	var display = "<h3>Browse Categories</h3></br>Browse categories functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};