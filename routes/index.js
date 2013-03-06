
/*
 * GET home page.
 */

 //var users = require('./lib');

exports.index = function(req, res){
  res.render('index', { title: 'Twitter', func: 'home' });
};