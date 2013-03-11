
/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');

var user = actions.getUser('marco');//user object

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.profile = function(req, res){
	var display = actions.getTweets(user);
 	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

exports.following = function(req, res){
	var display = actions.getFollowing(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
}

exports.followers = function(req, res){
	var display = actions.getFollowers(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

exports.favorites = function(req, res){
	var display = actions.getFavorites(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

exports.follower_requests = function(req, res){
	var display = actions.getFollowerRequests(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

exports.lists = function(req, res){
	var display = actions.getLists(user);
	res.render('users/profile', {title: 'Profile', func: 'me', data: display});
};

exports.connect = function(req, res){
	var display = actions.getInteractions(user);
	res.render('users/connect', {title: 'Connect', func: 'connect', data: display});
};

exports.mentions = function(req, res){
	var display = actions.getMentions(user);
	res.render('users/connect', {title: 'Connect', func: 'connect', data: display});
};

exports.discover = function(req, res){
	var display = "<h3>Tweets</h3></br>Tweets will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

exports.activity = function(req, res){
	var display = "<h3>Activity</h3></br>Activity will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

exports.who_to_follow = function(req, res){
	var display = "<h3>Who To Follow</h3></br>Who to follow functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

exports.find_friends = function(req, res){
	var display = "<h3>Find Friends</h3></br>Find friends functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};

exports.browse_categories = function(req, res){
	var display = "<h3>Browse Categories</h3></br>Browse categories functionality will go here..";
	res.render('users/discover', {title: 'Discover', func: 'discover', data: display});
};