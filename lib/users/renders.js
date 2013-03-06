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

exports.getInteractions = function(heading, data){
	var content = '<h3>'+heading+'</h3><ul>';
	for (var i=0; i<data.length; i++){
		content += '<li>'+data[i]+'</li>';
	}
	content += '</ul>';
	return content;
}