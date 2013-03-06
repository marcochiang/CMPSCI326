
/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.connect = function(req, res){
	var user = actions.getUser('jeff');
	var path = req.path;
	var display = '';
	if (path == "/connect")
		display = actions.getInteractions(user);
	else if (path == "/mentions")
		display = actions.getMentions(user);

	res.render('users/connect', {title: 'Connect', func: 'connect', data: display});
};

exports.discover = function(req, res){
	res.render('users/discover', {title: 'Discover', func: 'discover', name: 'Jeff'});
};