
/*
 * GET home page.
 */

 //var users = require('./lib');

exports.about = function(req, res){
  res.render('static/about', { title: 'About Us', func: 'about' });
};

exports.help = function(req, res){
  res.render('static/help', { title: 'Help', func: 'help' });
};

exports.faq = function(req, res){
  res.render('static/faq', { title: 'FAQ', func: 'faq' });
};