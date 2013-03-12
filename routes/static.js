
/*
 * GET home page.
 */

 //var users = require('./lib');

// Renders the static About page:
exports.about = function(req, res){
  res.render('static/about', { title: 'About Us', func: 'about' });
};

// Renders the static Help page:
exports.help = function(req, res){
  res.render('static/help', { title: 'Help', func: 'help' });
};

// Renders the static FAQ page:
exports.faq = function(req, res){
  res.render('static/faq', { title: 'FAQ', func: 'faq' });
};