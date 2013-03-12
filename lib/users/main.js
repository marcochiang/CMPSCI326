// # Users Module
// This is a module for accessing user data. We are using
// [Docker](https://github.com/jbt/docker), a documentation generation
// library, that will convert the inline documentation in [Markdown
// format](http://daringfireball.net/projects/markdown/syntax) into
// HTML that can be used to display documentation alongside the source
// code. You will use this to document your projects.

// ## In Memory User Database
// We will use a simple array `users` to record user data.
// We could easily replace this with calls to a *database layer*
var users = [
	{name: 'Jeff',
	 username: 'jeff'},
	{name: 'Marco',
     username: 'marco'}
];

// ## Exported Functions

// Export the `users` list.
exports.users = users;

// ### *function*: getUser
/**
 * Returns a specified user.
 * @param {object} user The user to be returned
 */
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

// ### *function*: toList
/**
 * Returns the list of all users in HTML format
 */
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

// ### *function*: getInteractions
/**
 * This is a test function which returns dummy HTML content.
 */
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