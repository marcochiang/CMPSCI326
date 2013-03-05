
/*
 * GET users listing.
 */

var users = require('../lib/users');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.connect = function(req, res){
	res.render('connect', {title: 'Connect', name: users.getUser('jeff')});
};

exports.discover = function(req, res){
	res.render('discover', {title: 'Discover', name: 'Jeff'});
};