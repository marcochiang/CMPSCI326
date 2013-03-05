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