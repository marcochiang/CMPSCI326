var renders = require('./renders.js');

var users = [
	{name: 'Jeff',
	 username: 'jeff'},
	{name: 'Marco',
     username: 'marco'}
];

exports.users = users;

exports.getUser = function(user){
	var u = undefined; 
	for (var i=0; i<users.length; i++){
		if (users[i].username == user){
			u = users[i];
			break;
		}
	}
	return u;
};

exports.getTweets = function(user){
	var data = new Array('@marco you are cool.',
						 'I am so awesome.',
						 'This is way better than the real Twitter');
	var content = renders.toList('Tweets', data);
	return content;
};

exports.getFollowing = function(user){
	var data = new Array('Marco @marco',
						 'Matt @matt',
						 'Jon @jon');
	var content = renders.toList('Following', data);
	return content;
};

exports.getFollowers = function(user){
	var data = new Array('Marco @marco',
						 'Matt @matt',
						 'Jon @jon');
	var content = renders.toList('Followers', data);
	return content;
};

exports.getFavorites = function(user){
	var data = new Array('Marco @marco </br> This is a tweet.',
						 'Matt @matt </br> This is another tweet.',
						 'Jon @jon </br> This is a third tweet.');
	var content = renders.toList('Favorites', data);
	return content;
};

exports.getFollowerRequests = function(user){
	var data = new Array('Marco @marco has requested to follow you.',
						 'Matt @matt has requested to follow you');
	var content = renders.toList('Pending Follower Requests', data);
	return content;
};

exports.getLists = function(user){
	var data = new Array('Do we even need this..seems stupid');
	var content = renders.toList('Lists', data);
	return content;
};

exports.getInteractions = function(user){
	var data = new Array('A tweet from Marco mentioned you!',
						 'Jon and Matt followed you');
	var content = renders.toList('Interactions', data);
	return content;
};

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