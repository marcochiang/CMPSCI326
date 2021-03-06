// # Renders Library
// This is a collection of methods that format input
// into HTML.

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

// ### *function*: toList
/**
 * Returns the arguments concatinated with HTML tags.
 * @param {object} heading The header of the page
 * @param {array} data An array of strings
 */
exports.toList = function(heading, data){
	var content = '<h3>'+heading+'</h3><ul>';
	for (var i=0; i<data.length; i++){
		content += '<li>'+data[i]+'</li>';
	}
	content += '</ul>';
	return content;
}
