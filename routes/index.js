
/*
 * GET home page.
 */

 var users = require('./lib');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.connect = function(req, res){
	res.render('connect', {title: 'Connect', name: 'Jeff'});
};

exports.discover = function(req, res){
	res.render('discover', {title: 'Discover', name: 'Jeff'});
};