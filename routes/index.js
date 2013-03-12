// # Index.js
// This is the routes module for accessing the index
// page of the app.

/*
 * GET home page.
 */

// Renders the index view:
exports.index = function(req, res){
  res.render('index', { title: 'Twitter', func: 'home' });
};