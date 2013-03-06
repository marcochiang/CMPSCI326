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

exports.toList = function(){
	var content = '<h3>Users</h3>';
    content += '<ul>';
	for (var i=0; i<users.length; i++){
		var u = users[i];
		content += '<li>' + u.name + ': ' + u.info + '</li>';
	}
	content += '</ul>';    
    return content;
};

exports.getInteractions = function(){
	var content = '<h3>Interactions</h3><ul>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li>';
	content += '<li>TEST</li></ul>';
	return content;
}