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

exports.getInteractions = function(user){
	var data = new Array('A tweet from Marco mentioned you!',
						 'Jon and Matt followed you');
	var content = renders.getInteractions('Interactions', data);
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
	var content = renders.getInteractions('Mentions', data);
	return content;
};