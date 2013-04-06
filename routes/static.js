// # Static.js
// This is the routes module for accessing the static
// pages of the app.

/*
 * GET home page.
 */

// Renders the static About page:
exports.about = function(req, res){
  res.render('static/about', { title: 'About Us', func: 'about', nav: '' });
};

// Renders the static Help page:
exports.help = function(req, res){
  res.render('static/help', { title: 'Help', func: 'help', nav: '' });
};

// Renders the static FAQ page:
exports.faq = function(req, res){
  res.render('static/faq', { title: 'FAQ', func: 'faq', nav: '' });
};