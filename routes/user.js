// # user.js
// This is the routes module for accessing the dynamic views
// and elements of the app.

/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');
var userlib = require('../lib/users/user.js');
var async   = require('async');

//Profile Render helper function
var profileRender = function(req, res, fn) {

	var requestedUser;
    var display = '';
    var followButton = '';
	var messageButton = '';
	var self = false;
	var func;
	var nav = '';
	var username = req.params.user;

	//need to use async.series here because of problems with asynchronous JavaScript & nested callbacks
	//functions need to run in a serial order
	async.series([
			//first series function: lookup user in DB
			function (callback){
				userlib.lookup(username, function(error, user) {
					if (error){
						callback(error); //pass error to callback, stop series
					}
					else{
						//set requestedUser variable, scoped for profileRender function above
						//need to do this for second series function
						requestedUser = user; 
						callback(null, 1);
					}
				});
			},

			//second series function: check if session exists, and get follow/unfollow button if so
			function (callback){
				if (req.session.user !== undefined) {
					//User is viewing their own profile
					if (requestedUser.uname === req.session.user.uname){
						self = true;
						nav = 'me';
						callback(null, 2); 
					}
					//User is viewing other user's profile
					else{
						//Get follow/unfollow button
						userlib.followButton(req.session.user, requestedUser, function(error, button) {
							if (error) {
								callback(error); //pass error to callback, stop series
							}
							else {
								followButton = button;
								callback(null, 2);
							}
						});
					}
				}
				//User is not logged in
				else{
					//still need to a call to the callback
					//if this isn't wrapped in an else, this line might get executed while waiting for userlib.followButton to return
					callback(null, 2);
				}
			},

			//third series function: get appropriate data and render profile page
			function (callback){
				//these functions will all eventually have callbacks as they will need to access DB
				//makes sense to separate into a separate series function
				switch(fn) {
					case 1:
					func = 'profile';
					display = actions.getTweets(requestedUser);
					callback(null, 3);
					break;
					case 2:
					func = 'following';
					userlib.getFollowing(requestedUser, self, function(error, following){
						if (error){
							callback(error); //pass error to callback, stop series
						}
						else{
							display = following;
							callback(null, 3);
						}
					});
					break;
					case 3:
					func = 'followers';
					userlib.getFollowers(requestedUser, self, function(error, followers){
						if (error){
							callback(error); //pass error to callback, stop series
						}
						else{
							display = followers;
							callback(null, 3);
						}
					});
					break;
					case 4:
					func = 'favorites';
					display = actions.getFavorites(requestedUser);
					callback(null, 3);
					break;
					case 5:
					func = 'requests';
					display = actions.getFollowerRequests(requestedUser);
					callback(null, 3);
					break;
					case 6:
					func = 'lists';
					display = actions.getLists(requestedUser);
					callback(null, 3);
					break;
					default:
					func = 'profile';
					display = actions.getTweets(requestedUser);
					callback(null, 3);
				}		
			}
		],

		//callback function: called after all above functions complete
		function callback(error, results){
			if (error){
				console.log('Error: ' + error);
				//render error page
				res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
			}
			if (results[2]){ //populated after third function completes
				res.render('users/profile', {title: username, func: func, nav: nav, data: display, self: self, user: requestedUser, buttons: followButton+messageButton});
			}
		}
	);
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

	//Ensures that only you can view your own follower requests
	if(req.session.user != undefined) {
		if(req.params.user == req.session.user.uname) {
			profileRender(req, res, 5);
		}
		else {
			res.redirect('/user/'+req.params.user);
		}
	}
	else {
		res.redirect('/login');
	}

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

// # Follow user functionality
exports.follow = function(req, res) {

	var id = req.params.id;
	var user = req.session.user;
	userlib.follow(user, id, function(error) {
		if (error) {
			console.log('Error: ' + error);
			//res.redirect('/');
			res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
		}
		else {
			//res.redirect('/discover/who_to_follow');
			res.redirect('/user/'+user.uname+'/following');
		}
	});

};

// # Unfollow user functionality
exports.unfollow = function(req, res) {

	var id = req.params.id;
	var user = req.session.user;
	userlib.unfollow(user, id, function(error) {
		if (error){
			console.log('Error: ' + error);
			res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
		}
		else{
			res.redirect('/user/'+user.uname+'/following');
		}
	});

};

// Renders who to follow suggestions for the current user:
exports.who_to_follow = function(req, res) {

	var user = req.session.user;
	userlib.who_to_follow(user, function(error, display){
		if (error){
			console.log('Error: ' + error);
			res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
		}
		else{
			res.render('users/active/discover', {title: 'Who to Follow', func: 'who_to_follow', nav: 'discover', data: display});
		}
	});
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

// # Message functionality
// Renders the send message view
exports.sendMessage = function(req, res) {

	//Ensures that only you can view your own follower requests
	if(req.session.user != undefined) {
		if(req.params.user == req.session.user.username) {
			res.redirect('/user/'+req.session.user.username);
		}
		else {
			res.render('users/active/sendMessage', {title: 'Message', func: 'sendMessage', nav: 'messages'});
		}
	}
	else {
		res.redirect('/login');
	}

};

// Renders the messages page functionality for the current user:
exports.messages = function(req, res) {

	res.render('users/active/messages', {title: 'Messages', func: 'messages', nav: 'messages'});

};
