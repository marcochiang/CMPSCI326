// # index.js
// This is the routes module for accessing the dynamic views
// and elements of the app.


// Displays list of users:
exports.index = function(req, res) {
	res.render('index', {title: 'Home', nav: 'home', func: 'index'});
};