
/*
 * GET users listing.
 */

var actions = require('../lib/users/actions.js');
var renders = require('../lib/users/renders.js');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.connect = function(req, res){
	res.render('connect', {title: 'Connect', name: actions.getUser('jeff')});
};

exports.discover = function(req, res){
	res.render('discover', {title: 'Discover', name: 'Jeff'});
};