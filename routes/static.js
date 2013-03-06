
/*
 * GET home page.
 */

 //var users = require('./lib');

exports.about = function(req, res){
  res.render('static/about', { title: 'About' });
};

exports.help = function(req, res){
  res.render('static/help', { title: 'Help' });
};

exports.faq = function(req, res){
  res.render('static/faq', { title: 'FAQ' });
};