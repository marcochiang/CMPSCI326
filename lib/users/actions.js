// # Actions Library
// This is a module for accessing the functionality
// of the app. Most of these methods are pertaining to
// individual users and how they interact.

var renders = require('./renders.js');

// ## In Memory User Database
// We will use a simple array `users` to record user data.
// We could easily replace this with calls to a *database layer*
var users = [
	{name: 'Jeff',
	 username: 'jeff'},
	{name: 'Marco',
     username: 'marco'}
];

// Export the `users` list.
exports.users = users;


// ### *function*: getUser
/**
 * Returns a specified user.
 * @param {object} user The user to be returned
 */
exports.getUser = function(user) {
	var u = undefined;
	for (var i=0; i<users.length; i++){
		if (users[i].username == user){
			u = users[i];
			break;
		}
	}
	return u;
};

// ### *function*: getTweets
/**
 * Returns an array of strings (tweets) that the specified
 * user has posted in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getTweets = function(user){
	var data = new Array('@marco you are cool.',
						 'I am so awesome.',
						 'This is way better than the real Twitter');
	var content = renders.toList('Tweets', data);
	return content;
};

// ### *function*: getFollowing
/**
 * Returns an array of users that the specified user is
 * following in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getFollowing = function(user){
	var data = new Array('Marco @marco',
						 'Matt @matt',
						 'Jon @jon');
	var content = renders.toList('Following', data);
	return content;
};

// ### *function*: getFollowers
/**
 * Returns an array of users that the specified user is
 * is being followed by in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getFollowers = function(user){
	var data = new Array('Marco @marco',
						 'Matt @matt',
						 'Jon @jon');
	var content = renders.toList('Followers', data);
	return content;
};

// ### *function*: getFavorites
/**
 * Returns an array of tweets that the specified user
 * has favorited in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getFavorites = function(user){
	var data = new Array('Marco @marco </br> This is a tweet.',
						 'Matt @matt </br> This is another tweet.',
						 'Jon @jon </br> This is a third tweet.');
	var content = renders.toList('Favorites', data);
	return content;
};

// ### *function*: getFollowerRequests
/**
 * Returns an array of users that the specified user is
 * being requested to be followed by in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getFollowerRequests = function(user){
	var data = new Array('Marco @marco has requested to follow you.',
						 'Matt @matt has requested to follow you');
	var content = renders.toList('Pending Follower Requests', data);
	return content;
};

// ### *function*: getLists
/**
 * Returns an array of something (???) related to the specified user
 * in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getLists = function(user){
	var data = new Array('Do we even need this..seems stupid');
	var content = renders.toList('Lists', data);
	return content;
};

// ### *function*: getInteractions
/**
 * Returns an array of strings (notifications) that the specified
 * user has posted in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getInteractions = function(user){
	var data = new Array('A tweet from Marco mentioned you!',
						 'Jon and Matt followed you');
	var content = renders.toList('Interactions', data);
	return content;
};

// ### *function*: getMentions
/**
 * Returns an array of strings (tweets) that the specified
 * user has been mentioned in posted in HMTL format.
 * @param {object} user The user we are specifying
 */
exports.getMentions = function(user){
	var data = new Array('Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username,
						'Matt: you are so cool @'+user.username);
	var content = renders.toList('Mentions', data);
	return content;
};
